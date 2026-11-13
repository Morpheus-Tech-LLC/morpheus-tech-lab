# morpheus-tech-lab — Architecture

## System topology

A static single-page site. There is no server logic and no database: every simulation runs
in the visitor's browser tab, on its GPU with WebGPU where it can and on its CPU otherwise, and
closing the tab discards everything. The only thing stored is one setting in the browser's
local storage: whether GPU compute is on.

```
 maintainer: npm run deploy ─► vite build ──► dist/ ──► gh-pages branch
                                                          │  GitHub Pages
                                                          ▼
                                   lab.morpheustech.net  (public/CNAME; DNS CNAME
                                                          lab → morpheus-tech-llc.github.io)
                                                          │  static files only
 ┌──────────────────────────── Browser tab ───────────────▼─────────────────────┐
 │ index.html ── main.js ── initSimulation() ──► matrixFunctions                │
 │                              │                 generateSimulation()          │
 │                              │                 ├ 1. GPU: gpu/engine, WGSL    │
 │                              │                 └ 2. CPU: the rest, if any    │
 │                              │                        │                      │
 │   controls.js ──writes──► state (state.js) ◄── history: Grid3D[0..N]         │
 │   gpu/computeControl.js ── state.gpuCompute     gpu/device: the GPUDevice    │
 │                              │                                               │
 │   time.animate() ──► simulationModel.updatePoints() ──► Three.js Points      │
 │                                     space.js: scene, camera, OrbitControls   │
 │   └ in Explore: explore.exploreFrame() ──► explore/view.js (points, boxes)   │
 │                                                                              │
 │ main.js opens Explore: hud.startFromSetup() ─► startExplore() ── unbounded/  │
 │   driver ◄──► run.worker; explore/hud.js: the boxes' settings (state.explore)│
 │   └ seed editor open: editor.editorFrame() ──► explore/editorView.js, drawn  │
 │     into the same renderer, only on change                                   │
 │   (a Web Worker: World + step, one generation at a time; snapshots back)     │
 │ Contests mode: contests/contests.js ─► panel.js ─► speed.js (SpeedRun) ──►   │
 │   run.worker, timed, which makes the result file; verify.worker for Verify   │
 └──────────────────────────────────────────────────────────────────────────────┘
```

The company site, https://morpheustech.net, links here, and the lab's company panel (opened
from any Morpheus Tech logo) links back to it. Nothing here calls any Morpheus service.

## Domain model

**`Grid3D`**: a dense cube of `size³` cells (`Uint8Array`) plus `active`, the list of
non-empty cells the renderer draws.

**History**: `state.simulationData`, one `Grid3D` per generation, from 0 to `generations`.
It is computed in full before playback.

**Simulation mode**: each mode turns a seed into a history.

| Mode | Space | Evolve step |
|---|---|---|
| Game of Life 3D | `size³`, 26 neighbours | `convolve3D()`: birth 9–10, survival 5–15 by default; separate corner, edge and face rules when wrapping is off |
| Rule 30 | 1D or 2D, depth 1 | `evolveRule30()`, `evolveRule30_2D()` |
| Sine wave | `size³` | `generateSineWaveGrid()`: an analytic field per generation, no state carried |
| Abelian sandpile | `size²` at `z = 0` | `evolveSandpile()`: one grain is added at the centre each generation, and cells topple above 4 |

Game of Life 3D and both Rule 30 modes also run on the GPU (`src/gpu/engine.js` and the
WGSL in `src/shaders/`), with one compute dispatch per generation. The GPU gives exactly the
CPU's grids; the CPU functions above are the reference.

**Unbounded world** (`src/unbounded/`, shown by the Explore mode): Game of Life 3D without edges.
Space is divided into chunks of 16³ cells (8³ or 32³ also work), held in a `Map` from chunk
coordinate to slot. A chunk is allocated when live cells reach it and released once it is empty.
Each slot lives in a large slab (64 MB by default) and holds two copies of its chunk, the
current generation and the next. `step()` advances every chunk by one generation together, then
checks the limits; it keeps no history. Rules are any birth and survival counts except B0.
`ReferenceWorld` is a deliberately simple engine for the tests to check it against.
A run (`run.js`) steps a world in a Web Worker (`run.worker.js`), either until a deadline (a
timed run: only generations completed before it count) or until stopped (an open-ended run,
which can also pause, step one generation and cap its rate). On the page, `EngineDriver`
(`driver.js`) starts each run in a fresh Worker, sends its commands, and receives statistics
(at most four times a second) and, on request, snapshots of the live cells, or past a budget
of cells, of the chunks that hold them.

**Explore** (`src/explore/`): the mode that shows the unbounded world. Its seed is one of the
shapes, lifted into world coordinates around the origin (`seed.js`), a preset with its own rules
(`presets.js`), or a seed file, JSON with the rules and the cells. A preset or a seed file
replaces the shape and the rules.

Explore's settings (#69) are one value, `state.explore`: the seed's source and its cells, the
visitor's rules, the arena and the memory limit (`setup.js`, with no DOM). From it come what each
HUD box shows, what is locked (a preset's rules; a saved generation's rules and arena) and the
config `startExplore()` takes. A change never edits it in place: each popover's Apply gives a new
value, or the reason it is refused, checked by building that config, and restarts the run.
`hud.js` wires the gears in the Seed, Rules and Limits boxes' titles to their popovers, and the
folding of every HUD box, and `popover.js` keeps one popover open at a time, the save popover
too. The HUD is one panel, Simulation, in every mode, with the boxes as its sections: first
Mode, which names the simulation that runs (`controls.js`), then the mode's own. Explore's Run
box only reports. The settings dialog shows only the mode choice in Explore.

**The seed editor** (#70) designs a seed in the seed box, `SEED_BOX` in `contests.js`, which `seed.js` re-exports (cells −5 to 4
on each axis), where the Discovery contests' seeds go. The Seed popover opens it: Design… on the
seed in use (`designOf()`), Edit a copy… on a preset (`presetCopy()`). `editorModel.js`, with no
DOM and no Three.js, holds the box as 1,000 bytes, the cursor, the selection (every kind is an
axis-aligned box of cells), switching, random fill and 100 steps of undo and redo, and works out
which axis each movement key takes from the camera's right, up and viewing directions: each
screen direction takes a different axis, the assignment that matches them best. `editorView.js`
has its own scene, camera and orbit controls, but draws into the lab's renderer, so there is
never a second WebGL context: one instanced mesh for the live cubes (another for the faded ones),
points for the lattice, boxes and lines for the selection and the cursor. It draws only when
something changes. While the editor is open, `time.animate()` calls `editorFrame()` instead of
`exploreFrame()` and the main render, and Explore's camera controls are off; the run's Worker
keeps going. `editor.js` holds the panel, the keys and picking. Use goes through `useDesign()`,
which makes the seed `{kind: 'design', cells}` with the rules the editor opened with, and
restarts the run as a popover's Apply does.

`explore.js` runs it through `EngineDriver`, with no history:
`state.simulationData` stays null. `view.js` draws the latest snapshot in a point buffer that
grows with the pattern, or the occupied chunks as boxes past 300,000 cells, and moves the camera
to keep the pattern in view (`framing.js`). In the 2D view it asks the Worker for one plane of
cells; the slice slider spans the pattern's extent on that axis. Explore's runs *settle*: the
engine keeps a 64-bit fingerprint of the cells (`World`'s `fingerprint` option), and the run
ends when every cell has died or a fingerprint matches one of the last 10,000 generations'
(the cells repeat in place). The Worker then replays the cycle once to send its frames, which
the view loops while the count stays put. A fingerprint is a hash, not a proof: scoring a
contest on a repeat needs #38's canonical state.

**Saving** (`save.js`): Save this generation, in Explore's Run box, and Save seed, in the Seed
box, open one popover, which moves beside the box of the button that opened it. **Save this generation**
asks the Worker for every live cell of the current generation, with the statistics of the same
moment (a snapshot whose budget is 1,000,000 cells, so a bigger generation comes back as chunks
and isn't saved), or takes the cycle frame on screen, and makes a result file from it
(`resultFromCells()`): the run's definition with its first seed, the generation, the ending, both
hashes, the details and the cells. **Save seed** writes the run's first seed as a seed file.
Save writes through the browser's save dialog (`showSaveFilePicker()`) where there is one, or as
a download. Load… reads either (`readSeedOrSave()`); a saved generation is checked against its
hashes, and its run starts with those cells at that generation (the Worker's `from`), under the
file's rules and arena, keeping the first seed in its config, so a later save is still a result
of that seed.

**Results** (`canonical.js`, `verify.js`): a run's state at one generation, as canonical bytes: a
header (sorted JSON: the format's version, the generation, and the run's whole definition, which is
its contest id, rules, seed, arena and the limits stated in the pattern's terms) and a body (the
live cells sorted by z, y, x, as zigzag varints of the difference from the cell before). Its
SHA-256 hash goes in a result file, beside run details (timings, statistics, browser) that are
outside the hash. A result may also carry `cells`, the live cells at its generation, and
`seedHash`, the hash of generation 0 under the same run; `checkResultHashes()` confirms both
without a replay, so an edited file fails. Explore's Save this generation writes them, so Load…
can carry on from the generation. `verifyResult()` replays the run from its seed to the stated generation and
compares hashes, and checks an ending the pattern decides by taking one more step; with a
reference table (every generation's hash, made once by `scripts/reference-hashes.mjs`) it looks
the hash up instead. `scripts/verify.mjs` runs it in Node.

**Contests** (`contests.js`, #40): each contest is data, with a versioned id (`speed-1`), its
kind, what it fixes (rules, seed or seed box, arena, limits), its chunk size and, for Speed, its
seconds. `runFor(contest, entry)` makes a run's definition from the contest's fixed parts and the
entry's rules and seed, so a contest's result states its whole run like any other. A contest's
result adds a `score`, outside the hash: Speed's is `{generations, ms}`, where `ms` is the time to
reach the 1,000-generation ceiling, and null for a run the 6 seconds ended. `verifyResult()`
first runs `checkContest()`: the run must be `runFor()` of its contest, with its own rules and
seed, and the score must follow from the generation and ending; then the replay, or the table,
confirms the generation. A contest the lab doesn't know isn't checked. The table for Speed is
made from the contest itself, with `scripts/reference-hashes.mjs --contest speed-1 --to 1000`.
The browser's name and version in a result's details come from `src/browser.js`, and are never
checked.

**The Contests mode** (`src/contests/`, #77). The page presents one contest in three branches
(Speed, Methuselah, Contained chaos); the code calls each branch a contest (`contests.js`'s
`CONTESTS`, an id such as `speed-1`, and a result file's `run.contest`, which is hashed, so it
keeps its name). It is a sixth mode, opened from a compact banner left of the
company logo, which also gives the date entries close (`closes` in `contests.js`, "Closes TBD"
while null). It has nothing to set, so one click opens it (`enterContests()` in `controls.js`),
and it has no card in the settings dialog. In Contests the banner stays, pressed; a click on it,
or Esc, goes back to the mode it was opened from (`leaveContests()`). Like Explore, it never reaches
`initSimulation()`. `contests.js` starts it in an empty scene and
shows the panel (`panel.js`) in the middle of the screen; `animate()` then draws nothing, and only
moves the countdown (`contestsFrame()`). The panel lists the contests as square cards, each kind
in its own colour and logo (`looks.js`), opens Speed's page, runs it
(`speed.js`'s `SpeedRun`: a timed run in a Worker, with the contest's chunk size and its ceiling as
the generation limit) and shows a clock whose arc empties over the 6 seconds, the statistics, and
a chart of the generations completed over time (each at the moment it was completed, the Worker's
`generationMs`, so a generation discarded at the deadline never stretches the line past 6
seconds), with axes rescaled as the run climbs
(`format.js`'s `chartLayout()`, tested in Node). The results card leads with the score, sized for
a screenshot, then the same chart, with its data as a table. When the run ends, `SpeedRun` scores it from the run's
own end reason and statistics, and asks the Worker for the result file (`run.js`'s `result`
message, `resultOf()` there), so the page never holds the cells. **Verify a result** reads a
file and checks it in its own Worker (`verify.worker.js`, running `verifyResult()`). The panel sets
only `textContent`, so nothing from a file is read as HTML. Leaving the mode closes the panel and
terminates its Workers.

**Benchmarks**: `scripts/bench.mjs` (#39) measures the engine in Node (chunk sizes, seeds, rules,
a bit-packed step, the dense `convolve3D()` in `denseStep.js`, serialization), times the Speed
candidates through the real run loop, and projects the Discovery worst case, a result file made by
`scripts/bench/worst-case.mjs` that `scripts/verify.mjs` replays. The dev page
`src/unbounded/memory.html` measures what one tab can take in slabs in each browser. Their numbers
pinned the contests' values: the chunk size, Speed's seed, rules and ceiling, the Discovery arena
and budget, and Explore's default memory limit.

**Seed**: a shape function from `shapeGenerators.js` (perlin, cube, tetrahedron, octahedron,
worley, rule30). Its parameters are in `state.shapeParams`.

## Data flows

**Write path (rebuild).** A control changes `state`, then `initSimulation()`:
1. `state.reset()`
2. `generateSimulation()` computes the full history. For Game of Life 3D and Rule 30, with
   GPU compute on and a device ready, `evolveOnGpu()` steps the grid on the GPU and reads the
   generations back in batches; the CPU computes any generations the GPU didn't (all of them
   when it's off or unavailable). If a newer rebuild started meanwhile, this one's result is
   dropped.
3. `buildSimulationModel()` sizes a `Points` geometry for the grid
4. The first `updatePoints()` runs, and the loading overlay hides.

**Read path (every frame).** `animate()` runs at about 60 fps. It advances `state.currentGen`
by playback speed and direction, then `updatePoints()` writes the positions and colours of that
generation's `active` cells into the geometry buffers. Orbiting, slicing and auto-rotate change
only the camera or the visible set.

## Architectural decisions

**Precompute the whole history.** It costs memory (`size³ × generations`, all at once) and a
wait up front. In return, scrubbing and reverse playback are instant and the render loop never
waits on compute.

**The CPU is the reference; the GPU is an accelerator (#28).** The lab shows what is possible
in plain JavaScript, readable by anyone, and every demo is written fresh for the CPU first. A
50³ grid over 100 generations is the default because it is comfortable on a laptop; 100³
proved too slow on the CPU. Game of Life 3D and Rule 30 now also run as WebGPU compute
shaders, using only the browser's WebGPU API, and must give exactly the CPU's generations
(`src/gpu/compare.js` checks this). The CPU path stays: it is the fallback when WebGPU, an
adapter or a device is missing or fails, and the definition of what each mode does. With the
GPU, memory and rendering, not the step, set the size limit (README §4).

**An unbounded engine beside the dense one (#35).** The dense grids wrap or clamp at their
edges and allocate all their memory up front, so a pattern can never outgrow them. The
unbounded engine's memory follows the live cells instead. It is new code next to the existing
modes, which keep precomputing as before. Every generation is one lockstep over the whole world,
so the chunk layout and processing order can never change a result. Refusing B0 makes skipping
empty space exact. Cells live in slabs outside the JavaScript heap, which browsers cap at a few
GB whatever the machine has, and a slab is the only point where the engine asks for memory, so
running out is a catchable error. A limit ends a run with the last complete generation whole,
never clipped, so a run can always be replayed to the same place.

**A contest's run draws nothing (#77).** Speed's score is how many generations the visitor's
machine completes in 6 seconds, so the page gives it the whole machine: no 3D view while it runs,
only a countdown and statistics four times a second. Its result file is made in the Worker, from
the world it already holds, rather than by sending a generation of hundreds of thousands of cells
to the page.

**The unbounded engine runs in a Worker (#36).** A run can work flat out for as long as it
lasts, so it runs off the page's thread, and the page only sends commands and draws what it
receives. Statistics are throttled and snapshots sent only on request, so a run nobody is
watching spends its time on generations. A timed run's deadline is checked before each
generation commits, never mid-step, so its count is the generations completed in time, and the
last one stands whole. Each run gets a fresh Worker, so ending one returns all its memory.

**Results are checked by replay, with no server (#38).** The lab is a static site, so a result
can't be trusted for what it says, only for what replaying it gives. The hash covers the run's
definition and the cells, never the chunk layout or the machine, so any engine on any machine
agrees. The definition is always in full, so a file can be checked on its own, and only the
format's version is hashed, not the engine's: the cells follow from the rules and the seed alone,
so an engine fix makes a wrong result fail instead of protecting it. A fixed-seed run (Speed) is
checked by looking its hash up in a precomputed table, so checking never needs hardware as fast
as the entrant's. Result files come from strangers, so they are read as data, against an exact
format, and the verifier has its own generation and memory limits.

**Vanilla JS and one state object.** Kept small enough to read in one sitting, as befits public
demo code. The lab hasn't needed more structure yet.

**Static hosting on GitHub Pages under a company subdomain.** Free, with no server to run;
`lab.morpheustech.net` keeps the lab under the company's domain while it stays a separate repo
from the company site.

**The brand is pinned, not linked, and only in part.** The lab takes `tokens.css` and the favicon
from a released `brand/v*` tag, with a hash lock; only maintainers can re-sync it. The brand's
documents and full-size logo stay private, since anything here is public. `NOTICE` keeps the
brand out of the license grant. The restyle that would use the tokens is not done yet.

**Open source under Apache-2.0, built with the community.** The code was public from the start,
under MIT through v1.4.0; from v1.5.0 it is licensed under Apache-2.0, with a `NOTICE` file.
Outside contributions come in under the same license, each commit signed off under the
Developer Certificate of Origin ([CONTRIBUTING.md](CONTRIBUTING.md)). Contributions must be
original work, with no code or internals from other projects or products, which keeps the
company's proprietary products out (see `AGENTS.md`).

**Pull requests into `development`, releases from `main`.** `main` is protected and changes only
by a release pull request from `development`; the annotated tag is the version. The rules are in
[RELEASING.md](RELEASING.md).
