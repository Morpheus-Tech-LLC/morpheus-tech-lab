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

### Changed
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

### Removed
- The `good first issue` label: the `ready` label alone says what work can be picked up (#71).

### Fixed
- In Explore, after settings were applied, Restart restarted the run more than once a click (#66).

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
