# Homepage implementation handoff

**Checkpoint:** 11 November 2026  
**Repository:** https://github.com/leenusdarnal/leenusdarnal.github.io  
**Default branch at checkpoint:** `main`  
**Baseline commit:** `8ce2c9813018d4ac141f82edf40c71bf8315dec5`  
**Production URL:** https://leenusdarnal.github.io/  
**Purpose:** Resume implementation later without repeating discovery or treating unverified work as complete.

## Executive status

The homepage is substantially implemented and the current `main` branch has a successful build/deployment and automated quality run. This is **not certified as 100% complete**. The remaining work is a finite set of evidence and hosting tasks: independent Vercel deployment verification, human device/accessibility checks, privacy runtime traces for the linked apps, and ongoing accuracy/maintenance checks.

Do not equate a green CI run or a Lighthouse score with complete privacy, accessibility, device compatibility or product correctness.

## Verified repository and release baseline

The repository is a SvelteKit + Svelte 5 + Tailwind CSS 4 static site. It uses the SvelteKit static adapter with a `404.html` fallback. Project discovery is intentionally filter-free; the audience is hybrid (people using the tools and developers inspecting how they are built). The site is not intended to be a résumé or government-employment showcase.

At the time of this checkpoint:

- `main` was at `8ce2c9813018d4ac141f82edf40c71bf8315dec5`.
- No open pull requests were returned by the repository's open-PR query.
- PR #74 (image optimization) and PR #59 (GitHub Actions artifact action update) had been merged.
- PR #60 (TypeScript 7.0.2) was closed without merging. The recorded reason is that `svelte-check@4.7.8` declares peer compatibility with TypeScript `^5 || ^6`, and `npm ci` fails with ERESOLVE on TypeScript 7. Keep TypeScript 6 until the Svelte toolchain explicitly supports TypeScript 7 and the clean-install pipeline passes.
- GitHub Pages is the only deployment target configured in this repository's checked-in workflow. The user wants both GitHub Pages and Vercel deployments where practical. Vercel deployment for this homepage has **not** been verified; do not state that it is live until the project is linked/configured and a production deployment is confirmed.

### Current CI evidence

These were the latest relevant workflow runs visible during the checkpoint:

| Workflow | Run | Result |
| --- | --- | --- |
| Build and deploy SvelteKit site to GitHub Pages | [#42991798095](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42991798095) | Success |
| Verify SvelteKit site | [#42991797941](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42991797941) | Success |
| Lighthouse quality audit | [#42991899830](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42991899830) | Success |
| Responsive browser QA | [#42991899862](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42991899862) | Success |
| Capture live project preview screenshots | [#42991899832](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/42991899832) | Success |

The workflow list showed these runs on `main` at the baseline commit above. Recheck run details and current branch state before relying on them after future changes.

### Existing implementation inventory

The current tree contains:

- SvelteKit homepage and project case-study routes.
- Four featured projects: PixelForge Studio, React Metronome, Sikkim Government Salary Calculator and PixelCutout.
- Filter-free project discovery, hybrid hero/visitor paths, developer diagnostics, command palette and theme switcher.
- Personal Space configurator and guarded configuration-publishing workflow.
- Authentic project previews, local icons/fonts, social preview assets, sitemap, robots file, RSS feed and custom 404.
- Responsive browser QA, axe-core WCAG scans, keyboard checks, Lighthouse audit, generated-site smoke tests and internal-link validation.
- Security guidance, compatibility, quality, licensing and privacy registers.

See [README](../README.md), [homepage roadmap](./HOMEPAGE-IMPROVEMENT-ROADMAP.md), [privacy review](./PROJECT-PRIVACY-REVIEW.md), [browser compatibility](./BROWSER-COMPATIBILITY.md), [quality standard](./PROJECT-QUALITY-STANDARD.md) and [licensing inventory](./PROJECT-LICENSING-INVENTORY.md).

## Remaining work — resume in this order

### P0 — confirm deployment parity and production state

- [ ] Inspect Vercel project/integration for this repository. If no project exists, configure one only after confirming the correct account/project and build settings.
- [ ] Confirm Vercel build settings for SvelteKit static output: Node 24, `npm ci`, `npm run check`, `npm run build`, output directory `build` (validate against the current adapter and Vercel's current SvelteKit support before setting it).
- [ ] Ensure GitHub Pages remains the canonical low-cost deployment and that both deployment paths build the same commit.
- [ ] Add a README link to the Vercel production URL only after a successful production deployment is confirmed.
- [ ] Verify GitHub Pages and Vercel live URLs, TLS, canonical/OG URLs, sitemap, robots, RSS, 404 behaviour, image assets and key case-study routes.
- [ ] Decide whether the Vercel deployment should be production or preview-only. Avoid unnecessary duplicated production infrastructure if it adds cost without value.

### P0 — complete the linked-app privacy/runtime audit

The current privacy register is a targeted source/documentation review, not a complete runtime audit. For PixelForge Studio, PixelCutout and the Salary Calculator:

- [ ] Use a clean browser profile and capture DevTools network logs for first load and each important workflow.
- [ ] Cover import/input, processing, AI model download where applicable, autosave, restore, export, reset/deletion and secondary tools.
- [ ] Confirm whether user images, salary/payroll data, or other entered content appear in any outbound request. Distinguish necessary third-party model/runtime downloads from user payload transmission.
- [ ] Inventory localStorage, sessionStorage, IndexedDB, Cache Storage, cookies and service-worker state, including keys, purpose, retention and deletion paths.
- [ ] Review all app routes, workers, service workers, API clients, analytics/error-reporting SDKs and production dependency requests.
- [ ] Record exact repository commit, browser/version, date, workflow and evidence for every conclusion.
- [ ] Keep homepage privacy copy conservative until the evidence supports a stronger statement.

### P1 — human accessibility and physical-device checks

- [ ] Test with at least one Android physical device and one iOS device if available; record actual device/OS/browser versions.
- [ ] Test touch targets, zoom/reflow, orientation, virtual keyboard interactions, theme, menus, command palette and case-study flows.
- [ ] Manually test a screen reader (for example TalkBack on Android and VoiceOver on iOS/macOS) through navigation, project cards, disclosures, theme control, command palette and forms/configurator.
- [ ] Review the axe-incomplete items recorded by the latest accessibility artifact: dynamic/variable contrast, ARIA states and link distinction in text blocks.
- [ ] Record unsupported combinations as **Not tested**, not passed.

### P1 — content and product correctness

- [ ] Recheck all four case studies against the current live applications and repositories. Verify features, limits, offline behaviour, browser support, export, recovery and privacy statements.
- [ ] Verify Salary Calculator formulae, effective dates and deductions against the applicable signed Government orders. Keep example data fictional.
- [ ] Refresh screenshots only from authentic current application interfaces; never fabricate screenshots or imply that a static screenshot proves interaction behaviour.
- [ ] Confirm every outbound link, demo URL, source repository, social metadata URL and contact path.
- [ ] Review the project licensing register; do not add licences or imply permission where the owner decision is unresolved.

### P2 — polish and ongoing maintenance

- [ ] Review the latest Lighthouse JSON artifact, not only the workflow conclusion. Keep scores measured and date-stamped; do not optimize solely for a perfect score.
- [ ] Review bundle size, image sizes, fonts, caching and Core Web Vitals. GitHub Pages has limited response-header configuration; document hosting constraints rather than adding ineffective configuration.
- [ ] Check Dependabot PRs individually. Do not auto-merge major dependency upgrades that break peer dependency constraints.
- [ ] Review GitHub Actions permissions, pinned action SHAs, workflow triggers, artifact retention and secrets exposure when workflows change.
- [ ] Keep the master ecosystem roadmap synchronized with this repository's actual state.

## Commands for a local continuation

Use Node.js 24 and the committed npm lockfile. Start from a clean checkout of the current `main`, then:

```sh
npm ci --no-audit --no-fund
npm audit --audit-level=high
npm run check
npm run build
node scripts/check-static-links.js
npm test
```

For live browser QA, use the existing workflow or install the same pinned test tools used by `.github/workflows/responsive-browser-qa.yml`:

```sh
npm install --no-save --package-lock=false --ignore-scripts playwright@1.62.1 axe-core@4.14.0
npx playwright install --with-deps chromium
SITE_URL=https://leenusdarnal.github.io/ node scripts/check-responsive.mjs
SITE_URL=https://leenusdarnal.github.io/ node scripts/check-accessibility.mjs
```

Do not commit the temporary no-save QA dependencies. Keep generated artifacts out of the repository unless the relevant workflow explicitly requires them.

## Resume protocol for the next session

1. Read this file first, then the homepage roadmap and privacy review.
2. Fetch the latest `main` SHA, open PR list, recent workflow runs and live deployment status. The baseline above is a checkpoint, not a guarantee that main has not moved.
3. Inspect any changes made since the baseline before editing. Do not overwrite newer work.
4. Pick the first unchecked P0 item. Keep changes small and verifiable.
5. Implement on a feature branch, run the local/CI checks, review the diff and open a PR.
6. Merge only when required checks pass and the change is safe. Do not merge failed or incompatible major dependency updates.
7. Verify both hosting targets after a merge, if Vercel has been configured.
8. Update this handoff, the homepage roadmap and privacy register with dated evidence, exact commit SHAs and run links. Mark an item complete only when its stated acceptance evidence exists.

## Definition of done

The homepage can be called release-complete for a given checkpoint only when:

- the production build and tests pass from a clean lockfile install;
- all intended deployment targets are live from the same reviewed commit;
- critical routes, links, metadata, assets and 404 behaviour are verified on production;
- responsive, keyboard and automated WCAG checks pass, with human screen-reader/device checks recorded;
- privacy claims are backed by source review and clean-profile runtime evidence for the linked applications;
- project facts, salary-calculator caveats, licensing and data-handling statements are current;
- all outstanding work is either completed or explicitly accepted as a documented limitation by the owner.

A future maintenance task does not automatically mean the implementation is incomplete. Conversely, a green CI run alone does not establish 100% completion.
