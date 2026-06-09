# Viuwu Codex Bootstrap Plan

## Goal

Create a production-quality repo for **Viuwu**, an Expo React Native Android TV app with a GitHub Pages landing site.

Viuwu replaces algorithm-driven video browsing with a user-controlled guide where saved searches become channels.

Brand:

* Name: **Viuwu**
* Slogan: **Do you. Viuwu.**
* Vibe: playful, new-school, cute-chaotic, anti-algorithm, polished
* Visual direction: organic hand-drawn wordmark, black and purple palette, pro graphics
* Quality reference:

  * Site: https://ittsy.resist.design/
  * Repo: https://github.com/resistdesign/ittsy

## Codex Mission

Codex should handle the full project bootstrap end-to-end:

* create local repo
* create remote GitHub repo with `gh`
* set up branch workflow
* create project structure
* build the Expo Android TV app
* build the landing site
* add branding assets/placeholders
* configure CI
* configure GitHub Pages
* create documentation
* create a PR

Work like a senior engineer starting a serious product repo.

## Repository

Repo name:

`viuwu`

Preferred first branch:

`chore/bootstrap-viuwu`

Set up:

* local git repo
* GitHub remote
* `main` branch
* PR-required workflow where possible
* branch protection if possible with `gh` or GitHub API
* GitHub Actions CI
* GitHub Pages deployment
* CNAME support
* docs for any manual GitHub setup that cannot be automated

## Proposed Structure

```text
/
  AGENTS.md
  README.md
  package.json
  apps/
    tv/
      # Expo React Native Android TV app
    site/
      # GitHub Pages landing site
  packages/
    brand/
      # shared colors, typography, logo assets, icon assets
    core/
      # saved-search/channel domain model
  docs/
    architecture.md
    product.md
    github-setup.md
    progress.md
    decisions.md
```

## AGENTS.md Requirements

Create a serious `AGENTS.md` focused on cross-session recoverability.

It must define:

* project mission
* repo workflow
* branch rules
* commit style
* PR expectations
* task tracking rules
* progress tracking rules
* decision logging rules
* context recovery rules
* safe git behavior
* how agents inspect repo state before acting
* how agents avoid destructive changes
* how documentation stays current

### Required Session Start Checklist

Every agent session must begin by doing this:

1. Read `AGENTS.md`
2. Read `docs/progress.md`
3. Read `docs/decisions.md`
4. Run `git status`
5. Confirm current branch
6. Review open tasks
7. State intended work before changing files

### Required Session End Checklist

Every agent session must end by doing this:

1. Run formatting
2. Run linting
3. Run type checks
4. Run tests/builds where available
5. Update `docs/progress.md`
6. Update `docs/decisions.md` if architectural choices changed
7. Summarize changed files
8. Commit coherent work only
9. Push branch
10. Open or update PR when appropriate

## Product Model

Core idea:

A saved search is a user-owned channel.

Initial domain entities should include:

* `SavedSearch`
* `SearchChannel`
* `VideoItem`
* `VideoProvider`
* `GuideRow`
* `UserGuide`

Do not hard-couple the architecture to YouTube.

YouTube can be the first provider, but the provider model should allow additional sources later.

Mock data is acceptable for the first milestone.

## Android TV App

Use Expo React Native targeting Android TV.

Build:

* TV-first navigation
* D-pad / remote-friendly focus states
* home guide screen
* rows of saved-search channels
* video cards
* search/channel management screen
* settings screen
* splash screen
* app icon
* brand assets
* clean app architecture

Priorities:

* readable from 10 feet away
* strong focus states
* fast perceived performance
* simple information architecture
* clean component boundaries
* no generic template feel

## Landing Site

Create a GitHub Pages-ready landing site.

The site should include:

* Viuwu logo
* slogan: **Do you. Viuwu.**
* concise hero copy
* explanation of saved searches as channels
* polished visual layout
* icons
* Open Graph image
* favicon
* CNAME support
* GitHub Pages deploy workflow

Design quality should match the polish of the ittsy site:

* strong typography
* clean spacing
* polished dark theme is acceptable
* memorable hero
* professional graphics
* no generic SaaS template feel

## Branding Assets

Create initial brand assets:

* logo source files if practical
* app icon
* site favicon
* splash screen
* Open Graph image
* shared color tokens
* typography guidance

Brand direction:

* organic hand-drawn wordmark feel
* black and purple palette
* playful but professional
* not corporate
* not YouTube red
* no slogan inside the logo

If final production assets cannot be generated directly, create high-quality placeholders and document what needs manual replacement.

## CI and Quality

Set up:

* formatting
* linting
* type checking
* tests if appropriate
* site build check
* app build/check where practical
* GitHub Actions workflow
* PR-ready checks

Do not over-engineer, but make the repo professional from day one.

## Documentation

Create:

* `README.md`
* `docs/product.md`
* `docs/architecture.md`
* `docs/progress.md`
* `docs/decisions.md`
* `docs/github-setup.md`

### README

Should explain:

* what Viuwu is
* how to install
* how to run the TV app
* how to run the site
* how to build
* repo structure
* contribution workflow

### Product Doc

Should explain:

* saved searches as channels
* anti-algorithm positioning
* TV guide metaphor
* user control philosophy
* first milestone UX
* future provider expansion

### Architecture Doc

Should explain:

* monorepo structure
* app/site/package boundaries
* domain model
* provider abstraction
* branding package
* CI/deployment flow

### Progress Doc

Should include:

* current status
* completed work
* active tasks
* next tasks
* known blockers
* handoff notes

### Decisions Doc

Should include dated architecture decisions, including:

* Expo React Native for Android TV
* monorepo layout
* saved-search/channel domain model
* provider abstraction
* GitHub Pages site deployment

### GitHub Setup Doc

Should include:

* repo settings
* branch protection setup
* required PR checks
* GitHub Pages setup
* CNAME setup
* any manual steps Codex could not automate

## First Milestone Definition of Done

The first milestone is complete when:

* repo exists locally and remotely
* project structure exists
* Expo Android TV app runs with branded mock UI
* landing site builds
* GitHub Pages workflow exists
* CNAME support exists
* brand placeholders/assets exist
* `AGENTS.md` is complete
* docs are complete enough for future agents
* CI exists
* branch/PR flow is documented or configured
* work is pushed to GitHub in a PR

## Final Codex Instructions

Start by creating a clear implementation plan.

Then execute the plan.

Use `git` and `gh` CLIs where useful.

Keep work coherent and reviewable.

Do not commit broken builds unless clearly documented as an intentional checkpoint.

At the end, provide:

* repo URL
* branch name
* PR URL
* completed work summary
* test/build results
* manual follow-ups
