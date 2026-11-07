const projects = [
  {
    slug: 'pixelforge-studio',
    number: '01',
    name: 'PixelForge Studio',
    category: 'Image editor · Browser app',
    summary: 'A mobile-friendly, offline-first image editor designed to make practical image editing available directly in the browser.',
    description: 'PixelForge Studio brings common image-editing workflows into a browser-based workspace. Its feature set includes layers, masks, selection tools and editable text, with local autosave and portable .pfs project files so work can remain on the user’s device.',
    role: 'Independent project',
    stack: ['SvelteKit', 'Tailwind CSS', 'Canvas API'],
    highlights: ['Editable text layers', '24 MP document target', 'Offline-first local projects', 'Portable .pfs project files'],
    live: 'https://pixelforge-studio-pied.vercel.app/',
    source: 'https://github.com/leenusdarnal/pixelforge-studio',
    privacy: 'Projects and autosaves are stored locally in the browser. Export a .pfs project file to keep a separate backup.'
  },
  {
    slug: 'metronome',
    number: '02',
    name: 'Metronome',
    category: 'Music practice · Web app',
    summary: 'A focused practice metronome with tempo and time-signature controls.',
    description: 'A lightweight browser tool for keeping a steady practice tempo. The interface focuses on quick tempo adjustment, playback and selecting a time signature without unnecessary setup.',
    role: 'Independent project',
    stack: ['React', 'TypeScript', 'Vite'],
    highlights: ['Tempo control', 'Playback controls', 'Selectable time signatures'],
    live: 'https://react-metronome-dusky.vercel.app/',
    source: 'https://github.com/leenusdarnal/react-metronome'
  },
  {
    slug: 'sikkim-government-salary-calculator',
    number: '03',
    name: 'Sikkim Government Salary Calculator',
    category: 'Reference tool · Sikkim',
    summary: 'An independent browser-based reference tool for estimating gross pay, common deductions and in-hand salary.',
    description: 'The calculator is intended as a convenient reference for exploring salary estimates. Actual pay depends on the applicable service rules, current rates, individual allowances and deductions, so results should be verified against official orders and payroll records.',
    role: 'Independent project',
    stack: ['JavaScript', 'HTML', 'CSS'],
    highlights: ['Gross pay estimates', 'Common deduction estimates', 'Estimated in-hand pay'],
    live: 'https://sikkim-government-salary-calculator.vercel.app/',
    source: 'https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR',
    disclaimer: 'This is not an official Government of Sikkim calculator. It is an independent reference tool and should not be treated as an authoritative pay determination.'
  },
  {
    slug: 'pixelcutout',
    number: '04',
    name: 'PixelCutout',
    category: 'Image tool · Privacy-first',
    summary: 'A browser-based background remover with AI-assisted and colour-selection workflows.',
    description: 'PixelCutout offers a choice between AI-powered subject detection and a no-AI colour-selection mode. It also includes local erase and restore controls and supports common image export formats.',
    role: 'Independent project',
    stack: ['SvelteKit', 'Transformers.js', 'ONNX Runtime'],
    highlights: ['AI and no-AI removal modes', 'Local erase and restore tools', 'PNG, JPEG and WebP export'],
    live: 'https://pixelcutout-three.vercel.app/',
    source: 'https://github.com/leenusdarnal/pixelcutout',
    privacy: 'The portfolio describes the editing workflow as local to the device. Check the project documentation for the exact model/runtime behaviour and browser requirements.'
  }
];

export const prerender = true;
export const trailingSlash = 'always';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return projects.map(({ slug }) => ({ slug }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) {
    return { project: null };
  }
  return { project };
}
