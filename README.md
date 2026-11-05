# Leenus Darnal — Personal Website

A personal developer homepage built with SvelteKit, Svelte 5 and Tailwind CSS 4. The site is prerendered as static files and published to GitHub Pages.

## Stack

- SvelteKit
- Svelte 5
- Tailwind CSS 4 with the Vite plugin
- SvelteKit static adapter

## Development

```sh
npm install
npm run dev
```

## Production checks

```sh
npm run check
npm run build
```

The GitHub Pages workflow runs the checks, builds the static site into `build/`, and deploys that folder when changes reach `main`.
