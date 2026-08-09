# Zerginox Final Website

This is the standalone HTML, CSS, and JavaScript version of the finalized
Zerginox homepage. It does not require React, Next.js, npm, or a build command.
All visual styling—including the lattice frames, orange Contact hover, responsive
layout, colors, spacing, and typography—is included.

## Project structure

```text
Zerginox_Final_VSCode_Site/
├── index.html
├── style.css
├── script.js
├── CNAME
├── .nojekyll
└── assets/
    ├── favicon.svg
    ├── geist.woff2
    ├── geist-mono.woff2
    ├── zerginox-hero.mp4
    ├── zerginox-hero-poster.jpg
    └── zerginox-official-wordmark.png
```

## Open it in VS Code

1. Extract the ZIP file.
2. In VS Code, select **File > Open Folder**.
3. Select the extracted `Zerginox_Final_VSCode_Site` folder.
4. Open `index.html`.
5. For a live local preview, use the VS Code **Live Server** extension and
   select **Open with Live Server**.

The asset filenames and folder paths are already connected. Keep the `assets`
folder beside the three code files unless you also update the paths in the
HTML and CSS.

## Add the Spotify playlist

1. Open `script.js`.
2. Find this line near the top:

   ```javascript
   const SPOTIFY_PLAYLIST_URL = "";
   ```

3. Paste the full playlist share link between the quotation marks.
4. Save the file and refresh the page.

The placeholder will automatically become the embedded Spotify player while
retaining the lattice frame.

## Publish with GitHub Pages

GitHub Pages is the simplest route for this static site:

1. Put the contents of this folder at the root of your website repository.
2. Commit and push the files to the `main` branch.
3. Open the repository on GitHub and select **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. In the Pages custom-domain field, enter `zerginox.com`.
7. Use the DNS values GitHub displays to finish connecting the domain and then
   enable **Enforce HTTPS** when it becomes available.

The included `CNAME` file already identifies `zerginox.com`, and `.nojekyll`
keeps GitHub Pages from applying unnecessary Jekyll processing.

## Important

- The public site identifies you only as **Zerginox**.
- The official wordmark is the exact transparent image selected for the brand.
- The included MP4 is the optimized 30-second website version.
- The Contact button opens an email to `zerginox@gmail.com`.
