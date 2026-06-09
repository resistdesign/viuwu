# Progress

## Current Status

First milestone implementation is complete on `chore/bootstrap-viuwu` and ready for review.

## Completed

- Product brief and editable source brand assets captured on `main`.
- Public GitHub repository created.
- Monorepo architecture and working agreement defined.
- Shared provider-neutral domain package and brand tokens implemented.
- Landing site and TV app source implemented.
- CI, GitHub Pages workflow, Pages environment, and `main` branch protection configured.
- Production domain `viuwu.resist.design` configured with a committed deployment `CNAME` and HTTPS.
- Formatting, linting, type checks, core tests, site build, responsive browser review, and Android
  TV native prebuild completed.

## Active

- Review the bootstrap pull request.

## Next

- Connect the first live video provider.
- Add persisted channel management.
- Add playback and provider authentication.
- Validate focus behavior on a physical Android TV device.

## Known Blockers

- Physical-device validation requires Android TV hardware or an emulator.
- Expo Doctor reports the core `react-native` package nested under
  `@react-native-tvos/virtualized-lists`; Android TV prebuild succeeds and this is tracked as an
  upstream TV-fork packaging warning.

## Handoff

Start with `AGENTS.md`, then inspect this file, `docs/decisions.md`, the current branch, and the
active pull request.
