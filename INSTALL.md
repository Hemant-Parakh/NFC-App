# Install TapDeck on your Pixel 10 Pro

There are **two ways** to install TapDeck on Android. Pick whichever fits.

---

## Option 1 — Install as a PWA (easiest, no developer tools)

This is the simplest path. The result is a real Android app with its own icon, fullscreen UI, splash screen, and offline support. It behaves like any installed app.

### Steps

1. **Host the app somewhere with HTTPS.** Any of these is fine:
   - **Vercel** — `npx vercel --prod` from the project root
   - **Netlify** — drag the `dist/` folder into netlify.app/drop
   - **GitHub Pages** — push `dist/` to a `gh-pages` branch
   - **Cloudflare Pages** — connect the repo, build with `npm run build`
2. **Open the deployed URL in Chrome** on your Pixel 10 Pro.
3. Chrome will show an **"Install app"** prompt in the address bar, or in the ⋮ menu.
4. Tap **Install**. TapDeck appears on your home screen like a native app.

That's it. No APK, no Play Store, no signing.

### Why this works
- The PWA manifest declares maskable icons, standalone display mode, and a theme color → Chrome treats it as installable
- The service worker (`vite-plugin-pwa`) caches the app shell → works offline
- App shortcuts let you long-press the icon for "New deck" and "All decks" quick actions
- The launch is full-screen with no Chrome chrome — it really feels native on Pixel

---

## Option 2 — Build a real Android APK (advanced)

If you want an actual `.apk` file you can sideload or publish to Play Store, use **Capacitor**. The project is already configured.

### Prerequisites
- Node.js 18+ (already have it)
- Android Studio (download from developer.android.com/studio)
- Android SDK 33+ (Android Studio installs this)
- Java 17 (Android Studio bundles it)

### Build steps

```bash
# 1. Install deps including Capacitor
npm install

# 2. Build the web app
npm run build

# 3. Initialize the Android project (one-time)
npm run android:init

# 4. Sync the latest web build into the Android project
npm run android:sync

# 5. Open in Android Studio
npm run android:open
```

In Android Studio:
1. Wait for Gradle sync to finish.
2. Connect your Pixel 10 Pro via USB (enable Developer Options → USB Debugging first).
3. Click ▶ **Run**, select your Pixel as the target, and the APK installs and launches directly.

To build a signed APK for distribution:
- **Build** menu → **Generate Signed Bundle / APK** → APK → create or pick a keystore → build release variant.

### Updating after code changes
After any web code change, just run:
```bash
npm run android:sync
```
Then re-run from Android Studio. No need to re-add the platform.

---

## Recommended: just use Option 1

Unless you specifically need an APK file or Play Store distribution, **PWA install on Chrome** is the better path. It's the same UX as a real app, updates automatically when you redeploy, and doesn't need Android Studio.

---

## Troubleshooting

**Chrome won't show the Install button**
- Make sure the site is on HTTPS (localhost is also OK).
- Reload after the service worker registers.
- The manifest must validate — visit `chrome://inspect/#service-workers` to debug.

**Icons look cropped on the home screen**
- This is the Android adaptive icon system. The manifest already declares maskable variants (`icon-maskable-*.png`) so this should be handled correctly.

**App opens in Chrome instead of fullscreen**
- Long-press the home-screen icon → if there's no "TapDeck" but only "Chrome", reinstall via Chrome menu → "Install app".
