# morpheus-tech-lab — coding contract

For people and agents changing code. The contributor workflow (setup from a fork, branches,
pull requests, DCO sign-off, changelog) is in [CONTRIBUTING.md](CONTRIBUTING.md); branches, versions and releases are in
[RELEASING.md](RELEASING.md).

## Module layout

```
.github/workflows/ci.yml The `build` (npm ci, npm run build, npm test) and `DCO` (sign-off) checks, required on main
.github/ISSUE_TEMPLATE/  Issue forms: bug_report.yml (type Bug), idea.yml (type Feature; what and why only), both labelled `idea`; config.yml turns off blank issues and links Discussions (GitHub adds the security-report entry itself)
.github/pull_request_template.md  The pull-request template: each issue and its relation, what changed, how it was tested, screenshots, and the checklist
index.html               All markup: HUD and its popovers, control bar, company panel, info panels, the top bar's
                         buttons (Info and the Contests banner, in #top-actions) and the Info guide
public/CNAME             lab.morpheustech.net, copied into every build. Never delete
public/favicon.svg       Brand pin (see brand.lock). Never hand-edit
public/hall-of-fame/     The Hall of Fame's pictures (128×128, metadata stripped) and, in results/, each entry's
                         verified result file (#79); created with the first entry. Only files an entry names
brand.lock               The brand tag the pin came from, and a sha256 per pinned file
LICENSE                  Apache License 2.0 (MIT through v1.4.0)
NOTICE                   Copyright notice, and what the license does not cover: the Morpheus Tech name, logo and brand files
CONTRIBUTING.md          How to contribute: setup from a fork, branches, pull requests, DCO sign-off, changelog;
                         handling contest entries (maintainers)
CODE_OF_CONDUCT.md       Contributor Covenant 2.1, unmodified apart from the enforcement contact
SECURITY.md              Supported versions (latest only) and private vulnerability reporting
ROADMAP.md               The public roadmap: the engine, new demos, the brand restyle, community
RELEASING.md             Branches, versions, changelog format and the release steps
CHANGELOG.md             What each version changed (Keep a Changelog)
scripts/brand.mjs        `sync --org <brand repo>` re-pins the brand at a tag (maintainers); `check` verifies the lock
scripts/verify.mjs       Checks result files from the unbounded engine in Node: by replay, or by lookup with --table;
                         a contest's result is checked against its contest too, and its score printed. Takes
                         several files (public/hall-of-fame/results/*.json); the worst verdict sets the exit status
scripts/reference-hashes.mjs Computes a run's reference table: the hash of every generation, for checking Speed by lookup;
                         --contest speed-1 takes the run from contests.js
scripts/bench.mjs        Benchmarks for the unbounded engine (#39): chunk sizes, seeds and rules, bytes against bit-packed
                         cells, the dense convolve3D(), serialization, the Speed candidates and the Discovery worst case
scripts/bench/           The bench's parts: lib.mjs (timing, seeds, rules, tables; no Node APIs), bitpacked.mjs (a
                         bit-packed one-chunk step, bench only), candidates.mjs (Speed candidates, each rebuilt from a
                         number; --run writes one's run), worst-case.mjs (writes the Discovery worst-case result file)
vite.config.js           base '/', because the site is served from the domain root; esbuild's legalComments 'inline',
                         so the bundled libraries' licence notices (three.js's MIT) ship with the site
test/                    `npm test` (Node's built-in node:test, no dependency): unbounded/ checks the unbounded engine,
                         its run loop on a fake clock and in a worker_threads Worker, the canonical hash and
                         the verifier (fixtures/ holds an example result and a hand-edited copy), settling and its
                         keyframes on small hand-made patterns (settle.test.js; the patterns are in helpers.js),
                         the contests and their scores, Methuselah's included (contests.test.js), ships leaving
                         at the edge and Classic Methuselah (departures.test.js), and the engine
                         against convolve3D() (dense.test.js); an arena that wraps, against the reference
                         and convolve3D() with wrapping on, and the worlds refused (wrap.test.js); an arena
                         with walls, against the reference and by hand (walls.test.js);
                         browser.test.js checks telling the browser; selfHosted.test.js that the page loads no
                         font from Google's servers (fonts come from npm, served with the site); readouts.test.js that a
                         readout's slot fits every value it counts through; shapeGenerators.test.js the bounded
                         mode's seed shapes (#49); memoryAdvice.test.js checks the precomputed modes'
                         memory estimate against real runs, and that the old caps' runs don't ask; brandMark.test.js that the company
                         panel's inline mark keeps the pinned favicon's paths and gilt; contests/ checks a Speed run and Verify a
                         result… on worker_threads (verifyNodeWorker.js stands in for verify.worker.js) and
                         Methuselah and Classic Methuselah runs on worker_threads (discovery.test.js),
                         the panel's text (format.test.js), Watch's, Methuselah's and the ships' included, the email's text (submit.test.js)
                         and the Hall of Fame, hall-of-fame.json against its result files (hallOfFame.test.js);
                         explore/ checks
                         The unbounded mode's seeds, presets, seed files, saves, settings (setup.test.js), Ships leave at
                         the edge (ships.test.js), an arena that wraps (wrap.test.js) or has walls
                         (walls.test.js), camera framing
                         and the seed editor's model (editorModel.test.js); guide/ checks the Info guide's automata
                         against published facts (automata.test.js), and its steps, its sources, its 3D camera
                         and that every animation draws (steps.test.js)
src/
  main.js                Boot: Game of Life 3D (unbounded) (startExplore()) by default, or initSimulation(); then animate()
  browser.js             detectBrowser(): the browser's name and version, from navigator.userAgentData or the
                         user-agent string, for a result's details (no DOM; tested in Node)
  brand/tokens.css       Brand pin: the Morpheus Tech brand tokens. Not imported yet. Never hand-edit
  state.js               The one shared, mutable `state` object: settings, rules, scene handles, history
  readouts.js            holdWidth(): keeps a readout above the control bar as wide as the longest value it
                         will show while a run plays, so it doesn't shift as it counts (#175) (tested in Node)
  simulationModel.js     Builds the Three.js Points geometry from the history; updatePoints() per frame
  matrixFunctions.js     The automata: generateSimulation() and each mode's evolve step (the CPU reference);
                         convolve3D() here passes `state`'s settings to denseStep.js
  denseStep.js           convolve3D(grid, {wrapping, rules, boundaryRules}): the dense Game of Life 3D (bounded) step, without
                         `state`, so Node can run it
  grid3D.js              Grid3D: a dense size³ Uint8Array plus an `active` list of live cells
  shapeGenerators.js     Seed shapes: perlin, cube, tetrahedron, octahedron, worley, rule30; boundedShape(),
                         the one Game of Life 3D (bounded)'s Seed popover applies
  space.js               Scene, camera, renderer, OrbitControls (stored on `state`)
  time.js                The animation loop, playback speed, auto-rotate
  controls.js            The control bar's wiring: buttons, sliders, the company panel, mode switching
                         and the Contests banner (~800 lines)
  memoryAdvice.js        A precomputed run's memory estimate (grids, live cells, view), the
                         suggested ranges for a laptop and a desktop, CONFIRM_BYTES, and the popovers'
                         texts (#123) (no DOM; tested in Node)
  adviceControl.js       The Grid popover's range hints and their popovers (#123)
  hudSettings.js         Every mode's settings in the HUD (#130): the Mode popover, from the HUD panel's
                         title gear or the control bar's, and the precomputed modes' Grid, Seed and Rules
                         popovers, whose Apply runs initSimulation() again, asking first above a high
                         memory estimate (#123); each mode keeps its own settings
  gpu/device.js          WebGPU status ('ready', 'no-webgpu', 'no-adapter', 'device-failed') and the one GPUDevice
  gpu/engine.js          Game of Life 3D (bounded) and Rule 30 (1D, 2D) on the GPU: evolveOnGpu() yields each generation
  gpu/computeControl.js  The GPU compute toggle: its GPU/CPU badge, the remembered choice, the "why not" popover
  gpu/compare.js         Not bundled: run from the dev console to check the GPU's generations against the CPU's
  shaders/*.wgsl         The WGSL compute shaders: gameOfLife3D.wgsl, rule30.wgsl (1D and 2D)
  unbounded/             Game of Life 3D without edges, shown by Game of Life 3D (unbounded). Imports no `state`, so it runs
                         in Node, a Web Worker or the browser
  unbounded/world.js     World: the chunk store (chunks as slots in large slabs), seeding, the limits, and the
                         arena, which may wrap (`wrap`, #114): a torus, with no departures; or have walls
                         (`walls`, #119), whose corner, edge and face cells follow their own rules
  unbounded/step.js      step(): one generation, a lockstep over every chunk, or the limit that ends the run;
                         in a wrapping arena, the chunks at its faces read their border from across the wrap;
                         with walls, they compute their wall cells by region, each by its own rule
  unbounded/rules.js     validateRules() (refuses B0) and the rule lookup table
  unbounded/reference.js ReferenceWorld: a deliberately simple Set-of-strings engine the tests check world.js against,
                         wrapping in a box, or closed by walls with their own rules, too
  unbounded/run.js       Run: the run loop (timed and open-ended runs, and replays with keyframes and seek;
                         pause, step, stop, settling through settle.js), statistics, snapshots, every
                         generation's live cells for a run with `history` (a Discovery run's chart), an ended run's
                         result file (the `result` message), and a replay's hash at its generation (`replayed`)
  unbounded/settle.js    Settler: the settle detector (#41). Ends a run when its pattern dies or repeats in place:
                         the fingerprint proposes a repeat, a rebuilt generation confirms it cell for cell; the
                         window and the budget's boundary; 'emits', a repeat whose cycle had a departure (#100).
                         run.js and verify.js both use it
  unbounded/departures.js Ships leave at the edge (#100), Classic Methuselah's rule: withDepartures() wraps step()
                         for a World built with `departures: {period}`. At an edge event it splits the cells into
                         islands, tests each departing one for an outward ship of period ≤ P, deletes them and
                         records each departure in world.departed, or ends the run at the edge
  unbounded/keyframes.js Keyframes: a run's cells every K generations under a byte budget, thinning as K doubles,
                         and a World rebuilt from the nearest; a replay seeks with them, settle.js confirms with them
  unbounded/run.worker.js The Web Worker that serves one Run
  unbounded/canonical.js The canonical state (a run's definition, the generation, the cells as bytes), its SHA-256
                         hash, the result file (readResult() reads one as untrusted data) and the reference table
  unbounded/verify.js    verifyResult(): replays a result, or looks it up in a table; verified, mismatch, refused
                         or not checked. A settled result (died, repeat, emits) is replayed with settle.js, never
                         looked up; a result's departures are replayed with the run and compared
  unbounded/verify.worker.js The Web Worker that runs verifyResult() for the page's Verify a result
  unbounded/endings.js   END_REASONS, how a run can end; apart from run.js so canonical.js can import it without
                         a cycle (run.js imports canonical.js to make a result file in the Worker)
  unbounded/contests.js  The contests as data (#40, #41, #100): CONTESTS (speed-1, methuselah-1,
                         classic-methuselah-1), departuresFor(run), runFor(contest, entry),
                         which refuses an entry's empty seed or a cell outside the seed box, each kind's score
                         and order (speedScore(), methuselahScore(), compareMethuselah()), methuselahWarnings()
                         (B1), and checkContest(), which checks a result's run and score against its contest;
                         SEED_BOX, DISCOVERY_ARENA
  unbounded/hall-of-fame.json The Hall of Fame's entries (#79), added by maintainers by pull request after
                         verifying them (CONTRIBUTING.md, "Contest entries"); read by contests/hallOfFame.js
  unbounded/driver.js    EngineDriver: the page's side of a run; starts a fresh Worker per run and relays its messages
  contests/              The Contests mode (#77): the contests on the page
  contests/contests.js   isContests(), startContests() and stopContests(): an empty scene, the panel, nothing drawn
  contests/panel.js      The panel in the middle of the screen: the list (the kinds in ON_PAGE), a contest's page
                         with its Hall of Fame; Methuselah's with its entry (#94), Load simulation… and its refusals,
                         shared with Classic Methuselah's, which adds its ships and its fifth ending (#102),
                         the run (Speed: countdown, statistics, a chart of generations over time; a Discovery run:
                         the generation out of the budget, statistics, a chart of live cells), the results card
                         with Export result and Submit by email, Verify a result, and the
                         HUD's Contest section. Sets only textContent
  contests/speed.js      SpeedRun: one Speed run in a Worker, its score and its result file made in the Worker;
                         verifyInWorker() (no DOM; tested in Node with worker_threads)
  contests/discovery.js  DiscoveryRun (#94): one Discovery run (Methuselah's, or Classic Methuselah's with ships
                         leaving at the edge and its departures, #102) in a Worker, in its contest's arena:
                         a settling run with every generation's live cells kept, its score from how it ended,
                         and its result file made in the Worker (no DOM; tested in Node with worker_threads)
  contests/watch.js      Watch (#78): a result played back in 3D in place of the panel, replayed in a Worker
                         (with the contest's departure rule, and ticks where ships left, #102)
                         (run.js's replay kind), with ExploreView, the control bar, a scrub bar, Close, and
                         whether the replay's hash at the result's generation matched
  contests/looks.js      Each kind of contest's colour and logo (a stopwatch, an hourglass, a scribble in a box),
                         and Verify a result's scales, drawn as SVG on the page
  contests/submit.js     Submit by email (#79): the address, the subject, the email's text (the lab's promise to an
                         entrant) and the mailto: link (no DOM; tested in Node)
  contests/hallOfFame.js The Hall of Fame (#79): readHallOfFame() (the data's shape; a Methuselah entry also has
                         rules and seedCells), rankEntries() (as the contest ranks, then date, then arrival), checkEntry()
                         (an entry against its result file) (no DOM; tested in Node)
  contests/format.js     What the panel says and draws: countdown, the chart's layout (chartLayout()), scores,
                         endings (Speed's and Methuselah's, `emits` included), the ships that left (departuresText(),
                         watchDeparturesText()), statistics, a Discovery seed's picture
                         (seedPicture()), what Watch found (selfVerifiedText()), and racing #1 (paceOf(), paceAt(),
                         raceText(), paceLayout(), #149) (tested in Node)
  contests/contests-check.html Not bundled: a dev page (/src/contests/contests-check.html under `npm run dev`) that
                         clicks through the Contests mode in a frame holding the lab, two real Speed runs,
                         Submit by email and a staged Hall of Fame included, and Methuselah's page, Load simulation…
                         and its runs, and a Classic Methuselah run whose ship leaves, marking each check ✔ or ✖, and
                         lists what to check by hand
  contests/race-bench.html Not bundled: a dev page (/src/contests/race-bench.html under `npm run dev`) that measures
                         what racing #1 costs a Speed run (#149): runs with and without the race in turn, then
                         their means, spread and Welch's t
  guide/                 The Info guide (#159): a short tour of cellular automata, with every source it cites
  guide/steps.js         The ten steps' words, each one's animation and sources, and SOURCES: every cited work's
                         authors, year, title, venue and link (no DOM; tested in Node)
  guide/automata.js      The small automata the animations run, written for the lab: elementary rules (Rule 30,
                         Rule 110), Life on the plane and on a torus, RLE patterns, the lab's default rule and the four
                         cases step 6 shows it deciding (CASES_3D), the HPP lattice gas,
                         Nagel–Schreckenberg traffic, the sandpile, and the scales' illustration (no DOM; tested)
  guide/iso.js           An orthographic camera that draws shaded cubes on a 2D canvas (no DOM; tested)
  guide/scenes.js        Each step's animation, drawn on the guide's own 2D canvas; a frame depends only on its
                         time. The 3D steps run the lab's unbounded engine (World, step, presets), never its WebGL
  guide/guide.js         The guide on the page: Info opens and closes it, Back, Next, the dots, the arrow keys
                         and Esc, Sources and credits, pausing the lab behind it (isGuideOpen(), which
                         animate() checks), and a still frame with reduced motion. Sets only textContent
  guide/guide.css        The top bar's buttons and the guide's layout, a phone's included
  guide/guide-check.html Not bundled: a dev page (/src/guide/guide-check.html under `npm run dev`) that checks the
                         guide on its own, with its markup and styles from index.html and stand-ins for the lab, so
                         it runs without WebGL; ?step=N&wait leaves step N open, for a look or a screenshot
  explore/               The Game of Life 3D (unbounded) mode, called Explore until #116 (the code keeps `explore`): the unbounded engine on the page (#37)
  explore/explore.js     Starts and drives the run, the control bar's commands in Game of Life 3D (unbounded), the HUD box and notices
                         (ships leaving, #103), and the save popover
  explore/save.js        Save this generation (a result file with the generation's cells, as a contest entry is,
                         refused once a ship has left, #103), Save simulation (a seed and its rules) and
                         Save seed (its cells only, #130), and reading them back for Load simulation… and
                         the Seed box's File
                         (tested in Node)
  explore/view.js        ExploreView: the growing point cloud, chunk boxes past RENDER_BUDGET, the arena (dashed when
                         it wraps, brighter with walls) and chunk grid
  explore/framing.js     The camera distance that fits the pattern, and easing (no Three.js; tested in Node)
  explore/seed.js        Shapes lifted into the unbounded world, rule text, the seed file format, and SEED_BOX
                         (re-exported from contests.js), the 10³ seed box the editor and the Discovery contests
                         use (tested in Node)
  explore/setup.js       The unbounded mode's settings as one value, `state.explore` (#69): the seed's source, the rules, the
                         arena, what happens at its edge (the run ends, ships leave, #103, it wraps, #115, or
                         walls with their own rules, #119) and the memory limit; what each HUD box shows,
                         what is locked, each popover's change or the reason it is refused, the config
                         startExplore() takes and the Worker's world (worldOf()), the simulation in use
                         (simulationOf(), #130), a contest's arena and ships for its Design a seed…
                         (contestArena(), #94), and a Methuselah Hall of Fame entry's for its Open seed (entrySetup(), #146)
                         (tested in Node)
  explore/hud.js         The gears in the Simulation, Seed, Rules and Limits boxes' titles and their popovers,
                         whose Apply changes `state.explore` and restarts the run, and the save icons;
                         startFromSetup(); openSeedEditor() (Design a seed… and Open seed from Contests); and
                         folding every HUD box to its title, in every mode
  explore/popover.js     One HUD popover open at a time, beside its box: Esc, a click or focus outside closes it,
                         and focus goes back to its button. The save popover opens through it too
  explore/hud-check.html Not bundled: a dev page (/src/explore/hud-check.html under `npm run dev`) that clicks
                         through every mode's settings in the HUD in a frame holding the lab, the Mode and
                         Simulation popovers and each choice at the arena's edge included, marking each check
                         ✔ or ✖
  explore/editorModel.js The seed editor's model (#70): the 10³ seed box as bytes, the cursor, the selection, switching,
                         random fill, undo and redo, seeds in and out, and which axis each movement key takes from
                         the camera's directions (no DOM, no Three.js; tested in Node)
  explore/editorView.js  The seed editor's 3D view: its own scene, camera and orbit controls, drawn into the lab's
                         renderer (never a second WebGL context), and only when something changes; picks a cell
  explore/editor.js      The seed editor: opening over the unbounded mode's view and closing, the panel, the keys, the touch
                         buttons, Load… and Export (a seed file, cells only); Use goes through setup.js's
                         useDesign()
  explore/editor-check.html Not bundled: a dev page (/src/explore/editor-check.html under `npm run dev`) that clicks
                         through the seed editor in a frame holding the lab, marking each check ✔ or ✖, and lists
                         what to check by hand
  explore/presets.js     Preset seeds with their own rules: Cube10 and Spreading noise (#39's candidate
                         12345, its cells written out; a test checks them against scripts/bench/candidates.mjs),
                         and nine Ships (#105, group 'ships'), each with the generation, period and shift it
                         becomes a ship at, which a test checks on the engine
  unbounded/workbench.html Not bundled: a dev page (/src/unbounded/workbench.html under `npm run dev`) that checks
                         the Worker in the browser and drives a run by hand
  unbounded/memory.html  Not bundled: a dev page (/src/unbounded/memory.html under `npm run dev`) that measures how
                         much one tab can take in slabs (memory.worker.js), and times Speed candidates in the
                         Worker, alone or two side by side, drawn as they grow. Never ship or link it: reaching
                         the browser's cap can close the tab
  unbounded/compareDense.js Not bundled: checks the engine against convolve3D(), cell for cell, with wrapping off,
                         or a wrapping arena against wrapping on (`wrap: true`); `npm test`, the bench and the
                         dev console run it
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
  be born. The Game of Life 3D (unbounded) mode (`src/explore/`) shows it.
- **Changing a setting rebuilds.** Mode, size, seed or rules all go through `initSimulation()`
  again (from `hudSettings.js`'s popovers, or `controls.js`).
- **Mode flags.** `state.simulationMode` names the mode, and the booleans `useRule30`,
  `useRule30_2D`, `useSineWave` and `useSandpile` steer `generateSimulation()`. Size and
  generations are remembered per mode in `state.modeValues`.
- **Game of Life 3D (unbounded) streams instead.** `simulationMode === 'explore'` never reaches `initSimulation()`
  or `generateSimulation()`: on the Mode popover's Apply, or another HUD popover's, `controls.js` calls
  `startFromSetup()` (`hud.js`), which calls `startExplore()` with the unbounded mode's settings, and
  leaving the mode calls `stopExplore()`. `animate()` calls `exploreFrame()` instead of
  advancing `currentGen`, and the play, step and reverse handlers check `isExplore()` first.
  Game of Life 3D (unbounded) clears all four flags, which `gpuModeOf()` would read as Game of Life 3D (bounded), so code that
  looks at the flags must check for Game of Life 3D (unbounded) first, as `computeControl.js` does. Its settings
  live in `state.explore`, a value from `setup.js` that is replaced, never edited, and only
  through `setup.js`'s changes, which check that it still makes a run. They are set from the
  HUD's boxes.
- **Contests is a mode that draws nothing.** `simulationMode === 'contests'` never reaches
  `initSimulation()` either: its banner, left of the company logo, calls `enterContests()`
  (`controls.js`), which calls `startContests()`; the Mode popover has no Contests option. In
  Contests the banner stays, pressed, and a click on it or Esc calls `leaveContests()`, back to
  the mode it was opened from. Leaving the mode calls
  `stopContests()`, and `animate()` calls `contestsFrame()` and returns before rendering, so a
  Speed run has the machine to itself. The play, step and reverse handlers check `isContests()`:
  a contest's run starts and stops only from its panel, so they do nothing there except while
  Watch is open (`isWatching()`), whose replay they play, pause and step; `contestsFrame()` then
  calls `watchFrame()`, which draws. Reverse stays off: a replay only runs forward.
- **The seed editor borrows the view.** While it is open (`isEditorOpen()`), `animate()` calls
  `editorFrame()` and returns before the unbounded mode's frame and the main render; the editor draws its
  own scene into `state.renderer`, only when something changed, and turns `state.controls` off.
  Closing it disposes of its scene and controls and gives the view back. Never create a renderer
  or a canvas for it.
- **GPU first, CPU after.** For Game of Life 3D (bounded) and Rule 30, `generateSimulation()` runs
  `evolveOnGpu()` when `state.gpuCompute` is on and a device is ready, then its CPU loop computes
  whatever generations remain: all of them if the GPU was off or unavailable, the rest if the
  device was lost part way. Sine Wave and the sandpile run on the CPU only.

## Invariants

- `Grid3D` index is `x + y*size + z*size²`. `data` and `active` must agree. Write through
  `set()`, or rebuild `active` after writing `data` directly (as the sandpile does).
- Rule 30 has depth 1 and the sandpile lives in the `z = 0` plane, with heights capped at 255.
  Rendering reads `matrixDepth` for that.
- Game of Life 3D (bounded) boundary rules (corner, edge, face) apply only when grid wrapping is off.
  Isolation and overcrowding are always derived from survival, never set by hand.
- **The GPU gives exactly the CPU's generations**, cell for cell, wrapping or not, with the
  same edge, face and corner rules. The CPU evolve steps in `matrixFunctions.js` (Game of Life 3D (bounded)'s in
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
- **A limit never wraps, clips or drops a cell.** Wrapping is the shape of an arena, chosen
  before the run (`wrap`, #114), never a limit: in a wrapping arena nothing is born outside it,
  so `arena-edge` can't end the run. A limit ends the run with its reason
  (`cell-limit`, `extent-limit`, `coordinate-limit`, `memory-limit`, `out-of-memory`,
  `arena-edge`), discards the step that would have crossed it, and keeps the last complete
  generation whole. Limits that can end a scored run are stated in cells, extent and
  generations, so a replay stops in the same place on any machine.
- **The unbounded engine gives exactly the reference's cells** (`src/unbounded/reference.js`),
  and, while a pattern stays 2 cells clear of the walls, `convolve3D()`'s with wrapping off. A
  wrapping arena of side N gives exactly `convolve3D()`'s N³ grid with wrapping on, everywhere.
  An arena with walls (#119) gives exactly the reference's cells with the same walls; no dense
  step checks it, since `convolve3D()` counts past a wall differently. A world that neither wraps
  nor has walls takes the step's path unchanged: both only touch the chunks the arena's faces run
  through, and the main loop stays one inline loop, as the bench needs (#119 measured 7-10%
  slower with it moved into a function).
  Change either engine and run `npm test`, which checks both; after a change to the step, also
  run `src/unbounded/compareDense.js` from the dev console at 100³, wrapping off and on
  (`wrap: true`), which takes longer. A change
  to the step or the cells' layout also reruns `node scripts/bench.mjs`, whose numbers pinned the
  contests' values (#39).
- **The page never steps the unbounded engine.** A run lives in its own Worker (`driver.js`),
  which the loop in `run.js` yields between generations so commands get through. A timed run
  checks its deadline after a generation is computed and before it is committed (`step()`'s
  `veto`), so a generation that finishes late is discarded like one that crosses a limit.
  Statistics go out at most every 250 ms on their own; snapshots only when asked for. A replay
  keeps only keyframes, under their byte budget (`KEYFRAME_BYTES`), never every generation.
- **A run settles only on a confirmed repeat** (`settle.js`). The fingerprint is a sum of
  per-cell hashes, which can be made to collide on purpose, so it only proposes: a repeat ends a
  run once the candidate generation, rebuilt from a keyframe, equals the current one cell for
  cell. Every generation that had a fingerprint is kept, so a false match never hides the true
  one. With a budget B, the window is B, so a cycle from generation 0 closing at B is found, and
  a run settles only by a cycle that closes within B (h + period ≤ B): a repeat found at B counts,
  a death at B doesn't. `run.js` and `verify.js` must settle through the same `Settler`, so a
  replay finds the run's own ending; never end a run on a fingerprint alone.
- **A departure belongs to the step from t to t + 1** (`departures.js`, #100). Generation t, as
  it is hashed, kept as a keyframe and compared when settling, is the whole state, ship
  included; the ship is deleted only on the way to t + 1. So every stepping of a world with
  departures goes through `withDepartures()` (`run.js`, the `Settler`'s rebuilds, `verify.js`,
  `reference-hashes.mjs`), and a rebuild or a replay meets the same departures as the run. The
  rule needs no catalogue of ships: never add one, or anything that depends on the machine.
- **The canonical bytes are a public format.** A result's hash depends only on the run's
  definition, the generation and the cells: never the chunk size, the order cells were added in,
  timings or the machine. Any change to the bytes (`canonical.js`) bumps `FORMAT_VERSION`, and the
  known-answer test in `test/unbounded/canonical.test.js` must fail first. Result files come from
  strangers: read them only through `readResult()`, which refuses anything over 128 MB or not
  exactly the format, and never run anything from one. A result's optional `cells` and `seedHash`
  are claims too: `checkResultHashes()` confirms them before they are used. So is its `score`:
  `checkContest()` works it out again from the generation and ending, a settled result's period
  is confirmed by replaying its settling, and only Speed's time is self-reported. So are its
  `departures` (#100): the replay makes them again, and the file's list must be the replay's.
- **The Hall of Fame holds only verified entries, and what entrants agreed to show.** An entry
  is added by pull request with its result file, and `npm test` checks it against that file. It
  carries the chosen name, picture, score, browser and date (and, for Methuselah, the seed's cell
  count, from the file), never an email address or anything else about the entrant, and the email's text (`submit.js`) and CONTRIBUTING.md's "Contest
  entries" must keep promising the same. Pictures are 128×128 with their metadata stripped.
  Removing an entry removes its files too; the test fails on a file no entry names.
- **A contest's id names everything that decides its results** (`contests.js`): rules, seed or
  seed box, arena, limits, for Speed the seconds, and for Classic Methuselah the departures' P.
  Changing any of them means a new id (`speed-2`), never an edit to a contest that has opened, so
  a result is never checked against the wrong definition.
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
- **Memory is `size³ × generations` bytes**, all held at once (Rule 30 and the sandpile too:
  `Grid3D` always allocates the whole cube), plus each generation's `active` list, which costs
  far more per live cell (an array of three numbers each). With the GPU the step is no longer the
  limit: memory and rendering are (README §4). The precomputed modes have no size or generation
  cap (#123), only advice: `memoryAdvice.js` estimates a run, and above `CONFIRM_BYTES` Apply
  asks first. That threshold is the line that is tested: a change to it, to the estimate, or to
  what a run holds is tested with runs at the threshold, on the GPU and on the CPU, in each
  precomputed mode, before it merges. A refused allocation (`RangeError`) ends the run with a
  message (`initSimulation()`); a tab the browser kills for memory can't be caught, which is why
  the confirmation exists.
- `controls.js` re-inits on almost every input. A change there easily triggers double rebuilds.
  `initControls()` runs again on every Apply, so a handler it sets is an `onclick` property, or
  an `addEventListener` guarded to run once: a listener added twice runs twice (a toggle then
  opens and shuts on one click).

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
  form CONTRIBUTING shows; the person running the agent answers for the estimate, and is the one
  a maintainer assigns. The lab's own agent, `morpheus-lab-agent`, is a maintainer: it gives its
  own estimate and is assigned itself ([RELEASING.md](RELEASING.md#agents)). The pull
  request is reviewed against the maintainer's `Ready. Done when: …` comment, not the issue
  body: meet it, or say in "What changed" where it differs.
- **Don't ask for `ready` before the plan is in the issue.** For an issue in `planning`, the work
  is its plan: write it into the issue body as a `## Plan` section below the idea, ending with a
  proposed Done when ([CONTRIBUTING.md](CONTRIBUTING.md#planning)). A plan drafted anywhere else
  goes into the issue before a maintainer is asked to accept it. The `Ready. Done when: …` comment
  accepts the plan that is in the issue, never one held elsewhere.
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
- Don't load anything the page needs from a third party's servers (fonts, scripts, styles): each
  request hands that party the visitor's IP address. Fonts come in as npm packages
  (`@fontsource/*`), imported in `main.js`, and are served with the site; `test/selfHosted.test.js`
  fails on a Google Fonts link.
- Don't commit `dist/` (ignored); `gh-pages` holds the build.
- Don't add brand files beyond the two pinned in `brand.lock`: the brand's design documents and
  the full-size logo stay private.
- Don't copy scripts from the company's other sites either. They are proprietary too;
  `scripts/brand.mjs` was written fresh for this repo.
- Don't add a framework or a backend for a demo. The lab stays a static site.

## Known debt

`index.html` carries many inline styles.
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
