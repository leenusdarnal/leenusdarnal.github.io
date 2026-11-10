/**
 * Homepage project catalogue.
 *
 * Keep project facts and links here; presentation and interaction belong in
 * the Svelte components that consume this data.
 */
export const projects = [
    {
      number: '01',
      slug: 'pixelforge-studio',
      categories: ['svelte'],
      name: 'PixelForge Studio',
      type: 'IMAGE EDITOR · BROWSER APP',
      description: 'A mobile-friendly, offline-first image editor with layers, masks, selection tools, editable text and local .pfs project files. It targets 24 MP documents and autosaves on your device.',
      stack: ['SvelteKit', 'Tailwind CSS', 'Canvas API'],
      features: ['Editable text layers', '24 MP document target', 'Offline-first local projects'],
      live: 'https://pixelforge-studio-pied.vercel.app/',
      source: 'https://github.com/leenusdarnal/pixelforge-studio',
      visual: 'pixel'
    },
    {
      number: '02',
      slug: 'metronome',
      categories: ['react'],
      name: 'Metronome',
      type: 'MUSIC PRACTICE · WEB APP',
      description: 'A straightforward practice metronome with tempo control, playback and selectable time signatures.',
      stack: ['React', 'TypeScript', 'Vite'],
      features: ['Tempo control', 'Playback controls', 'Selectable time signatures'],
      live: 'https://react-metronome-dusky.vercel.app/',
      source: 'https://github.com/leenusdarnal/react-metronome',
      visual: 'metro'
    },
    {
      number: '03',
      slug: 'sikkim-government-salary-calculator',
      categories: [],
      name: 'Sikkim Government Salary Calculator',
      type: 'REFERENCE TOOL · SIKKIM',
      description: 'An independent browser-based reference calculator for estimating gross pay, common deductions and in-hand salary. It is not an official Government of Sikkim calculator.',
      stack: ['JavaScript', 'HTML', 'CSS'],
      features: ['Gross pay estimates', 'Common deductions', 'In-hand pay estimates'],
      live: 'https://sikkim-government-salary-calculator.vercel.app/',
      source: 'https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR',
      visual: 'salary'
    },
    {
      number: '04',
      slug: 'pixelcutout',
      categories: ['client-compute', 'svelte'],
      name: 'PixelCutout',
      type: 'IMAGE TOOL · PRIVACY-FIRST',
      description: 'A browser-based background remover with a choice of AI-powered subject detection or a no-AI colour selection mode. Images stay on your device while you edit and export.',
      stack: ['SvelteKit', 'Transformers.js', 'ONNX Runtime'],
      features: ['AI and no-AI removal modes', 'Local erase and restore tools', 'PNG, JPEG and WebP export'],
      live: 'https://pixelcutout-three.vercel.app/',
      source: 'https://github.com/leenusdarnal/pixelcutout',
      visual: 'cutout'
    }
] as const;
