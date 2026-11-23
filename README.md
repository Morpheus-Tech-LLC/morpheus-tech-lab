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
| **Release:** | v1.7.0 - November 21st, 2026 |
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
| **Game of Life 3D (unbounded)** | Conway's rules in three dimensions, in a world without walls: the pattern grows as far as it likes, for as long as it runs. Pause, step, restart and set its speed; from its boxes in the HUD, choose the rules, a seed shape, a preset seed or a seed file, or design a seed cell by cell, set a memory limit, and optionally an arena, with a choice of what happens at its edge: the run ends; **Ships leave**, so ships of period up to 32 fly out as in Classic Methuselah; **It wraps around**, so opposite walls meet and a pattern that crosses one comes back in through the other; or **Walls**, closed walls whose corner, edge and face cells follow their own rules. The 2D view shows one slice, across the pattern's extent; the grid shows the 16³-cell chunks it occupies. A run stops once its pattern dies or settles into a still life or a repeating cycle, which then keeps playing. It computes on the CPU, in a background thread, keeping only the current generation, so its memory follows the live cells; it has no GPU path yet, [below](#limits) |
| **Game of Life 3D (bounded)** | Conway's rules extended to a cube, where each cell has 26 neighbours (rules above), in a fixed grid that wraps around, or has walls whose edge, face and corner cells get their own rules. The whole run is computed before it plays, so you can scrub it and play it backwards. It computes on your GPU with WebGPU where your browser has it, and on the CPU otherwise, with the same cells either way |
| **Rule 30** | Wolfram's elementary automaton, in 1D or 2D |
| **Sine Wave** | A continuous wave field, a smooth visual reference |
| **Abelian Sandpile** | One grain of sand dropped at the centre each generation; piles topple and spread into fractal patterns |
| **Contests** | Season 0: three contests on the unbounded engine, **Speed**, **Methuselah** and **Classic Methuselah**, opened from the Contests banner by the company logo, which says when entries close: 31 December 2026, 11:59 PM Central Time. Its panel sits in the middle of the screen. They run on the CPU only, so every entrant runs the same engine. **Speed** times how many generations your browser computes in 6 seconds, from the same seed (Cube10) under the same rules (B9-10/S5-15) for everyone, up to a ceiling of 1,000; runs that reach the ceiling rank by the time they took, to the millisecond, and the results card and the Hall of Fame lead with it. Nothing is drawn while it runs. The results card gives the score, the statistics, your browser and the result's hash, and **Export result** saves it as a result file. **Verify a result** checks any result file by replaying it, in a background thread. **Watch**, on the results card and on a checked file's verdict, plays the run back in 3D, replayed from its seed: the control bar plays, pauses, steps and sets the speed, a scrub bar goes to any generation up to the scored one, the view settings (grid, orientation, cell size, 3D or 2D) apply as in Game of Life 3D (unbounded), and when the replay reaches it, its hash is compared with the result's, so the run shows as self-verified. **Submit by email** takes three numbered steps, since an email link can't attach a file: **Save result file**, then **Open the email**, to lab@morpheustech.net with the text filled in (it opens only once the file is saved), then attach the file (and, if you like, a picture) by hand: without the file, an entry can't be verified. Folded away under the steps, the card also shows the address, subject and text with Copy, for webmail. Each contest's page shows its **Hall of Fame**: the verified entries, best first, with each entrant's chosen name, picture, score, browser and date, and Watch; a Methuselah or Classic Methuselah entry also has **Open seed**, which opens its seed and rules in Game of Life 3D (unbounded), in the seed editor, to change and enter as your own. Speed's timing is self-reported: a replay proves the generation, not how long it took. **Methuselah** looks for the longest-lived pattern that settles in place inside a 64³ arena: your entry is a simulation, a seed in the 10³ seed box and its rules, loaded with **Load simulation…** from a simulation file (the unbounded mode's Save simulation), and shown drawn as cubes, with its cell count, rules and file. **Design a seed…** opens the seed editor in Game of Life 3D (unbounded) and sets its arena to the contest's 64³, so a run there ends as the contest's would; the Contests banner brings you back to Methuselah's page. A run goes on until the pattern dies, repeats in place, reaches the arena's edge, or reaches 10,000 generations, and can take a few minutes; it scores the generation the pattern settled at, if its final state or cycle closes within the budget, so the top score is 9,999, and reaching the edge or the budget scores nothing. This is stricter than classic Life's methuselahs: anything that flies off ends the run unscored. The score depends only on the seed and rules, so it is the same on any machine; ties go to fewer seed cells, then the earlier submission, and the Hall of Fame shows each entry's rules. **Classic Methuselah** is Methuselah with one rule changed: a ship may leave the arena. When part of the pattern reaches a wall and is a ship heading out, of period up to 32, the longest recognised, it is deleted and listed as a departure, and the run goes on, so a pattern that settles after sending off ships scores; anything else at the edge still ends the run, and a pattern that keeps sending off ships ends as *emits*, unscored. Its page lists its five endings, the results card and the email list the ships that left ("2 ships left, at generations 140 and 412"), and Watch marks where each left on its scrub bar. Design a seed… works for both Methuselah contests. |

The lab opens in Game of Life 3D (unbounded), paused on a 10³ cube, the Cube10 simulation. The
HUD panel at the top left names the mode in its title, with a gear that opens the **Mode**
popover to switch mode; so does the gear in the control bar. Each mode keeps its own settings,
so switching back to one runs it as it was. Under the title are the mode's boxes, and every
setting is changed from them: a box you can change has a gear in its title that opens a popover
beside it (under it on a phone), whose **Apply** runs the mode again; **Cancel**, Esc or a click
elsewhere changes nothing. In Game of Life 3D (bounded), Rule 30, Sine Wave and Abelian Sandpile,
**Grid** sets the size and the generations, Rule 30's 3D, the sandpile's initial sand, and
whether the bounded grid wraps around or has walls with their own corner, edge and face rules;
the bounded mode's **Seed** and **Rules** set its shape and its birth and survival counts. Rule
30, Sine Wave and the sandpile have only the Grid box. The unbounded mode's boxes are
[below](#settings-of-game-of-life-3d-unbounded). A click on a box's title folds it down to the
title, to make room for the others on a short screen; a click on the panel's title folds the
whole panel.

Seeds: cube, tetrahedron, octahedron, Perlin noise and Worley noise. Game of Life 3D (bounded)'s default is a 50×50×50
grid over 100 generations. The whole run is computed before it plays, so you can scrub and play
it backwards instantly.

Game of Life 3D (unbounded) works differently: it computes one generation at a time, in a background thread, for as
long as it runs, and keeps only the current one, so it can't play backwards. The view draws up
to 300,000 live cells; past that it draws the 16³-cell chunks that hold them, as boxes. Its
memory limit starts at 1,024 MB: the browser caps each tab's memory, and a page can't learn that
cap, so the limit stops a run cleanly before the browser or the system does. On a 16 GB machine,
one Chrome tab could take about 6 GB; 512 MB is the cautious choice for phones and small machines.

### Settings of Game of Life 3D (unbounded)

In Game of Life 3D (unbounded), the **Simulation** box comes first. A simulation is a seed and
its rules, and its two parts, **Seed** and **Rules**, are boxes inside it. Its title line names
the simulation in use: a preset whenever the seed and rules are a preset's (so the lab opens on
Cube10), a loaded file's name, or **Custom**. Its gear sets the seed and the rules together, on
one page: a preset from the list, or **Load simulation…**, which takes a simulation file or a
saved generation. The Seed box's gear changes only the cells, under the rules in use, and the
Rules box's only the rules; either makes the simulation Custom, unless the two are a preset's
again. Then come
**Limits**, for the arena (on or off, its side, 8 to 1,024 cells, and what happens **At the edge**:
**The run ends**, the default, **Ships leave**, **It wraps around** or **Walls**) and the memory
limit (64 to 16,384 MB). The **Run** box only reports, and is drawn
darker, with a green title, to tell it apart: the generation, generations per second, live cells
and their peak, the pattern's extent, its chunks, whether it has settled, the engine's memory, and,
with Ships leave, how many ships have left and where the last one went. With that
choice, a ship of period up to 32 heading out through a wall leaves, a note says so, and the run
goes on, exactly as in Classic Methuselah, which a contest's **Design a seed…** switches it on for; a
pattern that keeps sending off ships ends as *emits*. A generation saved after a ship has left
can't be replayed by its file, which has no contest to say that ships leave, so Save this
generation refuses it, and Save seed and Save simulation still work. With **It wraps around**, the arena is drawn
dashed, its opposite walls meet, so a ship comes round and the run settles on its lap, and the
run never ends at the edge. No contest wraps: Save this generation is refused while the arena
wraps (Save seed and Save simulation still work), and a contest's Design a seed… stops the
wrapping. With **Walls**, the arena is closed and drawn
brighter: past its walls is empty, so a cell on a wall counts only its neighbours inside, 7 at a
corner, 11 on an edge and 17 on a face, and follows that kind of wall's Birth and Survival, set
right under Walls (they start at the old grid mode's corner B2,3/S2-4, edge B4/S2-6 and face
B6/S3-9; a wall may have no birth count, so its cells are never born). Every other cell follows
the Rules box, and nothing is born outside the arena. No contest has walls, so they are handled
as wrapping is: Save this generation is refused, and a contest's Design a seed… takes them off.
**Apply** restarts the run from generation 0 (a saved generation from its own generation), so
every run can be repeated from its seed and rules; **Cancel**, Esc or a click elsewhere changes
nothing. One popover is open at a time, and each works from the keyboard alone. The Rules
popover also shows the counts a live cell dies with: isolation (below Survival),
overcrowding (above it), and any counts in between that Survival leaves out.

The **Seed** popover takes the cells from a **Shape** (cube, tetrahedron, octahedron, Perlin or
Worley noise, or a preset's cells), a **File** (a seed file's cells, or a simulation file's
without its rules) or a **Design** (the seed editor, [below](#designing-a-seed)); the rules in
the Rules box stay. The presets are simulations, each a seed with its own rules: **Cube10**, the
10³ cube the lab opens on under the default rules, a dense mass that keeps swelling outward; or
**Spreading noise**, 224 cells under B7,13,14/S0,2-6,9,13,19,23,24 that look like chaotic noise
yet keep spreading. The Speed contest runs Cube10. Under **Ships**, nine small seeds each become
a ship, a pattern that flies off returning to its own shape: straight ones of period 1 to 12 and
two diagonal ones, each named by its period and speed in c, one cell a generation, the fastest
anything can go. Each description says the generation it becomes a ship and where it flies; the
shapes list their cells too.

A preset's rules are locked, so it is always the same run, and a saved generation's rules and
arena are locked too. The Rules box says what locks them. **Use your own rules**, in the Rules or
Limits popover, keeps the same cells, as a Custom simulation from generation 0, and makes those rules
(and the arena) yours to change.

### Designing a seed

The **seed editor** places cells one by one in the **seed box**: 10×10×10 cells, from −5 to 4
on each axis, around the centre, the box the Discovery contests' seeds go in. In the Seed popover,
**Design**, **Design…** opens it on the seed in use, if every cell of it lies in the box (Cube10
and Spreading noise do); otherwise on an empty box, saying why. To start from a preset's cells,
choose them as the Shape first.

The editor takes over the 3D view, with its tools in a panel beside it (at the foot, on a phone).
The whole box shows at once: live cells as solid cubes, empty places as faint dots. The cursor is
a white wireframe cube, with guide lines along x (red), y (green) and z (blue). The selection is a
yellow box, its live cells tinted and its empty places bright, and the panel names it: "Plane
across z, at z 4: 100 cells, 37 alive." The editor opens on a plane, across x through the cursor,
since a single cell is easily hidden among live ones; 1 selects the cursor's cell alone. The
unbounded mode's run, if it is running, keeps going behind it.

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
makes the design the seed, under the rules the editor opened with, and restarts the run: the
Seed box reads "Design". **Export** saves the design alone, without rules, as a seed file,
`game-of-life-3d-seed.json`. The editor's **Load…** opens a seed file or a simulation file whose
cells fit the box; a simulation file's rules become the ones Use brings. A saved generation
can't open as a design, since it brings its own rules and arena. A file from Export, Save seed
or Save simulation opens back unchanged.

Three save icons save the run: **Save simulation**, at the end of the Simulation box's name
line; **Save seed**, at the end of the Seed box's; and **Save this generation**, on the Run box's
title line. Each opens a popover that says what the file holds and where it goes before anything
is written. In Chrome and Edge, Save asks where to put the file; in other browsers it downloads,
to the downloads folder.

- **Save this generation** saves the generation on screen, running or paused, as
  `game-of-life-3d-generation-N.json`: a result file, the same file a contest entry is. It holds the
  run's seed, rules and arena, the generation, how the run stands (stopped there, or why it
  ended), the SHA-256 hash of that generation's cells and of the seed, the run's statistics,
  chunk size and browser, and the position of every live cell. The popover shows both hashes.
  `node scripts/verify.mjs` confirms the file by replaying the seed. Loaded with Load simulation…,
  it carries on from that generation, under its own rules and arena; only the memory
  limit comes from the Limits box. Opening the popover takes the generation, so the run can keep going. A
  saved generation holds at most 1,000,000 live cells, so a bigger one isn't saved, and the
  popover says why.
- **Save simulation** saves the seed the run started from, with its rules, as
  `game-of-life-3d-simulation.json`, a simulation file. Loaded with Load simulation…, it runs from
  generation 0, and a Methuselah contest takes it as an entry. For a run carried on from a saved
  generation, it is the first run's seed.
- **Save seed** saves that seed's cells alone, as `game-of-life-3d-seed.json`, a seed file.
  Loaded in the Seed box, under File, it runs under the rules in the Rules box.

Seed and simulation files are JSON: the format and its version, the rules in a simulation file
only, and the live cells as `[x, y, z]` whole numbers. A file saved by an earlier version always
has rules, so it loads as a simulation file. You can also write or edit one by hand:

```json
{
  "format": "morpheus-tech-lab/explore-seed",
  "version": 1,
  "rules": { "birth": [9, 10], "survival": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  "cells": [[0, 0, 0], [1, 0, 0], [0, 1, 0]]
}
```

### Limits
**GPU or CPU.** Game of Life 3D (bounded) and Rule 30 (1D and 2D) compute on your GPU with WebGPU when your
browser has it, and on your CPU when it doesn't; both give exactly the same generations, cell
for cell. Sine Wave and Abelian Sandpile always run on the CPU, and so does Game of Life 3D (unbounded), in a
background thread. A GPU steps a world of fixed size, and the unbounded world grows with its
pattern, so that mode has no GPU path yet; the routes to one, and what they cost, are talked
through in [Discussion #122](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/discussions/122).
Season 0's contests run on the CPU only, on the unbounded engine, so every entrant runs the same
engine. The chip button in the
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
| Game of Life 3D (bounded), default seed (a 10³ cube) | 6.4 s | 0.6 s |
| Game of Life 3D (bounded), 30% of all cells alive | 5–6 min | 5–6 s |
| Rule 30 2D | 0.6 s | 0.1 s |

**Size and generations are advice, not caps.** Game of Life 3D (bounded), Rule 30, Sine Wave and
Abelian Sandpile take any size and any number of generations. The range beside the size and
generations fields in the Grid popover is what a typical laptop runs comfortably at the other settings; click it for the
run's memory estimate, the ranges for a typical laptop (1.5 GB) and a strong desktop (4 GB), and
what happens past them: a slower precompute, a stuttering view, and at last the browser refusing
the memory, which stops the run with a message, or closing the tab, which no page can catch. Above
an estimate of 2 GB, Apply asks before it starts. The estimate counts every grid exactly; the live
cells it can only guess before the run (Game of Life 3D (bounded)'s guess follows the default
rules). Abelian Sandpile's Initial Sand stays 0 to 255, since each cell holds its grains in one
byte.

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
unbounded engine, or a generation saved from Game of Life 3D (unbounded), by replaying it (try it on `test/unbounded/fixtures/example-result.json`).
A contest's result is checked against its contest as well, and its score printed. A run that
settled (died out, or repeated, as a Methuselah result does) is replayed with the same settle
detector as the run, to confirm it first settled at the file's generation; its score prints as
"settled at generation 1,234 (period 2)" or "died at generation 1,234". A Classic Methuselah
result's ships leave the arena in the replay as they did in the run, and its departures print as
"2 ships left, at generations 140 and 412": the file's list must be the replay's. Speed's results
can also be checked by lookup: `node scripts/reference-hashes.mjs --contest speed-1 --to 1000 --out speed-1.table`
makes the table once, and `node scripts/verify.mjs <result.json> --table speed-1.table` looks a
result up in it. It takes several files at once, so `node scripts/verify.mjs public/hall-of-fame/results/*.json`
re-verifies the Hall of Fame; `npm test` checks each entry in `src/unbounded/hall-of-fame.json`
against its result file.
Releases are published to GitHub Pages by the maintainers, following [RELEASING.md](RELEASING.md); see [CHANGELOG.md](CHANGELOG.md) for what each version changed.


## 7. License

The code is licensed under the [Apache License 2.0](LICENSE) from v1.5.0; releases v1.0.0 to
v1.4.0 remain under the MIT License. The Morpheus Tech name, logo and brand files are not
covered by it; see [NOTICE](NOTICE).

## 8. Attributions

[1] Conway's Game of Life Rules -- 2D Visualization: <a href="https://playgameoflife.com/info" target="_blank" rel="noopener noreferrer">https://playgameoflife.com/info</a>