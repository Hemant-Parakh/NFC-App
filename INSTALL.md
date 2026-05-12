# Install TapDeck on your Pixel 10 Pro

TapDeck runs as a **self-contained Android app**. The whole web app is bundled inside the APK, so once installed there's no server, no internet connection, no accounts — everything works fully offline on your phone. All your decks are stored locally.

There are three install paths. Pick whichever is easiest for you.

---

## Path A — Download the prebuilt APK (no developer tools needed) ✅

This is the easiest. GitHub Actions builds an APK automatically every time the repo is updated.

### Steps

1. Open the repository on GitHub → **Releases** tab → grab the latest `TapDeck-debug.apk`.
   - Or: **Actions** tab → click the most recent successful build → scroll to **Artifacts** → download `TapDeck-debug-apk.zip` → unzip it.
2. Transfer the APK to your Pixel 10 Pro (USB cable, Google Drive, email, AirDrop-equivalent — anything works).
3. On your Pixel, tap the APK file.
4. Android will ask you to enable **"Install unknown apps"** for the app you're opening it from (Files, Drive, Chrome, etc.). Tap **Settings** → enable the toggle → go back.
5. Tap **Install**. Done — TapDeck is now a real installed app with its own icon.

No Play Store account, no hosting, no developer setup needed.

---

## Path B — Build the APK locally (Android Studio)

If you want to modify the app and build your own APK.

### Prerequisites
- Node.js 20+
- Android Studio (download from developer.android.com/studio) — it bundles the Android SDK
- Java 17 (Android Studio brings its own copy)

### Steps

```bash
git clone <repo-url>
cd NFC-App
npm install
npm run build
npx cap sync android
npm run android:open       # opens Android Studio
```

In Android Studio:
1. Wait for Gradle sync to finish (first time only — takes a few minutes).
2. Plug your Pixel in via USB. Enable Developer Options → USB Debugging on your phone if you haven't already (Settings → About phone → tap Build number 7 times → Developer options → enable USB debugging).
3. Click ▶ **Run** → pick your Pixel → app installs and launches.

To build a standalone APK without USB:
- **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)** → wait → click **locate** in the toast → grab the APK file → copy to phone → install.

---

## Path C — Build the APK locally without Android Studio (CLI only)

Faster than Path B if you've already got the Android SDK installed (e.g. via `apt install android-sdk` or the command-line tools).

```bash
export ANDROID_SDK_ROOT=/path/to/android-sdk
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
# APK appears at android/app/build/outputs/apk/debug/app-debug.apk
```

Then transfer that APK to your phone and install as in Path A step 3–5.

---

## What you get

Once installed:
- Real Android app with its own icon (stacked-cards design)
- Adaptive icon — works correctly with Material You theming on Pixel
- Full-screen launch (no browser chrome)
- App shortcuts: long-press the home icon for "New deck" / "All decks"
- All data stored locally on the device — no accounts, no sync, no tracking
- Works completely offline

## Updating

Every time the repo is updated, a fresh `TapDeck-debug.apk` shows up on the Releases page. Just download and install over the existing app — your data is preserved.

## Troubleshooting

**"App not installed" error**
- Make sure you uninstalled any previous version first if you switched signing keys.
- Check Settings → Apps → Special access → Install unknown apps → enable for your browser/Files app.

**Icon looks like a generic Android one**
- Force-restart launcher (clear cache for "Pixel Launcher") or reboot the phone. The first time the adaptive icon takes a few seconds to register.

**App won't open / shows blank screen**
- This shouldn't happen, but if it does, uninstall + reinstall. Web assets are bundled in the APK, so there's nothing to debug network-wise.
