# Homepage design brief and implementation roadmap

**Date:** 19 November 2026  
**Repository:** `leenusdarnal/leenusdarnal.github.io`  
**Production site:** https://leenusdarnal.github.io/

## Approved design brief

The homepage should be a balanced hybrid portfolio and practical-tool hub. It should communicate identity, useful applications and engineering credibility in the opening experience without turning into a long personal biography or a dense project catalogue.

### Decisions confirmed by the site owner

1. **Audience:** hybrid portfolio and tools.
2. **About presentation:** typography-only; no personal photograph or illustrated avatar.
3. **Visual direction:** balanced hybrid, using a minimal foundation with selected developer and creative details.
4. **Hero:** combined introduction, featured projects and useful tools.
5. **Project collection:** curated flagship projects, recent experiments and a compact path to the complete collection.
6. **Project cards:** progressive detail; concise initial presentation with deeper information available on demand.
7. **Personal storytelling:** concise introduction with optional deeper About content.
8. **Navigation:** adaptive across desktop and mobile.
9. **Motion:** subtle and purposeful transitions and hover effects.
10. **Primary outcome:** a complete balance of personal brand, useful tools, project credibility and professional opportunities.

## Experience principles

- Make the first screen understandable within seconds.
- Give practical tools first-class visibility alongside project work.
- Use typography, layout and spacing—not a portrait—to express identity.
- Keep initial project cards scannable; make technical detail optional.
- Keep every live/demo/source distinction honest and verifiable.
- Preserve accessible semantics, keyboard use, reduced-motion support and touch-friendly targets.
- Preserve the site's performance, privacy and static-hosting strengths.

## Roadmap

### Phase 1 — Discovery and first-screen clarity
- [x] Audit current homepage structure, central configuration and project catalogue.
- [x] Turn the hero's descriptive chips into useful in-page navigation shortcuts.
- [x] Add direct quick-start links to three existing featured applications in the hero.
- [ ] Review the hero at 320, 360, 390, 768 and desktop widths.
- [ ] Confirm all hero links have clear focus states and sensible destinations.

### Phase 2 — Navigation and responsive polish
- [ ] Test the existing navigation at narrow mobile widths and implement a compact, accessible mobile pattern if needed.
- [ ] Keep desktop navigation concise and task-oriented.
- [ ] Verify keyboard focus order, visible focus, 44px touch targets and reduced-motion behaviour.

### Phase 3 — Project discovery and progressive detail
- [ ] Review project card density and consistency across all four flagship projects.
- [ ] Keep primary actions (launch, source, project notes) obvious.
- [ ] Move secondary architecture detail behind accessible disclosure controls where it improves scanning.
- [ ] Ensure source-only experiments are visually distinct from live applications.
- [ ] Preserve the no-filter primary discovery decision.

### Phase 4 — Content and trust
- [ ] Refresh the dated Recent improvements content only from verified merged commits.
- [ ] Review hero copy for concise, task-oriented language and remove duplication with About.
- [ ] Maintain precise privacy statements for each tool and distinguish documentation from runtime verification.
- [ ] Verify the social preview PNG decodes and matches its declared 1200 × 630 dimensions.

### Phase 5 — Quality, privacy and release
- [ ] Run Svelte/TypeScript checks, production build and Node test suite.
- [ ] Run responsive browser tests and accessibility scans.
- [ ] Verify same-origin assets, outbound links, canonical metadata and all project routes.
- [ ] Complete clean-profile storage/network checks for the homepage and linked applications where feasible.
- [ ] Review GitHub Actions results before merging.
- [ ] Merge only after checks pass, then verify GitHub Pages deployment and live routes.

## Scope guardrails

- No portrait, avatar or identity illustration in the About section.
- No unnecessary homepage redesign or new visual framework.
- Do not add filters back to the primary project list.
- Do not claim runtime privacy, accessibility certification or performance results without fresh evidence.
- Do not change hosting or deploy to an unverified target as part of this design pass.

## Initial implementation in this change set

The hero now uses the existing configured tags as keyboard-accessible in-page links and includes direct links to the first three existing applications. This provides a more balanced opening without inventing new products or changing the project catalogue. Remaining roadmap items require responsive/browser verification and will be handled in subsequent, separately verified increments.
