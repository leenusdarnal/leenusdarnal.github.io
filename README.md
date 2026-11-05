# Leenus Darnal — Personal Site

A small, framework-free personal website published with GitHub Pages.

## Edit the website

The deployed website lives in `site/`:

- `site/index.html` — homepage content, project link, notes, About and Contact
- `site/styles.css` — responsive layout, colors, focus styles and reduced-motion behavior
- `site/theme.js` — light/dark theme toggle and local preference storage
- `site/salary-calculator-preview.svg` — lightweight illustrative project preview
- `site/og-image.svg` — social sharing preview image
- `site/favicon.svg` — site icon
- `site/feed.xml` — RSS feed for Notes
- `site/sitemap.xml` and `site/robots.txt` — search-engine discovery
- `site/404.html` — custom not-found page

The site has no client framework or runtime build step. GitHub Actions publishes the `site/` directory directly to GitHub Pages when changes are pushed to `main`.

## Deployment

The workflow is `.github/workflows/deploy.yml`. It uploads `site/` as a Pages artifact and deploys it.

## Project preview note

`salary-calculator-preview.svg` is an illustrative recreation of the calculator's opening screen, not a raw browser screenshot. Replace it with a captured screenshot when a reusable image export is available.
