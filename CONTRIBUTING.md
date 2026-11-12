# Contributing to Morpheus Tech Lab

Thanks for helping build the lab. New automata, simulators, fixes and docs are all welcome.
Work starts from an issue that is **ready**, so start there.

Everyone taking part in the project, in issues, Discussions, pull requests and anywhere else,
follows the [code of conduct](CODE_OF_CONDUCT.md).

## Find something to work on

- **[Work to pick up](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues?q=is%3Aissue%20is%3Aopen%20label%3Aready)**:
  open issues labelled `ready`, each sized for one pull request.
- **[The board](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/issues?q=is%3Aissue%20is%3Aopen%20no%3Aparent-issue)**:
  every open issue except the pieces of a plan, which show inside their plan instead.

The [roadmap](ROADMAP.md) says where the lab is heading. Questions go to
[Discussions](https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab/discussions).

To suggest something new, open an issue with the Idea or Bug report form: say what it is and
why, nothing more. It starts as an idea, and goes through the stages below.

## How an issue moves

Every issue goes through the same stages:

**Idea → Planning → Ready → In progress → Completed or Cancelled**

While an issue is open, exactly one label says its stage. Closing it removes that label: from
then on, GitHub's close reason says how it ended, so a closed issue has no stage label. Its type
says what kind it is: a **Feature**, a **Bug**, or a **Task** (one piece of a plan).

| Stage | How an issue gets there | What it means |
|---|---|---|
| **Idea** (`idea`) | Anyone files it with the Idea or Bug report form | A suggestion: what and why. Nothing is promised |
| **Planning** (`planning`) | A maintainer accepts the idea, with the comment `Accepted for planning.` | Its plan is written into the issue, [as below](#planning) |
| **Ready** (`ready`) | A maintainer accepts the plan, with the comment `Ready. Done when: …` | Anyone can claim it. That comment is what the pull request is reviewed against, even if the issue is edited later |
| **In progress** (`in progress`) | Someone claims it, [as below](#claim-it), and a maintainer changes the label and assigns them | Someone is working on it: its assignee |
| **Completed** (closed as completed, no label) | A maintainer closes it when its pull request merges into `development`, and removes its stage label | Done. The changelog says when it goes live |
| **Cancelled** (closed as not planned, no label) | A maintainer closes it at any stage, removes its stage label, and says why in one line | It won't happen. A duplicate is closed as a duplicate, with a link |

Only maintainers can add labels, assign people and close issues, so a contributor can't move
their own issue along. Some issues skip a stage, and some go back one:

- **A plan small enough to settle on the spot** goes straight from idea to ready. That is the
  usual case for a bug: once someone has reproduced it, its plan is its expected behaviour.
- **A lapsed claim** sends an issue back to ready. **A change of direction** sends it back to
  planning, with a comment saying why, so anyone with a claim or a pull request sees it. Either
  way, its assignees are removed.

**Assignees** show who is building an issue, and nothing else: an issue has one only while it is
in progress, from the claim until it closes. A closed issue keeps its assignee, as a record of
who did it. An idea, a plan being written and a ready issue have none, so "ready, no assignee"
always means free to pick up; someone drafting a plan says so in a comment. A plan with pieces
is never assigned, as it is never claimed: its pieces are.

### Moving an issue

For maintainers. Each move changes the label and leaves a comment, so the issue's history says
when and why it moved:

| Move | Label | Comment |
|---|---|---|
| Accept an idea | `idea` → `planning` | `Accepted for planning.` |
| Accept the plan | `planning` (or `idea`) → `ready` | `Ready. Done when:` and the final Done when |
| Mark a claim | `ready` → `in progress`, and assign the claimant | The claim itself is the comment |
| Lapse a claim | `in progress` → `ready`, and remove the assignee | One line saying the claim lapsed |
| Send it back to planning | its stage label → `planning`, and remove any assignee | One line saying why |
| Complete it | remove `in progress`, close as completed | `Completed: merged into development in #N.` |
| Cancel it | remove its stage label, close as not planned | One line saying why |
| Close a duplicate | remove its stage label, close as a duplicate | `Duplicate of #N.` |

With the GitHub CLI, marking a claim on issue 54 by `octocat`, then completing it after pull
request 55 merges, looks like this:

```sh
gh issue edit 54 --remove-label ready --add-label "in progress" --add-assignee octocat

gh issue close 54 --reason completed --comment "Completed: merged into development in #55." \
  && gh issue edit 54 --remove-label "in progress"
```

### Accepting an idea

A maintainer reads each new idea and bug report, and does one of these:

- **Accept it** into planning, or straight to ready.
- **Ask.** They comment with what is missing or unclear. Revise the issue, and they decide
  again.
- **Cancel it.** They close it as not planned, or as a duplicate with a link, and say why in one
  line.

An idea is accepted when:

- **It fits the lab:** a demo or feature that runs in the browser as a static site, with no
  backend or framework, written as original work with no code or internals from other
  projects or products.
- **It fits the direction:** it is on the [roadmap](ROADMAP.md), or a maintainer wants it there.
- **A visitor's browser can afford it:** it doesn't push memory or the frame rate past what a
  visitor's tab can handle.

A bug is accepted once someone has reproduced it.

### Planning

The plan is written into the issue, below the idea, as a `## Plan` section, by the person who
suggested it, a maintainer, or whoever wants to build it. It goes into the issue first: a plan
drafted elsewhere is moved into the issue before anyone asks for the issue to be accepted. It
settles:

- **The design:** how it will work, and the choices behind it.
- **The Done when:** what a visitor can do once it ships, and what must still hold, until a
  reviewer could check it by using the lab. For a bug, it is usually the expected behaviour.
  The plan ends with it, as a proposal, and it replaces any Done when the idea had.
- **The pieces,** if it is too big for one pull request: a list in the plan, each with its own
  Done when. They stay a list, not issues, until the plan is accepted.

A maintainer reads the plan in the issue, and accepts it when its Done when is checkable and it
fits in one pull request, or splits into pieces that each do. They add the `ready` label and
comment `Ready. Done when: …` with the final text. That comment freezes the Done when: if the
issue is edited later, the pull request is still reviewed against the comment.

**A plan with pieces.** When it is accepted, each piece becomes a sub-issue of the plan (type
Task, labelled `ready`), so the plan shows their progress, and the board shows only the plan.
The plan itself is never claimed: it moves to in progress when its first piece is claimed, and
closes as completed once its last piece does.

### Claim it

Before you start on a ready issue, comment on it, in this form:

```
Working on this.
Ready for review by: YYYY-MM-DD
Confidence: N/10
```

- The date is when your pull request will be ready for review.
- The confidence runs from 0 to 10: 10 means you are sure to be ready by that date, 0 that you
  have no idea whether you will be.
- A claim without both a date and a confidence counts as no date and no certainty.
- Post a new date and confidence whenever your estimate changes. The latest one counts.
- If the date passes with neither an update nor a pull request, the claim lapses.
- An agent's claim uses the same form, and the person running the agent answers for the
  estimate.

A maintainer then moves the issue to in progress and assigns you. You can't assign yourself
without triage access to the repository, but your claim comment is what lets a maintainer assign
you. Claims don't lock an issue. Others may start in parallel, each assigned once they claim it,
and if two pull requests arrive, the maintainer picks one. A claim's date and
confidence show how firm it is, so others can decide whether to start too.

Then build it and open the pull request, [as below](#make-a-change). You, or your agent, can go
from a ready issue to a pull request without waiting on anyone. The pull request's "What
changed" says how you did it, and it is reviewed together with the code.

Every pull request resolves a ready or in-progress issue. The one exception is a small fix, such
as a typo or a broken link, which can come without an issue.

## Report a vulnerability

Never in a public issue. Report it privately, as [SECURITY.md](SECURITY.md) says.

## Set up

Requires Node.js 20.19 or newer.

You work from a fork. Fork the lab on GitHub, clone your fork, and add the lab as `upstream`:

```sh
git clone https://github.com/<your-username>/morpheus-tech-lab.git
cd morpheus-tech-lab
git remote add upstream https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab.git
```

`origin` is your fork, where you push; `upstream` is the lab, where your branches start. Then:

```sh
npm ci          # install exactly what package-lock.json pins
npm run dev     # dev server at http://localhost:5180
npm run build   # production build to dist/; run it before you open a pull request
npm test        # the automated tests; run them before you open a pull request too
```

The automated tests cover the unbounded engine (`src/unbounded/`) only, so also check your change
in the browser, in each mode it touches.

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

One issue, one pull request: a pull request resolves exactly one issue, all of it. If an issue
turns out too big for one pull request, say so on it, and it goes back to planning to be split
into pieces.

1. Branch from the lab's `development`:
   ```sh
   git fetch upstream && git switch --no-track -c my-change upstream/development
   ```
2. Make your change. Read [AGENTS.md](AGENTS.md) for the code layout, patterns and invariants,
   and [ARCHITECTURE.md](ARCHITECTURE.md) for how the pieces fit.
3. Add a line under `## [Unreleased]` in [CHANGELOG.md](CHANGELOG.md) saying what changed, for
   a reader of the release notes.
4. Run `npm run build` and `npm test`, commit with `git commit -s` (below), writing the message
   as [Commit messages](#commit-messages) says, and push the branch to your fork:
   `git push -u origin my-change`.
5. Open a pull request from your fork's branch against **`development`**, never `main`, and
   fill in the template. Its title is your main commit's subject: it becomes the subject of the
   merge commit. List each issue, one per line, with how the pull request relates to
   it, using only these: `Resolves #123` for the one issue it does in full, `Related to #124`
   for an issue it touches but doesn't work on, and `Opens #125` for a follow-up issue you
   opened. GitHub doesn't act on these in a pull request into `development`: the maintainer
   who merges it closes the issue marked `Resolves` and removes its stage label.

### Keep your branch current

When `development` moves on, rebase your branch onto it and update your pull request:

```sh
git fetch upstream && git rebase upstream/development
git push --force-with-lease
```

`--force-with-lease` refuses to overwrite commits on your fork that you haven't fetched.

## Commit messages

Every commit message has the same shape, so `git log` on `development` or `main` reads as a list
of what changed and why.

- **The subject** says what the change does, as a plain sentence: capitalised, no full stop, and
  at most **65 characters**, so that the ` (#123)` the merge adds still fits in 72. Put an area
  first only when it helps, as in `Explore: preset seeds`. No type prefixes such as `feat:`.
- **The body**, after a blank line and wrapped at 72 characters, says what changed and why, for
  someone reading the history later. How the code works belongs in the code.
- **The trailers** come last: `Signed-off-by`, which `git commit -s` adds and every commit needs
  ([below](#sign-off-your-commits-dco)), and `Co-Authored-By` for each co-author, an AI assistant
  included.

```
Explore: preset seeds, Cube10 and Spreading noise

Explore's Seed section offers two ready-made seeds beside the shapes
and seed files. Choosing one replaces the shape and rules, as a seed
file does, so a visitor can compare a dense pattern with a chaotic
one without making a file.

Signed-off-by: Your Name <you@example.com>
```

**The merge commit.** A maintainer merges every pull request into `development` with a merge
commit, never a squash or a rebase. Its subject is the pull request's title and number, and its
body lists the pull request's issues as its description does:

```
Explore: preset seeds, Cube10 and Spreading noise (#63)

Resolves #58
```

Releases and hotfixes merge into `main` the same way ([RELEASING.md](RELEASING.md#merge-commits)).

## What happens next

1. The `build` (`npm ci`, `npm run build` and `npm test`) and `DCO` (below) checks run. On a first-time
   contributor's pull request, they wait until a maintainer approves them. Both must pass
   before it can merge.
2. A maintainer reviews it. Push any changes they ask for to the same branch. Then they merge
   it into `development` with a merge commit, [as above](#commit-messages), close the issue it
   marks `Resolves` as completed, and remove its stage label.
3. The change goes live at the next release.

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
made, run `git fetch upstream && git rebase --signoff upstream/development`, then
`git push --force-with-lease`.

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
