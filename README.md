# Leenus Darnal — Personal Website

A personal developer homepage built with SvelteKit, Svelte 5 and Tailwind CSS 4. The site is prerendered as static files and published to GitHub Pages. Vercel uses the same production build.

## Stack

- SvelteKit
- Svelte 5
- Tailwind CSS 4 with the Vite plugin
- SvelteKit static adapter
- Node.js built-in test runner for generated-site smoke tests

## Development

    npm install
    npm run dev

## Production checks

    npm run check
    npm run build

The build command automatically runs the Svelte check before the build and static-output tests afterwards. The tests verify the key metadata, accessible page structure, project links, project detail pages, sitemap and robots file.

The GitHub Pages workflow deploys the build directory only after this command succeeds. Vercel's standard npm run build command runs the same checks before a deployment is produced.
