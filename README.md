<p align="center">
  <a href="https://lab.morpheustech.net/" target="_blank" rel="noopener noreferrer">
    <img src="src/assets/images/game-of-life-screenshot-readme.png" alt="Logo" width="200" height="200">
  </a>
</p>

<h1 align="center">Morpheus Tech Lab</h1>

<p align="center">
  <img src="src/assets/images/morpheus-tech.png" alt="Morpheus Tech" width="120px"/>
</p>

<div align="center">

| | |
|----------------------|--------------------------|
| **Creator:** | <a href="https://github.com/wmauz677" target="_blank" rel="noopener noreferrer">Weston Mauz</a> |
| **Company:** | Morpheus Tech LLC |
| **Release:** | v1.6.0 - November 10th, 2026 |
| **Lab** | <a href="https://lab.morpheustech.net/" target="_blank" rel="noopener noreferrer">lab.morpheustech.net</a> |
| **Company** | <a href="https://morpheustech.net/" target="_blank" rel="noopener noreferrer">morpheustech.net</a> |

</div>

### Project Index:

1. [Mission Statement](#1-mission-statement)
2. [Rules](#2-rules)
3. [Design Methodology](#3-design-methodology)
4. [Status](#4-status)
5. [Next Steps](#5-next-steps)
6. [Run Locally](#6-run-locally)
7. [License](#7-license)
8. [Attributions](#8-attributions)

## 1. Mission Statement

**Morpheus Tech Lab** is an open-source cellular-automata, math-engine and simulator project,
built with the community. Its live demos are free to use in your browser at
<a href="https://lab.morpheustech.net/" target="_blank" rel="noopener noreferrer">lab.morpheustech.net</a>.
It began by re-imagining <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Conway's Game of Life</a>
in three dimensions, and it now holds several 3D cellular automata you can seed, play, rewind,
slice and orbit. Everything runs on your own computer; nothing is sent anywhere.

The lab is open source under the Apache License 2.0 and maintained by Morpheus Tech LLC.
Contributions are welcome: new automata, simulators, fixes and docs. See
[CONTRIBUTING.md](CONTRIBUTING.md). Everyone taking part follows the
[code of conduct](CODE_OF_CONDUCT.md), and vulnerabilities are reported privately, as
[SECURITY.md](SECURITY.md) says.

## 2. Rules

The original 2D rules are shown next to the new, reimagined 3D rules that are used in this project.

| Rule                        | Description                                                                                | 2D (Conway’s) | Visualization [1] | 3D |
| ---------------------------- | ------------------------------------------------------------------------------------------ | -------------- | ---------------- | --- |
| **Birth**                   | If a cell has exactly ***x*** living neighbors and is<br>initially dead, it becomes alive. | 3              | <img src="src/assets/images/rule_birth.png" alt="2D Birth" width="200" height="100"> | 9, 10 |
| **Survival**                | If a cell has ***[x,y,z]*** living neighbors, it<br>stays alive in the next generation.    | 2, 3           | <img src="src/assets/images/rule_survival.png" alt="2D Survival" width="200" height="100"> | 5–15 |
| **Death by Isolation**      | If a cell has fewer than ***x*** living<br>neighbors, it dies (becomes dead).              | 2              | <img src="src/assets/images/rule_death_isolation.png" alt="2D Death Isolation" width="200" height="100"> | 5 |
| **Death by Overcrowding**   | If a cell has more than ***x*** living neighbors, it dies.                                 | 3              | <img src="src/assets/images/rule_death_overpopulation.png" alt="2D Overcrowding" width="200" height="100"> | 11 |


### State Transition Table

| Current State | Conway’s Life – Living Neighbors | 3D Life – Living Neighbors | Next State | Rule Triggered / Reason       |
|---------------|----------------------------------|----------------------------|------------|-------------------------------|
| `1` (Alive)   | 0 – 1                            | 0 – 4                      | `0`        | **Dies** — underpopulation    |
| `1` (Alive)   | **2 – 3**                        | **5 – 15**                 | `1`        | **Survives / Lives**          |
| `1` (Alive)   | 4 – 8                            | 16 – 26                    | `0`        | **Dies** — overcrowding       |
| `0` (Dead)    | 0 – 2                            | 0 – 8                      | `0`        | Not enough neighbors / no birth |
| `0` (Dead)    | **3**                            | **9 – 10**                 | `1`        | **Birth / Reproduction**      |
| `0` (Dead)    | 4 – 8                            | 12 – 26                    | `0`        | Overcrowded — no birth        |

## 3. Design Methodology

### Tools
This project was built with vanilla javascript with the addition of the <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> library. <a href="https://cursor.com" target="_blank" rel="noopener noreferrer">Cursor</a>, <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">ChatGPT</a>, & <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude</a> were used to assist with writing code, researching mathematical concepts, & brainstorming different ideas. This was programmed on an M4 <a href="https://www.apple.com/mac-mini/" target="_blank" rel="noopener noreferrer">Mac Mini</a> & M1 <a href="https://www.apple.com/shop/buy-mac/macbook-air" target="_blank" rel="noopener noreferrer">Macbook Air</a> using MacOS.

### Resources
Much of the inspiration for the design for this project was from <a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener noreferrer">3Blue1Brown</a>, specifically the course <a href="https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener noreferrer">Essence of linear algebra</a>. Further inspiration came from the <a href="https://lexfridman.com/podcast/" target="_blank" rel="noopener noreferrer">Lex Friedman Podcast</a>, specifically conversations with <a href="https://www.youtube.com/watch?v=ez773teNFYA" target="_blank" rel="noopener noreferrer">Stephen Wolfram</a> & <a href="https://www.youtube.com/watch?v=YDjOS0VHEr4" target="_blank" rel="noopener noreferrer">Neil Gershenfeld</a>. Two Game of Life websites also helped formulate the UI, such as <a href="https://playgameoflife.com" target="_blank" rel="noopener noreferrer">Play Game of Life</a> & <a href="https://conwaylife.com" target="_blank" rel="noopener noreferrer">Conway Life</a>. Finally, an interview of Conway himself, by <a href="https://www.youtube.com/watch?v=R9Plq-D1gEk" target="_blank" rel="noopener noreferrer">Numberphile</a>.

### Process
The original idea began on pen-and-paper, starting with a 3D drawing representing a 3D cube made of cubes (see company logo). 



The 3D model was determined to be best represented mathematically by a three dimensional matrix, as linear algebra can be leveraged for computational efficiency. The idea was then delivered to various LLM to build a prototype of the software in Python. That prototype, was then reviewed & re-written line-by-line by a human software engineer. That version was then translated to javascript by an LLM, then passed back to the human engineer to be re-written manually, again. There were many iterations & refactors performed by handing off between LLM & human engineer. The end goal of this process was to deliver software that was clearly human readable & followed software development best practices.

<p align="center">
  <img src="src/assets/images/game-of-life-3d-drawing.png" alt="drawing" height="400">
</p>

## 4. Status

### Simulation modes

| Mode | What you see |
|---|---|
| **Game of Life 3D** | Conway's rules extended to a cube, where each cell has 26 neighbours (rules above). Edge, face and corner cells get their own rules when the grid doesn't wrap |
| **Rule 30** | Wolfram's elementary automaton, in 1D or 2D |
| **Sine Wave** | A continuous wave field, a smooth visual reference |
| **Abelian Sandpile** | One grain of sand dropped at the centre each generation; piles topple and spread into fractal patterns |
| **Contest** | One contest on the unbounded engine, in three branches, opened from the banner by the company logo. Its panel sits in the middle of the screen. The first branch, **Speed**, times how many generations your browser computes in 6 seconds, from the same seed (Cube10) under the same rules (B9-10/S5-15) for everyone, up to a ceiling of 1,000; nothing is drawn while it runs. The results card gives the score, the statistics, your browser and the result's hash, and **Export result** saves it as a result file. **Verify a result** checks any result file by replaying it, in a background thread. Speed's timing is self-reported: a replay proves the generation, not how long it took. The other two branches, Methuselah and Contained chaos, are coming (#41, #42). |
| **Explore** | Game of Life 3D without walls: the pattern grows as far as it likes, for as long as it runs. Pause, step, restart and set its speed; from its boxes in the HUD, choose the rules, a seed shape, a preset seed or a seed file, or design a seed cell by cell, set a memory limit, and optionally an arena that ends the run at its edge. The 2D view shows one slice, across the pattern's extent; the grid shows the 16³-cell chunks it occupies. A run stops once its pattern dies or settles into a still life or a repeating cycle, which then keeps playing. |

The lab opens in Explore, paused on a 10³ cube. The Simulation panel at the top left holds the
HUD, in every mode, as sections. The first, Mode, names the simulation that runs; the gear in its
title, or the settings button, switches mode. The other sections (the boxes, below) belong to that
simulation; Explore's own settings are in them, [below](#explores-settings). A click on a
section's title folds it down to the title, to make room for the others on a short screen; a
click on the panel's title folds the whole panel.

Seeds: cube, tetrahedron, octahedron, Perlin noise and Worley noise. Game of Life 3D's default is a 50×50×50
grid over 100 generations. The whole run is computed before it plays, so you can scrub and play
it backwards instantly.

Explore works differently: it computes one generation at a time, in a background thread, for as
long as it runs, and keeps only the current one, so it can't play backwards. The view draws up
to 300,000 live cells; past that it draws the 16³-cell chunks that hold them, as boxes. Its
memory limit starts at 1,024 MB: the browser caps each tab's memory, and a page can't learn that
cap, so the limit stops a run cleanly before the browser or the system does. On a 16 GB machine,
one Chrome tab could take about 6 GB; 512 MB is the cautious choice for phones and small machines.

### Explore's settings

Explore's settings are changed from its boxes in the HUD's Simulation panel, at the top left,
rather than in the settings dialog, which in Explore shows only the mode choice. Each box you can
change has a gear in its title that opens a popover beside it (under it on a phone): **Seed**, **Rules** and
**Limits**, for the arena (on or off, and its side, 8 to 1,024 cells) and the memory limit (64 to
16,384 MB). The **Run** box only reports, and is drawn darker, with a green title, to tell it apart: the
generation, generations per second, live cells and their peak, the pattern's extent, its chunks,
whether it has settled, and the engine's memory.
**Apply** restarts the run from generation 0 (a saved generation from its own generation), so
every run can be repeated from its seed and rules; **Cancel**, Esc or a click elsewhere changes
nothing. One popover is open at a time, and each works from the keyboard alone. The Rules
popover also shows the counts a live cell dies with: isolation (below Survival),
overcrowding (above it), and any counts in between that Survival leaves out.

The seed is **Custom** or a **Preset**. Custom cells come from a shape (cube, tetrahedron,
octahedron, Perlin or Worley noise, or a preset's cells under your rules) or from a file, with
**Load…**: a seed file brings its cells and puts its rules in the Rules box, and a saved
generation carries on from its generation. A **Preset** brings its own rules: **Cube10**, the
10³ cube Explore opens on under the default rules, a dense mass that keeps swelling outward; or
**Spreading noise**, 224 cells under B7,13,14/S0,2-6,9,13,19,23,24 that look like chaotic noise
yet keep spreading. The Speed contest
runs Cube10.

A preset's rules are locked, so it is always the same run, and a saved generation's rules and
arena are locked too. The Rules box says what locks them. **Use your own rules**, in the Rules or
Explore popover, keeps the same cells, as a Custom seed from generation 0, and makes those rules
(and the arena) yours to change.

### Designing a seed

The **seed editor** places cells one by one in the **seed box**: 10×10×10 cells, from −5 to 4
on each axis, around the centre, the box the Discovery contests' seeds go in. In the Seed popover,
**Custom**, **Design**, **Design…** opens it on the seed in use, if every cell of it lies in the
box (Cube10 and Spreading noise do); otherwise on an empty box, saying why. **Preset**, **Edit a
copy…** opens a preset's cells instead: using the copy makes it a Custom seed with the preset's
rules, yours to change, and the preset itself never changes.

The editor takes over the 3D view, with its tools in a panel beside it (at the foot, on a phone).
The whole box shows at once: live cells as solid cubes, empty places as faint dots. The cursor is
a white wireframe cube, with guide lines along x (red), y (green) and z (blue). The selection is a
yellow box, its live cells tinted and its empty places bright, and the panel names it: "Plane
across z, at z 4: 100 cells, 37 alive." Explore's run, if it is running, keeps going behind it.

| Key | Does |
|---|---|
| Arrows | Move the cursor across the screen, along whichever axis looks that way from where you stand |
| Page Up / Page Down | Move it away from you, or toward you |
| Click | Move the cursor to a cell; drag to turn the view (Front, Top, Side and Angled buttons too) |
| 1, 2, 3, 4, 5 | Select the cursor's cell, a line through it, a plane through it, a box, or all of it |
| X, Y, Z | The axis a line runs along, or a plane lies across |
| 4, Shift+click | A box runs from a corner to the cursor: 4 sets the corner at the cursor, Shift+click at a cell |
| Space, Enter | Switch the selection: clear it if every cell in it is alive, fill it if not |
| R | Fill the selection at random, at the panel's density (0.3 to start) |
| F | Fade the rest: dim every cell outside the cursor's plane, or outside a box |
| Ctrl+Z, Ctrl+Shift+Z or Ctrl+Y | Undo and redo, up to 100 changes |
| ? | List the keys |
| Esc | Close the list, or the editor, without using the design |

The panel has a button for each, and arrows, Away and Near buttons for a touch screen. **Use**
makes the design the seed, under Custom, and restarts the run: the Seed box reads "Design: 214
cells". **Export** saves it as a seed file, `explore-seed.json`, with the rules Use would bring;
the panel says which. The editor's **Load…** opens a seed file that fits the box, with its rules;
a saved generation can't open as a design, since it brings its own rules and arena. A seed file
from Export or Save seed opens back unchanged, there or through the Seed box's Load… and then
Design….

Two buttons save the run: Save this generation, in the Run box, and Save seed, in the Seed
box. Each opens a popover that says what the file holds and where it goes before anything is
written. In Chrome and Edge, Save asks where to
put the file; in other browsers it downloads, to the downloads folder.

- **Save this generation** saves the generation on screen, running or paused, as
  `explore-generation-N.json`: a result file, the same file a contest entry is. It holds the
  run's seed, rules and arena, the generation, how the run stands (stopped there, or why it
  ended), the SHA-256 hash of that generation's cells and of the seed, the run's statistics,
  chunk size and browser, and the position of every live cell. The popover shows both hashes.
  `node scripts/verify.mjs` confirms the file by replaying the seed. Loaded from the Seed box, under
  Custom, it carries on from that generation, under its own rules and arena; only the memory
  limit comes from the Limits box. Opening the popover takes the generation, so the run can keep going. A
  saved generation holds at most 1,000,000 live cells, so a bigger one isn't saved, and the
  popover says why.
- **Save seed** saves the seed the run started from, with its rules, as `explore-seed.json`, a
  seed file. Loaded from the Seed box, under Custom, it runs from generation 0. For a run carried on from a saved
  generation, it is the first run's seed.

An Explore seed file is JSON: its format and version, the rules, and the live cells as
`[x, y, z]` whole numbers. You can also write or edit one by hand:

```json
{
  "format": "morpheus-tech-lab/explore-seed",
  "version": 1,
  "rules": { "birth": [9, 10], "survival": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  "cells": [[0, 0, 0], [1, 0, 0], [0, 1, 0]]
}
```

### Limits
**GPU or CPU.** Game of Life 3D and Rule 30 (1D and 2D) compute on your GPU with WebGPU when
your browser has it, and on your CPU when it doesn't; Sine Wave and Abelian Sandpile always run
on the CPU. Both give exactly the same generations, cell for cell. The chip button in the
control bar says where the next run computes (GPU or CPU) and turns GPU compute off or on; your
browser remembers the choice. If the GPU can't be used, the button is disabled and says why.

**Which browsers have WebGPU.** Chrome and Edge 113 and later on Windows, macOS and ChromeOS
(121 and later on Android), Safari 26 and later, and Firefox 141 and later on Windows (later
versions add macOS). On Linux most browsers still keep it behind a flag. WebGPU only runs on a
secure page: HTTPS, or `localhost` when you run the lab yourself.

**Measured.** 100×100×100 grids over 100 generations, in Chromium on a laptop with an AMD
Ryzen 5 5500U and its integrated Radeon GPU:

| Run | CPU | GPU |
|---|---|---|
| Game of Life 3D, default seed (a 10³ cube) | 6.4 s | 0.6 s |
| Game of Life 3D, 30% of all cells alive | 5–6 min | 5–6 s |
| Rule 30 2D | 0.6 s | 0.1 s |

**Where it stops now.** With the GPU, computing the generations is no longer the limit. The
whole run is kept in memory so you can scrub and reverse it: one byte per cell per generation,
plus about 40 bytes of JavaScript memory per live cell per generation for drawing. A browser tab
gets about 4 GB of JavaScript memory, so a run with around 100 million live cells in total
(summed over all generations) is the most a tab holds. A dense 100³ run (36 million live cells
in total) takes about 1.5 GB and fits; the same density at 150³ runs the tab out of memory.
Drawing slows first: a frame with half a million live cells takes about 0.1 s to draw, so a
dense 100³ run plays back at about 9 frames a second. On the CPU, a 100³ grid over more than
100 generations is still more than a typical laptop handles comfortably.

## 5. Next Steps
More demos are coming to the lab. Feedback is welcome, so please reach out or tag us in your
content. Where the lab is heading, and what is ready to pick up, is in the
[roadmap](ROADMAP.md); to build something on it, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 6. Run Locally

Requires Node.js 20.19 or newer (for Vite 7).

1. Clone the repository
2. `npm install`
3. `npm run dev`, then open http://localhost:5180

`npm run build` writes the production site to `dist/`, and `npm run preview` serves it. `npm test`
runs the automated tests. `node scripts/verify.mjs <result.json>` checks a result file from the
unbounded engine, or a generation saved from Explore, by replaying it (try it on `test/unbounded/fixtures/example-result.json`).
A contest's result is checked against its contest as well, and its score printed. Speed's results
can also be checked by lookup: `node scripts/reference-hashes.mjs --contest speed-1 --to 1000 --out speed-1.table`
makes the table once, and `node scripts/verify.mjs <result.json> --table speed-1.table` looks a
result up in it.
Releases are published to GitHub Pages by the maintainers, following [RELEASING.md](RELEASING.md); see [CHANGELOG.md](CHANGELOG.md) for what each version changed.


## 7. License

The code is licensed under the [Apache License 2.0](LICENSE) from v1.5.0; releases v1.0.0 to
v1.4.0 remain under the MIT License. The Morpheus Tech name, logo and brand files are not
covered by it; see [NOTICE](NOTICE).

## 8. Attributions

[1] Conway's Game of Life Rules -- 2D Visualization: <a href="https://playgameoflife.com/info" target="_blank" rel="noopener noreferrer">https://playgameoflife.com/info</a>