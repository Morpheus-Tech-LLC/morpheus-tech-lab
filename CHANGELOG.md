# Changelog

All notable changes to Morpheus Tech Lab (`morpheus-tech-lab`, named `morpheus-tech-web` until
2026-11-08). The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
versions follow [Semantic Versioning](https://semver.org/); they are the annotated git tags. See
[RELEASING.md](RELEASING.md).

## [Unreleased]

### Added
- An unbounded Game of Life 3D engine, `src/unbounded/`, which Explore shows: space is divided
  into chunks allocated only where the cells are, every generation is one lockstep over the
  whole world, B0 rules are refused, and limits end a run without clipping it (#35).
- Automated tests: `npm test` runs Node's built-in test runner, and CI's `build` check runs it on
  every pull request. The tests check the unbounded engine against a simple reference engine,
  cell for cell (#35).
- The unbounded engine runs in a Web Worker: timed runs that count only the
  generations completed before their deadline, and open-ended runs that pause, step, resume and
  cap their rate; statistics at most four times a second (live cells, chunks, generations per
  second, extent, memory), and snapshots of the live cells only when asked for (#36).
- Explore, a new mode: Game of Life 3D without walls, run indefinitely, with pause, step,
  restart and a speed control; a shape or a seed file as the seed, editable rules (B0 is
  refused, with the reason), a memory limit explained in a popover, and an optional arena. The
  view grows with the pattern and follows it, draws the chunks as boxes past
  300,000 live cells, and shows the engine's statistics; a run that stops keeps its last
  generation on screen, with the reason. A run stops counting once its pattern dies or settles
  into a still life or a repeating cycle, and a cycle keeps playing (#37).
- Results from the unbounded engine can be checked without a server: a run's state hashes the
  same on any machine and at any chunk size, a result file records it, and
  `scripts/verify.mjs` replays the file from its seed to confirm it, or looks it up in a table
  of every generation's hash made by `scripts/reference-hashes.mjs`. Files are read as untrusted
  data (#38).
- Benchmarks for the unbounded engine, `node scripts/bench.mjs`, and a dev page that measures how
  much memory one tab can take in each browser. Their results pin the contests' values: the chunk
  size, the Speed seed, rules and generation ceiling, and the Discovery arena and generation
  budget (#39).
- Explore's Initial Seed offers a choice of Custom (a shape or a seed file, with your own
  rules) or Preset: Cube10, which the lab opens on and the Speed contest runs, or Spreading
  noise, which looks like chaotic noise yet keeps spreading outward. A preset brings its own
  rules, which the rule fields show but can't change. Exporting the seed on screen leaves the
  settings, to return with the seed editor (#52) (#58).
- Explore saves a run from two buttons, Save this generation in its box and Save seed in the Seed
  box, each with a popover saying what the file holds and where it goes (Chrome and Edge ask where to save it, other browsers download it). Save this
  generation saves the generation on screen, running or paused, as a result file, the same file a
  contest entry is: the seed, rules and arena, the generation, how the run stands, the hash of its
  cells and of the seed, the run's statistics, and every live cell. `scripts/verify.mjs` confirms
  it, and loaded under Custom it carries on from that generation. Save seed saves the seed the run
  started from. A generation of more than 1,000,000 live cells isn't saved, and the popover says
  why (#66).
- A result file may carry its generation's cells and its seed's hash, which are checked against
  the file's hashes before anything uses them; result files may be up to 128 MB, up from 1 MB
  (#66).
- A seed editor for Explore: Design… in the Seed popover, or Edit a copy… of a preset, opens the
  10³ seed box in 3D, in place of Explore's view, with every live cell and empty place showing.
  Select a cell, a line, a plane, a box or the whole box, switch it with Space or Enter, fill it
  at random, and undo or redo up to 100 changes; the arrow keys and Page Up / Page Down move the
  cursor the way they point from any view, a click moves it to a cell, and a panel has a button
  for every key, touch included. Use runs the design; Export saves it as a seed file, which opens
  back in the editor unchanged (#70).
- The contests are defined as data, starting with Speed (`speed-1`): the Cube10 seed under the
  lab's default rules, 6 seconds, and a ceiling of 1,000 generations. A contest's result file
  carries its score, and `scripts/verify.mjs` checks that the file's run is its contest's and
  that the score follows from it; `scripts/reference-hashes.mjs --contest speed-1` makes the
  table Speed's results are looked up in. Results name the browser more exactly, telling Edge,
  Opera, Brave and Chrome apart (#76).
- The Contest, a new mode: one contest on the unbounded engine, in three branches. A glowing
  banner by the company logo, giving the date entries close, opens it in one click; a second click
  or Esc leaves it. Its panel shows each branch as a card with its own logo and colour, and runs
  the first branch, Speed, which times how many generations your browser computes in 6 seconds
  from the same seed and rules as everyone else's, up to 1,000. Nothing is drawn during the run;
  a 6-second clock, the statistics and a chart of the generations completed over time show
  instead. The results card leads with the score, then the chart, the statistics, the browser and
  the result's hash, and exports the result file. Verify a result checks a result from any branch
  by replaying it in a background thread. Speed's timing is self-reported, and the page says so.
  Methuselah and Contained chaos, the other two branches, are coming (#77).
- Watch, in the Contest: a result played back in 3D, from the results card or from a file that
  Verify a result has checked. The run is replayed from its seed in a background thread and
  drawn as in Explore; the control bar plays, pauses, steps and sets the speed, and a scrub bar
  goes to any generation up to the scored one. The grid, orientation, cell size and 3D or 2D slice
  apply as in Explore. When the replay reaches the scored generation, its hash is compared with
  the result's, and Watch and the card say whether the run is self-verified (#78).
- Submitting a contest result, and the Hall of Fame. Submit by email, on the results card,
  downloads the result file and opens an email to lab@morpheustech.net with the subject and text
  filled in; the card says the file, and any picture, must be attached by hand, and shows the
  address, subject and text with Copy, for webmail. The text asks for the name to show and lets
  the entrant keep or delete the Hall of Fame line, and states the picture's conditions, that the
  repo is public, how the email address is used, and that Speed's timing is self-reported. Each
  contest's page shows its Hall of Fame, verified entries ranked as the contest ranks them, each
  with its picture (or the lab's logo), name, score, browser, date and Watch. Runs that reach
  Speed's ceiling compete on time: the results card and the board lead with it, to the
  millisecond, and the result file's name carries it (`speed-1-1000-3871ms.json`).
  `scripts/verify.mjs` takes several files, so it re-verifies the whole board at once (#79).
- The Methuselah contest is defined as data, `methuselah-1`, ahead of its page: a 64³ arena, a
  10³ seed box and 10,000 generations, with the entrant's own rules and seed. A run scores the
  generation its pattern settled, by dying out or repeating in place, if the cycle closes within
  the budget, so the top score is 9,999; a pattern that reaches the arena's edge, or is still
  unsettled at 10,000, scores nothing. B0 rules, empty seeds and seeds outside the box are
  refused. `scripts/verify.mjs` confirms a Methuselah result by replaying its settling, and prints
  its score; the Hall of Fame ranks Methuselah entries by score, then fewer seed cells (#93).
- Methuselah on the Contests page: the second branch of the contest opens from the list. Its page
  says what the contest fixes (the 64³ arena, the 10³ seed box, 10,000 generations), how a run
  ends and what scores, that the top score is 9,999, and that this is a stricter methuselah than
  classic Life's: the whole pattern must settle inside the arena. **Design a seed in Explore**
  opens Explore's seed editor, with Explore's arena set to the contest's 64³ so a run there ends
  as the contest's would, and the Contest banner then comes back to Methuselah's page.
  **Load seed…** reads a seed file
  from Explore's Save seed or the seed editor's Export as the entry, drawn as cubes in the seed box
  with its cell count and rules; a seed outside the box, an empty one or a B0 rule is refused with
  the reason, and a B1 rule is warned of before Run. A run shows the generation against the
  budget, the statistics and a chart of live cells by generation, with Stop; its results card
  names the ending, gives the score ("Settled at generation 1,234: a still life", "period 2",
  "Died at generation 1,234"), the seed's cells and the rules, with Export result
  (`methuselah-1-1234.json`), Submit by email and Watch, or says why a run that reached the edge
  or the budget has no score. Verify a result shows a file's score, rules and seed, and the Hall
  of Fame shows each Methuselah entry's rules and seed cells beside its score (#94).
- Explore's Seed popover has **Use in a contest**: it opens Methuselah with the seed in use and
  its rules as the entry, ready to run, never shifted, so the result file's seed is the seed
  designed. A seed with any cell outside the 10³ seed box is refused there, saying which cells,
  as are an empty seed and a saved generation; and if Explore's arena isn't 64³, Methuselah's
  page says the contest runs in its own (#95).
- Explore's presets include nine **Ships**: small seeds that each become a ship and fly off,
  returning to their own shape. Seven fly straight, at periods from 1 to 12, and two diagonally,
  and each is named by its period and its speed in c, one cell a generation. Their cells are also
  among the Custom shapes, in the same group (#105).
- The Classic Methuselah contest is defined as data, `classic-methuselah-1`, ahead of its page:
  Methuselah with one rule changed, that a ship may leave the arena. When a pattern would grow
  past the edge, each part of it there is run alone for up to 32 generations; if every one is a
  ship heading out, it leaves and the run goes on, so a pattern that settles after sending off
  ships scores. Anything else at the edge ends the run as in Methuselah, and a pattern that keeps
  sending off ships ends as `emits`, without a score. The test needs no list of known ships, so it
  works under any rules. A result file lists its departures, and `scripts/verify.mjs` replays
  them, prints them and fails a file whose list differs. Season 1 of the contests is Speed,
  Methuselah and Classic Methuselah; Contained chaos moves to a later season (#101).
- **Classic Methuselah** is on the Contests page, beside Speed and Methuselah: Methuselah with one
  rule changed, that a ship of period up to 32 may leave the arena. Its page says how it differs
  and lists its five endings, `emits` among them; a run counts the ships that leave, and its
  results card, its result file, its email and Verify a result list them. Watch lets them leave
  too, marking where each left on its scrub bar. Explore's Use in a contest offers both Methuselah
  contests, and Contained chaos is no longer listed as coming (#102).
- Explore's arena has **Ships leave at the edge**, off by default: with it on, a ship of period up
  to 32 heading out through a wall leaves the arena and the run goes on, as in Classic Methuselah,
  and a pattern that keeps sending off ships ends as `emits`. The Run box counts the ships that
  left and where the last went, and a note says when one leaves. Design a seed in Explore from
  Classic Methuselah switches it on with the 64³ arena, from Methuselah off. Once a ship has left,
  Save this generation says why it can't save that generation, whose file couldn't replay it;
  Save seed still works (#103).
- The unbounded engine's arena can wrap: with `wrap`, it is a torus whose opposite faces are
  neighbours, so a pattern that crosses one comes back in at the other, exactly as the dense
  grid does with wrapping on, and nothing is born outside it. It needs an arena at least 3 cells
  a side, and ships can't leave one. Worlds that don't wrap give the same cells and hashes as
  before (#114).
- Explore's arena can wrap around. The Limits popover's **At the edge** chooses what happens
  there: **The run ends** (the default), **Ships leave** (in place of the Ships leave at the edge
  checkbox) or **It wraps around**, where opposite walls meet, so a pattern that crosses one comes
  back in through the other, and a ship comes round and the run settles on its lap. The Limits
  box says "wraps", and the arena is drawn dashed. No contest wraps: Save this generation says why
  it can't save while the arena wraps (Save seed still works), Use in a contest notes that the
  contest's arena doesn't wrap, and Design a seed in Explore stops the wrapping (#115).
- Explore's arena can have walls: a fourth choice **At the edge**, **Walls**, with Birth and
  Survival for **Corner (7 neighbours)**, **Edge (11)** and **Face (17)** right under it, starting
  from the old Game of Life 3D mode's defaults. Past the walls is empty, so a wall cell counts only
  its neighbours inside (the old mode counted some past a wall several times), and nothing is born
  outside the arena. A B0 wall rule, or a count past its cells' neighbours, is refused, saying
  which. The Limits box says "walls", and the arena is drawn brighter. No contest has walls, so
  Save this generation says why it can't save with them, Use in a contest notes it, and Design a
  seed in Explore takes them off. The unbounded engine gets a `walls` option for it (#119).

### Changed
- The precomputed modes (Game of Life 3D (bounded), Rule 30, Sine Wave, Abelian Sandpile) no
  longer cap size at 200 or generations at 100. Each range hint in the settings dialog shows what
  a typical laptop runs at the other settings, and opens a popover with the run's memory
  estimate, the ranges for a typical laptop and a strong desktop, and what happens past them; the
  sandpile's Initial Sand hint says why its 0-255 stays. Above an estimate of 2 GB, Apply asks
  first, and a run whose memory the browser refuses stops with a message instead of breaking the
  page. Rule 30's grid now follows its generations past 200, as it always meant to (#123).
- The lab opens in Explore, paused on a 10³ cube, instead of Game of Life 3D (#37).
- The HUD is one panel at the top left, Simulation, in every mode, with the HUD's boxes as its
  sections. The first, Mode, names the simulation that runs, in place of the title at the top
  centre, and the gear in its title opens the settings dialog. The other modes' Simulation box is now Grid.
  A click on any section's title folds it down to the title (#69).
- Explore's settings moved from the settings dialog into its boxes in the HUD. The Seed, Rules
  and Limits (the arena and the memory limit) boxes each have a gear in their title that opens
  a popover beside the box; Apply restarts the run, and Cancel, Esc or a click elsewhere changes
  nothing. A preset's rules, and a saved generation's rules and arena, show as locked, and Use
  your own rules keeps the same cells with those rules to change. The Rules popover shows the
  counts a live cell dies with, in place of the box's Isolation and Overcrowding lines. The Run
  box, in place of Explore's box and Engine Memory, reports the run, the engine's memory included,
  and saves its generation. In Explore, the settings dialog shows only the mode choice (#69).
- Every issue goes through the same stages, idea, planning, ready and in progress, to completed
  or cancelled, each shown by a label, with its kind as the issue type. An idea needs only what
  it is and why; its Done when is settled when its plan is, and a plan's pieces become
  sub-issues only once the plan is accepted. Work starts from a `ready` issue, which replaces
  `approved`, and an issue closes as completed, without its stage label, when its pull request
  merges (#54).
- Explore's default memory limit is 1,024 MB, up from 512: measured, one browser tab can take
  about 6 GB of the engine's memory on a 16 GB machine (#39).
- Commit messages follow one standard, written in CONTRIBUTING.md: a plain-sentence subject of
  at most 65 characters, a body saying what changed and why, then the trailers. Every pull
  request merges with a merge commit titled with its pull request (`<title> (#N)`) and listing
  its issues; releases and hotfixes into `main` read `Release X.Y.Z (#N)` and
  `Hotfix X.Y.Z (#N)` (#61).
- A plan is written into its issue, ending with a proposed Done when, before the issue is
  accepted as ready; the plan's Done when replaces the idea's, and the `Ready. Done when: …`
  comment freezes the final text. A maintainer assigns whoever claims an issue, and removes the
  assignee if the claim lapses or the issue goes back to planning, so an assignee always means
  someone is building it (#62).
- The company panel opens at the top right, under the Morpheus Tech logo, instead of in the middle
  of the screen. The logo stays on screen, lit, while it is open; a second click on it, or Esc,
  closes it (#77).
- The lab's own agent account, `morpheus-lab-agent`, is a maintainer: it claims issues, opens
  pull requests from a clone of the lab, and reviews pull requests, but merges one into
  `development` only with a human maintainer's OK, and never releases or deploys. Other agents
  still edit files only (#88).
- Explore, and any run that settles, now ends on a repeat only once the cells are confirmed
  equal, cell for cell, not on a matching fingerprint alone, so a false match can't end a run
  early. A saved generation that died or repeated is verified by replaying the run's settling
  from its seed (#93).
- The two Game of Life 3D modes are named side by side, first in the dialog: the original,
  precomputed mode is **Game of Life 3D (bounded)**, and Explore is **Game of Life 3D
  (unbounded)**, everywhere a visitor reads it, Contests' Design a seed in Game of Life 3D
  (unbounded) included. Each says in the dialog what it computes on and why: the bounded mode on
  the GPU where WebGPU allows, and on the CPU otherwise; the unbounded mode on the CPU, in a
  background thread, with no GPU path yet, since a GPU needs a world of fixed size (Discussion
  #122). The GPU toggle says so in the unbounded mode, and the contests say season 1 is CPU-only.
  The unbounded mode's files are named `game-of-life-3d-seed.json` and
  `game-of-life-3d-generation-N.json`; seed files, saved generations and result files are
  unchanged, and every one made before still loads (#116).
- The company panel and the control bar take their look from the stylesheets instead of styles
  written into the page, ready for the brand restyle; they look and work as before (#21).

### Removed
- The Morpheus Tech logo buttons beside the settings dialog's range hints; the logo at the top of
  the page still opens the company panel (#123).
- The `good first issue` label: the `ready` label alone says what work can be picked up (#71).

### Fixed
- The check pages (`hud-check.html`, `editor-check.html`, `contests-check.html`, dev pages) keep
  the lab's frame in view beside their results, scaled to fit the window. Scrolled out of view, the
  frame stopped drawing, and the checks of the countdown and of Watch's view failed. The Contests
  check also says whether the frame is drawing.
- Moving the pointer off the page no longer throws an error from the tooltips.
- In Explore, after settings were applied, Restart restarted the run more than once a click (#66).
- The Contests check page (`src/contests/contests-check.html`, a dev page) runs again: it
  declared one name twice, so its script never ran (#85).

### Security
- The build and dev-server tools are updated for `npm audit`'s high-severity advisories: vite
  7.3.8, rollup 4.68.5, postcss 8.5.33, picomatch 4.0.7 and 2.3.2, nanoid 3.3.20 and
  source-map-js 1.2.2. The site itself is unchanged (#86).

## [1.6.0] — 2026-11-10

### Added
- Game of Life 3D and Rule 30 compute on the GPU with WebGPU where the browser has it, with the
  same generations, many times faster; a toggle in the controls shows GPU or CPU, says why when
  the GPU can't be used, and the CPU takes over if the GPU fails (#28).

### Changed
- Contributing works from a fork: `CONTRIBUTING.md` sets up an `upstream` remote, keeps a branch
  current, asks for commit subjects of 72 characters or less and says what happens after a pull
  request is opened; each pull request resolves one issue and names its relation to any others
  (Related to, Opens), and the release closes the resolved ones; and the pull-request template
  asks what changed, how it was tested and for screenshots (#30).
- Work starts from an issue a maintainer has labelled `approved`, sized for one pull request:
  `CONTRIBUTING.md` explains how and on what criteria a maintainer approves an issue, the idea
  form's new "Done when" field and how to claim an issue with a date and a confidence, and every
  pull request resolves an approved issue, except a small fix (#32).

## [1.5.6] — 2026-11-09

### Changed
- The deploy step in `RELEASING.md` switches back to `development` afterwards, and
  `RELEASING.md`, `AGENTS.md` and `CLAUDE.md` say to edit only on `development` or a feature
  branch, never on `main`.

## [1.5.5] — 2026-11-09

### Changed
- The new-issue page lists vulnerability reporting once, as GitHub's own "Report a security
  vulnerability" entry. The separate link to `SECURITY.md` is gone.

## [1.5.4] — 2026-11-09

### Added
- `ROADMAP.md`: the public roadmap, covering the engine, new demos, the brand restyle and the
  community.
- `CODE_OF_CONDUCT.md`: the Contributor Covenant 2.1.
- `SECURITY.md`: only the latest release is supported, and vulnerabilities are reported
  privately through GitHub.
- Issue templates for bug reports and ideas, with blank issues turned off, and a pull-request
  template with the contribution checklist.

### Changed
- The README's next steps point to the roadmap, which now holds the ideas that were listed
  there.

## [1.5.3] — 2026-11-08

### Fixed
- The company panel links to the lab's GitHub repository again, next to morpheustech.net.
  v1.5.1 had replaced that link instead of adding the website alongside it.

## [1.5.2] — 2026-11-08

### Fixed
- The company panel opens in the centre of the screen, and hides the control bar and the
  top-right logo while it is open. On phones it keeps its width instead of filling the screen.

## [1.5.1] — 2026-11-08

### Fixed
- The top-right logo opens the company panel again, as in v1.4.0, and the panel's link now
  goes to https://morpheustech.net instead of GitHub. v1.5.0 had made the logo itself a link.

## [1.5.0] — 2026-11-08

### Changed
- Relicensed from MIT to the **Apache License 2.0**, with an Apache-style `NOTICE`. Releases
  v1.0.0 to v1.4.0 remain under the MIT License. The Morpheus Tech name, logo and brand files
  stay outside the license.
- The top-right logo now links to https://morpheustech.net instead of opening the GitHub panel.
- The agent and architecture docs (`CLAUDE.md`, `AGENTS.md`, `ARCHITECTURE.md`) are
  self-contained: they name no paths outside this repo, and plans and the roadmap live in this
  repo and its issues.
- `npm run brand:sync` now needs `--org <brand repo>`; it no longer assumes where the brand
  repo is cloned.
- The README describes the lab as an open-source cellular-automata, math-engine and simulator
  project, built with the community.

### Added
- `RELEASING.md`: branches, versions, changelog format and the release steps.
- `CONTRIBUTING.md`: setup, branching, the changelog, and sign-off.
- The Developer Certificate of Origin: every commit must be signed off (`git commit -s`).
- CI on every pull request: a `build` check (`npm ci`, `npm run build`, including the brand
  check) and a `DCO` check that every commit is signed off by its author.

## [1.4.0] — 2026-11-08

### Changed
- The site moves to **lab.morpheustech.net**, built for the domain root. The repo's `github.io`
  project address redirects there; the pre-rename `…/morpheus-tech-web/` address no longer
  resolves.
- Renamed Morpheus Tech Lab, replacing "MatMagic" in the site and the README. The repo is now
  `morpheus-tech-lab`.
- `package.json` carries the release version instead of 0.0.0.
- `dist/` is no longer tracked; the `gh-pages` branch holds the build.

### Added
- Agent and architecture docs: `CLAUDE.md`, `AGENTS.md`, `ARCHITECTURE.md` and this changelog.
- The Morpheus Tech favicon, and the brand tokens ready for a restyle, pinned from `brand/v3.2.0`
  (`brand.lock`, `npm run brand:check`).
- `NOTICE`: the MIT License covers the code, not the Morpheus Tech name, logo or brand files.

## [1.3.0] — 2025-12-16
### Added
- Abelian sandpile mode.
- Sine wave mode.
- Configuration modal and a reworked control bar with a 3D/2D toggle.

## [1.2.0] — 2025-11-13
### Added
- Rule 30, in 1D and 2D.
- Boundary rules for corner, edge and face cells when wrapping is off.
- Flip-orientation toggle.

## [1.1.1] — 2025-11-06
### Changed
- Grid wrapping, cell size and the visual 3D grid refined.

## [1.1.0] — 2025-11-03
### Added
- Wireframe display, Perlin and Worley noise seeds, and a grid-wrap toggle.

## [1.0.0] — 2025-10-31
### Added
- Game of Life 3D on a 50³ grid, with orbit controls and playback.
