# Leenus Darnal — Personal Website

A personal developer homepage built with SvelteKit, Svelte 5 and Tailwind CSS 4. The site is prerendered as static files and published to GitHub Pages, with Vercel as an additional deployment.

## Live website

- **GitHub Pages:** https://leenusdarnal.github.io/
- **Vercel:** https://leenusdarnal.vercel.app/

## Source code

- **GitHub repository:** https://github.com/leenusdarnal/leenusdarnal.github.io

## Stack

- SvelteKit
- Svelte 5
- Tailwind CSS 4 with the Vite plugin
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

GitHub Actions runs the checks on pull requests and pushes to `main`. After a successful build and test run, the Pages workflow publishes the generated `build/` directory to GitHub Pages. Vercel is connected to the GitHub repository and can deploy updates from `main`.

## Quality checks

A scheduled and manually triggerable Lighthouse workflow audits the published GitHub Pages site for performance, accessibility, best practices and SEO. The report is retained as a GitHub Actions artifact.

## Homepage experience

The homepage introduces the developer behind the projects, highlights selected work and includes a concise About section with direct contact links. Its light/dark theme follows the saved preference or system setting, and the browser theme colour tracks the active theme. Social sharing uses a dedicated 1200 × 630 PNG preview image.

## Project case studies

The portfolio includes dedicated pages for PixelForge Studio, Metronome, Sikkim Government Salary Calculator, and PixelCutout. Each page includes an overview, key features, technology stack, and links to the live project and source code.

## Site quality

- Semantic page landmarks, keyboard skip link, visible focus styles and reduced-motion support.
- Descriptive project highlights and accessible labels for the project cards and theme control.
- Canonical URL, Open Graph/Twitter metadata with a PNG social preview, Person/Website structured data, sitemap and robots file.
- Theme-aware browser chrome, system theme detection, persistent theme preference and an Apple touch icon.
- A scheduled uptime workflow checks the portfolio and linked project demos once per day.
