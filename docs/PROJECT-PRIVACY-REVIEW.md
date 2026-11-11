# Project privacy review — 11 November 2026

## Scope and evidence level

This review checked the README and published project documentation for the three data-sensitive applications linked from the personal site. It is a **documentation-level audit**, not a source-code or network-traffic certification. The repositories' own statements are recorded as claims, not independently proven guarantees.

## Findings

| Project | What the project documentation says | Important caveat | Homepage treatment |
| --- | --- | --- | --- |
| PixelForge Studio | IndexedDB stores autosaves and recovery copies on the current device; no account, cloud sync or artwork upload is provided. | Browser storage may be cleared or evicted. The active editor's full network behaviour has not been independently traced. | Describe local autosave and separate .pfs backup; explicitly qualify the statement. |
| PixelCutout | Image pixels are processed in the browser and are not uploaded. AI mode downloads model/runtime assets from public model hosts; no-AI mode does not download the model. | Model downloads are third-party network requests. Independent runtime/network verification has not been completed. | Explain the distinction between image pixels and model downloads; avoid an absolute no-network claim. |
| Sikkim Government Salary Calculator | README describes browser-only calculations, browser-local employee records, session-only metadata in selected workflows, and no payroll credential collection. | This is not proof that every route/dependency is free of outbound requests. Local storage on a shared device is still sensitive. | Warn users not to treat the app as an official payroll system and to protect local records. |

## Site-level observation

The homepage previously called the public GitHub API from the visitor's browser to display repository stars and last-push dates. This was a non-essential metadata feature and did not provide a visitor workflow that justified the additional third-party request.

The implementation branch for the current review removes the RepoMetadata component, its homepage references, and its sessionStorage cache. Project source links remain available as visitor-initiated links. The pull request includes a regression test requiring the homepage to contain no repository-metadata API call or related cache write.

**Evidence limitation:** this is a source-level change plus CI regression coverage. A clean-profile deployed-browser network trace has not yet been captured, so this document does not claim independent runtime network certification.

## Targeted source-level observations — 11 November 2026

The following source modules were inspected after the documentation-level pass. These are **source-review observations**, not proof from a clean-profile browser network capture. The review was targeted to the data/storage modules listed below; it is not an exhaustive review of every route and dependency.

### PixelForge Studio

Inspected `src/lib/editor/storage.ts` and `src/routes/+page.svelte` at the merged recovery-management implementation.

- The app uses IndexedDB database `pixelforge-studio-local`, object store `snapshots`.
- The current autosave is stored as `current`; up to three retained records use `backup-<timestamp>` identifiers.
- The editor exposes a **Manage local recovery** panel. It reports the latest autosave date and number of recovery copies and can clear the snapshot store after an explicit confirmation.
- Clearing snapshots does not delete the canvas currently held in memory or the service-worker app cache. New edits can create fresh recovery snapshots.
- Autosaves and clear operations are sequenced through one task queue to reduce the chance of an in-flight save racing with deletion. A new edit observed during a clear is scheduled for a fresh save afterward.
- IndexedDB connection handling closes on `versionchange` and resets the cached connection after open failures.

**Evidence and limits:** PixelForge PR #16 was merged after Svelte/TypeScript checks, unit tests, production build and generated-site smoke checks passed. The smoke checks assert that the recovery manager and confirmation control exist. A real-browser IndexedDB delete/reload test has not yet been captured. The source change does not itself prove all application network activity.

### PixelCutout

Inspected `src/lib/workers/remove-background.ts`, `src/service-worker.js` and the main route.

- The Transformers.js runtime is dynamically imported only when the AI removal path is requested. The no-AI colour-removal path does not load the AI runtime.
- The worker configures `allowLocalModels = false` and `useBrowserCache = true`, then loads `Xenova/modnet`. It prefers the `q4f16` WebGPU model and falls back to `uint8` WASM if WebGPU loading or inference fails.
- The selected image is passed to the worker as a Blob and processed using browser image APIs/OffscreenCanvas. The visible route enforces a 20 MB image limit and revokes temporary object URLs when they are replaced or the editor is reset/unmounted.
- The service worker intercepts only same-origin GET requests. Its cache contains compiled app assets, selected PWA assets and the app entry route; comments and conditions exclude Blob URLs, cross-origin model downloads and non-GET requests.
- The AI model/runtime downloads remain network requests to their public model host(s). They are not the same thing as uploading the selected image.

**Evidence and limits:** These findings support the intended distinction between local pixel processing and remote AI model downloads at source level. No clean-profile DevTools trace has yet verified the actual runtime request list or confirmed the absence of image payloads in all outbound requests.

### Sikkim Government Salary Calculator

Inspected `src/lib/pay-history-storage.ts`, `src/lib/pay-history-management.ts` and `src/lib/arrears-storage.ts`.

- Pay-history data uses localStorage key `sikkim-salary-pay-history:v1`. Its versioned JSON backup has a 1,000,000-character limit and a maximum of 500 entries.
- Pay-history imports are structurally checked and validated against the pay-progression rules before being accepted. The management module supports editing and deleting individual entries, and re-validates the edited chronology.
- Arrears scenarios use localStorage key `sikkim-salary-arrears-scenario-v1`. Backups are limited to 2 MiB and validated for supported schema version, dates, salary fields, event types, monthly records and historical-rate structure before restore.
- These are separate tools and storage records; this targeted review does not imply that every calculator route uses only these keys or that all transient values have the same retention behaviour.

**Evidence and limits:** The source contains validation and data-management code, but the complete storage-key inventory and a clean-profile network trace across all calculator routes have not been completed. The salary-calculation formula/effective-date review against signed Government orders remains separate from this privacy review.

## Additional targeted source scan — 11 November 2026

A targeted pattern scan was run over source files in the linked application repositories. The scan looked for explicit fetch, XMLHttpRequest, sendBeacon, WebSocket, EventSource, remote URLs, browser storage and service-worker cache use. It helps locate code paths, but it is not a review of every transitive dependency, compiled bundle or runtime request.

### PixelForge Studio

- Scanned 17 JavaScript, TypeScript, Svelte and HTML source files, including the current editor route, engine, storage module, service worker and legacy static entry.
- No direct app-level fetch, XHR, beacon, WebSocket or EventSource usage was found in the scanned UI/editor modules.
- The service worker uses fetch only after rejecting non-GET requests and requests whose origin differs from its own origin. It caches same-origin app assets and navigations.
- Recovery records use IndexedDB through the storage module; the current route also exposes the recovery summary and explicit clear control.
- This confirms the intended first-party source structure, not the absence of all third-party requests or image/document transmission in a deployed browser session.

### PixelCutout

- Scanned 16 JavaScript, TypeScript, Svelte and HTML source files, including the main route, editor components, worker and service worker.
- The AI worker dynamically imports @huggingface/transformers only when AI removal is requested and loads Xenova/modnet; model/runtime assets therefore require third-party network downloads on first use.
- The no-AI path uses the local colour-removal worker. The route's fetch(cutout) is used for clipboard export after cutout is created with URL.createObjectURL from the worker's generated Blob; this is not a request to a remote HTTP endpoint.
- The service worker explicitly ignores non-GET and cross-origin requests, so its cache path does not intercept remote model downloads.
- No XHR, beacon, WebSocket or EventSource API usage was found in the scanned source files. Runtime request logging is still required before making an absolute no-upload claim.

### Sikkim Government Salary Calculator

- Scanned 15 key JavaScript, TypeScript, Svelte and HTML files covering the calculator route/component, arrears planner, pay-progression, payslip, retirement, GPF and temporary-pay routes, plus the main storage and source-reference modules.
- The reviewed files use browser-local storage for the theme, pay history and arrears scenarios. The inspected storage modules validate backup shape and size before restore.
- The reviewed routes and calculation modules contained no app-level fetch, XHR, beacon, WebSocket or EventSource calls. sources.ts and the UI contain outbound links to Government orders and reference material; these are user-initiated link navigations rather than automatic data submissions.
- The source scan did not cover every module in the repository, every npm dependency or the production browser runtime. It does not establish that all employee-entered data stays local under every route and dependency.

## Not yet verified

- Exhaustive source-code search for outbound requests, analytics, error reporting and third-party scripts across every active route and dependency in each application. The source review above is targeted, not exhaustive.
- Clean-profile browser DevTools network trace for each primary workflow, including first-run AI model download, export, autosave, restore and secondary tools; confirm no user image or payroll record is transmitted unexpectedly.
- Browser-runtime inspection of localStorage, IndexedDB, Cache Storage, cookies and service-worker caches to confirm the source-level inventory and actual retention/deletion behaviour.
- Third-party dependency and CDN inventory for each app.
- Salary calculator's effective-date and formula correctness against signed Government orders.

## Recommended next audit steps

1. Inspect each application's active routes, service worker, API calls, workers and dependency imports.
2. Run clean-profile browser tests with network logging for each core workflow.
3. Verify that user image/document payloads never appear in outbound requests.
4. Document exact storage keys, retention, deletion and backup/restore behaviour.
5. Record the audit date and tested app commit for each verified claim.
6. Keep privacy copy conservative until those checks are complete.

## Source repositories reviewed

- https://github.com/leenusdarnal/pixelforge-studio
- https://github.com/leenusdarnal/pixelcutout
- https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR
