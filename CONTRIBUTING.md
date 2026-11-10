# Contributing to Morpheus Tech Lab

Thanks for helping build the lab. New automata, simulators, fixes and docs are all welcome.
For anything large, open an issue first so we can agree on the shape before you write it.

Everyone taking part in the project, in issues, Discussions, pull requests and anywhere else,
follows the [code of conduct](CODE_OF_CONDUCT.md).

## Find something to work on

Start from the [roadmap](ROADMAP.md), or pick an issue labelled
[`good first issue`](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/labels/good%20first%20issue):
those are ready to pick up. Questions go to
[Discussions](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/discussions).

## Report a vulnerability

Never in a public issue. Report it privately, as [SECURITY.md](SECURITY.md) says.

## Set up

Requires Node.js 20.19 or newer.

```sh
npm ci          # install exactly what package-lock.json pins
npm run dev     # dev server at http://localhost:5180
npm run build   # production build to dist/; run it before you open a pull request
```

There are no automated tests yet, so check your change in the browser, in each mode it touches.

### Test the GPU path

Game of Life 3D and Rule 30 run on the GPU with WebGPU, and fall back to the CPU. Check a change
to them both ways: the chip button in the control bar switches GPU compute off and on, and its
badge says where the next run computes.

- **Use `http://localhost:5180`.** WebGPU only runs on a secure page, and `localhost` counts as
  one; your machine's LAN address over plain HTTP doesn't.
- **On Linux, Chromium needs flags.** WebGPU is off there by default, so the button says no GPU
  adapter was found. Open a separate, throwaway profile with WebGPU on, rather than adding the
  flags to your everyday browser (`--enable-unsafe-webgpu` relaxes some of WebGPU's safety
  hardening):
  ```sh
  chromium --user-data-dir=/tmp/webgpu-test \
    --enable-unsafe-webgpu --enable-features=Vulkan \
    --use-angle=vulkan --ignore-gpu-blocklist \
    http://localhost:5180
  ```
  It needs your GPU's Vulkan driver (on AMD, Mesa's RADV). `chrome://gpu` in that window should
  show **WebGPU: Hardware accelerated**. If it doesn't on Wayland, add `--ozone-platform=x11`.
- **Check the GPU matches the CPU.** If you change a shader, `src/gpu/engine.js` or a CPU evolve
  step, run the comparison in `src/gpu/compare.js` from the dev console, as its header shows, at
  50³ and 100³ with wrapping on and off. The GPU must give exactly the CPU's generations.

## Make a change

1. Branch from `development`: `git switch development && git pull && git switch -c my-change`.
2. Make your change. Read [AGENTS.md](AGENTS.md) for the code layout, patterns and invariants,
   and [ARCHITECTURE.md](ARCHITECTURE.md) for how the pieces fit.
3. Add a line under `## [Unreleased]` in [CHANGELOG.md](CHANGELOG.md) saying what changed, for
   a reader of the release notes.
4. Open a pull request against **`development`**, never `main`. Two checks run on it: `build`
   (`npm ci` and `npm run build`) and `DCO` (below). Both must pass before it can merge.

## Sign off your commits (DCO)

Every commit must be signed off under the
[Developer Certificate of Origin](https://developercertificate.org/). Signing off certifies that
you wrote the change, or otherwise have the right to submit it under the project's license.
Use `-s`:

```sh
git commit -s -m "Add a Langton's ant demo"
```

This adds a `Signed-off-by: Your Name <you@example.com>` line, which must match the commit's
author. A required check enforces it on every pull request. To sign off commits you already
made, run `git rebase --signoff development` and force-push your branch.

## License and originality

The lab is licensed under the [Apache License 2.0](LICENSE). By contributing, you agree that
your contribution is licensed under it too.

Contributions must be your own original work: no code or internals from other projects or
products. Open-source libraries come in as npm dependencies, not as copied code. The Morpheus
Tech name, logo and brand files are not part of the license; see [NOTICE](NOTICE).

## The brand files

`src/brand/tokens.css` and `public/favicon.svg` are pinned brand files, locked by hash in
`brand.lock`. Don't edit them by hand: `npm run build` refuses to build if they changed.

- `npm run brand:check` verifies the pin, and works for everyone.
- `npm run brand:sync` re-pins the brand from a clone of the private brand repo, and is for
  maintainers only.

## Releases

Branching, versioning and the release process are in [RELEASING.md](RELEASING.md).
Maintainers merge, tag and deploy.
