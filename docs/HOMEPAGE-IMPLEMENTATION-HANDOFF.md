# Homepage implementation handoff

**Checkpoint:** 11 November 2026  
**Repository:** https://github.com/leenusdarnal/leenusdarnal.github.io  
**Default branch at checkpoint:** `main`  
**Baseline commit:** `8ce2c9813018d4ac141f82edf40c71bf8315dec5`  
**Production URL:** https://leenusdarnal.github.io/  
**Purpose:** Resume implementation later without repeating discovery or treating unverified work as complete.  
**Hosting decision (23 November 2026):** GitHub Pages is the only intended deployment target for this repository. Do not configure or deploy this site to Vercel.

## Executive status

The homepage is substantially implemented and the current `main` branch has a successful build/deployment and automated quality run. This is **not certified as 100% complete**. The remaining work is a finite set of evidence and hosting tasks: confirm GitHub Pages production state, human device/accessibility checks, privacy runtime traces for the linked apps, and ongoing accuracy/maintenance checks. A second hosting provider is not required.

Do not equate a green CI run or a Lighthouse score with complete privacy, accessibility, device compatibility or product correctness.

## Verified repository and release baseline

The repository is a SvelteKit + Svelte 5 + Tailwind CSS 4 static site. It uses the SvelteKit static adapter with a `404.html` fallback. Project discovery is intentionally filter-free; the audience is hybrid (people using the tools and developers inspecting how they are built). The site is not intended to be a résumé or government-employment showcase.

At the time of this checkpoint:

- `main` was at `8ce2c9813018d4ac141f82edf40c71bf8315dec5`.
- No open pull requests were returned by the repository's open-PR query.
- PR #74 (image optimization) and PR #59 (GitHub Actions artifact action update) had been merged.
- PR #60 (TypeScript 7.0.2) was closed without merging. The recorded reason is that `svelte-check@4.7.8` declares peer compatibility with TypeScript `^5 || ^6`, and `npm ci` fails with ERESOLVE on TypeScript 7. Keep TypeScript 6 until the Svelte toolchain explicitly supports TypeScript 7 and the clean-install pipeline passes.
- GitHub Pages is the only deployment target configured in this repository's checked-in workflow. The owner confirmed on 23 November 2026 that GitHub Pages must remain the sole deployment target; Vercel setup and deployment are intentionally out of scope.

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

### P0 — confirm GitHub Pages production state

- [ ] Confirm the latest successful GitHub Pages build/deploy workflow corresponds to the current reviewed `main` commit.
- [ ] Verify the GitHub Pages production URL, TLS, canonical/OG URLs, sitemap, robots, RSS, 404 behaviour, image assets and key case-study routes.
- [ ] Keep GitHub Pages as the sole deployment path; do not create a Vercel project, Vercel deployment, or secondary production target for this repository.

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
7. Verify the GitHub Pages production deployment after a merge.
8. Update this handoff, the homepage roadmap and privacy register with dated evidence, exact commit SHAs and run links. Mark an item complete only when its stated acceptance evidence exists.

## Definition of done

The homepage can be called release-complete for a given checkpoint only when:

- the production build and tests pass from a clean lockfile install;
- the GitHub Pages production site is live from the reviewed commit (no secondary deployment target is required);
- critical routes, links, metadata, assets and 404 behaviour are verified on production;
- responsive, keyboard and automated WCAG checks pass, with human screen-reader/device checks recorded;
- privacy claims are backed by source review and clean-profile runtime evidence for the linked applications;
- project facts, salary-calculator caveats, licensing and data-handling statements are current;
- all outstanding work is either completed or explicitly accepted as a documented limitation by the owner.

A future maintenance task does not automatically mean the implementation is incomplete. Conversely, a green CI run alone does not establish 100% completion.


## Continuation update — 23 November 2026

A repeatable static privacy source-pattern audit has been implemented for PixelForge Studio, PixelCutout and the Salary Calculator. See [PROJECT-PRIVACY-REVIEW.md](./PROJECT-PRIVACY-REVIEW.md) for its scope and limitations. The workflow report is a review aid only; the next P0 evidence step is to review its first artifact, then complete clean-profile request/payload and browser-storage traces. Do not mark runtime privacy as verified based on a source scan.


## Content correction — 23 November 2026

The PixelCutout case study was corrected to match the current app README and Project Tracker v1.4 (updated 22 November 2026): one image at a time, AI-assisted or manual colour removal, transparent PNG export, and no batch queue/ZIP or crop tools in the current scope. The previous homepage note claiming batch processing for 20 images and ZIP export was withdrawn. The updated catalogue regression test guards against those unsupported claims.


## Case-study FAQ implementation — 23 November 2026

Added source-backed native disclosure FAQs for PixelForge Studio, PixelCutout, the Salary Calculator and Metronome. The shared project catalogue owns each question and answer; the case-study route renders them as semantic `details/summary` disclosures with visible focus treatment. The regression test checks the prerendered case-study HTML and deliberately verifies that no unsupported FAQ is emitted for Metronome.


## Metronome FAQ source review — 23 November 2026

The Metronome README did not contain enough text for FAQs, so the source components were reviewed directly. The new answers are grounded in `src/Metronome.tsx`, `src/components/Slider.tsx`, `src/components/Tempo.tsx`, `src/components/PlayButton.tsx` and `src/App.tsx`: 30–240 BPM, default 80 BPM, 1/4–4/4 beat options, interval updates while playing and localStorage-backed dark-mode preference. The regression test now asserts the corresponding prerendered page output.


## Lighthouse accessibility follow-up — 23 November 2026

The 22 November Lighthouse artifact identified a visible-label/accessibility-name mismatch on the mobile menu disclosure. Removed its explicit `aria-label` so the visible “Menu” text supplies the control name, and added a regression assertion against the generated homepage HTML. The next Lighthouse and responsive accessibility runs should confirm the result after deployment.


## Responsive project-preview optimisation — completed 23 November 2026

Added a shared `ProjectPreviewImage.svelte` component that offers AVIF first, WebP second and the authentic original JPG/PNG as the final fallback. The component selects 480, 768, 1200 or 1440-pixel sources using per-placement `sizes`, with lazy loading and intrinsic dimensions retained. The repeatable optimizer uses pinned Sharp 0.35.5 as a temporary CI-only tool; it is not added to the application's dependencies.

The branch-specific CI job is set to generate and commit all 32 modern variants to this pull request branch, then build the static site and run strict presence tests. See [PROJECT-PREVIEW-ASSET-PIPELINE.md](./PROJECT-PREVIEW-ASSET-PIPELINE.md). Merge only after reviewing the size report and successful CI. A new deployed Lighthouse run is required to measure the real result.
