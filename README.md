# Zerginox

The static website at **https://www.zerginox.com/**, with the restored Salt Altar game and the first playable Monster Fish prototype. GitHub Pages serves the `main` branch from the repository root. No framework, package install, server, or build step is needed to serve the website.

## Pages

- `/` — The redesigned Zerginox homepage, procedural wizard, games, about, and contact.
- `/games/salt-altar/` — Salt Altar level select, six playable levels, original music, and saved progression. Levels 7–13 remain marked as future content; they are not implemented in the supplied game.
- `/games/monster-fish/` — Monster Fish project page, playable embedded prototype, and Android download.
- `/games/monster-fish/play/` — Full-screen Monster Fish browser prototype.
- `/downloads/MonsterFish.apk` — The Android 0.1.0 development build supplied with the project.

## Visual direction

The shared palette uses near-black greens, muted bone, moss, and a soft green glow. `assets/wizard.js` draws the homepage wizard, staff, eyes, hat, moss beard, crystals, stones, roots, and drifting motes directly with Canvas paths and gradients. The wizard is original code-drawn character art, not an imported image or sprite. Its eyes follow the pointer, with reduced motion support and suspended animation in hidden tabs.

The Zerginox display lettering uses **Creepster**, locally hosted in `assets/fonts/` with its SIL Open Font License. Geist and Geist Mono remain the body and small-label fonts. The previous official wordmark and video assets remain in `assets/` for future use but are not used by the redesigned homepage.

## Salt Altar restoration

The six supplied levels keep their original Canvas characters, hazards, timer, score, lives, and ritual mechanics. Shared `portal.css` and `portal.js` add return navigation and touch movement buttons. Keyboard controls still use WASD and arrow keys. The touch buttons release held keys on pointer cancellation, loss of focus, and page hiding.

Progress retains the `saltAltarProgress` storage key. Completing an earlier level no longer lowers existing progress or relocks later levels. The theme and level tracks are MP3 encodings of the supplied WAV audio to reduce download size. Music starts through player interaction.

Game progress from the old `salt-altar.com` origin cannot automatically appear on `www.zerginox.com`; browsers keep those origins' storage separate. New progress saves under the current site.

## Monster Fish

The browser game lives under `games/monster-fish/play/`, including separate fish, bait, rarity, and event catalogs. It retains the original 25 fish, seven unlimited baits, real local time, random conditions, and catch journal. The web integration adds a return link; the Android APK remains the original development build. Browser and Android saves are separate.

To update the prototype, sync the game files from the Android project's `app/src/main/assets/game/` into `games/monster-fish/play/`, preserving the website return link in `index.html` and its small style rule. Update the project-page stats if the roster or bait count changes.

## Editing and publishing

Edit HTML, CSS, and JavaScript directly. Keep `CNAME` set to `www.zerginox.com`, and preserve `.nojekyll`. Commit and push reviewed changes to `main`; the repository's existing GitHub Pages setup handles publication. Relative routes work on both the custom domain and the user GitHub Pages domain.

The site identifies the creator as **Zerginox** and uses `zerginox@gmail.com` as its contact address.

## Checks

```sh
python3 tests/check-links.py
node tests/verify-site.cjs
```

The JavaScript verification uses `@napi-rs/canvas` as development-only tooling. It executes all six original Salt Altar level scripts with a real Canvas renderer and a small DOM/event harness, checking countdowns, touch movement/release, win returns, unlocks, and progress retention. It also checks all shipped JavaScript syntax, the procedural wizard, Monster Fish roster and bait rules, and the custom domain. This package is not needed by visitors or by GitHub Pages.

Browser layout and on-device testing should complement these checks. The current environment does not have the supported browser-control capability for a browser QA pass.

Font source and license: https://github.com/google/fonts/tree/main/ofl/creepster
