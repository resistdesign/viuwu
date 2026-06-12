# Android TV Releases

## Release Status

GitHub releases publish a signed Android TV APK. First launch requires YouTube authorization.
Preview guide rows still use fixtures and do not yet play videos.

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
- `VIUWU_YOUTUBE_TV_CLIENT_ID`

The key must be backed up permanently. Losing it prevents future APKs from upgrading installed
copies.

## YouTube Credentials

Create an OAuth 2.0 client in Google Cloud with application type **TVs and Limited Input devices**.
Store that client ID in the GitHub Actions secret `VIUWU_YOUTUBE_TV_CLIENT_ID`. The workflow exposes
it to Expo as `EXPO_PUBLIC_YOUTUBE_TV_CLIENT_ID`; OAuth client IDs are application identifiers, not
client secrets. Never add a Google OAuth client secret to the app.

The app requests read-only YouTube access and stores access and refresh tokens with Expo Secure
Store. Live search may use the OAuth access token with the YouTube Data API; an API key alone cannot
connect a user's account.

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
