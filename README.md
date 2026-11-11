# Leenus Darnal — Personal Website

A personal homepage and maker's notebook built with SvelteKit, Svelte 5 and Tailwind CSS 4. It collects useful tools, side projects and experiments. The site is prerendered as static files and published exclusively to GitHub Pages.

## Live website

- **GitHub Pages:** https://leenusdarnal.github.io/

## Source code

- **GitHub repository:** https://github.com/leenusdarnal/leenusdarnal.github.io

## Stack

- SvelteKit
- Svelte 5
- Tailwind CSS 4 with the Vite plugin
- Self-hosted Inter and Fira Code WOFF2 font assets bundled at build time through Fontsource
- SvelteKit static adapter
- Node's built-in test runner for generated-site smoke tests

## Development

```sh
npm ci
npm run dev
```

Use npm ci for clean local installs and CI. Run npm install only when intentionally changing dependencies, then commit package.json and package-lock.json together.

## Production checks

Run these in order so the smoke tests inspect the generated static site:

```sh
npm run check
npm run build
npm test
```

GitHub Actions runs the checks on pull requests and pushes to main. After a successful build and test run, the Pages workflow publishes the generated build/ directory to GitHub Pages. GitHub Pages is the only hosting and deployment target for this website.

## Quality and maintenance

A scheduled and manually triggerable Lighthouse workflow audits the published GitHub Pages site for performance, accessibility, best practices and SEO. The report is retained as a GitHub Actions artifact.

The daily site monitor checks the personal homepage and linked demos. Each run now writes a UTC timestamp, per-site HTTP result and summary to the GitHub Actions job summary. A successful check is an observation at that time, not a continuous availability guarantee.

The master [ecosystem implementation roadmap](./docs/ECOSYSTEM-IMPLEMENTATION-ROADMAP.md) tracks work across this site and connected applications. The [shared project quality standard](./docs/PROJECT-QUALITY-STANDARD.md) defines release expectations. Supporting registers cover [homepage improvements](./docs/HOMEPAGE-IMPROVEMENT-ROADMAP.md), [privacy review](./docs/PROJECT-PRIVACY-REVIEW.md), [browser compatibility](./docs/BROWSER-COMPATIBILITY.md) and [licensing/attribution](./docs/PROJECT-LICENSING-INVENTORY.md). Security reporting guidance is in [SECURITY.md](./SECURITY.md).

## Homepage experience

The homepage serves both tool users and curious developers: visitors can open practical projects directly, while implementation notes and optional diagnostics remain available. It is not a résumé or job-search portfolio. Its light/dark theme follows the saved preference or system setting, and the browser theme colour tracks the active theme. Social sharing uses a dedicated 1200 × 630 PNG preview image.

The homepage keeps project discovery filter-free and includes a short FAQ for privacy, offline use and salary-estimate limitations. The privacy review distinguishes repository documentation from independent runtime verification; do not treat README statements as a network audit.

## Project notes

The site has dedicated project notes for PixelForge Studio, Metronome, Sikkim Government Salary Calculator, and PixelCutout. It also lists Breadit, Chirp and ROFC Web Hub as source-only code experiments, with repository links and architecture notes but no implied live demos.

## Site quality

- Semantic page landmarks, keyboard skip link, visible focus styles and reduced-motion support.
- Descriptive project highlights and accessible labels for the project cards and theme control.
- Canonical URL, Open Graph/Twitter metadata with a PNG social preview, Person/Website structured data, sitemap and robots file.
- Theme-aware browser chrome, system theme detection, persistent theme preference and an Apple touch icon.
- Inter and Fira Code are bundled locally; the published site does not request Google Fonts at runtime.
- A root-scoped service worker adds Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: credentialless to same-origin document navigations. After it takes control, the runtime inspector offers a one-time reload to activate cross-origin isolation; no HTML is cached by the worker.

## Configuration publishing

The Personal Space editor saves drafts only in the current browser and can export a JSON file. To publish an approved draft, open **Actions → Publish Personal Space configuration → Run workflow**, paste the exported JSON into the config_json input (minified JSON is easiest), and run it. The workflow validates the supported fields, updates only the allow-listed values in src/lib/personal-space.config.ts, and opens a pull request. It does not deploy directly or accept arbitrary code. Review the pull request and its checks before merging; the normal GitHub Pages workflow then deploys the approved change.

The workflow requires repository write access and uses a short-lived, least-privilege GITHUB_TOKEN. Drafts are not sent anywhere until you explicitly run the workflow.

## Publishing and project previews

The PixelForge case study includes a before/after comparison control. Choose your own original and edited images; the preview uses temporary browser object URLs only, applies a 20 MB per-image limit, and never uploads or stores the files.

The homepage uses authentic app icons and the Metronome screenshot from its source repository. Where a project has not published a screenshot, the site links to the live app rather than inventing a product screenshot.

An RSS 2.0 feed is available at [/feed.xml](https://leenusdarnal.github.io/feed.xml). Unknown routes use a custom recovery page and the static 404.html fallback.
