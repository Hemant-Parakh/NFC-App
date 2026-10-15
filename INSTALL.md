# Install TapDeck on your Pixel

TapDeck is a self-contained Android app. The whole web app is bundled inside the APK, so there's no server and no account, and all decks stay on your phone. The only network request it makes is a check for new versions of itself, sent to this repository's GitHub Releases.

---

## First install

1. Open this repo's **Releases** page and download `TapDeck.apk` from the latest release.
2. On your Pixel, tap the file. If Android asks, allow **Install unknown apps** for the app you opened it from (Files, Chrome, Drive…).
3. Tap **Install**.

> Builds from before v1.2 were signed with a throwaway key, so Android can't update them. Uninstall that old TapDeck once before installing this one. After that, every update installs over the top and keeps your decks.

## Updates

TapDeck checks for a new release when you open it (at most every 3 hours).

1. An **Update available** card appears on Home, showing what's new. **Settings → App updates** also has a manual "Check for updates" button.
2. Tap **Update now**. The first time, Android asks you to allow TapDeck to install apps; turn it on, come back and tap Update again.
3. The APK downloads inside the app, then Android shows **Update TapDeck?**. Tap **Update**.

Android always asks for that one confirmation for sideloaded apps; there's no way to skip it. Your profiles and decks are kept.

"Later" hides the card until a newer version comes out.

---

## How releases are made

Every push runs `.github/workflows/build-apk.yml`:

- The version is `1.2.<run number>`, so each build is newer than the last.
- The APK is signed with `android/app/tapdeck-release.p12`. That key file is locked with a password stored only in the **`TAPDECK_KEYSTORE_PASSWORD`** repository secret. Without the password, the file is useless.
- Pushes to the repo's **default branch** publish a GitHub Release (`v1.2.N`, notes taken from the commit message). The app updates from that release.

### One-time setup: the signing secret

GitHub → this repo → **Settings → Secrets and variables → Actions → New repository secret**

- Name: `TAPDECK_KEYSTORE_PASSWORD`
- Value: the password you were given when the key was created

Keep a copy of the password somewhere safe, such as a password manager. If it's lost, a new key has to be made, and you'd need to uninstall and reinstall TapDeck once.

---

## Build locally (optional)

```bash
npm install
npm run build
npx cap sync android
npm run android:open      # Android Studio → Run
```

For an APK that can update your installed app, sign it with the same key:

```bash
export TAPDECK_KEYSTORE_PASSWORD=...   # same as the GitHub secret
export TAPDECK_VERSION_CODE=9999 TAPDECK_VERSION_NAME=1.2.9999
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

**"App not installed as package conflicts with an existing package"**: the installed copy was signed with a different key (any build before v1.2). Uninstall it once, then install the latest release.

**The Update button opens a settings screen**: that's Android's one-time "Allow from this source" permission for TapDeck. Turn it on and go back.

**No update card appears**: open Settings → App updates → Check for updates. The check needs an internet connection; everything else works offline.
