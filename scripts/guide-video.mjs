#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
//
// Renders the Info guide as a video for YouTube (#161): a 1920 × 1080, 60 fps H.264 MP4, its
// captions (.srt) and its description, from src/guide/video.js's timeline. Maintainers only:
// it serves src/guide/guide-render.html with Vite, has headless Chromium draw every frame,
// one segment (the title card, a step, the credits, the end card) per tab, several at once,
// encodes each segment with ffmpeg, joins them and adds the audio.
//
//   npm run guide:video -- [--out DIR] [--music FILE --music-credit TEXT] [--narration DIR]
//                          [--stills] [--jobs N] [--browser PATH]
//
// --out        where to write guide.mp4, guide.srt and guide-description.txt (default
//              ~/guide-video). Keep it outside the clone: nothing rendered is committed.
// --music      a track licensed for YouTube, such as one from the YouTube Audio Library: looped
//              to the video's length, faded in and out, and lowered under narration.
// --music-credit  the credit line the track asks for, shown in the credits and the description.
// --remix      put new music (or narration) under the video already in --out, without drawing it
//              again; the guide must not have changed since.
// --narration  a folder with one recording per step, named by the step's id (what.wav,
//              rule30.wav, …; any format ffmpeg reads): each step then lasts as long as its
//              recording, and the words on screen follow it.
// --stills     write one PNG from the middle of each segment instead of the video, for a look.
// --frame N@S  write one PNG, segment N (0 is the title card) at S seconds, instead of the video.
//
// Needs chromium (or --browser), ffmpeg and ffprobe on the PATH.

import { parseArgs } from 'node:util';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { createServer as netServer } from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { STEPS } from '../src/guide/steps.js';
import { timeline, srt, description, chapters, chapterTime, DESCRIPTION_LIMIT } from '../src/guide/video.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { values: args } = parseArgs({
  options: {
    out: { type: 'string', default: path.join(os.homedir(), 'guide-video') },
    music: { type: 'string' },
    'music-credit': { type: 'string', default: '' },
    narration: { type: 'string' },
    stills: { type: 'boolean', default: false },
    frame: { type: 'string' },
    remix: { type: 'boolean', default: false },
    jobs: { type: 'string', default: String(Math.max(1, Math.min(8, Math.floor(os.cpus().length / 3)))) },
    browser: { type: 'string', default: 'chromium' },
  },
});

function fail(message) {
  console.error(`guide-video: ${message}`);
  process.exit(1);
}

/** A mistake in the command, found once the browser is running: said without a stack. */
class Refusal extends Error {}

/** @returns {number} a media file's length in seconds */
function lengthOf(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  const seconds = Number(out.trim());
  if (!(seconds > 0)) throw new Refusal(`can't read the length of ${file}`);
  return seconds;
}

/** Each step's recording in the narration folder, by step id. */
function findNarration(dir) {
  if (!fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory()) fail(`--narration ${dir} is not a folder`);
  const files = fs.readdirSync(dir);
  const found = {};
  for (const step of STEPS) {
    const name = files.find((f) => path.parse(f).name === step.id);
    if (!name) fail(`--narration: no recording for step "${step.id}" (${step.title}) in ${dir}`);
    found[step.id] = path.join(dir, name);
  }
  return found;
}

async function freePort() {
  const server = netServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  server.close();
  return port;
}

/** A DevTools protocol connection to one target, over Node's own WebSocket. */
class Cdp {
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', () => reject(new Error(`can't connect to ${url}`)), { once: true });
    });
    return new Cdp(ws);
  }

  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.method) {
        this.listeners.get(message.method)?.(message.params);
        return;
      }
      const waiting = this.pending.get(message.id);
      if (!waiting) return;
      this.pending.delete(message.id);
      if (message.error) waiting.reject(new Error(`${message.error.message} ${message.error.data ?? ''}`));
      else waiting.resolve(message.result);
    });
    ws.addEventListener('close', () => {
      for (const { reject } of this.pending.values()) reject(new Error('the browser closed the connection'));
    });
  }

  /** Calls fn with each event of this kind. */
  on(method, fn) {
    this.listeners.set(method, fn);
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  /** Evaluates an expression in the page, waits for it, and returns its value. */
  async eval(expression) {
    const result = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    }
    return result.result.value;
  }

  close() {
    this.ws.close();
  }
}

async function launchBrowser(work) {
  const browser = spawn(args.browser, [
    '--headless=new', '--disable-gpu', '--disable-extensions', '--no-first-run', '--no-default-browser-check',
    '--mute-audio', '--hide-scrollbars', '--remote-debugging-port=0', `--user-data-dir=${path.join(work, 'profile')}`,
    'about:blank',
  ], {
    stdio: ['ignore', 'ignore', 'pipe'],
    // Arch's launcher adds the flags in $XDG_CONFIG_HOME/chromium-flags.conf (a desktop's, with its
    // extensions): pointed at the work folder, it finds none
    env: { ...process.env, XDG_CONFIG_HOME: work },
  });
  let log = '';
  const url = await new Promise((resolve, reject) => {
    browser.on('error', (err) => reject(new Refusal(`can't start ${args.browser}: ${err.message}`)));
    browser.stderr.on('data', (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) resolve(match[1]);
    });
    browser.on('exit', () => reject(new Error(`${args.browser} exited:\n${log}`)));
  });
  browser.stderr.resume();
  return { process: browser, cdp: await Cdp.connect(url), origin: new URL(url).host };
}

/** Opens the render page in a new tab and waits until it can draw. */
async function openTab(browser, pageUrl) {
  const { targetId } = await browser.cdp.send('Target.createTarget', { url: pageUrl });
  const tab = await Cdp.connect(`ws://${browser.origin}/devtools/page/${targetId}`);
  // The page's own errors and messages, so a failing frame says why
  tab.on('Runtime.exceptionThrown', ({ exceptionDetails: e }) => console.error(`page: ${e.exception?.description ?? e.text}`));
  tab.on('Runtime.consoleAPICalled', ({ type, args: values }) => {
    if (type === 'debug') return; // Vite's client saying it connected
    console.error(`page ${type}: ${values.map((v) => v.value ?? v.description ?? v.type).join(' ')}`);
  });
  await tab.send('Runtime.enable');
  for (let i = 0; i < 300 && !(await tab.eval('!!window.guideVideo').catch(() => false)); i++) {
    await new Promise((r) => setTimeout(r, 100));
  }
  await tab.eval('guideVideo.ready');
  return tab;
}

const pngOf = (dataUrl) => Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');

/** Runs ffmpeg, rejecting with its output if it fails. */
function ffmpeg(ffArgs, { input = false } = {}) {
  const child = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...ffArgs],
    { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'pipe'] });
  let errors = '';
  child.stderr.on('data', (d) => { errors += d; });
  const done = new Promise((resolve, reject) => {
    child.on('error', (err) => reject(new Error(`can't run ffmpeg: ${err.message}`)));
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg failed:\n${errors}`))));
  });
  return { child, done };
}

/** Encodes one segment's frames, piped from the tab as PNGs, to an MP4 without sound. */
async function renderSegment(tab, segment, file, threads, progress) {
  const { child, done } = ffmpeg([
    '-f', 'image2pipe', '-framerate', String(timelineData.fps), '-c:v', 'png', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-g', String(timelineData.fps / 2),
    '-bf', '2', '-threads', String(threads),
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
    file,
  ], { input: true });
  child.stdin.on('error', () => {}); // ffmpeg's own error says why
  await tab.eval(`guideVideo.open(${JSON.stringify(segment)})`);
  // Draw the next frame while ffmpeg takes this one
  let next = tab.eval('guideVideo.frame(0)');
  for (let n = 0; n < segment.frames; n++) {
    const png = pngOf(await next);
    if (n + 1 < segment.frames) next = tab.eval(`guideVideo.frame(${n + 1})`);
    if (!child.stdin.write(png)) await Promise.race([once(child.stdin, 'drain'), done]);
    progress();
  }
  child.stdin.end();
  await done;
}

/** Mixes the music and the narration under the video. */
async function addAudio(video, file, narrationFiles, tl) {
  const inputs = ['-i', video];
  const filters = [];
  const mix = [];
  const D = tl.duration.toFixed(3);
  if (args.music) {
    inputs.push('-stream_loop', '-1', '-i', args.music);
    // Quieter under a voice; YouTube plays everything at about -14 LUFS anyway
    const loudness = narrationFiles ? -30 : -16;
    filters.push(`[1:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:${D},asetpts=PTS-STARTPTS,`
      + `loudnorm=I=${loudness}:TP=-2:LRA=11,aresample=48000,afade=t=in:d=2,afade=t=out:st=${(tl.duration - 5).toFixed(3)}:d=5[m]`);
    mix.push('[m]');
  }
  if (narrationFiles) {
    tl.segments.filter((s) => s.kind === 'step').forEach((segment, i) => {
      const input = inputs.filter((a) => a === '-i').length;
      inputs.push('-i', narrationFiles[segment.id]);
      const ms = Math.round((segment.start + segment.narrationAt) * 1000);
      filters.push(`[${input}:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-16:TP=-1.5:LRA=11,`
        + `aresample=48000,adelay=${ms}:all=1[n${i}]`);
      mix.push(`[n${i}]`);
    });
  }
  filters.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad,atrim=0:${D}[a]`);
  await ffmpeg([
    ...inputs, '-filter_complex', filters.join(';'), '-map', '0:v', '-map', '[a]',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '384k', '-ar', '48000', '-t', D, '-movflags', '+faststart', file,
  ]).done;
}

// ---- Main ----

if (args.music && !fs.existsSync(args.music)) fail(`--music ${args.music}: no such file`);
if (args.music && !args['music-credit']) {
  console.warn('guide-video: no --music-credit; check whether the track asks for one');
}
const narrationFiles = args.narration ? findNarration(args.narration) : null;
let narration = null;
try {
  if (narrationFiles) narration = Object.fromEntries(Object.entries(narrationFiles).map(([id, file]) => [id, lengthOf(file)]));
} catch (err) {
  fail(err.message);
}
const musicCredit = args['music-credit'];
const timelineData = timeline({ narration, musicCredit });
const text = description(timelineData, { musicCredit });
if (Buffer.byteLength(text) > DESCRIPTION_LIMIT) {
  fail(`the description is ${Buffer.byteLength(text)} bytes, over YouTube's ${DESCRIPTION_LIMIT}: shorten --music-credit`);
}

const list = chapters(timelineData);
const short = list.filter((c, i) => (list[i + 1]?.time ?? timelineData.duration) - c.time < 10);
if (short.length) {
  console.warn(`guide-video: YouTube shows no chapters when one is under 10 seconds: ${short.map((c) => c.title).join(', ')}`);
}

const out = path.resolve(args.out);
if (out === ROOT || out.startsWith(`${ROOT}${path.sep}`)) fail('--out must be outside the clone: nothing rendered is committed');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'guide.srt'), srt(timelineData));
fs.writeFileSync(path.join(out, 'guide-description.txt'), text);
console.log(`The video: ${chapterTime(timelineData.duration)}, ${timelineData.frames} frames, ${timelineData.segments.length} segments`);
for (const c of list) console.log(`  ${chapterTime(c.time).padStart(5)} ${c.title}`);

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'guide-video-'));
const port = await freePort();
const server = await createServer({
  root: ROOT, logLevel: 'error', clearScreen: false,
  server: { host: '127.0.0.1', port, strictPort: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});
let browser = null;
/** Closes the browser, waiting for it to let go of its profile, and removes the work folder. */
const stop = async () => {
  if (browser && browser.process.exitCode === null) {
    const exited = once(browser.process, 'exit');
    browser.process.kill();
    await Promise.race([exited, new Promise((r) => setTimeout(r, 5000))]);
  }
  await server.close();
  fs.rmSync(work, { recursive: true, force: true, maxRetries: 5 });
};
process.on('SIGINT', async () => {
  await stop();
  process.exit(130);
});

try {
  if (args.remix) {
    if (!args.music && !narrationFiles) throw new Refusal('--remix needs --music or --narration');
    const rendered = path.join(out, 'guide.mp4');
    if (!fs.existsSync(rendered)) throw new Refusal(`--remix: no ${rendered} to put music under`);
    if (Math.abs(lengthOf(rendered) - timelineData.duration) > 0.1) {
      throw new Refusal(`--remix: ${rendered} doesn't match the guide as it is now; render it again`);
    }
    const video = path.join(work, 'video.mp4');
    await ffmpeg(['-i', rendered, '-map', '0:v', '-c', 'copy', video]).done;
    await addAudio(video, rendered, narrationFiles, timelineData);
    console.log(`${rendered} (${chapterTime(lengthOf(rendered))})`);
  } else {
    await server.listen();
    browser = await launchBrowser(work);
    const pageUrl = `http://127.0.0.1:${port}/src/guide/guide-render.html`;
    const jobs = Math.max(1, Number(args.jobs) || 1);
    const segments = timelineData.segments.map((segment, i) => ({ segment, i }));

    if (args.frame) {
      const [i, seconds] = args.frame.split('@').map(Number);
      const segment = timelineData.segments[i];
      if (!segment || !(seconds >= 0)) throw new Refusal(`--frame ${args.frame}: give a segment from 0 to ${segments.length - 1}, @ seconds`);
      const tab = await openTab(browser, pageUrl);
      await tab.eval(`guideVideo.open(${JSON.stringify(segment)})`);
      const file = path.join(out, `frame-${i}@${seconds}.png`);
      fs.writeFileSync(file, pngOf(await tab.eval(`guideVideo.frame(${Math.round(seconds * timelineData.fps)})`)));
      console.log(file);
    } else if (args.stills) {
      const tab = await openTab(browser, pageUrl);
      for (const { segment, i } of segments) {
        await tab.eval(`guideVideo.open(${JSON.stringify(segment)})`);
        const n = segment.kind === 'step' ? Math.round((segment.chunks[0].from + 1) * timelineData.fps) : Math.floor(segment.frames / 2);
        const file = path.join(out, `still-${String(i).padStart(2, '0')}-${segment.id ?? segment.kind}.png`);
        fs.writeFileSync(file, pngOf(await tab.eval(`guideVideo.frame(${n})`)));
        console.log(file);
      }
    } else {
      // Longest first, so the last to finish isn't a long one started late
      const queue = [...segments].sort((a, b) => b.segment.frames - a.segment.frames);
      const threads = Math.max(1, Math.floor(os.cpus().length / jobs));
      let drawn = 0;
      const started = Date.now();
      const progress = () => {
        drawn++;
        if (drawn % 300 === 0 || drawn === timelineData.frames) {
          const seconds = (Date.now() - started) / 1000;
          process.stdout.write(`\r  ${drawn} / ${timelineData.frames} frames, ${(drawn / seconds).toFixed(1)} a second, `
            + `${Math.round(((timelineData.frames - drawn) / drawn) * seconds)} s to go   `);
        }
      };
      console.log(`Rendering in ${jobs} tabs…`);
      await Promise.all(Array.from({ length: jobs }, async () => {
        const tab = await openTab(browser, pageUrl);
        for (let item = queue.shift(); item; item = queue.shift()) {
          await renderSegment(tab, item.segment, path.join(work, `segment-${item.i}.mp4`), threads, progress);
        }
        tab.close();
      }));
      process.stdout.write('\n');
      const list = path.join(work, 'segments.txt');
      fs.writeFileSync(list, segments.map(({ i }) => `file '${path.join(work, `segment-${i}.mp4`)}'`).join('\n'));
      const video = path.join(work, 'video.mp4');
      await ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', video]).done;
      const final = path.join(out, 'guide.mp4');
      if (args.music || narrationFiles) await addAudio(video, final, narrationFiles, timelineData);
      else {
        console.warn('guide-video: no --music or --narration, so the video is silent');
        fs.copyFileSync(video, final);
      }
      console.log(`${final} (${chapterTime(lengthOf(final))})`);
    }
  }
  console.log(path.join(out, 'guide.srt'));
  console.log(path.join(out, 'guide-description.txt'));
} catch (err) {
  console.error(`guide-video: ${err instanceof Refusal ? err.message : err.stack ?? err}`);
  process.exitCode = 1;
} finally {
  await stop();
}
