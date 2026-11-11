# Browser and device compatibility register

**Baseline date:** 11 November 2026  
**Evidence status:** Test matrix created; no new compatibility claims are made by this document.

A browser is considered tested only after actual application workflows have been exercised on the stated browser and device. A page rendering without an error is not sufficient.

## Status definitions

- **Pass:** Critical workflows tested successfully on the stated environment.
- **Partial:** Some workflows pass; limitations are listed.
- **Fail:** A critical workflow does not work.
- **Not tested:** No reliable test evidence is recorded.
- **Not applicable:** The workflow does not exist in the application.

## Test matrix

| Application | Android Chrome | Desktop Chrome | Edge | Firefox | iOS Safari | macOS Safari |
| --- | --- | --- | --- | --- | --- | --- |
| Personal website | Not tested | Not tested | Not tested | Not tested | Not tested | Not tested |
| PixelForge Studio | Not tested | Not tested | Not tested | Not tested | Not tested | Not tested |
| PixelCutout | Not tested | Not tested | Not tested | Not tested | Not tested | Not tested |
| Salary Calculator | Not tested | Not tested | Not tested | Not tested | Not tested | Not tested |
| React Metronome | Not tested | Not tested | Not tested | Not tested | Not tested | Not tested |

Existing automated build/test results do not establish compatibility for all physical devices or browsers.

## Required test cases

### Personal website
- Initial load and navigation.
- Mobile menu and touch interactions.
- Light/dark theme and saved preference.
- FAQ and project links.
- Keyboard navigation and focus indicators.
- 404 recovery route.
- Service-worker update and reload behaviour.

### PixelForge Studio
- Create/import image.
- Canvas editing, layer operations and undo/redo.
- Autosave and recovery after reload.
- Export and reopen a PFS project.
- Storage unavailable or quota exceeded.
- Large image warning and cancellation.
- Offline core editing after the app shell is installed.

### PixelCutout
- Import and preview image.
- No-AI colour removal without model download.
- AI model download, progress, cache and retry.
- WebGPU path where supported.
- WASM fallback.
- Editor, undo/redo and export.
- Low-memory, failed-download and offline states.

### Salary Calculator
- Main salary calculation and deductions.
- Source notes and effective-date handling.
- Arrears, pay progression and other enabled planners.
- Export/restore and local/session data behaviour.
- Print and PDF flows.
- Keyboard, touch and small-screen forms.
- Non-official and estimate limitations remain visible.

### React Metronome
- Start, stop and tempo adjustment.
- Timing stability under background/tab changes.
- Keyboard and touch controls.
- Audio permissions and autoplay behaviour.
- Mobile responsive interaction.

## Evidence to record for each run

| Field | Required value |
| --- | --- |
| Application version | Release/tag or tested commit SHA |
| Test date | ISO date |
| Device | Exact model or representative environment |
| Operating system | Version |
| Browser | Name and full version |
| Workflow | Specific test cases completed |
| Result | Pass / Partial / Fail |
| Known limitation | Reproducible detail or None observed |
| Evidence | CI run, screenshot or concise test notes |

Do not infer support from browser brand alone. Record WebGPU, file-system, service-worker, storage or audio API support separately where it affects a feature.
