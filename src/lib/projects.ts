/**
 * Shared project catalogue for homepage cards and prerendered case studies.
 *
 * Keep a project's identity, links, stack and long-form notes together here.
 * UI components own only presentation; route files select records by slug.
 */
export type ProjectCategory = 'client-compute' | 'full-stack' | 'svelte' | 'react';
export type ProjectVisual = 'pixel' | 'metro' | 'salary' | 'cutout';

export interface ProjectRecord {
  number: string;
  slug: string;
  categories: readonly ProjectCategory[];
  name: string;
  type: string;
  description: string;
  audience: string;
  firstAction: string;
  stack: readonly string[];
  features: readonly string[];
  live: string;
  source: string;
  visual: ProjectVisual;
  caseStudy: {
    category: string;
    summary: string;
    description: string;
    role: string;
    highlights: readonly string[];
    approach?: readonly string[];
    constraints?: readonly string[];
    nextSteps?: readonly string[];
    previewImage?: string;
    previewAlt?: string;
    previewSourceUrl?: string;
    privacy?: string;
    disclaimer?: string;
  };
}

export const projects: readonly ProjectRecord[] = [
  {
    number: '01',
    slug: 'pixelforge-studio',
    categories: ['svelte'],
    name: 'PixelForge Studio',
    type: 'IMAGE EDITOR · BROWSER APP',
    description: 'Edit images in your browser with layers, masks, selection tools and editable text. Keep working with local autosaves and export a .pfs file for a separate backup.',
    audience: 'People who want practical image edits with local projects and portable backups.',
    firstAction: 'Open the editor, create a canvas or import an image, then export a .pfs backup.',
    stack: ['SvelteKit', 'Tailwind CSS', 'Canvas API'],
    features: ['Editable text layers', '24 MP document target', 'Offline-first local projects'],
    live: 'https://pixelforge-studio-pied.vercel.app/',
    source: 'https://github.com/leenusdarnal/pixelforge-studio',
    visual: 'pixel',
    caseStudy: {
      category: 'Image editor · Browser app',
      summary: 'A mobile-friendly, offline-first image editor designed to make practical image editing available directly in the browser.',
      description: 'PixelForge Studio brings common image-editing workflows into a browser-based workspace. Its feature set includes layers, masks, selection tools and editable text, with local autosave and portable .pfs project files so work can remain on the user’s device.',
      role: 'Independent project',
      highlights: ['Editable text layers', '24 MP document target', 'Offline-first local projects', 'Portable .pfs project files'],
      approach: ['SvelteKit and Svelte 5 provide the application shell and workbench.', 'Canvas APIs handle the editing surface; IndexedDB stores local autosaves and recovery copies.', 'Portable .pfs project files provide a separate backup path without cloud sync.'],
      constraints: ['The editor targets 24 megapixels and a maximum 6,000-pixel document side.', 'Actual performance depends on device memory, layer count, masks and browser limits.', 'Web Workers are documented as planned, not active in the current release.'],
      nextSteps: ['Continue splitting the transitional canvas runtime into smaller feature modules.'],
      privacy: 'The project README documents IndexedDB autosaves and recovery copies on the current device, with no account, cloud sync or artwork upload. Browser storage can be cleared or evicted; export a .pfs file for a separate backup. This is a documentation-level review, not an independent network-traffic certification.'
    }
  },
  {
    number: '02',
    slug: 'metronome',
    categories: ['react'],
    name: 'Metronome',
    type: 'MUSIC PRACTICE · WEB APP',
    description: 'Keep a steady practice tempo with simple playback controls, adjustable BPM and selectable time signatures.',
    audience: 'Musicians and learners who want a quick, focused practice tempo.',
    firstAction: 'Set the BPM, choose a time signature and press Play.',
    stack: ['React', 'TypeScript', 'Vite'],
    features: ['Tempo control', 'Playback controls', 'Selectable time signatures'],
    live: 'https://react-metronome-dusky.vercel.app/',
    source: 'https://github.com/leenusdarnal/react-metronome',
    visual: 'metro',
    caseStudy: {
      category: 'Music practice · Web app',
      summary: 'A focused practice metronome with tempo and time-signature controls.',
      description: 'A lightweight browser tool for keeping a steady practice tempo. The interface focuses on quick tempo adjustment, playback and selecting a time signature without unnecessary setup.',
      role: 'Independent project',
      highlights: ['Tempo control', 'Playback controls', 'Selectable time signatures'],
      approach: ['The interface centres the practice loop on tempo, playback and time-signature selection.', 'The implementation uses React, TypeScript and Vite.'],
      constraints: ['The portfolio describes the visible product scope and does not claim unverified advanced practice features.'],
      previewImage: 'https://raw.githubusercontent.com/leenusdarnal/react-metronome/master/screenshots/react-metronome.png',
      previewAlt: 'Screenshot of the Metronome web app interface from its source repository.',
      previewSourceUrl: 'https://github.com/leenusdarnal/react-metronome/tree/master/screenshots'
    }
  },
  {
    number: '03',
    slug: 'sikkim-government-salary-calculator',
    categories: [],
    name: 'Sikkim Government Salary Calculator',
    type: 'REFERENCE TOOL · SIKKIM',
    description: 'Estimate basic pay plus DA first, then explore optional allowances, deductions and planning tools. An independent reference calculator, not an official payroll system.',
    audience: 'Sikkim Government employees exploring a non-authoritative monthly pay estimate.',
    firstAction: 'Choose a pay level and basic-pay cell, set the DA rate and calculate the base estimate.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    features: ['Gross pay estimates', 'Common deductions', 'In-hand pay estimates'],
    live: 'https://sikkim-government-salary-calculator.vercel.app/',
    source: 'https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR',
    visual: 'salary',
    caseStudy: {
      category: 'Reference tool · Sikkim',
      summary: 'An independent browser-based reference tool for estimating gross pay, common deductions and in-hand salary.',
      description: 'The calculator is intended as a convenient reference for exploring salary estimates. Actual pay depends on the applicable service rules, current rates, individual allowances and deductions, so results should be verified against official orders and payroll records.',
      role: 'Independent project',
      highlights: ['Gross pay estimates', 'Common deduction estimates', 'Estimated in-hand pay'],
      approach: ['The main flow starts with pay level, basic pay and DA before exposing optional tools.', 'Rates and historical schedules are source-referenced and effective-dated where supported.', 'Employee-specific records remain in browser-local storage; the app does not request payroll credentials.'],
      constraints: ['It is an independent estimate tool, not an official payroll system or pay-fixation authority.', 'Promotion fixation, retrospective arrears and other rule-dependent cases remain guarded where full validation is incomplete.', 'Verify current rates and employee eligibility against signed orders and the DDO / Accounts section.'],
      disclaimer: 'This is not an official Government of Sikkim calculator. It is an independent estimate tool and should not be treated as an authoritative pay determination. Confirm current rates, eligibility and deductions against signed orders and the DDO / Accounts section.',
      privacy: 'The project README states that calculations run in the browser and employee-specific records use browser-local storage or session-only workflows. It says the app does not request payroll credentials. Avoid using a shared device for personal records and use the app backup/export controls carefully. This is documentation-level evidence, not an independent network-traffic certification.'
    }
  },
  {
    number: '04',
    slug: 'pixelcutout',
    categories: ['client-compute', 'svelte'],
    name: 'PixelCutout',
    type: 'IMAGE TOOL · PRIVACY-FIRST',
    description: 'Remove image backgrounds with AI-assisted subject detection or a no-AI colour-selection workflow, then refine and export your result in the browser.',
    audience: 'People preparing portrait cutouts or removing simple, uniform backgrounds.',
    firstAction: 'Choose AI automatic or no-AI colour removal, then select an image.',
    stack: ['SvelteKit', 'Transformers.js', 'ONNX Runtime'],
    features: ['AI and no-AI removal modes', 'Local erase and restore tools', 'PNG, JPEG and WebP export'],
    live: 'https://pixelcutout-three.vercel.app/',
    source: 'https://github.com/leenusdarnal/pixelcutout',
    visual: 'cutout',
    caseStudy: {
      category: 'Image tool · Privacy-first',
      summary: 'A browser-based background remover with AI-assisted and colour-selection workflows.',
      description: 'PixelCutout offers a choice between AI-powered subject detection and a no-AI colour-selection mode. It also includes local erase and restore controls and supports common image export formats.',
      role: 'Independent project',
      highlights: ['AI and no-AI removal modes', 'Local erase and restore tools', 'PNG, JPEG and WebP export'],
      approach: ['AI mode uses MODNet with WebGPU attempted first and a WASM fallback.', 'No-AI mode uses local colour selection and does not download the model.', 'Brush edits, crop composition and export run in the browser; image pixels are not uploaded.'],
      constraints: ['MODNet is primarily a portrait-matting model and may be less reliable for pets, products, glass and complex scenes.', 'First-time AI use requires an internet connection to download model assets.', 'Batch queues, ZIP export and a draggable crop frame are not part of the current release.'],
      privacy: 'The project README states that image pixels are processed locally and are not uploaded. AI mode downloads model/runtime assets from public model hosts; the no-AI mode does not load the AI model. This statement is based on project documentation and still needs independent runtime/network verification.'
    }
  }
];
