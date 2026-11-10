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

## Project case studies

The site has dedicated project notes for PixelForge Studio, Metronome, Sikkim Government Salary Calculator, and PixelCutout. Each page is a lightweight project note with an overview, key features, technology stack, and links to the live project and source code.

## Site quality

- Semantic page landmarks, keyboard skip link, visible focus styles and reduced-motion support.
- Descriptive project highlights and accessible labels for the project cards and theme control.
- Canonical URL, Open Graph/Twitter metadata with a PNG social preview, Person/Website structured data, sitemap and robots file.
- Theme-aware browser chrome, system theme detection, persistent theme preference and an Apple touch icon.
- A scheduled uptime workflow checks the portfolio and linked project demos once per day.
