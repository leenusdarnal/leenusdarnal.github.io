# Homepage redesign using Refactoring UI

**Date:** 22 November 2026  
**Repository:** `leenusdarnal/leenusdarnal.github.io`  
**Design source:** *Refactoring UI*, Adam Wathan and Steve Schoger

## Design intent

Keep the approved hybrid portfolio and practical-tool hub, slate-and-emerald character, typography-only identity, accessible theme switch, filter-free project list and honest live/source distinctions. The redesign changes visual hierarchy and responsive composition, not the product's purpose or claims.

## Applied principles

- **Hierarchy over decoration:** the name and one clear project action lead; supporting copy, navigation shortcuts and secondary links are quieter. The featured tool launcher uses a structured numbered list rather than several equally weighted buttons.
- **A small design system:** a fixed HSL neutral and emerald palette, a deliberate spacing rhythm, a compact type scale, consistent radii and five reusable elevation levels replace one-off values in the core theme.
- **Space and measure:** the hero no longer reserves a fixed 540–650px viewport height. Text measures are constrained and the main intro and tool launcher use a responsive two-column composition only when there is room.
- **Responsive navigation:** narrow screens use a native disclosure menu so the theme control and every navigation destination remain independently tappable.
- **Less visual noise:** the featured project gets one restrained accent edge; cards rely on subtle elevation, surface contrast and spacing rather than stacking heavy borders.
- **Motion with restraint:** hover movement remains subtle and is disabled for reduced-motion preferences. Real application previews, content and links are retained.

## Source references

The implementation follows the guidance in *Refactoring UI*: visual hierarchy and action priority (pp. 35–62), whitespace and constrained spacing (pp. 65–99), type scale and readable measure (pp. 101–136), HSL-based palette systems (pp. 137–166), elevation and image handling (pp. 171–217), and empty states / fewer borders / finishing touches (pp. 219–247).

## Verification

The branch adds regression tests for design tokens, hero hierarchy, mobile navigation and project-card elevation. The responsive browser test now explicitly opens the compact mobile disclosure before exercising the navigation links. Build, type-check, generated-site tests, responsive Chromium checks and axe-core checks remain release gates; this document does not claim that unrun checks have passed.
