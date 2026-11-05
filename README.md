# Leenus Darnal — Personal Site

A small, framework-free personal website published with GitHub Pages.

## Edit the website

The deployed website lives in `site/`:

- `site/index.html` — homepage, project details, About and Contact
- `site/styles.css` — responsive layout, themes, focus styles and reduced-motion behavior
- `site/theme.js` — light/dark theme and local preference storage
- `site/salary-calculator-preview.svg` — lightweight illustrative salary calculator preview
- `site/pixelforge-preview.svg` — lightweight illustrative PixelForge Studio preview
- `site/og-image.svg` — social sharing preview image
- `site/favicon.svg` — site icon
- `site/sitemap.xml` and `site/robots.txt` — search-engine discovery
- `site/404.html` — custom not-found page

The site has no client framework or runtime build step. GitHub Actions publishes `site/` directly to GitHub Pages whenever the `main` branch changes.

## Content policy

Project details should come from repositories owned by this GitHub account or from material written for this site. Do not present another developer's project as the site owner's work.

## Deployment

The workflow is `.github/workflows/deploy.yml`. It uploads the `site/` directory as a Pages artifact and deploys it.

## Project preview note

`salary-calculator-preview.svg` is an illustrative recreation of the calculator interface, not a raw browser screenshot.
