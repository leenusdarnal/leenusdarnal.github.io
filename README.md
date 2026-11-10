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
npm install
npm run dev
```

## Production checks

Run these in order so the smoke tests inspect the generated static site:

```sh
npm run check
npm run build
npm test
```

GitHub Actions runs the checks on pull requests and pushes to `main`. After a successful build and test run, the Pages workflow publishes the generated `build/` directory to GitHub Pages. GitHub Pages is the only hosting and deployment target for this website.

## Quality checks

A scheduled and manually triggerable Lighthouse workflow audits the published GitHub Pages site for performance, accessibility, best practices and SEO. The report is retained as a GitHub Actions artifact.

## Homepage experience

The homepage is a personal space for sharing projects, experiments and things learned along the way. It is not a résumé or job-search portfolio. Its light/dark theme follows the saved preference or system setting, and the browser theme colour tracks the active theme. Social sharing uses a dedicated 1200 × 630 PNG preview image.

## Project notes

The site has dedicated project notes for PixelForge Studio, Metronome, Sikkim Government Salary Calculator, and PixelCutout. It also lists Breadit, Chirp and ROFC Web Hub as source-only code experiments, with repository links and architecture notes but no implied live demos.

## Site quality

- Semantic page landmarks, keyboard skip link, visible focus styles and reduced-motion support.
- Descriptive project highlights and accessible labels for the project cards and theme control.
- Canonical URL, Open Graph/Twitter metadata with a PNG social preview, Person/Website structured data, sitemap and robots file.
- Theme-aware browser chrome, system theme detection, persistent theme preference and an Apple touch icon.
- Inter and Fira Code are bundled locally; the published site does not request Google Fonts at runtime.
- A root-scoped service worker adds `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless` to same-origin document navigations. After it takes control, the runtime inspector offers a one-time reload to activate cross-origin isolation; no HTML is cached by the worker.
- A scheduled uptime workflow checks the portfolio and linked project demos once per day.
