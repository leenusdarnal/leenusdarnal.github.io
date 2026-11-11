# Ecosystem implementation roadmap

**Baseline date:** 11 November 2026  
**Coordination repository:** https://github.com/leenusdarnal/leenusdarnal.github.io

This is the master implementation register for the personal website and connected applications. It consolidates the homepage roadmap with cross-project work on security, privacy, data safety, accessibility, compatibility, reliability, testing, performance, documentation and maintenance.

## Principles

1. Protect user data before adding features. Prefer local processing where appropriate, but verify actual outbound requests and browser storage.
2. Make builds reproducible. Commit the package-manager lockfile, use clean installs in CI and review dependency changes.
3. Do not invent assurance. Mark compatibility, performance, privacy and availability as unknown until measured.
4. Keep licensing explicit. Do not add a licence or imply reuse permission without an owner decision.
5. Ship in small, testable changes and preserve each project's current deployment target.
6. Keep the public website useful to tool users and developers without turning it into a résumé site.

## Repository scope

| Repository | Role | Current deployment / notes | Initial focus |
| --- | --- | --- | --- |
| [Personal website](https://github.com/leenusdarnal/leenusdarnal.github.io) | Personal site and project directory | GitHub Pages | Shared standards, homepage, site privacy, CI and monitoring |
| [PixelForge Studio](https://github.com/leenusdarnal/pixelforge-studio) | Browser image editor | Vercel; MIT licence present | Local recovery, storage safety, editor reliability and accessibility |
| [PixelCutout](https://github.com/leenusdarnal/pixelcutout) | Browser background remover | Vercel; licence decision pending | AI model network behaviour, memory, onboarding and privacy |
| [Salary Calculator](https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR) | Salary and service-planning tools | Vercel and GitHub Pages workflow | Calculation/source verification and sensitive local data |
| [React Metronome](https://github.com/leenusdarnal/react-metronome) | Metronome application | Public demo; default branch is master | Accessibility, compatibility and dependency maintenance |
| [Breadit](https://github.com/leenusdarnal/breadit) | Source-only experiment | No live demo recorded | Document status and maintenance decision |
| [Chirp](https://github.com/leenusdarnal/chirp) | Source-only experiment | No live demo recorded | Document status and maintenance decision |
| ROFC Web Hub | Source-only experiment | Repository identity not confirmed | Confirm repository before changes |

## Status key

- [x] Implemented and verified in the current change.
- [~] Partially implemented or documented; verification remains.
- [ ] Not yet implemented.
- **Blocked** means an owner decision, unavailable environment or external dependency is required.

## Phase 0 — Reproducible builds and supply-chain security (P0)

- [ ] Generate and commit the correct lockfile using each repository's package manager and Node version.
- [ ] Switch CI from npm install to npm ci only after a valid lockfile is committed.
- [ ] Enable npm caching only after a lockfile exists.
- [ ] Pin third-party GitHub Actions to verified immutable commit SHAs and retain release tags in comments.
- [ ] Set workflow and job permissions to the minimum required.
- [ ] Add CI timeouts and concurrency controls where missing.
- [ ] Review direct and transitive dependency advisories; document temporary exceptions.
- [ ] Keep Dependabot enabled for npm and GitHub Actions.
- [ ] Check that secrets are not exposed to untrusted pull-request code.
- [ ] Record Node.js and package-manager versions in development guides.

**Acceptance:** Clean CI installs from the committed lockfile, runs all project checks and builds the production output. Dependency updates are reviewable and high-severity findings are resolved or explicitly documented.

**Constraint:** The personal site currently has no committed lockfile. Its verification workflow creates one during CI and uploads it as a temporary artifact. Do not change it to npm ci before the real lockfile is generated and committed. Apply the same rule to other repositories without a lockfile.

## Phase 1 — Privacy and data-handling verification (P0)

- [~] Documentation-level review recorded in PROJECT-PRIVACY-REVIEW.md.
- [ ] Search source for network calls, analytics, telemetry, error reporting, remote assets and dynamic imports.
- [ ] Inspect service workers, workers, routes, API handlers and third-party SDKs.
- [ ] Capture clean-profile network traces for import, processing, autosave, restore, export and first-run model download.
- [ ] Confirm whether user image/document payloads appear in outbound requests.
- [ ] Inventory localStorage, sessionStorage, IndexedDB, Cache Storage, cookies and service-worker caches.
- [ ] Record storage keys, purpose, retention, deletion and backup behaviour.
- [ ] Inspect third-party runtime, model, font, icon and CDN requests.
- [ ] Tie public privacy claims to a tested commit and dated evidence.
- [ ] Remove avoidable visitor-side requests when build-time metadata can serve the same purpose.

**Acceptance:** Each data-sensitive app has source-level and runtime evidence. User-data handling, remote dependencies and limitations are explained without unsupported absolute claims.

## Phase 2 — User data export, restore and deletion (P0)

- [ ] Explain what is stored and where.
- [ ] Verify export/restore round trips with representative data.
- [ ] Validate backups and reject malformed or incompatible versions safely.
- [ ] Confirm before destructive deletion or reset.
- [ ] Provide targeted deletion controls where records are managed individually.
- [ ] Handle unavailable, full, cleared or evicted browser storage.
- [ ] Explain browser-local data loss risks.
- [ ] Avoid retaining sensitive drafts longer than necessary.
- [ ] Provide safe recovery after interrupted saves or crashes.

**Acceptance:** Users can identify, export, restore and delete local data; failures do not silently destroy existing work.

## Phase 3 — Licensing and third-party attribution (P0/P1)

- [~] Initial repository-level inventory recorded in PROJECT-LICENSING-INVENTORY.md.
- [ ] Confirm intended licence for each repository before adding one.
- [ ] Record source-code, asset, model, font and dependency licences separately.
- [ ] Add required attribution notices.
- [ ] Document model redistribution and commercial-use restrictions where applicable.
- [ ] Distinguish public source code from licensed open source.
- [ ] Recheck licences when assets, models or major dependencies change.

**Blocked decisions:** Do not add a licence automatically to PixelCutout, Salary Calculator, Metronome, Breadit, Chirp or the personal site. Missing licence does not grant reuse permission.

**Acceptance:** Every maintained project clearly states its licence or that no reuse licence is granted; third-party assets have appropriate notices.

## Phase 4 — First-run experience and sample workflows (P1)

- [ ] PixelForge: safe sample project or guided example that does not overwrite user work.
- [ ] PixelCutout: sample image or guided first-use path.
- [ ] Metronome: beginner tempo presets and quick-start.
- [ ] Salary Calculator: fictional sample scenarios only.
- [ ] Useful empty states, progress states and contextual help.
- [ ] Explain irreversible or resource-intensive actions before they start.
- [ ] Keep samples separate from user-created files and records.

**Acceptance:** A first-time visitor can understand and complete a basic workflow without a long manual. Sample data is clearly fictional.

## Phase 5 — Reliability, offline operation and recovery (P1)

- [ ] Handle failed, interrupted and resumed model downloads.
- [ ] Handle browser storage errors and quota exhaustion.
- [ ] Handle large files and memory-pressure conditions gracefully.
- [ ] Add cancellation and progress feedback for long-running work.
- [ ] Verify service-worker update and recovery behaviour.
- [ ] Distinguish offline-capable workflows from features requiring network downloads.
- [ ] Test offline behaviour after a fresh install and with network disabled.
- [ ] Add safe retry paths and understandable failure messages.

**Acceptance:** Core failure modes have tests or reproducible manual test records, with safe recovery paths.

## Phase 6 — Browser and device compatibility (P1)

- [~] Matrix template recorded in BROWSER-COMPATIBILITY.md; no new compatibility results are claimed.
- [ ] Test Android Chrome on a physical or representative device.
- [ ] Test desktop Chrome and Microsoft Edge.
- [ ] Test Firefox.
- [ ] Test Safari on iOS and macOS where available.
- [ ] Test touch, keyboard, file import/export, storage, model loading and offline workflows.
- [ ] Record browser version, OS/device, tested commit, date, workflow and outcome.
- [ ] Label untested combinations as Not tested.

**Acceptance:** Published compatibility statements are based on dated tests for each application.

## Phase 7 — Accessibility and responsive design (P1)

- [ ] Adopt WCAG 2.2 AA as the target for essential journeys.
- [ ] Verify keyboard operation, visible focus and logical focus order.
- [ ] Add accessible names, labels, descriptions and status announcements.
- [ ] Check colour contrast in light and dark themes.
- [ ] Respect reduced-motion preferences.
- [ ] Check touch target size and alternatives to drag-only actions.
- [ ] Test mobile, tablet and desktop layouts.
- [ ] Run automated checks plus manual keyboard/screen-reader review.

**Acceptance:** No known critical accessibility blocker remains in core workflows; exceptions are documented.

## Phase 8 — Automated tests and visual regression (P1)

- [ ] Add browser end-to-end tests for critical workflows where coverage is missing.
- [ ] Test mobile navigation, theme, project links, FAQ and case-study paths.
- [ ] Add visual baselines at 360, 390, 768, 1024 and 1440 CSS pixels.
- [ ] Cover light and dark themes.
- [ ] Add accessibility checks to CI.
- [ ] Verify static links and deployed routes.
- [ ] Retain useful test reports as CI artifacts.
- [ ] Review visual changes instead of blindly accepting baselines.

**Acceptance:** Pull requests expose critical functional, accessibility and visual regressions before merge.

## Phase 9 — Feedback and support (P2)

- [x] Add privacy-conscious bug-report and feature-request forms to the personal-site repository.
- [ ] Add matching issue forms to maintained application repositories.
- [ ] Include reproduction steps, app version and browser details where relevant.
- [ ] Warn users not to attach private images, payroll records, credentials or personal data.
- [ ] Provide private security reporting where repository settings support it.

**Acceptance:** Reports help reproduce issues without encouraging disclosure of sensitive content.

## Phase 10 — Project health and availability (P2)

- [~] Existing daily workflow checks the personal site and linked demos.
- [x] Add a timestamped workflow summary so results are tied to the current run.
- [ ] Display public health only when backed by fresh results and a timestamp.
- [ ] Distinguish operational, degraded, failed and unknown/stale states.
- [ ] Review monitored URLs after deployment or URL changes.

**Acceptance:** Stale checks are never presented as real-time availability.

## Phase 11 — Performance (P2)

- [ ] Review Lighthouse artifacts before quoting scores.
- [ ] Measure Core Web Vitals at p75 where field data exists.
- [ ] Use LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 as good-performance targets.
- [ ] Optimise images, fonts, critical rendering and route bundles.
- [ ] Avoid unnecessary runtime API calls.
- [ ] Measure mobile resource use and long-running image/AI tasks.
- [ ] Recheck after significant releases.

**Acceptance:** Performance decisions use repeatable measurements, not unverified score claims.

## Phase 12 — Documentation and learning resources (P2/P3)

- [ ] Add concise user guides for major applications.
- [ ] Keep architecture notes aligned with current code.
- [ ] Document common errors and recovery steps.
- [ ] Maintain release notes and known limitations.
- [ ] Label experiments and source-only projects clearly.
- [ ] Use authentic current screenshots only.

**Acceptance:** Users can learn core workflows and developers can understand the current architecture without stale notes.

## Phase 13 — Shared quality and maintenance standard (P3)

- [x] Create PROJECT-QUALITY-STANDARD.md.
- [ ] Apply the standard to each active project.
- [ ] Record maintenance status of source-only experiments.
- [ ] Periodically review dependencies, links, licences, privacy notes and compatibility evidence.
- [ ] Reassess when browsers, frameworks or hosting change.

**Acceptance:** Every public project is classified as maintained, experimental, archived or unsupported, with status visible to visitors.

## Implementation record

| Date | Repository | Change | Evidence |
| --- | --- | --- | --- |
| 11 Nov 2026 | Personal site | Hybrid homepage, filter-free discovery, FAQ and privacy wording | Merged PR #51; commit 7d9d6ab; GitHub Pages build, deployment and verification succeeded |
| 11 Nov 2026 | Personal site | Master roadmap, quality standard, compatibility/licence registers, issue templates and monitoring summary | Current implementation branch; verification pending |

## Release definition

A project is release-ready when supported core workflows build and pass tests; data handling, licence status and limitations are documented; accessibility and browser coverage have been reviewed; critical errors have safe recovery paths; and deployment health can be verified. Finished means that the release standard is met, not that the software will never need maintenance.
