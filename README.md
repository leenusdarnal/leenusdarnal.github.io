# Leenus Darnal — Personal Website

A personal developer homepage built with SvelteKit, Svelte 5 and Tailwind CSS 4. The site is prerendered as static files and published to GitHub Pages, with Vercel kept as the secondary deployment.

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

The checks run for pull requests before changes are merged. The GitHub Pages deployment workflow repeats them before publishing the `build/` folder. Vercel deploys from the connected GitHub repository after a successful merge to `main`.

## Site quality

- Semantic page landmarks, keyboard skip link, visible focus styles and reduced-motion support.
- Descriptive project highlights and accessible labels for the project cards and theme control.
- Canonical URL, Open Graph/Twitter metadata, Person/Website structured data, sitemap and robots file.
- A scheduled uptime workflow checks the portfolio and linked project demos once per day.
