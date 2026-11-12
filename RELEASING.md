# Releasing Morpheus Tech Lab

How this repo branches, versions and releases. Contributors need only the first three sections;
the release steps are for maintainers. To contribute, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Branches

| Branch | Role |
|---|---|
| `main` | The release branch. Protected: it changes only through a pull request from `development` (or a hotfix, below) |
| `development` | The integration branch. Every contribution's pull request targets it |
| `gh-pages` | The build output, served at https://lab.morpheustech.net. Written by `npm run deploy`; never edit it |
| feature branches | Short-lived, branched off `development` (a contributor's, in their fork), deleted once merged |

Your working copy stays on `development` or a feature branch off it, so edits never land on
`main` by accident. `main` is checked out only to deploy, and the deploy command switches back.

## Versions

Versions follow [Semantic Versioning](https://semver.org/), `X.Y.Z`:

- **MAJOR** breaks something users or embedders rely on: a URL, or the engine's public API.
- **MINOR** adds a feature or a demo.
- **PATCH** is fixes, docs and internal changes.

The version **is** the annotated tag `vX.Y.Z` on the release merge commit on `main`. Three places
only mirror it, and are updated to match at release: `version` in `package.json`, the root
package's `version` in `package-lock.json`, and the **Release** line in `README.md`.

## Changelog

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Each pull
request adds its lines under `## [Unreleased]`, in the right group (`Added`, `Changed`,
`Deprecated`, `Removed`, `Fixed`, `Security`). At release, that heading becomes
`## [X.Y.Z] — YYYY-MM-DD`, and a fresh, empty `## [Unreleased]` goes above it.

## Merge commits

Every pull request merges with a merge commit, never a squash or a rebase, and every merge commit
has the same shape: the pull request's title and number as the subject, and its issues in the
body. Commits on a branch follow [CONTRIBUTING.md](CONTRIBUTING.md#commit-messages).

| Into | Subject | Body |
|---|---|---|
| `development`, a pull request | `<its title> (#123)` | Its issues, as in its description: `Resolves #45`, `Related to #46`, `Opens #47` |
| `main`, a release | `Release X.Y.Z (#124)` | One `Shipped: #N` line per issue, as in its description |
| `main`, a hotfix | `Hotfix X.Y.Z (#125)` | `Resolves #48`, the issue it fixes |
| `development`, from `main` | `Merge main into development after X.Y.Z` | None: needed only when a fast-forward isn't possible |

The release's prep commit on `development` is `Release prep X.Y.Z`.

The repository's settings (Settings, General, Pull Requests) allow merge commits only, with
**Pull request title** as the default message: GitHub fills in the subject, and the maintainer
adds the body's issue lines before confirming the merge. From the command line:

```sh
gh pr merge 123 --merge --subject "<its title> (#123)" --body "Resolves #45"
```

## Release steps (maintainers)

Maintainers release from a clone of the lab itself, not a fork: in these steps and the hotfix
below, `origin` is the lab.

1. **Decide the version** from what is under `[Unreleased]`, using the rules above.
2. **Prepare on `development`.** One prep commit moves `[Unreleased]` to `## [X.Y.Z] — YYYY-MM-DD`
   and updates the mirrors (`package.json`, the lockfile root, the README's Release line).
   An agent may draft this commit's changes.
3. **Open a pull request from `development` to `main`** titled `Release X.Y.Z`. Its description
   lists the issues it ships, one per line (`Shipped: #N`): each closed as completed when its
   pull request merged into `development`. Wait for the DCO and build checks to pass, then
   merge it **with a merge commit**, never a squash or rebase: `Release X.Y.Z (#N)`, with its
   `Shipped:` lines ([Merge commits](#merge-commits)).
4. **Tag the merge commit:**
   ```sh
   git fetch origin && git tag -a vX.Y.Z origin/main -m "Release X.Y.Z" && git push origin vX.Y.Z
   ```
5. **Deploy from `main`, then switch back to `development`.** This publishes to
   https://lab.morpheustech.net at once:
   ```sh
   git switch main && git pull && npm ci && npm run deploy; git switch development
   ```
   The `;` switches back even if the deploy fails; to retry, run the whole line again.
6. **Bring `development` up to `main`:**
   ```sh
   git switch development && git merge --ff-only main && git push
   ```
   If the fast-forward is refused, something landed on `development` during the release; merge
   `main` into `development` instead, as `Merge main into development after X.Y.Z`.
7. Optionally, **publish a GitHub Release** from the tag, with that version's changelog section.

## Hotfix

For a fix that cannot wait for the next release from `development`:

1. Branch `hotfix/X.Y.Z` from the tag being fixed, e.g. `git switch -c hotfix/1.5.1 v1.5.0`.
2. Make the fix, bump the mirrors and add a `## [X.Y.Z] — YYYY-MM-DD` changelog section.
3. Open a pull request from `hotfix/X.Y.Z` to `main` titled `Hotfix X.Y.Z`, and merge it with a
   merge commit: `Hotfix X.Y.Z (#N)` ([Merge commits](#merge-commits)).
4. Tag and deploy as in steps 4 and 5 above.
5. Merge `main` back into `development`, as `Merge main into development after X.Y.Z`, so the
   fix and its changelog entry are not lost.

## A pull request against `main` (maintainers)

A pull request opened against `main` that is not a release or a hotfix is retargeted, not
closed: a maintainer changes its base to `development` (**Edit**, next to the title → base).

## Agents

Agents edit files only. Maintainers commit, merge, tag and deploy. A deploy is a public release.
