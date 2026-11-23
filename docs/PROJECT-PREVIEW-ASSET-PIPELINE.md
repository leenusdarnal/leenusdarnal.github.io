# Project preview asset pipeline

**Updated:** 23 November 2026

## What this does

The homepage and case studies use screenshots captured from the real project applications. This pipeline keeps those original JPG/PNG screenshots unchanged as compatibility fallbacks and creates responsive AVIF and WebP variants from each source.

Four source images are processed:

- PixelForge Studio
- Metronome
- Sikkim Government Salary Calculator
- PixelCutout

Each source is resized to 480, 768, 1200 and 1440 pixels wide. The AVIF and WebP files are stored under `static/images/project-previews/optimized/` and referenced through a shared `ProjectPreviewImage.svelte` component. Browsers choose AVIF first, then WebP, then the original screenshot.

The component sets `sizes` per placement, keeps the intrinsic width/height attributes, and retains lazy loading and asynchronous decoding.

## Regenerate the variants

Create an internal branch whose name starts with `optimize-project-previews-`, then open a pull request to `main`. The existing SvelteKit verification workflow runs an additional image-optimization job for that branch. It installs the pinned build-time-only `sharp@0.35.5` tool, generates the variants, commits them to the pull request branch, builds the static site, and requires all 32 assets in the generated output.

The optimizer does not add Sharp to the site's runtime or package manifest. The original screenshot files remain committed and unchanged. The optimization report is uploaded as the `optimized-project-previews` workflow artifact and records source/variant byte counts and per-image savings for the 1440-pixel AVIF/WebP versions.

For a local regeneration after installing dependencies:

```sh
npm install --no-save --package-lock=false sharp@0.35.5
node scripts/optimize-project-previews.mjs
```

## Hosting constraint

GitHub Pages remains the sole production host for this homepage. The site can ship hashed static filenames but does not provide a per-path response-header configuration for custom cache lifetimes. This pipeline therefore improves the image bytes and responsive selection; it does not claim to change GitHub Pages cache headers.

## Quality checks

- `npm run check`
- `npm run build`
- `node scripts/check-static-links.js`
- `REQUIRE_OPTIMIZED_PREVIEWS=1 npm test`

The normal verification suite checks the component and prerendered srcsets. The image-optimization job and Pages deployment set `REQUIRE_OPTIMIZED_PREVIEWS=1`, which fails unless all four formats/sizes for all four screenshots are present in the static build.


## First generated result — 23 November 2026

The first report was produced by GitHub Actions run [#45132287829](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/45132287829); the clean final verification run is [#45132643426](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/45132643426). The four 1440px AVIF assets total 89,772 B versus 273,902 B for the four original JPG/PNG files, a combined reduction of 67.2%. At 1440px the per-image AVIF reductions are 68.1% (PixelForge), 76.1% (Metronome), 69.4% (Salary Calculator) and 61.3% (PixelCutout). Original files remain as fallbacks. The variants were visually inspected at full width and show no obvious interface-text degradation.

The first run exposed two test/build integration issues: SvelteKit prerender correctly rejected missing responsive source-set assets before they were generated, and an older CI test disallowed any `npm install` string. The final pipeline now generates the variants before the ordinary PR build, runs a specialized branch-only generation/commit job, and explicitly permits only the pinned no-save Sharp install. Both workflow jobs and the strict 32-asset static-build test passed in run #45132643426.


## Refresh lifecycle integration — 23 November 2026

The post-deployment live screenshot capture workflow also runs the pinned Sharp optimizer after capturing all source screenshots and before committing image assets. Thus, if a live application UI changes and the JPEG/PNG originals are refreshed, the matching AVIF/WebP derivatives are regenerated in the same commit. The subsequent Pages deployment publishes both together. The optimizer is temporary CI tooling and is not part of the site's runtime dependencies.


## Capture selector maintenance — 23 November 2026

The live capture script waits for “Keep the subject.” on the current PixelCutout homepage. This was updated from the obsolete “Make your subject” phrase after the 23 November capture timed out; the source of truth is the app's current `src/routes/+page.svelte` heading. A smoke assertion protects the new string.
