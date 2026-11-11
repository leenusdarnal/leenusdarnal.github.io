# Homepage improvement roadmap

**Decision profile:** hybrid audience · remove project filters · audit privacy · full roadmap.

This file records homepage-specific decisions. Cross-repository implementation is tracked in the [master ecosystem implementation roadmap](./ECOSYSTEM-IMPLEMENTATION-ROADMAP.md), with release expectations in the [shared project quality standard](./PROJECT-QUALITY-STANDARD.md).

## Completed in the homepage change

- Replace filter pills with a clear optional developer entry point; keep the command palette and diagnostics available to technical visitors.
- Reframe the hero around the visitor's two paths: use a tool or inspect how it is built.
- Rewrite project descriptions around outcomes and practical workflows.
- Add a concise FAQ covering cost/availability, privacy, offline limitations and the non-official status of salary estimates.
- Add a privacy review that separates repository documentation claims from independently verified behaviour.
- Qualify privacy statements on the project pages rather than presenting documentation as proof.
- Retain existing case studies, authentic preview assets, theme, SEO foundations, RSS, sitemap, custom 404 and configuration editor.

## Follow-up implementation sequence

### P0 — correctness and trust
- Complete source-level outbound-request and storage audits for PixelForge, PixelCutout and Salary Calculator.
- Capture clean-profile network traces for image import, AI model download, editing, export, autosave and restore.
- Verify salary calculations and effective dates against the calculator's cited Government orders; add regression cases for the main pay levels, DA and deductions.
- Publish only privacy claims tied to a tested commit and dated evidence.

### P1 — visitor experience
- [ ] Capture authentic screenshots for projects that currently have only icons/placeholder panels. A source-repository asset review found a durable screenshot for Metronome, but only app icons for PixelForge, PixelCutout and Salary Calculator; do not substitute generated mockups for real interfaces.
- [x] Improve each project card's what-it-does / who-it-helps / first-action hierarchy with shared, catalogue-driven audience and first-step guidance.
- Keep technical diagnostics collapsed and clearly labelled for developers.
- Ensure project cards and case studies have clear feedback/source paths.

### P2 — project trust and discoverability
- Add project-specific social images only when genuine project assets are available.
- Add a dated What's New section with verified release notes.
- Expand case-study FAQs with browser support, offline behaviour, backups and limitations where confirmed.
- Add structured data only for applications with verified product metadata.

### P3 — quality and performance
- Add browser-level end-to-end checks for mobile navigation, theme switching, project links, FAQ and case-study paths.
- Add automated accessibility checks and keyboard/screen-reader review.
- Generate repository metadata at build time or remove the runtime GitHub API dependency.
- Review Core Web Vitals from real Lighthouse artifacts; do not report scores without reading the artifact.

### P4 — ongoing maintenance
- Recheck external project links and privacy notes after releases.
- Keep a lightweight changelog and a dated audit register.
- Revisit project filters only when the catalogue is large enough to justify them.

## Implementation update — 11 November 2026

The homepage now presents a concise **Good for** and **First step** panel on each project card and case study, driven by the shared project catalogue. The PixelForge comparison now supports clearing both images, re-selecting the same file, stale image-decode protection and cleanup of pending object URLs when the component is removed. Regression checks cover these behaviours. Authentic screenshots remain a separate follow-up: the reviewed PixelForge, PixelCutout and Salary Calculator repositories currently publish app icons but no durable interface screenshots.

## Acceptance criteria

- A first-time visitor can understand the homepage and open a project without using filters or developer tools.
- Technical visitors can still reach implementation notes and diagnostics.
- Privacy copy clearly distinguishes local user-data processing from model/CDN downloads and is not stronger than the evidence.
- Salary estimates remain clearly labelled as independent and non-authoritative.
- Existing SEO, RSS, theme, accessibility foundations and GitHub Pages deployment remain intact.
- npm run check, npm run build and npm test pass before merge.
