# Android TV Releases

## Release Status

GitHub releases publish a signed Android TV APK. Preview releases use mock guide data and do not
yet call YouTube or play videos.

## Versioning

- `expo.version` is the user-facing Android `versionName`.
- `expo.android.versionCode` must increase for every APK that may be installed as an upgrade.
- Git tags use SemVer. Preview tags use a suffix such as `v0.1.0-preview.1`.

Update both values before creating a release tag.

## Release Process

1. Merge the intended release commit into `main`.
2. Run `npm run check`.
3. Confirm Android TV prebuild and a local preview build.
4. Update `apps/tv/app.json` version and Android version code.
5. Create and push an annotated `v*` tag.
6. The `Release Android TV` workflow regenerates the native project, restores the signing key from
   GitHub Actions secrets, builds the release APK, rejects debug signatures, writes a SHA-256
   checksum, and creates a GitHub prerelease.
7. Install the APK on a physical TV and verify launch, focus, and navigation.

The workflow can be rerun manually for an existing tag. It will not release an untagged commit.

## Signing

The release key is not committed. GitHub Actions requires:

- `VIUWU_ANDROID_KEYSTORE_BASE64`
- `VIUWU_ANDROID_STORE_PASSWORD`
- `VIUWU_ANDROID_KEY_ALIAS`
- `VIUWU_ANDROID_KEY_PASSWORD`

The key must be backed up permanently. Losing it prevents future APKs from upgrading installed
copies.

## YouTube Credentials

The current preview uses fixtures and needs no API key.

A live public-search adapter will require a YouTube Data API v3 key. The key will be present in the
APK, so it must be restricted in Google Cloud to the Android package `design.resist.viuwu`, the
production signing certificate SHA-1, and only the required YouTube API. User account data,
subscriptions, and private history require OAuth rather than an API key.

Do not commit credentials or place an unrestricted key in Expo public configuration.

## Physical TV Installation

For legacy network debugging:

```bash
adb connect 192.168.1.170:5555
adb install -r viuwu-v0.1.0-preview.1-android-tv.apk
adb shell monkey -p design.resist.viuwu -c android.intent.category.LEANBACK_LAUNCHER 1
```

The TV must have Developer Options and network debugging enabled. The first connection requires
accepting the RSA prompt on the TV. Newer Android TV versions may require `adb pair` with the
pairing port shown under Wireless debugging before `adb connect`.
