# morpheus-tech-lab — coding contract

For people and agents changing code. The contributor workflow (setup from a fork, branches,
pull requests, DCO sign-off, changelog) is in [CONTRIBUTING.md](CONTRIBUTING.md); branches, versions and releases are in
[RELEASING.md](RELEASING.md).

## Module layout

```
.github/workflows/ci.yml The `build` (npm ci, npm run build, npm test) and `DCO` (sign-off) checks, required on main
.github/ISSUE_TEMPLATE/  Issue forms: bug_report.yml (type Bug), idea.yml (type Feature; what and why only), both labelled `idea`; config.yml turns off blank issues and links Discussions (GitHub adds the security-report entry itself)
.github/pull_request_template.md  The pull-request template: each issue and its relation, what changed, how it was tested, screenshots, and the checklist
index.html               All markup: HUD, control bar, configuration modal, info panels
public/CNAME             lab.morpheustech.net, copied into every build. Never delete
public/favicon.svg       Brand pin (see brand.lock). Never hand-edit
brand.lock               The brand tag the pin came from, and a sha256 per pinned file
LICENSE                  Apache License 2.0 (MIT through v1.4.0)
NOTICE                   Copyright notice, and what the license does not cover: the Morpheus Tech name, logo and brand files
CONTRIBUTING.md          How to contribute: setup from a fork, branches, pull requests, DCO sign-off, changelog
CODE_OF_CONDUCT.md       Contributor Covenant 2.1, unmodified apart from the enforcement contact
SECURITY.md              Supported versions (latest only) and private vulnerability reporting
ROADMAP.md               The public roadmap: the engine, new demos, the brand restyle, community
RELEASING.md             Branches, versions, changelog format and the release steps
CHANGELOG.md             What each version changed (Keep a Changelog)
scripts/brand.mjs        `sync --org <brand repo>` re-pins the brand at a tag (maintainers); `check` verifies the lock
scripts/verify.mjs       Checks a result file from the unbounded engine in Node: by replay, or by lookup with --table
scripts/reference-hashes.mjs Computes a run's reference table: the hash of every generation, for checking Speed by lookup
scripts/bench.mjs        Benchmarks for the unbounded engine (#39): chunk sizes, seeds and rules, bytes against bit-packed
                         cells, the dense convolve3D(), serialization, the Speed candidates and the Discovery worst case
scripts/bench/           The bench's parts: lib.mjs (timing, seeds, rules, tables; no Node APIs), bitpacked.mjs (a
                         bit-packed one-chunk step, bench only), candidates.mjs (Speed candidates, each rebuilt from a
                         number; --run writes one's run), worst-case.mjs (writes the Discovery worst-case result file)
vite.config.js           base '/', because the site is served from the domain root
test/                    `npm test` (Node's built-in node:test, no dependency): unbounded/ checks the unbounded engine,
                         its run loop on a fake clock and in a worker_threads Worker, the canonical hash and
                         the verifier (fixtures/ holds an example result and a hand-edited copy), and the engine
                         against convolve3D() (dense.test.js); explore/ checks
                         Explore's seeds, seed files and camera framing
src/
  main.js                Boot: Explore (startExplore()) by default, or initSimulation(); then animate()
  brand/tokens.css       Brand pin: the Morpheus Tech brand tokens. Not imported yet. Never hand-edit
  state.js               The one shared, mutable `state` object: settings, rules, scene handles, history
  simulationModel.js     Builds the Three.js Points geometry from the history; updatePoints() per frame
  matrixFunctions.js     The automata: generateSimulation() and each mode's evolve step (the CPU reference);
                         convolve3D() here passes `state`'s settings to denseStep.js
  denseStep.js           convolve3D(grid, {wrapping, rules, boundaryRules}): the dense Game of Life 3D step, without
                         `state`, so Node can run it
  grid3D.js              Grid3D: a dense size³ Uint8Array plus an `active` list of live cells
  shapeGenerators.js     Seed shapes: perlin, cube, tetrahedron, octahedron, worley, rule30
  space.js               Scene, camera, renderer, OrbitControls (stored on `state`)
  time.js                The animation loop, playback speed, auto-rotate; a vestigial clock history
  controls.js            All UI wiring: buttons, sliders, modal, mode switching (~1,800 lines)
  gpu/device.js          WebGPU status ('ready', 'no-webgpu', 'no-adapter', 'device-failed') and the one GPUDevice
  gpu/engine.js          Game of Life 3D and Rule 30 (1D, 2D) on the GPU: evolveOnGpu() yields each generation
  gpu/computeControl.js  The GPU compute toggle: its GPU/CPU badge, the remembered choice, the "why not" popover
  gpu/compare.js         Not bundled: run from the dev console to check the GPU's generations against the CPU's
  shaders/*.wgsl         The WGSL compute shaders: gameOfLife3D.wgsl, rule30.wgsl (1D and 2D)
  unbounded/             Game of Life 3D without edges, shown by Explore. Imports no `state`, so it runs
                         in Node, a Web Worker or the browser
  unbounded/world.js     World: the chunk store (chunks as slots in large slabs), seeding, and the limits
  unbounded/step.js      step(): one generation, a lockstep over every chunk, or the limit that ends the run
  unbounded/rules.js     validateRules() (refuses B0) and the rule lookup table
  unbounded/reference.js ReferenceWorld: a deliberately simple Set-of-strings engine the tests check world.js against
  unbounded/run.js       Run: the run loop (timed and open-ended runs, pause, step, stop, settling), statistics and snapshots
  unbounded/run.worker.js The Web Worker that serves one Run
  unbounded/canonical.js The canonical state (a run's definition, the generation, the cells as bytes), its SHA-256
                         hash, the result file (readResult() reads one as untrusted data) and the reference table
  unbounded/verify.js    verifyResult(): replays a result, or looks it up in a table; verified, mismatch, refused
                         or not checked
  unbounded/driver.js    EngineDriver: the page's side of a run; starts a fresh Worker per run and relays its messages
  explore/               The Explore mode: the unbounded engine on the page (#37)
  explore/explore.js     Starts and drives the run, the control bar's commands in Explore, the HUD box and notices
  explore/view.js        ExploreView: the growing point cloud, chunk boxes past RENDER_BUDGET, the arena and chunk grid
  explore/framing.js     The camera distance that fits the pattern, and easing (no Three.js; tested in Node)
  explore/seed.js        Shapes lifted into the unbounded world, rule text, the seed file format (tested in Node)
  unbounded/workbench.html Not bundled: a dev page (/src/unbounded/workbench.html under `npm run dev`) that checks
                         the Worker in the browser and drives a run by hand
  unbounded/memory.html  Not bundled: a dev page (/src/unbounded/memory.html under `npm run dev`) that measures how
                         much one tab can take in slabs (memory.worker.js), and times Speed candidates in the
                         Worker, alone or two side by side, drawn as they grow. Never ship or link it: reaching
                         the browser's cap can close the tab
  unbounded/compareDense.js Not bundled: checks the engine against convolve3D(), cell for cell; `npm test`, the
                         bench and the dev console run it
  color.css, style.css   Theme colours and layout
  assets/images/         Logos, README images
```

## Core patterns

- **One state object.** Every module imports `state` from `state.js` and reads or writes it
  directly. There is no store, no events and no reactivity: a change takes effect when something
  reads it next.
- **Precompute, then play.** `initSimulation()` computes the whole history,
  `state.simulationData[0..generations]`, one `Grid3D` per generation, before anything plays.
  Playback, reverse and scrubbing only change `state.currentGen` and call `updatePoints()`.
- **Stream, keep no history (the unbounded engine).** `src/unbounded/` computes one generation
  at a time, for as long as a run lasts, and keeps only the current one. Space is chunked
  (16³ cells by default), and a chunk exists only where there are live cells or cells that can
  be born. The Explore mode (`src/explore/`) shows it.
- **Changing a setting rebuilds.** Mode, size, seed or rules all go through `initSimulation()`
  again (from `controls.js`).
- **Mode flags.** `state.simulationMode` names the mode, and the booleans `useRule30`,
  `useRule30_2D`, `useSineWave` and `useSandpile` steer `generateSimulation()`. Size and
  generations are remembered per mode in `state.modeValues`.
- **Explore streams instead.** `simulationMode === 'explore'` never reaches `initSimulation()`
  or `generateSimulation()`: on Apply, `controls.js` calls `startExplore()`, and leaving the mode
  calls `stopExplore()`. `animate()` calls `exploreFrame()` instead of advancing `currentGen`, and
  the play, step and reverse handlers check `isExplore()` first. Explore clears all four flags,
  which `gpuModeOf()` would read as Game of Life 3D, so code that looks at the flags must check
  for Explore first, as `computeControl.js` does. Its settings live in `state.explore`.
- **GPU first, CPU after.** For Game of Life 3D and Rule 30, `generateSimulation()` runs
  `evolveOnGpu()` when `state.gpuCompute` is on and a device is ready, then its CPU loop computes
  whatever generations remain: all of them if the GPU was off or unavailable, the rest if the
  device was lost part way. Sine Wave and the sandpile run on the CPU only.

## Invariants

- `Grid3D` index is `x + y*size + z*size²`. `data` and `active` must agree. Write through
  `set()`, or rebuild `active` after writing `data` directly (as the sandpile does).
- Rule 30 has depth 1 and the sandpile lives in the `z = 0` plane, with heights capped at 255.
  Rendering reads `matrixDepth` for that.
- Game of Life 3D boundary rules (corner, edge, face) apply only when grid wrapping is off.
  Isolation and overcrowding are always derived from survival, never set by hand.
- **The GPU gives exactly the CPU's generations**, cell for cell, wrapping or not, with the
  same edge, face and corner rules. The CPU evolve steps in `matrixFunctions.js` (Game of Life 3D's in
  `denseStep.js`) are the
  reference, quirks included (a dead cell with no live neighbour is never born; with wrapping
  off, neighbours clamp to the grid). Change a CPU step and its shader together, and check
  with `src/gpu/compare.js` at 50³ and 100³, wrapping on and off, before opening a pull
  request. The GPU's `active` lists hold the same cells in index order; nothing may depend on
  that order. A seed that isn't a plain 0/1 grid (`isPlainGrid()`) runs on the CPU.
- Any GPU failure falls back to the CPU without an error: no WebGPU, no adapter, a device that
  fails to start, or a device lost mid-run. Every GPU file starts with
  `// SPDX-License-Identifier: Apache-2.0`, and uses only the browser's WebGPU API.
- **The unbounded engine steps in lockstep.** Every chunk is always at the same generation. A
  step reads only generation t and writes t+1 to each chunk's other copy; nothing is updated in
  place, and the result never depends on the order the chunks are processed in. Chunks are how
  cells are stored, not the order they are computed in.
- **B0 is refused** (`validateRules()`): a dead cell with no live neighbour is never born. That
  is what makes skipping empty space exact.
- **A limit never wraps, clips or drops a cell.** It ends the run with its reason
  (`cell-limit`, `extent-limit`, `coordinate-limit`, `memory-limit`, `out-of-memory`,
  `arena-edge`), discards the step that would have crossed it, and keeps the last complete
  generation whole. Limits that can end a scored run are stated in cells, extent and
  generations, so a replay stops in the same place on any machine.
- **The unbounded engine gives exactly the reference's cells** (`src/unbounded/reference.js`),
  and, while a pattern stays 2 cells clear of the walls, `convolve3D()`'s with wrapping off.
  Change either engine and run `npm test`, which checks both; after a change to the step, also
  run `src/unbounded/compareDense.js` from the dev console at 100³, which takes longer. A change
  to the step or the cells' layout also reruns `node scripts/bench.mjs`, whose numbers pinned the
  contests' values (#39).
- **The page never steps the unbounded engine.** A run lives in its own Worker (`driver.js`),
  which the loop in `run.js` yields between generations so commands get through. A timed run
  checks its deadline after a generation is computed and before it is committed (`step()`'s
  `veto`), so a generation that finishes late is discarded like one that crosses a limit.
  Statistics go out at most every 250 ms on their own; snapshots only when asked for.
- **The canonical bytes are a public format.** A result's hash depends only on the run's
  definition, the generation and the cells: never the chunk size, the order cells were added in,
  timings or the machine. Any change to the bytes (`canonical.js`) bumps `FORMAT_VERSION`, and the
  known-answer test in `test/unbounded/canonical.test.js` must fail first. Result files come from
  strangers: read them only through `readResult()`, which refuses anything over 1 MB or not exactly
  the format, and never run anything from one.
- The unbounded engine asks for cell memory only by adding a slab (`World.addSlab()`), so a refusal
  is one catchable `RangeError` in one place. Keep it that way.
- `state.reset()` keeps the scene, renderer and camera, so a rebuild reuses one WebGL context.
- `public/CNAME` and `base: '/'` go together. Without both, the deployed site breaks.
- Pinned brand files match `brand.lock`; `npm run build` refuses to build otherwise. Only
  maintainers change one: they change the brand at its source, release a `brand/v*` tag, and
  re-sync with `npm run brand:sync`. Never edit a pinned file here.

## Risky operations

- **`npm run deploy` publishes to the world immediately.** Only a maintainer runs it, from `main`,
  as a step of [RELEASING.md](RELEASING.md). Agents never deploy.
- **Memory is `size³ × generations` bytes**, all held at once, plus each generation's `active`
  list, which costs far more per live cell (an array of three numbers each). With the GPU the
  step is no longer the limit: memory and rendering are (README §4). Raising the size or
  generation limits can freeze or crash a visitor's tab; test at the new maximums, on the GPU
  and on the CPU, before raising them.
- `controls.js` re-inits on almost every input. A change there easily triggers double rebuilds.

## What NOT to do

- **Don't edit files while `main` is checked out.** Before the first edit, check
  `git branch --show-current`. In a fork, work on a feature branch off `upstream/development`
  ([CONTRIBUTING.md](CONTRIBUTING.md)). In a maintainer's clone of the lab, a deploy may have
  left the checkout on `main`: switch to `development` (`git switch development && git pull
  --ff-only`) before changing anything. Never leave the checkout on `main` when you finish.
- **Don't start on an issue that isn't labelled `ready` (or `in progress` under your own
  claim)**, except a small fix such as a typo or a broken link. An issue goes idea → planning →
  ready → in progress → completed or cancelled ([CONTRIBUTING.md](CONTRIBUTING.md#how-an-issue-moves));
  only maintainers move it. Claim it first with a comment giving a date and a confidence, in the
  form CONTRIBUTING shows; the person running the agent answers for the estimate. The pull
  request is reviewed against the maintainer's `Ready. Done when: …` comment, not the issue
  body: meet it, or say in "What changed" where it differs.
- **Don't file a plan's pieces as issues before the plan is accepted.** They stay a list in the
  plan; at acceptance each becomes a sub-issue (type Task, `ready`).
- **Don't invent a commit message format.** A commit message an agent drafts follows "Commit
  messages" in [CONTRIBUTING.md](CONTRIBUTING.md#commit-messages): a plain-sentence subject of at
  most 65 characters, a body saying what and why, then the trailers. Merge commits follow
  [RELEASING.md](RELEASING.md#merge-commits).
- **Don't make a pull request do more or less than one issue.** It resolves exactly one issue,
  all of it; an issue too big for one goes back to planning to be split. It lists each issue
  with its relation, using only `Resolves`, `Related to` and `Opens`, which GitHub doesn't act
  on in a pull request into `development`: the maintainer who merges it closes the issue marked
  `Resolves` as completed.

- **Contributions must be original work; no code or internals from other projects or
  products**, including Morpheus Tech's other, proprietary products: don't copy, port or describe
  them. This is public, Apache-2.0-licensed code; anything committed is given away and disclosed.
  Write new demos from scratch, for the CPU first: the CPU path is the reference, and a GPU
  path is optional and must match it exactly. Libraries come in as npm dependencies, not copies.
- No secrets, tokens, internal hostnames, or paths outside this repo. The repo and the site are
  public.
- Don't commit `dist/` (ignored); `gh-pages` holds the build.
- Don't add brand files beyond the two pinned in `brand.lock`: the brand's design documents and
  the full-size logo stay private.
- Don't copy scripts from the company's other sites either. They are proprietary too;
  `scripts/brand.mjs` was written fresh for this repo.
- Don't add a framework or a backend for a demo. The lab stays a static site.

## Known debt

`console.log` runs on every frame in `updatePoints()` and on every generation. `time.js`
still computes a clock history that nothing displays. `index.html` carries many inline styles.
Each generation's `active` list is an array of `[x, y, z]` arrays, about 40 bytes of heap per
live cell; with the GPU computing the steps, building and holding those lists, and
`updatePoints()` walking them every frame, is what limits grid size now.

## End-of-session obligations

- New or changed simulation mode or seed: update `README.md` (Simulation modes) and
  `ARCHITECTURE.md` (Domain model).
- New module or data flow: update the module layout here and `ARCHITECTURE.md`.
- New rule or risk: add it here.
- User-visible change: add a line under `## [Unreleased]` in `CHANGELOG.md`.
- Release prep, when asked: draft the prep changes in [RELEASING.md](RELEASING.md) (step 2) as
  file edits only. Maintainers commit, merge, tag and deploy.
