# Project licensing and attribution inventory

**Initial review date:** 11 November 2026  
**Purpose:** Record repository-level licence evidence and prevent accidental claims of reuse permission.

This is a preliminary repository metadata and root-file inventory. It is not a legal opinion or a complete dependency/asset licence scan. A missing licence means default copyright restrictions apply; public visibility alone does not grant permission to reuse, modify or redistribute a project.

## Repository inventory

| Repository | Evidence observed | Current status | Required action |
| --- | --- | --- | --- |
| Personal website | GitHub metadata reports no licence; reviewed tree had no root LICENSE file | No reuse licence identified | Owner decision required |
| PixelForge Studio | GitHub metadata reports MIT; root LICENSE exists; package manifest says MIT | MIT | Preserve licence and review third-party assets separately |
| PixelCutout | GitHub metadata reports no licence; reviewed tree had no root licence | No reuse licence identified | Owner decision required |
| Salary Calculator | GitHub metadata reports no licence; README says no licence is provided | No reuse licence identified | Owner decision required |
| React Metronome | GitHub metadata reports no licence; reviewed tree had no root licence | No reuse licence identified | Owner decision required |
| Breadit | GitHub metadata reports no licence; reviewed tree had no root licence | No reuse licence identified | Owner decision required |
| Chirp | GitHub metadata reports no licence; reviewed tree had no root licence | No reuse licence identified | Owner decision required |
| ROFC Web Hub | Repository identity and licence evidence not confirmed | Unknown | Confirm repository before reviewing |

## Third-party materials to inventory

| Project | Known material | Next verification |
| --- | --- | --- |
| PixelCutout | Xenova/modnet model documented as Apache-2.0; Transformers.js and ONNX Runtime Web dependencies | Confirm model revision, model card, runtime dependencies and redistributed notices |
| PixelForge Studio | UI assets and npm dependencies | Review icon/font/image assets and package notices |
| Personal website | Inter and Fira Code bundled through Fontsource; project logos/screenshots | Confirm included image/icon rights and package notices |
| Salary Calculator | Government notifications/PDFs linked as source material; npm dependencies | Distinguish citations from copied materials and review dependency licences |
| React Metronome | Existing screenshot and application assets | Trace original asset source and applicable terms |

## Rules for future changes

1. Do not add MIT, Apache-2.0 or another licence automatically.
2. Do not state open source unless an applicable licence is present.
3. Keep model, source-code, font, image and npm dependency licences as separate records.
4. Preserve upstream copyright and NOTICE files.
5. Confirm whether model terms cover weights, code, configuration and redistribution.
6. If a project remains unlicensed, say so plainly and ask users to obtain permission before reuse.
7. Re-run the inventory after adding major dependencies or replacing assets.

## Owner decisions pending

- [ ] Select or explicitly decline a licence for the personal website repository.
- [ ] Select or explicitly decline a licence for PixelCutout.
- [ ] Select or explicitly decline a licence for Salary Calculator.
- [ ] Select or explicitly decline a licence for React Metronome.
- [ ] Decide whether Breadit and Chirp remain unlicensed experiments, receive a licence or are archived.
- [ ] Confirm the repository identity for ROFC Web Hub.

No licence files are added by this inventory. Choose intended terms before publishing a permission grant.
