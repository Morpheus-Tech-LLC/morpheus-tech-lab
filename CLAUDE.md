# morpheus-tech-lab — Morpheus Tech Lab

An open-source (Apache-2.0) cellular-automata, math-engine and simulator project by Morpheus
Tech LLC, built with the community. Visitors use interactive 3D cellular automata: Game of
Life 3D, Rule 30, an Abelian sandpile and a sine wave. They run in the browser: Game of Life 3D
and Rule 30 on the GPU with WebGPU where it's available, everything else on the CPU. The
live demos are at **https://lab.morpheustech.net**, linked from the company site.

**Before writing any code, read [AGENTS.md](AGENTS.md).** It is the coding contract, including the
one rule that matters most here: what may never enter this repo. Contributors' workflow is in
[CONTRIBUTING.md](CONTRIBUTING.md); branches, versions and releases are in
[RELEASING.md](RELEASING.md).

## This repo is public

Everything committed here is published: the source on GitHub, the build on the open web.

- **Contributions must be original work; no code or internals from other projects or
  products.** That includes Morpheus Tech's other, proprietary products: nothing from them may
  be copied, ported or described here. A demo of a product shows *what* it does, as a video,
  screenshots or a toy written fresh for the lab, never *how*.
- No secrets, no `.env`, no internal hostnames and no paths outside this repo in anything that
  ships.

## Lifecycle

| Command | Does |
|---|---|
| `npm ci` | Install the locked dependencies (first run) |
| `npm run dev` | Vite dev server, http://localhost:5180 |
| `npm run build` | Check the brand pin, then build to `dist/` (not tracked) |
| `npm run preview` | Serve the built `dist/` locally, also on 5180 |
| `npm run deploy` | Build, then publish `dist/` to the `gh-pages` branch, which is live at once |
| `npm run brand:check` | Fail if a pinned brand file no longer matches `brand.lock` |
| `npm run brand:sync -- brand/vX.Y.Z --org <brand repo>` | Maintainers only: re-pin the brand from a local clone of the private brand repo at a released tag |

There is no backend, database, backup or log path, and there are no environment variables.
Releases follow [RELEASING.md](RELEASING.md). Agents never deploy, since a deploy is a public
release.

## Stack

- Vanilla JavaScript (ES modules), no framework, no TypeScript.
- Three.js for rendering (`Points` cloud and `OrbitControls`).
- Vite for build and dev. `gh-pages` for deploy.
- No tests yet. CI (`.github/workflows/ci.yml`) runs the `build` and `DCO` checks on every pull request.

## Branches and versions

`main` is the protected release branch, `development` the integration branch every pull request
targets, and `gh-pages` the deployed build (never edited by hand). Edit only on `development` or
a feature branch off it: check the branch before the first edit, switch away from `main` if a
deploy left it checked out, and finish on `development`. The annotated tag `vX.Y.Z` is
the version; `package.json`, the lockfile root and the README's Release line mirror it. The
full rules are in [RELEASING.md](RELEASING.md).

## Plans and process

The roadmap is [ROADMAP.md](ROADMAP.md); plans also live in this repo's GitHub issues and
Discussions. The code of conduct is [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and
vulnerabilities are reported privately, as [SECURITY.md](SECURITY.md) says. Agents edit
files only and do no version control unless asked: maintainers commit, merge, tag and deploy.
