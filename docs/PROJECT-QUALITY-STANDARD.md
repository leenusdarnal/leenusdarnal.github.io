# Shared project quality standard

**Version:** 1.0  
**Adopted as a target:** 11 November 2026  
**Applies to:** Public applications and experiments linked from the personal website

This standard is a target, not a claim that every repository already complies.

## 1. Project classification

Every project must identify one of these states:

- **Maintained application:** deployed, has a documented maintenance path and receives routine checks.
- **Experimental application:** works as a demonstrator but may change or break without notice.
- **Source-only experiment:** code is published, but no maintained public demo is promised.
- **Archived:** no active development; historical reference only.
- **Unsupported:** available, but compatibility and maintenance are not promised.

Do not label a project production-ready merely because it has a public URL.

## 2. Release gates

### Build and dependencies
- Keep the package manifest and lockfile committed together.
- Use the same supported Node.js major in local documentation and CI.
- Use clean lockfile-based installs in CI.
- Run type checks, unit tests and production builds.
- Review dependency and GitHub Actions updates.
- Keep workflow permissions minimal and set job timeouts.
- Document approved exceptions to build failures.

### Security
- Do not commit secrets, tokens, private keys or user data.
- Validate imported files and external input.
- Treat remote content, model files and uploads as untrusted.
- Review dependency advisories and transitive packages.
- Avoid exposing privileged secrets to untrusted pull-request code.
- Document private security reporting where supported.

### Privacy and data handling
- State whether data is processed locally, sent to an application server or sent to a third party.
- List material browser storage, retention and deletion behaviour.
- Explain network requirements, including model/runtime downloads.
- Provide export, restore and deletion controls when users create persistent data.
- Never make privacy claims stronger than source and runtime evidence support.
- Do not attach user files or sensitive records to diagnostics by default.

### Reliability
- Provide progress and failure feedback for lengthy work.
- Handle cancellation, retries, offline states and storage failures.
- Preserve work during expected error and recovery paths.
- Explain browser/device limitations.
- Do not promise offline operation without testing the relevant workflow offline.

### Accessibility and responsive layout
- Target WCAG 2.2 AA for core journeys.
- Support keyboard interaction and visible focus.
- Use semantic structure and accessible labels.
- Respect reduced-motion preferences.
- Check contrast in all supported themes.
- Provide touch-friendly controls and alternatives to drag-only actions where practical.

### Testing
- Test critical workflows, not only whether a page loads.
- Add regression tests for calculation, file, storage and state-management logic.
- Run generated-site or production smoke checks.
- Test supported browser/device combinations and record exact versions.
- Review visual regressions across representative viewports and themes.
- Mark untested combinations explicitly.

### Documentation and licensing
- Document setup, build, test and deployment commands.
- State project status and known limitations.
- Keep screenshots and feature descriptions authentic.
- Record source-code licence status and third-party attribution.
- Do not imply reuse permission where no licence has been granted.
- Document how users can report reproducible issues.

## 3. Performance targets

Use these Core Web Vitals good thresholds as targets when field or lab data is available:

| Metric | Target |
| --- | --- |
| Largest Contentful Paint (LCP) | ≤ 2.5 seconds |
| Interaction to Next Paint (INP) | ≤ 200 milliseconds |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |

These are p75 field-assessment thresholds. A Lighthouse lab score is useful diagnostic evidence but is not a substitute for field data. Do not publish scores without retaining and reviewing the underlying report.

Reference: https://web.dev/articles/defining-core-web-vitals-thresholds

## 4. Accessibility target

Use WCAG 2.2 Level AA as the target for core user journeys. Manual review remains necessary in addition to automated checks, especially for keyboard order, screen-reader announcements, dialogs, drag interactions and touch targets.

Reference: https://www.w3.org/TR/WCAG22/

## 5. Repository readiness checklist

- [ ] Clean dependency installation succeeds from the committed lockfile.
- [ ] Static/type checks, automated tests and production build pass.
- [ ] High-severity dependency findings are resolved or documented.
- [ ] Secrets and workflow permissions have been reviewed.
- [ ] Data processing, storage, outbound requests and retention are documented.
- [ ] Export, restore and deletion behaviour is tested where applicable.
- [ ] Licence and third-party asset/model terms are clear.
- [ ] Core workflows are usable on supported mobile and desktop browsers.
- [ ] Keyboard and accessibility checks are complete.
- [ ] Failure states and recovery paths are tested.
- [ ] User documentation and known limitations are current.
- [ ] Deployment status and last successful check can be verified.

## 6. Exceptions and maintenance

For any incomplete item, document the reason, impact, affected workflow and next review point. Do not weaken the standard merely to make a checklist pass. Revisit this standard when browsers, frameworks, hosting providers or security guidance change.
