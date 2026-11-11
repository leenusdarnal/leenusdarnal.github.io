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
- [x] Keep the authentic Metronome screenshot in the homepage repository rather than requesting it from a third-party raw-image host.
- [x] Capture authentic screenshots for PixelForge, PixelCutout and Salary Calculator. PR [#77](https://github.com/leenusdarnal/leenusdarnal.github.io/pull/77) integrated the real Playwright captures as same-origin JPEG assets in the homepage cards and case studies; the post-deployment workflow refreshes them.
- [x] Improve each project card's what-it-does / who-it-helps / first-action hierarchy with shared, catalogue-driven audience and first-step guidance.
- Keep technical diagnostics collapsed and clearly labelled for developers.
- Ensure project cards and case studies have clear feedback/source paths.

### P2 — project trust and discoverability
- Add project-specific social images only when genuine project assets are available.
- [x] Add a dated What's New section with verified 11 November 2026 project and quality updates.
- Expand case-study FAQs with browser support, offline behaviour, backups and limitations where confirmed.
- Add structured data only for applications with verified product metadata.

### P3 — quality and performance
- [x] Add responsive browser-level end-to-end checks for navigation, theme switching and persistence, project links, FAQ and the PixelForge case-study path at 360, 390, 768, 1024 and 1440 CSS-pixel viewport widths.
- [x] Add automated axe-core WCAG 2.2 A/AA checks for the homepage (light/dark), developer panel, command palette and all four case studies.
- [x] Add keyboard-only checks for skip navigation, visible focus, theme activation/persistence, developer tools, command-palette arrow navigation and Escape focus restoration.
- [ ] Complete manual screen-reader testing and review axe-incomplete checks for colour contrast, ARIA states and text-link distinction. Automated scans remain necessary but are not a substitute.
- [x] Remove the non-essential runtime GitHub repository-metadata API dependency and its sessionStorage cache; source and project links remain visitor-initiated.
- [x] Review the actual Lighthouse artifact and use its findings to guide readability fixes; rerun after this change to verify the new result.
- [ ] Reassess cache-lifetime headers only if the hosting platform allows configurable response headers; GitHub Pages does not expose a per-file cache-header configuration in this project.

### P4 — ongoing maintenance
- Recheck external project links and privacy notes after releases.
- Keep a lightweight changelog and a dated audit register.
- Revisit project filters only when the catalogue is large enough to justify them.

## Implementation update — 11 November 2026

The homepage now presents a concise **Good for** and **First step** panel on each project card and case study, driven by the shared project catalogue. The PixelForge comparison now supports clearing both images, re-selecting the same file, stale image-decode protection and cleanup of pending object URLs when the component is removed. Regression checks cover these behaviours. Authentic PixelForge, PixelCutout and Salary Calculator interface screenshots were subsequently captured from the live applications, committed as same-origin assets and integrated into the homepage and case studies in PR [#77](https://github.com/leenusdarnal/leenusdarnal.github.io/pull/77).

Responsive browser QA was added in PR #64 and passed against the deployed GitHub Pages commit on 11 November 2026. Playwright checked phone (360×800 and 390×844), tablet (768×1024), small desktop (1024×900) and desktop (1440×1000) profiles. Each profile passed horizontal-overflow checks, primary navigation, project-card/case-study link checks, theme switching and theme persistence after reload. The PixelForge mobile case study also passed its quick-start and local-comparison checks. The run reported no uncaught page errors. Screenshots and the JSON report are retained in [responsive browser QA run #42962341179](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42962341179) for 14 days. These are browser-emulated viewport profiles, not physical-device certification.

Accessibility automation was added in PR #66. The first live run surfaced a repeated visible-label/accessibility-name mismatch on architecture disclosures and an overly strict focus-return assertion in the test. Both were corrected in PR #67. The corrected deployed run [#42963583197](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42963583197) passed eight axe-core 4.14.0 scans (homepage light/dark, developer panel, open command palette and four case studies): **184 rules passed, zero WCAG A/AA violations**. All nine keyboard checks passed, including skip-link activation, focus visibility, theme keyboard activation/persistence, developer-tools activation, command-palette opening, arrow navigation and Escape focus restoration. The report still contains axe *incomplete* checks for manual review, including dynamic/variable colour contrast, some ARIA states and link distinction in text blocks. These are not confirmed violations. Manual screen-reader testing remains open; automated scans do not establish full accessibility conformance.

## Final quality pass — 11 November 2026

- [x] Enforce a 12px minimum for small utility and technical labels across all five responsive viewport profiles (360, 390, 768, 1024 and 1440 CSS px); add a Playwright assertion.
- [x] Add a dated What's New section linking to the underlying changes and CI history.
- [x] Move the authentic Metronome preview into the site's own static assets, update the homepage to use it, and self-host the authentic PixelForge and PixelCutout app icons.
- [x] Add a deployed Playwright guard that fails if homepage images or initial resource loads use a cross-origin origin.
- [~] Perform a targeted source-pattern scan of key application modules for network APIs and browser storage; findings and scope are recorded in PROJECT-PRIVACY-REVIEW.md. This is not a complete dependency or deployed-network audit.
- [x] Capture authentic PixelForge, PixelCutout and Salary Calculator interfaces with Playwright, commit compressed screenshots as same-origin assets, and integrate them into homepage cards and case studies. A post-deployment GitHub Actions job refreshes the captures.
- [ ] Complete physical-device and manual screen-reader testing.
- [ ] Capture clean-profile live network traces and inspect deployed browser storage for all data-sensitive apps.
- [x] Re-run Lighthouse on the deployed commit and review the new artifact before closing performance work.

## Release verification — 11 November 2026

The final homepage release is deployed at commit `dea5bb2ebd912600800a0479fa39d4db49ebf78b`.

- PR [#72](https://github.com/leenusdarnal/leenusdarnal.github.io/pull/72) fixed the tablet text-size defect and established the 12px floor for utility/technical labels. The follow-up extended that floor to every viewport profile after the 1024px desktop profile exposed the same small labels.
- PR [#73](https://github.com/leenusdarnal/leenusdarnal.github.io/pull/73) self-hosted the two authentic project icons, switched the homepage to the already-local Metronome screenshot, and added same-origin resource regression coverage.
- [Responsive browser and accessibility QA](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42974411330) passed at 360×800, 390×844, 768×1024, 1024×900 and 1440×1000. Navigation, project links, theme switching/persistence, overflow, PixelForge case-study behaviour and the Metronome local preview passed. The new initial-resource/image origin check also passed.
- The same run passed eight axe-core 4.14.0 WCAG A/AA scans with zero violations and all nine keyboard checks. Axe incomplete checks still require manual review; automated scans are not a screen-reader certification.
- [Lighthouse quality audit](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42974411418) passed with 100/100 in Performance, Accessibility, Best Practices and SEO.
- [Static build, generated-site checks and smoke tests](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42974325867) passed.

These are automated Chromium/Playwright and Lighthouse results for the homepage and the listed case-study routes. They do not certify physical devices, other browsers, manual screen-reader use, or the network/storage behaviour of the separate linked applications.

## Acceptance criteria

- A first-time visitor can understand the homepage and open a project without using filters or developer tools.
- Technical visitors can still reach implementation notes and diagnostics.
- Privacy copy clearly distinguishes local user-data processing from model/CDN downloads and is not stronger than the evidence.
- Salary estimates remain clearly labelled as independent and non-authoritative.
- Existing SEO, RSS, theme, accessibility foundations and GitHub Pages deployment remain intact.
- npm run check, npm run build and npm test pass before merge.


## Authentic project preview capture — 11 November 2026

PR [#76](https://github.com/leenusdarnal/leenusdarnal.github.io/pull/76) added a Playwright capture workflow, merged after all repository verification checks passed. The workflow runs after a successful GitHub Pages deployment and can also be run manually. It captures the real production interfaces for PixelForge Studio, PixelCutout and the Sikkim Government Salary Calculator in isolated Chromium contexts at 1440×900, checks the expected interface content and HTTP response, then commits compressed JPEGs to `static/images/project-previews/`.

The first production capture completed successfully in [workflow run #42981740301](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42981740301). The resulting files are approximately 103.5 KB (PixelForge), 73.8 KB (PixelCutout) and 78.1 KB (Salary Calculator). PR [#77](https://github.com/leenusdarnal/leenusdarnal.github.io/pull/77) integrates the captured assets into the homepage cards and all four case-study pages, including the existing Metronome preview.

Screenshot captures are visual evidence of the initial interface only. They do not imply successful interaction testing, certify privacy/network behaviour, or replace physical-device and manual assistive-technology checks.
