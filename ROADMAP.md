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
  [`approved`](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/labels/approved), and
  approved work that suits a first contribution is also labelled
  [`good first issue`](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/labels/good%20first%20issue).
- **To build something**, read [CONTRIBUTING.md](CONTRIBUTING.md) first. Work starts from an
  issue a maintainer has approved.

## The engine

The engine items are not listed yet. They will be added here.

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
- **`good first issue` labels** on approved work that suits a first contribution, so new
  contributors have a clear place to start.
