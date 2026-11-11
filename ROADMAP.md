# Morpheus Tech Lab roadmap

**Morpheus Tech Lab** is an open-source cellular-automata, math-engine and simulator project,
built with the community. Its live demos are free to use in your browser at
[lab.morpheustech.net](https://lab.morpheustech.net/). It began by re-imagining Conway's Game of
Life in three dimensions, and it now holds several 3D cellular automata you can seed, play,
rewind, slice and orbit. Everything runs on your own computer; nothing is sent anywhere.

This roadmap is a direction, not a promise. Items may change order, change shape, or be dropped,
and none of them has a date.

- **Ideas and questions** go to
  [issues](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues) and
  [Discussions](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/discussions).
- **Work that is ready to pick up** is labelled
  [`ready`](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/labels/ready), and ready
  work that suits a first contribution is also labelled
  [`good first issue`](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/labels/good%20first%20issue).
- **To build something**, read [CONTRIBUTING.md](CONTRIBUTING.md) first. Every issue goes from
  idea to planning to ready, and work starts from a ready one.

## The engine

An unbounded engine, where a pattern can grow without walls, and contests built on it. The plan,
with the decisions behind it, is [#44](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/44).
Each item is one of its sub-issues, and builds on the ones before it, except the last. Ideas
for after it are talked through in [Discussion #45](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/discussions/45).

| # | Item | Description |
|---|------|-------------|
| [#35](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/35) | **Unbounded engine core** | Game of Life 3D without edges: chunks allocated where the cells are, one lockstep per generation, with tests (in progress) |
| [#36](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/36) | **Engine in a Web Worker** | Timed and open-ended runs off the main thread, with live statistics (in progress) |
| [#37](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/37) | **Explore** | A new mode: the unbounded world, run indefinitely, with no score (in progress) |
| [#38](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/38) | **Canonical state and replay** | A hash of the world's state, and a verifier that replays a result from its seed |
| [#39](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/39) | **Benchmarks** | Measurements that pin the chunk size and the contests' values |
| [#40](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/40) | **Contests and Speed** | A Contests view, the Speed contest and a Hall of Fame |
| [#41](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/41) | **Methuselah** | A Discovery contest: the longest-lived pattern that settles inside an arena |
| [#42](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/42) | **Contained chaos** | A Discovery contest: a pattern that never settles and never escapes |
| [#43](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues/43) | **Caps become advice** | The existing modes' size and generation caps become popovers that explain the memory each run needs |

## New demos

| # | Demo | Description |
|---|------|-------------|
| 1 | **Upload Starting Seed** | Start from your own seed: a CSV matrix, voxels, or a converted 3D file |
| 2 | **More automata** | New rule families, each a demo of its own |

New demos are written from scratch for the lab and run in the browser on the CPU.

## The brand restyle

Restyle the chrome, meaning the controls, panels and info displays around the simulation, to
the Morpheus Tech brand. The brand tokens are already in the repo at
[`src/brand/tokens.css`](src/brand/tokens.css), pinned by [`brand.lock`](brand.lock), but
nothing imports them yet. The restyle imports and uses them; it does not edit the pinned file.

## Community

- **GitHub Discussions**, for questions, ideas and showing what you made with the lab.
- **`good first issue` labels** on ready work that suits a first contribution, so new
  contributors have a clear place to start.
