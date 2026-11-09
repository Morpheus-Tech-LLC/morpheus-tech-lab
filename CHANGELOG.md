# Changelog

All notable changes to Morpheus Tech Lab (`morpheus-tech-lab`, named `morpheus-tech-web` until
2026-11-08). The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
versions follow [Semantic Versioning](https://semver.org/); they are the annotated git tags. See
[RELEASING.md](RELEASING.md).

## [Unreleased]

## [1.5.6] — 2026-11-10

### Changed
- Moved inline styles from the company panel and bottom control bar into stylesheets.

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
