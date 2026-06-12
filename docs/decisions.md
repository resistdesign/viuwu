# Decisions

## 2026-06-09: Expo React Native For TV

Use Expo SDK 56 with `react-native-tvos` and the TV config plugin. This follows Expo's supported TV
path while retaining continuous native generation and Android TV focus primitives.

## 2026-06-09: npm Workspace Monorepo

Keep both applications and shared packages in one npm workspace. A single lockfile and quality
command reduce bootstrap overhead while package boundaries preserve ownership.

## 2026-06-09: Saved Searches Are Channels

Model the user's saved query separately from its guide presentation. This allows a search to be
paused, reordered, renamed, or reused without changing its semantic intent.

## 2026-06-11: YouTube-Only Product

Build Viuwu specifically for YouTube. Remove the multi-provider abstraction and require YouTube
device authorization before the TV app can be used. The guide remains organized around the user's
saved searches, while video identifiers and API behavior may be YouTube-specific.

## 2026-06-09: Static GitHub Pages Site

Use Vite to build a static site deployed by GitHub Actions. The site needs polished interaction and
metadata, not a server runtime.

## 2026-06-09: Production Pages Domain

Serve the site from `https://viuwu.resist.design/`. Build Vite assets from `/`, commit the uppercase
`CNAME` in the public directory, verify it in CI before upload, and enforce HTTPS through GitHub
Pages. GitHub Actions does not require the file, but retaining it makes the intended domain explicit
in both source and deployment artifacts.

## 2026-06-11: Signed Tag-Driven Android Releases

Generate Android from Expo configuration for every `v*` tag, sign with a dedicated repository
secret, reject debug certificates, and publish the APK plus SHA-256 checksum as a GitHub release.
Early preview releases remained limited until live YouTube search and playback were complete;
production tags publish as normal releases.

## 2026-06-12: Live YouTube Guide And Native Playback

Persist only user-created search channels; never seed production with fixture rows. Load current
results through authenticated YouTube Data API calls and cache them for 15 minutes to control
quota. Launch selected videos explicitly in the YouTube TV package, with a standard watch URL as
the fallback when YouTube is unavailable.
