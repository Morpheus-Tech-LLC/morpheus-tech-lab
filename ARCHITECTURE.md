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
 │   └ in the unbounded mode: explore.exploreFrame() ──► explore/view.js        │
 │                                                                              │
 │ main.js opens Game of Life 3D (unbounded): hud.startFromSetup() ─►           │
 │   startExplore() ── unbounded/                                               │
 │   driver ◄──► run.worker; explore/hud.js: the boxes' settings (state.explore)│
 │   └ seed editor open: editor.editorFrame() ──► explore/editorView.js, drawn  │
 │     into the same renderer, only on change                                   │
 │   (a Web Worker: World + step, one generation at a time; snapshots back)     │
 │ Contests mode: contests/contests.js ─► panel.js ─► speed.js (SpeedRun) ──►   │
 │   run.worker, timed, which makes the result file; verify.worker for Verify   │
 │   └ Watch: watch.js ─► run.worker, a replay (keyframes, seek, its hash);     │
 │     contestsFrame() ─► watchFrame() ──► explore/view.js                      │
 │   submit.js: the mailto: link; hallOfFame.js ◄── hall-of-fame.json, whose    │
 │     result files (public/hall-of-fame/results/) Watch fetches and replays    │
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
| Game of Life 3D (bounded) | `size³`, 26 neighbours | `convolve3D()`: birth 9–10, survival 5–15 by default; separate corner, edge and face rules when wrapping is off |
| Rule 30 | 1D or 2D, depth 1 | `evolveRule30()`, `evolveRule30_2D()` |
| Sine wave | `size³` | `generateSineWaveGrid()`: an analytic field per generation, no state carried |
| Abelian sandpile | `size²` at `z = 0` | `evolveSandpile()`: one grain is added at the centre each generation, and cells topple above 4 |

Game of Life 3D (bounded) and both Rule 30 modes also run on the GPU (`src/gpu/engine.js` and the
WGSL in `src/shaders/`), with one compute dispatch per generation. The GPU gives exactly the
CPU's grids; the CPU functions above are the reference.

**Unbounded world** (`src/unbounded/`, shown by the Game of Life 3D (unbounded) mode): Game of Life 3D without edges.
Space is divided into chunks of 16³ cells (8³ or 32³ also work), held in a `Map` from chunk
coordinate to slot. A chunk is allocated when live cells reach it and released once it is empty.
Each slot lives in a large slab (64 MB by default) and holds two copies of its chunk, the
current generation and the next. `step()` advances every chunk by one generation together, then
checks the limits; it keeps no history. Rules are any birth and survival counts except B0.
An optional arena ends the run when a cell would be born outside it, or, with `wrap` (#114), is
a torus: its opposite faces are neighbours, so a chunk its faces run through reads its border
from across the wrap and computes only its cells inside, and nothing is born outside it.
With `walls` (#119), it is closed instead: past a wall is empty, nothing is born outside, and a
cell on one, two or three of its faces follows the face, edge or corner rule, counting only its
real neighbours (17, 11, 7). Only the chunks its faces run through do anything different: they
run the step's loop over their cells off the faces, then a second loop, by region, over the wall
cells, so a world without walls runs the loop unchanged.
`ReferenceWorld` is a deliberately simple engine for the tests to check it against, wrapping, with
walls or neither; a wrapping arena of side N also gives exactly `convolve3D()`'s N³ grid with
wrapping on. (`convolve3D()` can't check walls: with wrapping off it counts some neighbours past
a wall as the wall cell, several times over.)
A run (`run.js`) steps a world in a Web Worker (`run.worker.js`), either until a deadline (a
timed run: only generations completed before it count) or until stopped (an open-ended run,
which can also pause, step one generation and cap its rate). On the page, `EngineDriver`
(`driver.js`) starts each run in a fresh Worker, sends its commands, and receives statistics
(at most four times a second) and, on request, snapshots of the live cells, or past a budget
of cells, of the chunks that hold them.

**Game of Life 3D (unbounded)** (`src/explore/`): the mode that shows the unbounded world. Its seed is one of the
shapes, lifted into world coordinates around the origin (`seed.js`), a preset with its own rules
(`presets.js`), or a seed file, JSON with the rules and the cells. A preset or a seed file
replaces the shape and the rules. Presets may have a group, which the Preset and shape lists show
as an optgroup: the nine Ships (#105), found by #100's search, each record when they become a
ship, with what period and shift.

The unbounded mode's settings (#69) are one value, `state.explore`: the seed's source and its cells, the
visitor's rules, the arena, what happens at its edge (`edge`: `'end'`, `'ships'`, #103, `'wrap'`,
#115, or `'walls'`, #119, with the walls' rules in `walls`) and the memory limit (`setup.js`, with no DOM). With an arena and `'ships'`, `worldOf()` gives the Worker's world
Classic Methuselah's departure rule (`SHIP_PERIOD`, 32, read from the contest), so a run lets
ships leave, settles or ends as `emits` where the contest's would; the run's statistics count the
ships that left and the last one (`departed`, `lastDeparture`), which the Run box and a note show.
A saved generation carries on without the rule, as it was saved: Save this generation refuses
once a ship has left (`save.js`'s `shipsLeftReason()`), since a result file without a contest
can't say that ships leave, and before then the run has stepped exactly as one without it. With
an arena and `'wrap'`, the world has `wrap` (#114), a torus; the view draws its arena dashed, and
Save this generation refuses throughout (`WRAP_SAVE_REASON`), since no result file or contest
wraps. With `'walls'`, the world has `walls` (#119), the corner, edge and face rules; the view
draws the arena brighter, and Save this generation refuses throughout (`WALLS_SAVE_REASON`).
A saved generation's edge is always `'end'`. From it come what each
HUD box shows, what is locked (a preset's rules; a saved generation's rules and arena) and the
config `startExplore()` takes. A change never edits it in place: each popover's Apply gives a new
value, or the reason it is refused, checked by building that config, and restarts the run.
`hud.js` wires the gears in the Simulation, Seed, Rules and Limits boxes' titles to their
popovers, the save icons, and the folding of every HUD box, and `popover.js` keeps one popover
open at a time, the save popover too. A seed is only cells, and a simulation is a seed and its
rules (#130): the Simulation box holds the Seed and Rules boxes as its two parts, and names the
simulation in use (`simulationOf()`: a preset whenever the seed and rules are a preset's, a
loaded file's, a saved generation, or Custom). Its popover sets both, from a preset or Load
simulation… (`simulationFile()`); the Seed popover sets only the cells, from a shape, a file
(`fileSeed()`, which takes a seed or a simulation file's cells) or a design, and the rules in use
stay. The unbounded mode's Run box only reports.

**The HUD in every mode** (#130). There is no settings dialog. The HUD is one panel: its title
names the mode, and its gear, or the control bar's, opens the Mode popover (`hudSettings.js`);
under it come the mode's boxes. In the precomputed modes, `hudSettings.js` wires the Grid, Seed
and Rules boxes' gears to popovers whose Apply sets `state` and runs `initSimulation()` again,
asking first above a high memory estimate (#123); each mode keeps its own settings, so switching
back to one runs it as it was.

**The seed editor** (#70) designs a seed in the seed box, `SEED_BOX` in `contests.js`, which `seed.js` re-exports (cells −5 to 4
on each axis), where the Discovery contests' seeds go. The Seed popover's Design… opens it on the
seed in use (`designOf()`); so does a Methuselah contest's Design a seed…, after setting the
contest's arena. `editorModel.js`, with no
DOM and no Three.js, holds the box as 1,000 bytes, the cursor, the selection (every kind is an
axis-aligned box of cells), switching, random fill and 100 steps of undo and redo, and works out
which axis each movement key takes from the camera's right, up and viewing directions: each
screen direction takes a different axis, the assignment that matches them best. `editorView.js`
has its own scene, camera and orbit controls, but draws into the lab's renderer, so there is
never a second WebGL context: one instanced mesh for the live cubes (another for the faded ones),
points for the lattice, boxes and lines for the selection and the cursor. It draws only when
something changes. While the editor is open, `time.animate()` calls `editorFrame()` instead of
`exploreFrame()` and the main render, and the unbounded mode's camera controls are off; the run's Worker
keeps going. `editor.js` holds the panel, the keys and picking. Use goes through `useDesign()`,
which makes the seed `{kind: 'design', cells}` with the rules the editor opened with (or those
of a simulation file it loaded, `designFile()`), and restarts the run as a popover's Apply does.
Export writes the design alone, as a seed file.

`explore.js` runs it through `EngineDriver`, with no history:
`state.simulationData` stays null. `view.js` draws the latest snapshot in a point buffer that
grows with the pattern, or the occupied chunks as boxes past 300,000 cells, and moves the camera
to keep the pattern in view (`framing.js`). In the 2D view it asks the Worker for one plane of
cells; the slice slider spans the pattern's extent on that axis. The unbounded mode's runs *settle*
(`settle.js`, #93): the run ends when every cell has died, or the cells repeat in place those of
one of the last 10,000 generations. The engine keeps a 64-bit fingerprint of the cells
(`World`'s `fingerprint` option), and a match only proposes a repeat: the candidate generation is
rebuilt from the nearest of the settle detector's own keyframes (`keyframes.js`) and compared
with the current cells, cell for cell, before the run ends. A false match costs that comparison,
and the run carries on. The Worker then replays the cycle once to send its frames, which the view
loops while the count stays put.

**Saving** (`save.js`): Save this generation (on the Run box's title line), Save simulation and
Save seed (at the end of the Simulation and Seed boxes' name lines) open one popover, which moves
beside the box of the icon that opened it. **Save this generation** asks the Worker for every
live cell of the current generation, with the statistics of the same moment (a snapshot whose budget is 1,000,000 cells, so a bigger generation comes back as chunks
and isn't saved), or takes the cycle frame on screen, and makes a result file from it
(`resultFromCells()`): the run's definition with its first seed, the generation, the ending, both
hashes, the details and the cells. **Save simulation** writes the run's first seed and its rules
as a simulation file, and **Save seed** its cells alone as a seed file: one format (`seed.js`),
with `rules` or without. A file saved before #130 always has rules, so it reads as a simulation
file. Save writes through the browser's save dialog (`showSaveFilePicker()`) where there is one,
or as a download. Load simulation… reads a simulation file or a saved generation
(`readSeedOrSave()`); a saved generation is checked against its hashes, and its run starts with those cells at that generation (the Worker's `from`), under the
file's rules and arena, keeping the first seed in its config, so a later save is still a result
of that seed.

**Results** (`canonical.js`, `verify.js`): a run's state at one generation, as canonical bytes: a
header (sorted JSON: the format's version, the generation, and the run's whole definition, which is
its contest id, rules, seed, arena and the limits stated in the pattern's terms) and a body (the
live cells sorted by z, y, x, as zigzag varints of the difference from the cell before). Its
SHA-256 hash goes in a result file, beside run details (timings, statistics, browser) that are
outside the hash. A result may also carry `cells`, the live cells at its generation, and
`seedHash`, the hash of generation 0 under the same run; `checkResultHashes()` confirms both
without a replay, so an edited file fails. The unbounded mode's Save this generation writes them, so Load simulation…
can carry on from the generation. `verifyResult()` replays the run from its seed to the stated generation and
compares hashes, and checks an ending the pattern decides by taking one more step; with a
reference table (every generation's hash, made once by `scripts/reference-hashes.mjs`) it looks
the hash up instead. A settled result (`died`, `repeat`) can't be checked that way, since a still
life formed at 100 also equals itself at 500: it is replayed from the seed with the same settle
detector as the run, and verifies only if the run first settles at its generation, with its
ending (and its score's period), and the cells there match its hash. A table can't show settling,
so with one such a file is not checked. `scripts/verify.mjs` runs it in Node.

**Contests** (`contests.js`, #40): each contest is data, with a versioned id (`speed-1`), its
kind, what it fixes (rules, seed or seed box, arena, limits), its chunk size and, for Speed, its
seconds. **Methuselah** (`methuselah-1`, #41) fixes the 64³ arena (`DISCOVERY_ARENA`, cells −32 to
31), the 10³ seed box and a budget of 10,000 generations, with chunk size 16, and takes the
entry's rules (any but B0) and seed (1 to 1,000 cells in the seed box, never shifted; `runFor()`
refuses an empty seed or a cell outside the box). A run is a settling run in the arena: it scores
`{generations: h, period}`, h being the first generation of the state or cycle it ends in, once
that cycle closes within the budget (a death is a cycle of period 1), so the top score is 9,999.
Reaching the arena's edge or the budget scores nothing. Entries rank by generations, then fewer
seed cells (`compareMethuselah()`), then the earlier submission. Under B1 a pattern always
reaches the edge, by generation 37, so `methuselahWarnings()` warns of it.

**Classic Methuselah** (`classic-methuselah-1`, #100) is Methuselah with one rule changed: a ship
may leave the arena. It fixes what Methuselah fixes, plus `departures: {period: 32}`, which isn't
in the run's definition: `departuresFor(run)` reads it from the contest, through `run.contest`, and
a World built with it lets ships leave (`departures.js`). When the step from generation t would
bring a cell to life outside the arena, the cells split into islands (cells within 2 of each
other on every axis, directly or through others, which can't affect each other's next
generation). Each island next to such a birth is run alone, with no arena, for up to 32
generations: it is a ship if its cells come back shifted by some d ≠ 0, at the least such period
s. If every one is a ship moving out through each face its births cross, each is deleted and
recorded, `{generation: t, period: s, shift: d, cells}`, and generation t + 1 is computed without
them; otherwise the run ends at the edge, as Methuselah's does. Generation t itself keeps the ship
(the deletion belongs to the step), so keyframes, rebuilds and replays meet the same departures.
A ship in flight is part of the pattern, so a run settles only once its last ship has left, and
a cycle with a departure in it (a gun) ends as `emits`, with no score. The rule needs no catalogue
of known ships, so it works under any rules. A result lists its `departures`, outside the hash
like the score, even when none left; `verifyResult()` replays them with the run and compares the
list, departure for departure. It ranks as Methuselah does, on a board of its own.

`runFor(contest, entry)` makes a run's definition from the contest's fixed parts and the
entry's rules and seed, so a contest's result states its whole run like any other. A contest's
result adds a `score`, outside the hash: Speed's is `{generations, ms}`, where `ms` is the time to
reach the 1,000-generation ceiling, and null for a run the 6 seconds ended. `verifyResult()`
first runs `checkContest()`: the run must be `runFor()` of its contest, with its own rules and
seed, and the score must follow from the generation and ending; then the replay, or the table,
confirms the generation. A contest the lab doesn't know isn't checked. The table for Speed is
made from the contest itself, with `scripts/reference-hashes.mjs --contest speed-1 --to 1000`.
The browser's name and version in a result's details come from `src/browser.js`, and are never
checked.

**The Contests mode** (`src/contests/`, #77). Season 0 (`SEASON` in `contests.js`, #130) is
three contests: Speed, Methuselah, and Classic Methuselah (#102, which took Contained chaos's
place), each a contest in the code too (`contests.js`'s `CONTESTS`, an id such as `speed-1`, and
a result file's `run.contest`, which is hashed). All three close at the same instant, 11:59 PM
Central Time on 31 December 2026 (`closes`). It is a sixth mode, opened from a compact banner
left of the company logo, which also gives the date entries close ("Closes TBD" while `closes` is
null). It has nothing to set, so one click opens it (`enterContests()` in `controls.js`), and the
Mode popover has no Contests option. In Contests the banner stays, pressed; a click on it,
or Esc, goes back to the mode it was opened from (`leaveContests()`). Like Game of Life 3D (unbounded), it never reaches
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

**Methuselah's page** (#94). `panel.js` gives Methuselah its own page: the entry, what the contest
fixes, its four endings, the Hall of Fame and how it runs. The entry is a seed and its rules,
kept per contest while the panel is open. **Load simulation…** reads a simulation file
(`seed.js`'s `parseSeedFile()`, as untrusted data; a seed file, with no rules, is refused) and
passes it through `runFor()`, which refuses a B0 rule,
an empty seed or a cell outside the seed box with the reason, shown before Run; a B1 rule gets
`methuselahWarnings()`'s warning. **Design a seed…** calls back into `controls.js`
(`designInExplore()`, handed to `startContests()`), which sets the unbounded mode's arena to the contest's,
with ships leaving at its edge for Classic Methuselah and not for Methuselah, and never wrapping (`setup.js`'s
`contestArena()`; a saved generation keeps its own), starts Game of Life 3D (unbounded) and opens the
seed editor (`hud.js`'s `openSeedEditor()`) with a note on the contest; the panel remembers the contest, so the
banner comes back to its page. The seed is drawn as cubes in the seed box, seen from above a
corner, with hidden cubes left out (`format.js`'s `seedPicture()`, tested in Node). A run is
`discovery.js`'s `DiscoveryRun`: an open-ended settling run in a Worker, in the contest's arena,
with its chunk size and its budget as the generation limit, and `history`, so the Worker keeps
every generation's live cells (`run.js`'s `history` message, 4 bytes a generation). Nothing
depends on time. The run panel shows a ring that fills over the budget, the statistics and a chart
of live cells by generation (`chartLayout()` without `seconds`: both axes fit the data), from the
statistics while it runs and from the whole history once it ends. `DiscoveryRun` scores the run
from its end reason, generation and cycle (`methuselahScore()`), and has the Worker make the
result file, as `SpeedRun` does. The card's and the email's words come from `format.js`
(`methuselahScoreText()`, `methuselahHero()`, `methuselahEndingText()`) and `submit.js`, which
adds the rules and the seed's cells. Classic Methuselah (#102) shares Methuselah's page, run and
card: its kind is `methuselah`. `DiscoveryRun` builds its Worker's world with `departuresFor(run)`,
so ships leave at the edge as they will in a replay; the run's statistics then count them
(`departed`), and its ended state lists them, without their cells, as the run's `departures`.
The page adds what differs: a sentence and a fact on the ships, a fifth ending (`emits`), the
ships that left on the results card (`departuresText()`) and in the email, and in Watch, which
replays with the same rule, a tick on the scrub bar where each left and a line that follows them
(`watchDeparturesText()`). Verify a result's Worker passes a file's departures back, without
their cells. Contained chaos (#42), a later season's, would add its kind.

**Watch** (`watch.js`, #78) plays a result back in 3D: from the results card, or from a file Verify
a result has read (`readResult()` again, on the page). It hides the panel and starts a *replay* in a
Worker (`run.js`'s `replay` kind): an open-ended run from the result's seed that ends at the
result's generation, with the control bar's pause, step and rate. A replay keeps no history, only
**keyframes** (`keyframes.js`, shared with the settle detector), the cells every K generations (8
at first), under a budget (128 MB of cells): when they pass it, every other one is dropped and K
doubles. A `seek` restores the nearest keyframe at
or before its target, or the seed, and steps on flat out, in the loop's slices, so the scrub
bar's next seek takes over from one still on its way (`seeked` answers both). When the replay
first ends at the result's generation, the Worker hashes its cells under the result's run and
compares them with its hash (`replayed`); a replay a limit of the run's ends early doesn't
match, and one the machine ends (memory) isn't checked. `format.js`'s `selfVerifiedText()` says
which, on Watch's bar and on the card. While Watch is open, `contestsFrame()` calls
`watchFrame()`, which draws with the unbounded mode's `ExploreView` and camera following, and takes the
control bar's view settings as Game of Life 3D (unbounded) does: the grid and the slice from the replay's extent
(`explore.js`'s `fitSlice()`, shared), the orientation and cell size every frame, and the view
toggles call `watchViewChanged()` for a new snapshot. Play and step in
`controls.js`, and the speed slider in `time.js`, go to Watch in Contests, and Esc closes Watch
before it leaves the mode.

**Submitting, and the Hall of Fame** (#79). A static site can't send email, so **Submit by
email** on the results card is a `mailto:` link to morpheus.lab.agent@hey.com (#142) (`submit.js`: the
subject, the template's text and the link, tested in Node). A `mailto:` link can't attach the
result file, and the entry is the file, so the card makes it three numbered steps (#140): **Save
result file** (`explore.js`'s `writeJsonFile()`, Chrome's save dialog or a download), **Open the
email**, which has no `href` until the file is saved, by that button or by Export result, and
**attach the file** by hand, named. Saving and opening are separate clicks because, done in one,
the hand-off to the mail app could lose the download. The email opens in a new tab
(`target="_blank"`): where the browser sends `mailto:` to webmail, a plain link replaced the lab,
and its results card, with the webmail page. The email's text opens by saying to attach
the file, then has only what the entrant fills in; what the result file holds (score, rules, seed,
ships, hash) isn't repeated, and the conditions follow under a rule of dashes, in plain text, since
a `mailto:` body can't carry formatting. Under the steps, folded away, the card shows the address, subject and text with Copy,
for webmail. The text is the lab's promise to an
entrant (the picture's conditions, the public repo, the email address used only to reply, Speed's
self-reported timing); CONTRIBUTING.md's "Contest entries" is the maintainers' side of it. The
**Hall of Fame** is data: `src/unbounded/hall-of-fame.json`, `{"entries": [...]}`, each entry
with its contest, chosen name, picture (a path under `public/hall-of-fame/`, or null), score,
browser, the date it arrived, and its result file under `public/hall-of-fame/results/`, and a
Methuselah entry its rules, shown beside its score, and its seed's cell count (`seedCells`), which
breaks a tie in its score; paths
are as the site serves them, without `public/`. `hallOfFame.js` reads it (`readHallOfFame()`,
shape only), ranks a contest's entries (`rankEntries()`: the contest's order, `compareSpeed()`
for Speed, `compareMethuselah()` for Methuselah, then the earlier date, then the file's order,
which is arrival order), and checks an entry against its file (`checkEntry()`: it reads as a
result, passes `checkContest()`, and has the entry's contest, score, browser, rules and seed cells), which `npm test` runs on every entry without replaying;
`scripts/verify.mjs` replays them. Each contest's page shows its top 10, the lab's logo standing
in for a missing picture, each score led by what ranks it (`format.js`'s `boardScore()`): at
Speed's ceiling every entry has 1,000 generations, so the time leads, to the millisecond the score
holds (`secondsText()`), as on the results card (`speedHero()`), since two places would show
times that rank apart as equal, and Methuselah's generations lead, with its period, rules and seed
cells after them; and Watch fetches an entry's result file from the site and reads it
through `readResult()` like any other.

**Benchmarks**: `scripts/bench.mjs` (#39) measures the engine in Node (chunk sizes, seeds, rules,
a bit-packed step, the dense `convolve3D()` in `denseStep.js`, serialization), times the Speed
candidates through the real run loop, and projects the Discovery worst case, a result file made by
`scripts/bench/worst-case.mjs` that `scripts/verify.mjs` replays. The dev page
`src/unbounded/memory.html` measures what one tab can take in slabs in each browser. Their numbers
pinned the contests' values: the chunk size, Speed's seed, rules and ceiling, the Discovery arena
and budget, and the unbounded mode's default memory limit.

**Seed**: a shape function from `shapeGenerators.js` (perlin, cube, tetrahedron, octahedron,
worley, rule30). Its parameters are in `state.shapeParams`.

## Data flows

**Write path (rebuild).** A control changes `state`, then `initSimulation()`:
1. `state.reset()`
2. `generateSimulation()` computes the full history. For Game of Life 3D (bounded) and Rule 30, with
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
proved too slow on the CPU. Game of Life 3D (bounded) and Rule 30 now also run as WebGPU compute
shaders, using only the browser's WebGPU API, and must give exactly the CPU's generations
(`src/gpu/compare.js` checks this). The CPU path stays: it is the fallback when WebGPU, an
adapter or a device is missing or fails, and the definition of what each mode does. With the
GPU, memory and rendering, not the step, set the size limit (README §4).

**Caps become advice (#123).** The precomputed modes once capped size at 200 and generations at
100, chosen for the weakest machines. The caps held back visitors with strong ones, and still
didn't protect the weakest: the sandpile had no generation cap at all. Now nothing is capped.
`memoryAdvice.js` estimates what a run will hold (every grid exactly; the live cells by a model
fitted to measured runs), the Grid popover's range hints show it with the ranges a laptop and a desktop
run, and above 2 GB Apply asks first. A refused allocation is a `RangeError`, which
`initSimulation()` turns into a message and an empty view; a tab the browser kills for memory
can't be caught, so the confirmation comes before the run, not after.

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
