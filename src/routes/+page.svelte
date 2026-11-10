<script>
  import { onMount } from 'svelte';
  import LabControls from '../lib/LabControls.svelte';
  import ProjectActions from '../lib/ProjectActions.svelte';
  import { personalSpaceConfig } from '../lib/personal-space.config';

  let theme = $state('dark');

  const projects = [
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
  ];

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Leenus Darnal',
        url: 'https://leenusdarnal.github.io/',
        description: 'A personal space for practical web tools, playful experiments and things I am curious about.',
        sameAs: ['https://github.com/leenusdarnal']
      },
      {
        '@type': 'WebSite',
        name: 'Leenus Darnal — I build useful things',
        description: 'A personal corner of the internet for useful tools, side projects and experiments.',
        url: 'https://leenusdarnal.github.io/',
        publisher: { '@type': 'Person', name: 'Leenus Darnal' }
      }
    ]
  });

  onMount(() => {
    try {
      const saved = localStorage.getItem('site-theme');
      const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      theme = saved || preferred;
    } catch {
      theme = 'dark';
    }
    document.documentElement.dataset.theme = theme;
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('site-theme', theme);
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }
</script>

<svelte:head>
  <title>Leenus Darnal — I build useful things</title>
  <meta name="description" content="The personal site of Leenus Darnal. A collection of useful web tools, projects and experiments." />
  <meta name="author" content="Leenus Darnal" />
  <meta name="theme-color" content={theme === "dark" ? "#0b0f19" : "#f8fafc"} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Leenus Darnal — I build useful things" />
  <meta property="og:description" content="A collection of useful web tools, projects and experiments by Leenus Darnal." />
  <link rel="canonical" href="https://leenusdarnal.github.io/" />
  <meta property="og:url" content="https://leenusdarnal.github.io/" />
  <meta property="og:image" content="https://leenusdarnal.github.io/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Leenus Darnal — I build useful things" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Leenus Darnal — I build useful things" />
  <meta name="twitter:description" content="A collection of useful web tools, projects and experiments by Leenus Darnal." />
  <meta name="twitter:image" content="https://leenusdarnal.github.io/og-image.png" />
  <script type="application/ld+json">{structuredData}</script>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 min-[480px]:px-5 sm:px-8 lg:px-10">
  <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-[var(--page)]" href="#main">Skip to content</a>

  <header class="site-header -mx-4 flex items-center justify-between gap-3 px-4 py-4 sm:-mx-8 sm:px-8 sm:py-5 lg:-mx-10 lg:px-10">
    <a href="#top" aria-label="L. Leenus Darnal. — home" class="group flex min-w-0 shrink-0 items-center gap-2 text-xs font-semibold tracking-tight no-underline sm:gap-3 sm:text-sm">
      <span aria-hidden="true" class="grid size-8 place-items-center rounded-full bg-[var(--accent)] text-sm font-black text-[var(--accent-contrast)] sm:size-9" style="color: var(--accent-contrast)">L.</span>
      <span>Leenus Darnal<span class="text-[var(--accent)]">.</span></span>
    </a>

    <nav aria-label="Main navigation" class="flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--muted)] sm:gap-4 sm:text-sm lg:gap-7">
      <a href="#work" class="inline-flex min-h-11 items-center rounded-full px-2 transition-colors hover:text-[var(--ink)] sm:px-1">Projects</a>
      <a href="#about" class="inline-flex min-h-11 items-center rounded-full px-2 transition-colors hover:text-[var(--ink)] sm:px-1">About</a>
      <a href="#contact" class="inline-flex min-h-11 items-center rounded-full px-2 transition-colors hover:text-[var(--ink)] sm:px-1">Contact</a>
      <a href="https://github.com/leenusdarnal" target="_blank" rel="noopener noreferrer" class="hidden transition-colors hover:text-[var(--ink)] sm:inline">GitHub ↗</a>
      <button
        type="button"
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-pressed={theme === 'light'}
        onclick={toggleTheme}
        class="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] sm:size-10"
      >
        {#if theme === 'dark'}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="size-[18px]" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="size-[18px]" aria-hidden="true">
            <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
          </svg>
        {/if}
      </button>
    </nav>
  </header>

  <main id="main">
    <section id="top" class="relative grid min-h-0 content-center gap-8 py-20 sm:min-h-[540px] sm:gap-10 sm:py-24 md:min-h-[600px] md:grid-cols-[minmax(0,1fr)_180px] md:items-end md:py-28 xl:min-h-[650px] xl:grid-cols-[minmax(0,1fr)_220px] xl:py-32">
      <div class="max-w-4xl">
        <h1 class="text-[clamp(3.1rem,11vw,8.8rem)] font-semibold leading-[0.9] tracking-[-0.08em] sm:leading-[0.88] sm:tracking-[-0.085em]">
          Leenus<br />
          <span class="text-[var(--accent)]">Darnal.</span>
        </h1>
        <p class="mt-7 max-w-2xl text-xl font-medium leading-snug tracking-[-0.04em] text-[var(--ink)] sm:mt-9 sm:text-2xl lg:text-3xl">
          I build useful things<span class="text-[var(--accent)]">.</span>
        </p>
        <p class="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8 lg:text-lg">
          This is my little corner of the internet for browser-native tools, practical web apps and experiments. I like making everyday tasks simpler, exploring what the web can do and sharing what I learn.
        </p>
        <ul aria-label="Things I like exploring" class="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] sm:mt-6">
          <li class="rounded-full border border-[var(--line)] px-3 py-1.5">Useful tools</li>
          <li class="rounded-full border border-[var(--line)] px-3 py-1.5">Browser experiments</li>
          <li class="rounded-full border border-[var(--line)] px-3 py-1.5">Privacy-first apps</li>
          <li class="rounded-full border border-[var(--line)] px-3 py-1.5">Learning by building</li>
        </ul>
        <div class="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
          <a href="#work" class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:-translate-y-0.5 sm:gap-3 sm:px-6 sm:py-3.5 hover:shadow-[0_12px_30px_color-mix(in_srgb,var(--accent)_20%,transparent)]" style="color: var(--accent-contrast)">
            Explore projects <span aria-hidden="true">↓</span>
          </a>
          <a href="https://github.com/leenusdarnal" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)] sm:px-6 sm:py-3.5">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div class="hidden md:block">
        <p class="border-l border-[var(--line)] pl-4 font-mono text-[10px] uppercase leading-6 tracking-[0.15em] text-[var(--muted)]">
          Curious by nature.<br />
          Practical by design.<br />
          Always building.
        </p>
      </div>

      <div class="pointer-events-none absolute -right-5 top-20 -z-10 hidden select-none text-[18rem] font-black leading-none tracking-[-0.12em] text-[var(--accent)] opacity-[0.035] xl:block">L</div>
    </section>

    <section id="work" aria-labelledby="work-heading" class="scroll-mt-12 pb-20 pt-4 sm:pb-28 sm:pt-8">
      <div class="mb-7 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] pb-5 sm:mb-9 sm:items-end sm:gap-4">
        <div>
          <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">01 / PROJECTS & EXPERIMENTS</p>
          <h2 id="work-heading" class="text-[clamp(1.8rem,7vw,2.25rem)] font-semibold tracking-[-0.06em] sm:text-4xl">Things I've made & explored<span class="text-[var(--accent)]">.</span></h2>
        </div>
        <p class="w-full max-w-xs text-sm leading-6 text-[var(--muted)] sm:w-auto">A growing collection of useful tools, side projects and experiments.</p>
      </div>

      <LabControls {projects} onToggleTheme={toggleTheme} />

      <article data-project-card data-category={projects[0].categories.join(' ')} aria-labelledby="project-pixelforge-title" aria-describedby="project-pixelforge-description" class="project-card group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))]">
        <div class="grid lg:grid-cols-[1.12fr_0.88fr]">
          <div aria-hidden="true" class="relative min-h-[220px] overflow-hidden bg-[var(--panel-soft)] p-3 sm:min-h-[300px] sm:p-6 lg:min-h-[370px] lg:p-8">
            <div class="absolute inset-0 opacity-70" style="background: radial-gradient(circle at 48% 50%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%);"></div>
            <div class="relative mx-auto flex h-full min-h-[200px] min-w-0 max-w-[600px] overflow-hidden rounded-xl border border-[var(--line)] bg-[#101512] shadow-2xl sm:min-h-[280px] sm:rounded-2xl lg:min-h-[315px]">
              <div class="flex w-9 shrink-0 flex-col items-center gap-3 border-r border-white/10 bg-[#171e19] py-3 text-[10px] text-white/55 sm:w-14 sm:gap-5 sm:py-6 lg:w-16">
                <span class="text-lg text-[#b9ef70]">✳</span><span>⌖</span><span>◩</span><span>✎</span><span>◌</span><span>⌘</span>
              </div>
              <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex h-9 items-center justify-between gap-2 border-b border-white/10 px-2 text-[8px] text-white/55 sm:h-12 sm:px-4 sm:text-[10px]">
                  <span>PIXELFORGE STUDIO</span><span class="rounded-full bg-[#b9ef70]/15 px-2 py-1 text-[#b9ef70]">Untitled project</span>
                </div>
                <div class="flex min-w-0 flex-1 items-center justify-center p-2 sm:p-6 lg:p-8">
                  <div class="relative aspect-[4/3] w-full max-w-[330px] overflow-hidden rounded-lg bg-gradient-to-br from-[#d2e2bb] via-[#829f70] to-[#263d31] shadow-xl">
                    <div class="absolute -left-8 top-8 size-32 rounded-full bg-[#d6edb4]/80 blur-[1px] sm:size-44"></div>
                    <div class="absolute -bottom-10 right-3 size-40 rounded-full bg-[#243b31]/80 sm:size-52"></div>
                    <div class="absolute right-8 top-8 h-24 w-16 rotate-12 rounded-full border border-white/50 bg-white/15 backdrop-blur-sm sm:right-12 sm:top-12 sm:h-32 sm:w-24"></div>
                    <div class="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">Canvas / 01</div>
                  </div>
                </div>
                <div class="flex h-8 items-center justify-between gap-2 border-t border-white/10 px-2 text-[7px] text-white/70 sm:h-10 sm:px-4 sm:text-[9px]"><span>100% · RGB</span><span>Layers&nbsp;&nbsp; Adjust&nbsp;&nbsp; History</span></div>
              </div>
              <div class="hidden w-24 flex-col gap-3 border-l border-white/10 bg-[#171e19] p-3 text-[9px] text-white/45 sm:flex sm:w-32 sm:p-4">
                <span class="mb-2 text-[8px] uppercase tracking-widest">Layers</span>
                <span class="rounded bg-white/10 p-2 text-white/80">◧ Background</span><span class="p-2">◧ Shape 01</span><span class="p-2">◧ Shape 02</span>
              </div>
            </div>
            <p class="relative mt-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--muted)]">01 — Browser image editor</p>
          </div>

          <div class="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-12">
            <div class="flex flex-wrap items-center justify-between gap-2"><p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">FEATURED PROJECT · IMAGE EDITOR</p><span class="repo-stars" data-repo-stars="pixelforge-studio" hidden></span></div>
            <h3 id="project-pixelforge-title" class="mt-3 text-2xl font-semibold tracking-[-0.06em] sm:mt-4 sm:text-3xl lg:text-4xl">PixelForge Studio</h3>
            <p id="project-pixelforge-description" class="mt-5 text-sm leading-7 text-[var(--muted)]">A mobile-friendly, offline-first editor with layers, masks, selection tools and editable text. Projects and autosaves stay on your device, with .pfs files available for separate backups.</p>
            <ul aria-label="PixelForge Studio highlights" class="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
              {#each projects[0].features as feature}
                <li class="flex items-center gap-2"><span aria-hidden="true" class="size-1.5 rounded-full bg-[var(--accent)]"></span>{feature}</li>
              {/each}
            </ul>
            <div class="mt-6 flex flex-wrap gap-2">
              {#each projects[0].stack as item}<span class="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[10px] text-[var(--muted)]">{item}</span>{/each}
            </div>
            <ProjectActions project={projects[0]} />
            <p class="mt-4 font-mono text-[10px] text-[var(--muted)]" data-repo-meta="pixelforge-studio" hidden></p>
            <p class="mt-6 text-[11px] leading-5 text-[var(--muted)]">Offline-first editing with local autosaves. Export a .pfs project file to keep a separate backup of your work.</p>
          </div>
        </div>
      </article>

      <div class="mt-5 grid gap-5 lg:grid-cols-2">
        {#each projects.slice(1) as project}
          <article data-project-card data-category={project.categories.join(' ')} aria-labelledby="project-{project.visual}-title" aria-describedby="project-{project.visual}-description" class="project-card group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))]">
            <div aria-hidden="true" class="relative flex min-h-[210px] items-center justify-center overflow-hidden bg-[var(--panel-soft)] p-4 sm:min-h-[270px] sm:p-6">
              {#if project.visual === 'metro'}
                <div class="w-full max-w-[560px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-xl">
                  <img src="https://raw.githubusercontent.com/leenusdarnal/react-metronome/master/screenshots/react-metronome.png" alt="" aria-hidden="true" width="416" height="314" sizes="(max-width: 560px) 100vw, 560px" loading="lazy" decoding="async" class="block h-auto w-full object-contain" />
                </div>              {:else if project.visual === 'salary'}
                <div class="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-xl sm:p-6">
                  <div class="flex items-center justify-between"><span class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">Pay estimate</span><span class="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-[9px] text-[var(--accent)]">Reference</span></div>
                  <div class="mt-6 text-xs text-[var(--muted)]">Pay level</div>
                  <div class="mt-1 flex items-center justify-between border-b border-[var(--line)] pb-3 text-lg font-semibold">Level 17 <span class="text-sm text-[var(--muted)]">⌄</span></div>
                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <div class="rounded-xl bg-[var(--panel-soft)] p-3"><div class="text-[9px] text-[var(--muted)]">Basic pay</div><div class="mt-2 text-lg font-semibold">Enter amount</div></div>
                    <div class="rounded-xl bg-[var(--panel-soft)] p-3"><div class="text-[9px] text-[var(--muted)]">DA rate</div><div class="mt-2 text-lg font-semibold">Set rate</div></div>
                  </div>
                  <div class="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs"><span class="text-[var(--muted)]">Estimated in-hand</span><span class="font-semibold text-[var(--accent)]">Estimate salary →</span></div>
                </div>
              {:else}
                <div class="grid w-full max-w-sm grid-cols-2 gap-3 sm:gap-4">
                  <div class="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-3 shadow-lg sm:p-4">
                    <div class="absolute inset-0 opacity-70" style="background: radial-gradient(circle at 50% 38%, #d7b08a, transparent 42%), linear-gradient(145deg, #9a765d, #33453d);"></div>
                    <div class="absolute bottom-0 left-1/2 h-[72%] w-[48%] -translate-x-1/2 rounded-t-[48%] bg-[#e2c1a1] shadow-xl"></div>
                    <span class="absolute left-3 top-3 rounded-full bg-black/45 px-2 py-1 font-mono text-[8px] text-white">ORIGINAL</span>
                  </div>
                  <div class="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-[var(--line)] p-3 shadow-lg sm:p-4" style="background-color:var(--panel);background-image:linear-gradient(45deg,var(--line) 25%,transparent 25%),linear-gradient(-45deg,var(--line) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,var(--line) 75%),linear-gradient(-45deg,transparent 75%,var(--line) 75%);background-size:18px 18px;background-position:0 0,0 9px,9px -9px,-9px 0;">
                    <div class="relative h-[72%] w-[48%] rounded-t-[48%] bg-[#e2c1a1] shadow-xl"></div>
                    <span class="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-2 py-1 font-mono text-[8px] text-[var(--accent-contrast)]" style="color: var(--accent-contrast)">CUTOUT</span>
                  </div>
                </div>
              {/if}
              <p class="absolute bottom-4 right-5 rounded-full bg-[var(--panel)]/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">{project.visual === 'metro' ? 'Actual app screenshot' : 'Interface illustration'} · {project.number}</p>
            </div>
            <div class="min-w-0 p-5 sm:p-7 lg:p-8">
              <div class="flex flex-wrap items-center justify-between gap-2"><p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">{project.type}</p><span class="repo-stars" data-repo-stars={project.slug} hidden></span></div>
              <h3 id="project-{project.visual}-title" class="mt-3 text-2xl font-semibold tracking-[-0.05em]">{project.name}</h3>
              <p id="project-{project.visual}-description" class="mt-3 text-sm leading-7 text-[var(--muted)] sm:min-h-[72px]">{project.description}</p>
              <ul aria-label="{project.name} highlights" class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
                {#each project.features as feature}
                  <li class="flex items-center gap-2"><span aria-hidden="true" class="size-1.5 rounded-full bg-[var(--accent)]"></span>{feature}</li>
                {/each}
              </ul>
              <div class="mt-5 flex flex-wrap gap-2">
                {#each project.stack as item}<span class="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[10px] text-[var(--muted)]">{item}</span>{/each}
              </div>
              <ProjectActions {project} />
              <p class="mt-4 font-mono text-[10px] text-[var(--muted)]" data-repo-meta={project.slug} hidden></p>
            </div>
          </article>
        {/each}
      </div>
    </section>

    <section id="space" aria-labelledby="space-heading" class="space-config-section pb-4 pt-2">
      <div class="space-config-intro">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">01 / PERSONAL SPACE</p>
          <h2 id="space-heading">A little about this corner<span>.</span></h2>
        </div>
        <p>This is less of a showcase and more of a workbench: useful things, small experiments and whatever I am learning next.</p>
      </div>

      <div class="terminal-card">
        <div class="terminal-header">
          <div class="terminal-dots" aria-hidden="true">
            <span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span>
          </div>
          <div class="terminal-file">
            <span>personal-space.config.ts</span>
            <span class="terminal-language">TypeScript</span>
          </div>
          <span class="terminal-status">THE SHORT VERSION</span>
        </div>

        <div class="terminal-layout">
          <div class="terminal-body">
            <pre aria-label="Personal space configuration preview"><code><span class="code-line"><span class="code-comment">// Just things I make and explore.</span></span><span class="code-line"><span class="code-keyword">export const</span> <span class="code-name">personalSpaceConfig</span> = &#123;</span><span class="code-line">  <span class="code-property">owner</span>: <span class="code-string">{JSON.stringify(personalSpaceConfig.owner)}</span>,</span><span class="code-line">  <span class="code-property">handle</span>: <span class="code-string">{JSON.stringify(personalSpaceConfig.handle)}</span>,</span><span class="code-line">  <span class="code-property">headline</span>: <span class="code-string">{JSON.stringify(personalSpaceConfig.headline)}</span>,</span><span class="code-line">  <span class="code-property">purpose</span>: <span class="code-string">{JSON.stringify(personalSpaceConfig.statement)}</span>,</span><span class="code-line">  <span class="code-property">palette</span>: <span class="code-string">{JSON.stringify(personalSpaceConfig.palette)}</span>,</span><span class="code-line">  <span class="code-property">hosting</span>: <span class="code-string">{JSON.stringify(personalSpaceConfig.hosting)}</span>,</span><span class="code-line">  <span class="code-property">focus</span>: [</span>{#each personalSpaceConfig.focus as item, index}<span class="code-line">    <span class="code-string">{JSON.stringify(item)}</span>{index < personalSpaceConfig.focus.length - 1 ? ',' : ''}</span>{/each}<span class="code-line">  ],</span><span class="code-line">  <span class="code-property">principles</span>: [</span>{#each personalSpaceConfig.principles as item, index}<span class="code-line">    <span class="code-string">{JSON.stringify(item)}</span>{index < personalSpaceConfig.principles.length - 1 ? ',' : ''}</span>{/each}<span class="code-line">  ]</span><span class="code-line">&#125; <span class="code-keyword">as const</span>;</span></code></pre>
          </div>

          <aside class="terminal-aside" aria-label="What this space is about">
            <div>
              <p class="terminal-label">THE IDEA</p>
              <h3>{personalSpaceConfig.headline}</h3>
              <p class="terminal-description">{personalSpaceConfig.statement}</p>
            </div>

            <div>
              <p class="terminal-label">WHAT YOU'LL FIND HERE</p>
              <ul class="terminal-focus-list">
                {#each personalSpaceConfig.focus as item, index}
                  <li><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item}</li>
                {/each}
              </ul>
            </div>

            <div class="terminal-principles" aria-label="Personal principles">
              {#each personalSpaceConfig.principles as principle}
                <span>{principle}</span>
              {/each}
            </div>

            <div class="terminal-meta">
              <span>HOME</span>
              <strong>{personalSpaceConfig.hosting}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section id="about" aria-labelledby="about-heading" class="scroll-mt-12 border-t border-[var(--line)] py-16 sm:py-20 lg:py-24">
      <div class="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">02 / A LITTLE ABOUT ME</p>
          <h2 id="about-heading" class="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.07em]">Curious by nature.<br />Practical by design.</h2>
        </div>
        <div class="max-w-2xl">
          <p class="text-base leading-8 text-[var(--muted)] sm:text-lg">I enjoy turning everyday problems and passing ideas into useful digital tools. The things I make tend to sit somewhere between clean interfaces, browser capabilities and practical problem-solving.</p>
          <p class="mt-5 text-base leading-8 text-[var(--muted)] sm:text-lg">I like making things that feel simple to use, respect people's privacy and work well across devices. This site is where I keep a record of those experiments, share the projects that grow from them and collect what I learn along the way.</p>
          <a href="https://github.com/leenusdarnal" target="_blank" rel="noopener noreferrer" class="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:gap-3">More on GitHub <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <section id="contact" aria-labelledby="contact-heading" class="scroll-mt-12 border-y border-[var(--line)] py-16 sm:py-20 lg:py-24">
      <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">03 / SAY HELLO</p>
      <div class="mt-5 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 id="contact-heading" class="max-w-2xl text-[clamp(2.25rem,7vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.07em] sm:text-6xl">Have something<br class="hidden sm:block" /> interesting in mind?</h2>
          <p class="mt-5 max-w-lg text-sm leading-7 text-[var(--muted)]">I'm always happy to hear about ideas, useful tools and interesting projects.</p>
        </div>
        <div class="flex flex-wrap gap-3 text-sm font-semibold sm:gap-4">
          <a class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-[var(--accent-contrast)] transition hover:-translate-y-0.5 sm:px-5" href="mailto:leenus.darnal@gmail.com" style="color: var(--accent-contrast)">Send an email ↗</a>
          <a class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 transition hover:border-[var(--accent)] sm:px-5" href="https://github.com/leenusdarnal" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="flex flex-col justify-between gap-3 py-7 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:gap-4">
    <span>© {new Date().getFullYear()} Leenus Darnal</span>
    <span class="flex items-center gap-2">Built with SvelteKit & Tailwind CSS <span class="text-[var(--accent)]">✳</span></span>
    <a href="https://github.com/leenusdarnal/leenusdarnal.github.io" target="_blank" rel="noopener noreferrer" class="transition hover:text-[var(--ink)]">View source ↗</a>
  </footer>
</div>
