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

The homepage's optional repository metadata component calls the public GitHub API from the visitor's browser to display repository stars and last-push dates. It does not send user-entered project files, but it creates an avoidable third-party request and exposes the visitor's request to GitHub. This is a product metadata feature, not a file-processing requirement.

## Not yet verified

- Full source-code search for outbound requests, analytics, error reporting and third-party scripts in each application.
- Browser DevTools network trace for each primary workflow, including first-run AI model download, export, autosave, restore and secondary tools.
- Storage inspection for localStorage, IndexedDB, Cache Storage, cookies and service-worker caches.
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
