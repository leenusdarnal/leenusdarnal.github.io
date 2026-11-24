/**
 * Shared project catalogue for homepage cards and prerendered case studies.
 *
 * Keep a project's identity, links, stack and long-form notes together here.
 * UI components own only presentation; route files select records by slug.
 */
export type ProjectCategory = 'client-compute' | 'full-stack' | 'svelte' | 'react';
export type ProjectVisual = 'pixel' | 'metro' | 'salary' | 'cutout' | 'guitar';

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
    previewSourceLabel?: string;
    previewWidth?: number;
    previewHeight?: number;
    privacy?: string;
    disclaimer?: string;
    faqs?: readonly { question: string; answer: string }[];
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
      privacy: 'The project README documents IndexedDB autosaves and recovery copies on the current device, with no account, cloud sync or artwork upload. Browser storage can be cleared or evicted; export a .pfs file for a separate backup. This is a documentation-level review, not an independent network-traffic certification.',
      faqs: [
        { question: 'Where are my edits saved?', answer: 'Autosaves and up to three recovery copies are stored in IndexedDB on this device. No account or cloud sync is required. Browser storage can be cleared or evicted, so export an editable .pfs project for a separate backup.' },
        { question: 'Can I clear the recovery copies?', answer: 'Yes. Open Manage local recovery and confirm the clear action. It removes the saved autosave and recovery copies, but it does not close or erase the canvas currently open or remove the offline app-shell cache. New edits can create fresh recovery snapshots.' },
        { question: 'What image size is supported?', answer: 'The documented target is 24 megapixels with a maximum document side of 6,000 pixels. Larger imports are scaled down proportionally. This is a guardrail, not a guarantee of performance on every device; layers, masks and available memory matter.' },
        { question: 'Can PixelForge work offline?', answer: 'PixelForge is described as offline-first and includes an app-shell cache. Offline use depends on the app and its assets having been loaded and cached successfully in the browser.' }
      ],
      previewImage: '/images/project-previews/pixelforge.jpg',
      previewAlt: 'Live PixelForge Studio interface showing the image-editing workspace, toolbar and layers panel.',
      previewSourceUrl: 'https://pixelforge-studio-pied.vercel.app/',
      previewSourceLabel: 'live application',
      previewWidth: 1440,
      previewHeight: 900
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
      faqs: [
        { question: 'What tempo range can I set?', answer: 'The tempo slider ranges from 30 to 240 BPM. The metronome starts at 80 BPM.' },
        { question: 'Which time signatures are available?', answer: 'You can choose 1/4, 2/4, 3/4 or 4/4. The default selection is 3/4.' },
        { question: 'Can I change tempo while playback is running?', answer: 'Yes. Changing BPM or the selected beat count updates the playback interval while the metronome is running.' },
        { question: 'Is my dark-mode preference remembered?', answer: 'The app stores the dark-mode choice in this browser’s localStorage and reads it when the app loads.' }
      ],
      previewImage: '/images/metronome-preview.png',
      previewAlt: 'Screenshot of the Metronome web app interface, captured from its live application.',
      previewSourceUrl: 'https://react-metronome-dusky.vercel.app/',
      previewSourceLabel: 'live application',
      previewWidth: 1440,
      previewHeight: 900
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
    stack: ['SvelteKit 3', 'Svelte 5', 'TypeScript', 'Tailwind CSS 4'],
    features: ['23 pay levels · 794 cells', 'Temporary-pay and arrears planners', 'GPF, service history and payslip tools'],
    live: 'https://sikkim-government-salary-calculator.vercel.app/',
    source: 'https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR',
    visual: 'salary',
    caseStudy: {
      category: 'Reference tool · Sikkim',
      summary: 'An independent browser-based reference tool for estimating gross pay, common deductions and in-hand salary.',
      description: 'The calculator covers all 23 State pay levels and 794 pay-matrix cells, with separate workflows for temporary pay, arrears, GPF, pay progression and payslip generation. It is an independent estimate tool; confirm rates and eligibility against signed orders and the DDO / Accounts section.',
      role: 'Independent project',
      highlights: ['23 State pay levels · 794 pay-matrix cells', 'Temporary-pay and arrears planners', 'GPF, service-history and payslip tools'],
      approach: ['SvelteKit 3, Svelte 5, TypeScript and Tailwind CSS 4 provide the application structure.', 'The main flow starts with pay level, basic pay and DA before exposing optional tools.', 'Rates and historical schedules are source-referenced and effective-dated where supported.', 'Employee-specific records remain in browser-local storage; the app does not request payroll credentials.'],
      constraints: ['It is an independent estimate tool, not an official payroll system or pay-fixation authority.', 'Promotion fixation, retrospective arrears and other rule-dependent cases remain guarded where full validation is incomplete.', 'Verify current rates and employee eligibility against signed orders and the DDO / Accounts section.'],
      disclaimer: 'This is not an official Government of Sikkim calculator. It is an independent estimate tool and should not be treated as an authoritative pay determination. Confirm current rates, eligibility and deductions against signed orders and the DDO / Accounts section.',
      privacy: 'The project README states that calculations run in the browser and employee-specific records use browser-local storage or session-only workflows. It says the app does not request payroll credentials. Avoid using a shared device for personal records and use the app backup/export controls carefully. This is documentation-level evidence, not an independent network-traffic certification.',
      faqs: [
        { question: 'Is this an official Government payroll calculator?', answer: 'No. It is an independent estimate tool, not an official Government payroll system or pay-fixation authority. Confirm rates, eligibility and deductions against current signed Government orders and the employee’s DDO / Accounts section.' },
        { question: 'What does the first calculation include?', answer: 'The main flow starts with Pay Level, Basic Pay and DA to produce a Basic Pay + DA gross estimate. Optional allowances, deductions, historical context and separate planning tools are available after the first result.' },
        { question: 'Where are employee records stored?', answer: 'The project documentation describes pay-history and arrears drafts as browser-local data with backup and restore options. Some optional employee metadata in print/payslip workflows is session-only. Treat records on a shared device as sensitive and remove them when no longer needed.' },
        { question: 'Does the calculator cover every pay-fixation case?', answer: 'No. Some rule-dependent cases, including direct-recruit fixation, promotion fixation, retrospective arrears and cohort-specific regularisation/ACPS, remain unautomated pending complete rule validation. Use the cited sources and seek confirmation from the DDO / Accounts section.' }
      ],
      previewImage: '/images/project-previews/salary-calculator.jpg',
      previewAlt: 'Live Sikkim Government Salary Calculator interface showing the pay-level, basic-pay and DA selection workflow.',
      previewSourceUrl: 'https://sikkim-government-salary-calculator.vercel.app/',
      previewSourceLabel: 'live application',
      previewWidth: 1440,
      previewHeight: 900
    }
  },
  {
    number: '04',
    slug: 'pixelcutout',
    categories: ['client-compute', 'svelte'],
    name: 'PixelCutout',
    type: 'IMAGE TOOL · AI & MANUAL MODES',
    description: 'Remove a background from one image at a time with AI-assisted subject detection or manual colour removal, then export a transparent PNG.',
    audience: 'People who need a single-image background cutout, especially portraits or simple, fairly uniform backgrounds.',
    firstAction: 'Choose one PNG, JPEG or WebP image, then select Remove background or Advanced manual colour removal.',
    stack: ['SvelteKit', 'Transformers.js', 'ONNX Runtime'],
    features: ['AI-assisted background removal', 'Advanced manual colour selection', 'Before/after comparison and transparent PNG export'],
    live: 'https://pixelcutout-three.vercel.app/',
    source: 'https://github.com/leenusdarnal/pixelcutout',
    visual: 'cutout',
    caseStudy: {
      category: 'Image tool · AI & manual modes',
      summary: 'A focused browser-based background remover with AI-assisted and manual colour-selection workflows for one image at a time.',
      description: 'PixelCutout works on one image at a time. AI mode uses MODNet for subject matting, while the advanced manual mode samples a background colour for removal. You can compare the result with the original and download a transparent PNG.',
      role: 'Independent project',
      highlights: ['AI subject removal with WebGPU and WASM paths', 'Manual colour removal with sampled-colour tolerance', 'Before/after comparison and transparent PNG export'],
      approach: ['AI model/runtime assets are loaded only after the user explicitly starts background removal; WebGPU is attempted first, with a WASM fallback.', 'Manual colour removal uses a local processing path and does not load the AI runtime or download model files.', 'The selected image is passed to a browser Web Worker for processing; independent runtime network verification remains pending.'],
      constraints: ['The current release handles one image at a time; batch queues and ZIP export are out of scope.', 'Accepts PNG, JPEG and WebP images up to 20 MB, 16 megapixels and 10,000 pixels on either side.', 'MODNet is primarily designed for people and portraits and may be less reliable on pets, products, fine objects, glass and complex scenes.', 'The first AI run requires an internet connection for model/runtime downloads; manual colour removal works without downloading the AI model.'],
      privacy: 'The current project README says source image pixels stay in the browser and are passed to a local Web Worker, and that pixels are not sent to an application server, model host, analytics service or cloud storage. AI mode downloads model/runtime assets from public model hosts after the user starts removal; manual colour mode does not load the AI model. This is documentation and targeted source evidence, not a clean-profile runtime network certification.',
      faqs: [
        { question: 'Can I process a batch of images?', answer: 'No. The current release processes one image at a time. Batch queues and ZIP export are outside the documented product scope.' },
        { question: 'Which images can I use?', answer: 'The app accepts PNG, JPEG and WebP images up to 20 MB, 16 megapixels and 10,000 pixels on either side. Files outside those limits are rejected before full-resolution processing.' },
        { question: 'Does AI removal need an internet connection?', answer: 'The first AI run needs a connection to download the model and runtime assets after you start removal. Advanced manual colour removal does not load the AI model and works without downloading those model files.' },
        { question: 'Are my image pixels uploaded?', answer: 'The project README says image pixels stay in the browser and are passed to a local Web Worker. It says they are not sent to the app server, model host, analytics service or cloud storage. AI mode does download model/runtime assets from public model hosts. These are documentation and targeted source findings, not a completed clean-profile network certification.' }
      ],
      previewImage: '/images/project-previews/pixelcutout.jpg',
      previewAlt: 'Live PixelCutout interface showing the AI background-removal action, manual colour-removal option and image selection area.',
      previewSourceUrl: 'https://pixelcutout-three.vercel.app/',
      previewSourceLabel: 'live application',
      previewWidth: 1440,
      previewHeight: 900
    }
  },
  {
    number: '05',
    slug: 'guitarlab',
    categories: ['svelte'],
    name: 'GuitarLab',
    type: 'GUITAR LEARNING · PRACTICE APP',
    description: 'Follow a structured guitar curriculum, plan practice and explore interactive music tools in a mobile-friendly, local-first workspace.',
    audience: 'Guitar learners who want a structured learning path and a private practice history on their own device.',
    firstAction: 'Create a local learner profile, choose a lesson from the curriculum and start a guided practice session.',
    stack: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Tailwind CSS 4', 'Cloudflare Workers', 'Drizzle / D1'],
    features: ['152 versioned lesson records', 'Local lesson progress and practice history', 'Fretboard, chord, tuner, metronome and ear-training tools'],
    live: 'https://guitarlab.leenusdarnal.workers.dev/',
    source: 'https://github.com/leenusdarnal/guitarlab',
    visual: 'guitar',
    caseStudy: {
      category: 'Education · Guitar learning and practice',
      summary: 'A local-first guitar-learning workspace combining a structured curriculum, guided lessons, practice planning and interactive music tools.',
      description: 'GuitarLab brings a structured guitar curriculum and day-to-day practice into one mobile-friendly workspace. Learners can work through lessons, resume checkpoints, record practice sessions, review progress and use a fretboard explorer, chord tools, metronome, tuner and ear training. Learner profiles and practice history are designed to stay in browser-local storage rather than being synced to a cloud learner-data store.',
      role: 'Independent project',
      highlights: ['152 lesson records across a two-year core curriculum and optional specialisations', 'Local learner profiles, lesson checkpoints, completion and practice history', 'Practice planner, fretboard explorer, chord tools, metronome, tuner and ear training', 'Responsive offline app shell with export, restore and reset workflows'],
      approach: [
        'SvelteKit, Svelte 5, TypeScript and Tailwind CSS 4 provide the application structure; the app is deployed to a Cloudflare Workers runtime.',
        'The versioned curriculum contains 152 lesson records: 52 weeks in Year 1, 52 weeks in Year 2 and four optional 12-week Year 3+ specialisations.',
        'Learner profiles and practice history are stored in browser-local IndexedDB. Lesson completion, practice activity and demonstrated skill evidence are treated as separate signals.',
        'Interactive music tools use the Web Audio API and MediaDevices. Microphone input is designed to start only after explicit user action and to be processed locally by default.',
        'The optional account layer uses a dedicated Cloudflare D1 database for identity and session data only; it does not enable cloud learner-data synchronisation.'
      ],
      constraints: [
        'The existence of a lesson record or successful schema validation does not mean its teaching has completed human musical review.',
        'Account code is present, but production account activation remains gated on database migrations, credentials and identity-provider configuration.',
        'Cloud learner-data synchronisation is not enabled; learner profiles and practice history remain browser-local.',
        'The repository has not selected an open-source licence. Public visibility does not automatically grant reuse permission.'
      ],
      nextSteps: [
        'Continue the documented curriculum audit and remediation process before describing every lesson as fully human-reviewed.',
        'Keep optional account activation and any future cloud learner-data sync behind explicit production, privacy and security acceptance gates.'
      ],
      privacy: 'The repository documents browser-local IndexedDB for learner profiles and practice history, explicit user action before microphone access, and local audio processing by default. The dedicated production D1 databases are described as identity/session stores, not learner-data sync stores; cloud learner-data synchronisation is not enabled. This summary reflects repository documentation and design decisions, not an independent clean-profile network or storage certification.',
      faqs: [
        { question: 'Is learner progress synced to the cloud?', answer: 'No. The documented current design stores learner profiles and practice history in browser-local IndexedDB. Cloud learner-data synchronisation is not enabled.' },
        { question: 'Does GuitarLab listen through my microphone automatically?', answer: 'The project principles require microphone input to start only after explicit user action and to be processed locally by default. Browser microphone permission is therefore tied to a user-started audio feature, not background listening.' },
        { question: 'Have all 152 lessons been musically reviewed?', answer: 'The repository explicitly warns that a lesson record existing or passing schema validation does not by itself mean its teaching has completed human musical review. Curriculum audit and remediation remain tracked work.' },
        { question: 'Can I create an account?', answer: 'Optional email/password and Google/GitHub OAuth code is present, but production account activation remains gated on database migrations, credentials and provider configuration. Accounts do not enable cloud learner-data synchronisation.' }
      ]
    }
  },
];
