# Homepage UX and Design Audit — 19 November 2026

**Site:** https://leenusdarnal.github.io/  
**Repository:** https://github.com/leenusdarnal/leenusdarnal.github.io  
**Scope:** Live homepage, desktop/mobile presentation, primary navigation and project-discovery journeys, project detail routes, PixelForge comparison initial state, accessibility and performance evidence.  
**Status:** Audit recorded for reference. No implementation changes were made as part of this audit.

## Executive summary

The homepage is a strong hybrid personal project space: practical tools are discoverable for general visitors, while project notes and source links serve developers. The slate-and-emerald visual system, project-card structure, personal introduction and privacy explanations are coherent.

No critical homepage blocker was identified in the inspected journeys. The highest-value follow-ups are correcting a stale uptime-monitor target and refreshing the Metronome project preview. Smaller improvements concern mobile navigation readability, section numbering and the affordance of the hero topic pills.

## Findings

Severity guide: **Medium** = worth addressing in the next improvement pass; **Low** = polish/usability improvement, not a release blocker.

### 1. Stale uptime-monitor target — Medium

The scheduled **Check live sites** workflow failed on 17 and 18 November 2026. The 18 November run shows:

- `https://leenusdarnal.github.io/` — HTTP 200
- `https://leenusdarnal.vercel.app/` — HTTP 404
- PixelForge Studio — HTTP 200
- Metronome — HTTP 200
- Sikkim Government Salary Calculator — HTTP 200
- PixelCutout — HTTP 200

The failure is caused by the stale `leenusdarnal.vercel.app` target, not by the GitHub Pages homepage. Remove the obsolete URL or replace it with the verified intended deployment before relying on the monitor's overall status.

Evidence: [18 November 2026 monitoring run](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/44284180923).

### 2. Metronome preview needs a refresh — Medium

The Metronome project card uses a source-repository screenshot. Its lower resolution and older visual presentation are less consistent with the other featured project previews. The current source attribution is honest and should be retained until a genuine replacement is available.

Recommendation: capture a fresh, authentic screenshot from the live Metronome application at a consistent desktop aspect ratio, and verify a mobile crop before replacing the asset. Do not fabricate a UI screenshot.

### 3. Mobile navigation text is small — Low

At a 390px viewport, the Projects, About and Contact links fit without horizontal overflow and have 44px minimum height. Their text is 12px.

Recommendation: evaluate 13–14px text or an accessible compact navigation pattern at the narrowest supported widths. Preserve comfortable touch targets and keyboard access.

### 4. Section numbering is inconsistent — Low

The visible eyebrow labels restart numbering: Projects & Experiments is marked 01, Code Experiments 02, Personal Space 01, About 02 and Contact 03.

Recommendation: either use one continuous numbering sequence across the page or remove the numbers and keep descriptive section labels.

### 5. Hero topic pills look interactive — Low

The hero shows “Try the tools”, “How they work”, “Privacy notes” and “Open-source projects” as bordered pills. They are list items rather than links or buttons.

Recommendation: either link them to the relevant sections or style them more clearly as non-interactive topic labels. Do not add interactive styling without real interaction.

## Strengths verified

- Clear hybrid positioning: practical tools for visitors and source/implementation context for developers.
- One primary H1, a descriptive hero, and a prominent “Explore projects” action.
- Project cards communicate purpose, first action, highlights and launch/source links.
- Responsive project-card stacking and no horizontal overflow at the inspected 390px viewport.
- Semantic main navigation and section landmarks, skip-to-content link, labelled theme control, visible focus styles and reduced-motion CSS.
- Privacy copy correctly explains that external requests and offline support vary by project/feature; it avoids universal offline or no-upload claims.
- Salary calculator is described as an independent reference tool, not official advice.
- Project image markup uses explicit dimensions and lazy loading for below-the-fold previews.

## Journey inspection

| Journey/check | Result |
|---|---|
| Homepage response | HTTP 200 |
| Main navigation structure | Present and labelled |
| Explore projects → projects section | Inspected |
| Four project detail routes | HTTP 200 in the recorded browser QA |
| PixelForge comparison initial state | Two labelled local file inputs; comparison slider hidden before images are selected |
| PixelForge file upload and drag-divider interaction | Not exercised in this audit |

## Accessibility evidence and limitations

The repository's latest successful responsive/accessibility browser workflow available during this audit was 16 November 2026. It tested five viewport profiles and ran axe-core WCAG 2.2 A/AA scans and keyboard checks.

Evidence: [Responsive Browser QA run](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/43872211351).

This is positive automated evidence, not a certification of full WCAG conformance. Manual screen-reader and physical-device testing remain useful. The current audit did not perform a complete assistive-technology session.

## Performance evidence and limitations

The Lighthouse workflow completed successfully on 16 November 2026.

Evidence: [Lighthouse workflow run](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/43862860917).

The workflow enforces these minimum category scores:

| Category | Quality floor |
|---|---:|
| Performance | 65 |
| Accessibility | 90 |
| Best Practices | 85 |
| SEO | 90 |

The exact historical report metrics were not retrieved during this audit. No current LCP, INP, CLS or Lighthouse score is asserted here. A fresh report should be inspected before making numerical performance claims.

## Screenshot and evidence record

Desktop and mobile full-page captures, plus a PixelForge case-study capture, were inspected during the live audit session. The audit-session screenshot URLs were temporary signed links and are not embedded here as permanent assets. The repository's [Responsive Browser QA workflow](https://github.com/leenusdarnal/leenusdarnal.github.io/actions/runs/43872211351) uploads reproducible screenshots and reports as a workflow artifact (retained for 14 days).

## Recommended action order

1. Correct the stale uptime-monitor URL and rerun the workflow.
2. Capture and verify a genuine, current Metronome screenshot.
3. Improve mobile navigation text readability without reducing touch-target size.
4. Standardise or remove section numbering.
5. Clarify the hero topic pills' non-interactive or interactive nature.

## Audit boundaries

This document records findings and evidence available on 19 November 2026. It is not an implementation checklist that authorises silent code changes. No repository source, workflow, deployment or configuration was modified as part of the audit. Recheck live behaviour and CI evidence before implementing or closing any finding.
