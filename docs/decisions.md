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

## 2026-06-09: Provider-Neutral Core

Normalize provider results behind a `VideoProvider` contract. No vendor SDK or vendor-specific
identifier is allowed to become the guide's primary model.

## 2026-06-09: Static GitHub Pages Site

Use Vite to build a static site deployed by GitHub Actions. The site needs polished interaction and
metadata, not a server runtime.
