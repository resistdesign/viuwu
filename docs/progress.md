# Progress

## Current Status

YouTube-only first-launch authorization is in active development.

## Completed

- Product brief and editable source brand assets captured on `main`.
- Public GitHub repository created.
- Monorepo architecture and working agreement defined.
- Shared YouTube guide domain package and brand tokens implemented.
- Landing site and TV app source implemented.
- CI, GitHub Pages workflow, Pages environment, and `main` branch protection configured.
- Production domain `viuwu.resist.design` configured with a committed deployment `CNAME` and HTTPS.
- Landing site deployed successfully at `https://viuwu.resist.design/`; HTTP redirects to HTTPS.
- Formatting, linting, type checks, core tests, site build, responsive browser review, and Android
  TV native prebuild completed.
- Preview APK built, installed, launched, and visually verified on a Philips 4K Android 11 TV at
  `192.168.1.170`.
- YouTube-only first-launch gate, secure token storage, refresh, and disconnect behavior
  implemented.
- Signed `0.1.1` APK built and installed on the physical TV; missing-credential gate visually
  verified at 1920x1080.

## Active

- Configure the Google OAuth client ID for release builds and validate a successful account
  connection.

## Next

- Connect live YouTube search results.
- Add persisted channel management.
- Add YouTube playback.
- Validate focus behavior on a physical Android TV device.

## Known Blockers

- Successful authorization validation requires a Google OAuth client configured for TVs and Limited
  Input devices.
- Expo Doctor reports the core `react-native` package nested under
  `@react-native-tvos/virtualized-lists`; Android TV prebuild succeeds and this is tracked as an
  upstream TV-fork packaging warning.

## Handoff

Start with `AGENTS.md`, then inspect this file, `docs/decisions.md`, the current branch, and the
active pull request.
