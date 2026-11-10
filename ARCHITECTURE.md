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
