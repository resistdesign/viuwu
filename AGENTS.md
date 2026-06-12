# Viuwu Agent Guide

## Mission

Viuwu is an Expo React Native Android TV app and companion site that turns saved video
searches into user-owned channels. Protect the anti-algorithm product premise: people choose
the subjects, providers, order, and cadence of their guide.

## Session Start Checklist

Every session begins with:

1. Read `AGENTS.md`.
2. Read `docs/progress.md`.
3. Read `docs/decisions.md`.
4. Run `git status`.
5. Confirm the current branch.
6. Review open tasks in `docs/progress.md` and the active PR.
7. State intended work before changing files.

## Repository Workflow

- `main` must remain releasable.
- Work on a focused branch. Prefer `feat/<topic>`, `fix/<topic>`, or `chore/<topic>`.
- Do not force-push shared branches or rewrite published history.
- Never discard worktree changes you did not create. Understand and preserve them.
- Pull with `--ff-only` unless a deliberate rebase is required.
- Use Conventional Commit subjects such as `feat: add channel editor`.

## Pull Requests

- Keep PRs coherent and explain product impact, implementation, and validation.
- Require CI before merge. Use squash merge unless preserving commits has a clear benefit.
- Include screenshots or recordings for meaningful UI changes.
- Resolve review threads only after the requested behavior is implemented and verified.

## Task, Progress, And Decisions

- `docs/progress.md` is the cross-session source of truth for status, active work, next work,
  blockers, and handoff notes.
- Update progress when a milestone changes, not for every small edit.
- Record durable architecture or product choices in `docs/decisions.md` with the date,
  decision, rationale, and consequences.
- Keep `README.md` commands accurate whenever tooling changes.

## Context Recovery

When context is incomplete, recover from git history, the active PR, `docs/progress.md`, and
`docs/decisions.md`. Inspect package scripts and nearby code before introducing a new pattern.
Do not assume an uncommitted file is disposable.

## Engineering Rules

- Keep the domain explicitly YouTube-focused. Video identifiers and API behavior may be
  YouTube-specific.
- Treat TV focus behavior, ten-foot readability, and remote navigation as primary UX.
- Reuse `@viuwu/brand` tokens and `@viuwu/core` entities across surfaces.
- Prefer narrow components and explicit data flow over framework-heavy abstraction.
- Add tests in proportion to behavioral risk.
- Do not commit generated native Expo folders unless a release workflow requires them.

## Session End Checklist

Before ending a session:

1. Run formatting.
2. Run linting.
3. Run type checks.
4. Run tests and builds where available.
5. Update `docs/progress.md`.
6. Update `docs/decisions.md` if architecture changed.
7. Review and summarize changed files.
8. Commit coherent work only.
9. Push the branch.
10. Open or update the PR when appropriate.
