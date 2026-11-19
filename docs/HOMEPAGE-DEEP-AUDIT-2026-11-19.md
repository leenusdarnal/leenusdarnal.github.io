# Homepage Deep Audit — 19 November 2026

Repository: `leenusdarnal/leenusdarnal.github.io`  
Live site: https://leenusdarnal.github.io/  
Audit scope: live homepage, four published project case studies, source configuration and Svelte page, existing Lighthouse/responsive/accessibility evidence, privacy disclosures, metadata and deployment monitoring.

## Executive summary

The site is a strong hybrid portfolio and practical-tools directory. It communicates the distinction between live apps and source-only experiments, has useful project quick-start guidance, avoids misleading privacy promises, and has recent automated quality evidence. The four case-study routes and homepage were fetched successfully (HTTP 200) during this audit.

The most important next step is not a visual redesign. It is closing operational and trust gaps, then improving the first-visit experience and the proof behind privacy and project claims.

## Verified strengths

- Clear audience split: visitors can launch tools while developers can inspect source and architecture.
- Project discovery remains filter-free; source-only experiments are explicitly identified.
- Project cards explain who each tool is for and the first action to take.
- Case studies provide constraints and trade-offs, not only promotional claims.
- Privacy copy correctly distinguishes local processing, external model downloads and pending independent runtime verification.
- Salary calculator copy clearly states it is an independent reference estimate, not an official payroll system.
- Semantic headings, skip link, keyboard focus styles, reduced-motion handling, theme control state and descriptive case-study metadata are present in source.
- Prior CI evidence: Lighthouse 100/100 across Performance, Accessibility, Best Practices and SEO; five viewport profiles passed; eight axe WCAG 2.2 A/AA scans reported zero violations. These are automated checks, not certification or a substitute for manual assistive-technology testing.

## Findings and priorities

### P1 — Fix the stale homepage uptime target

The prior uptime workflow evidence records the GitHub Pages homepage returning 200 while the old `https://leenusdarnal.vercel.app/` target returns 404. The other four project demo URLs returned 200. This makes the monitor report a failure for a stale homepage target rather than an actual outage of the published homepage.

**Action:** remove the stale Vercel URL from the monitor or replace it with a verified production URL. Keep GitHub Pages as the authoritative homepage check. Re-run the monitor and verify the job summary.

Evidence: https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/44284180923

### P1 — Verify the Open Graph image file itself

The page metadata advertises `/og-image.png` as a 1200×630 PNG on the homepage and project pages. The repository also contains a 1200×630 SVG source graphic. Earlier source inspection found the PNG payload suspiciously small, but this audit did not establish that it is corrupt or renderable.

**Action:** validate PNG signature, full decode, dimensions and visual output; compare against the SVG; regenerate a real 1200×630 PNG if necessary; then validate social metadata and a real social-preview fetch. Do not treat the declared dimensions in HTML as proof of the image dimensions.

### P2 — Make the hero topic chips meaningful or visibly non-interactive

The four hero chips (“Try the tools”, “How they work”, “Privacy notes”, “Open-source projects”) are rendered as plain list items with pill styling. They look like navigation controls but do not navigate.

**Action:** either convert them to useful in-page anchors (recommended) or reduce the control-like styling so they read as descriptive tags. If linked, use real anchors with valid section targets and verify keyboard focus.

### P2 — Improve mobile navigation label legibility

The primary navigation uses `text-xs` at the narrow viewport while preserving 44px minimum control height. Touch target height is good, but the text can be difficult to scan on small phones, especially when all navigation links compete with the brand and theme control.

**Action:** test 13–14px navigation text at 360px and 390px widths, and use a compact menu only if the current layout cannot fit without crowding. Preserve 44px targets and avoid adding unnecessary JavaScript.

### P2 — Complete runtime privacy verification across linked apps

The homepage explicitly says clean-profile network and storage checks across linked apps are pending. Case-study copy also describes local processing and model downloads with careful qualifications. This is appropriately transparent, but it leaves an important trust claim unverified.

**Action:** run clean-profile network/storage audits on PixelForge, Metronome, Salary Calculator and PixelCutout. Record first-load vs repeat-load requests, external hosts, image/file upload requests, browser storage keys and persistence behavior. Distinguish app-owned storage from third-party telemetry and model/CDN downloads. Publish concise per-app findings and date them.

### P2 — Keep the “Recent improvements” section current

The live homepage still presents 11 November 2026 as the newest update, while this audit is dated 19 November 2026. This weakens the sense that the site is actively maintained.

**Action:** update the feed from verified merged commits only, or generate this section from a curated changelog so dates and descriptions cannot drift. Avoid claiming that a change is deployed until the Pages workflow and live site confirm it.

### P3 — Clarify the hero chip list and page landmarks

The page source contains a header and a main content landmark, and the skip link targets the main content. Keep landmark nesting valid and avoid introducing duplicate main landmarks during future component refactors. The hero list currently has an accessible label but no interactive purpose.

**Action:** retain one primary `main` landmark, keep section heading relationships, and ensure every visible control is a native link or button with a clear name.

### P3 — Align section numbering

The project section and code-experiments section are numbered 01 and 02, but Personal Space, About and Contact restarted at 01, 02 and 03. The audit branch updates the latter labels to 03, 04 and 05 to create a single sequence.

### P3 — Reduce image transfer where it does not affect quality

The prior Lighthouse report scored 100 but still identified opportunities to properly size images (about 147 KiB) and serve next-generation formats (about 84 KiB). A perfect score does not mean there are no byte-level opportunities.

**Action:** inventory the largest homepage and case-study images; produce responsive AVIF/WebP variants with a fallback; use accurate `srcset`/`sizes`; keep the hero/LCP candidate discoverable and prioritize only the actual LCP asset. Preserve intrinsic dimensions to avoid layout shift.

### P3 — Review hero hierarchy and information density

The current hero communicates the maker identity and practical-tools promise clearly. However, the short “Curious by nature / Practical by design / Always building” aside repeats ideas already present in the hero and About copy.

**Action:** test a more outcome-oriented supporting line (for example, “Open a tool, solve a task, or explore how it works”) and reserve the personal statement for the About section. Do not change the site's hybrid audience positioning without owner approval.

## Evidence reviewed

- Live homepage and metadata: https://leenusdarnal.github.io/
- PixelForge case study: https://leenusdarnal.github.io/projects/pixelforge-studio/
- Metronome case study: https://leenusdarnal.github.io/projects/metronome/
- Salary Calculator case study: https://leenusdarnal.github.io/projects/sikkim-government-salary-calculator/
- PixelCutout case study: https://leenusdarnal.github.io/projects/pixelcutout/
- Lighthouse run: https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/44458380115
- Responsive/accessibility run: https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/44458380103
- Prior uptime failure: https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/44284180923

## Audit limitations

This was a remote source/live-page audit. It did not include physical-device testing, a full screen-reader session with human review, user testing, a complete HAR capture for every linked app, or formal WCAG certification. Firecrawl mobile screenshot capture was requested, but its result was not independently reviewed pixel-by-pixel in this report. The Modern Web Guidance accessibility, performance, privacy and text-legibility references were applied as review criteria; the package's live CLI search could not be completed because its network invocation timed out.

## Next verification sequence

1. Fix the uptime monitor target.
2. Validate/regenerate the social preview PNG.
3. Convert hero chips to real anchor links.
4. Run the privacy network/storage review across the four apps.
5. Refresh the curated updates section.
6. Re-run `npm run check`, `npm run build`, `npm test`, responsive/accessibility Playwright, Lighthouse and uptime checks.
7. Merge only after required checks pass; verify the GitHub Pages deployment and live assets.
