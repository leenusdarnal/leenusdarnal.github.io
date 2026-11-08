<script>
  import { onMount } from 'svelte';

  let theme = $state('dark');

  const projects = [
    {
      number: '01',
      slug: 'pixelforge-studio',
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
        sameAs: ['https://github.com/leenusdarnal']
      },
      {
        '@type': 'WebSite',
        name: 'Leenus Darnal — I build useful things',
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
  <meta name="theme-color" content="#0b0d0c" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Leenus Darnal — I build useful things" />
  <meta property="og:description" content="A collection of useful web tools, projects and experiments by Leenus Darnal." />
  <link rel="canonical" href="https://leenusdarnal.github.io/" />
  <meta property="og:url" content="https://leenusdarnal.github.io/" />
  <meta property="og:image" content="https://leenusdarnal.github.io/og-image.svg" />
  <meta property="og:image:alt" content="Leenus Darnal — I build useful things" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Leenus Darnal — I build useful things" />
  <meta name="twitter:description" content="A collection of useful web tools, projects and experiments by Leenus Darnal." />
  <meta name="twitter:image" content="https://leenusdarnal.github.io/og-image.svg" />
  <script type="application/ld+json">{structuredData}</script>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 min-[480px]:px-5 sm:px-8 lg:px-10">
  <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-[var(--page)]" href="#main">Skip to content</a>

  <header class="flex items-center justify-between gap-3 border-b border-[var(--line)] py-4 sm:py-5">
    <a href="#top" aria-label="L. Leenus Darnal. — home" class="group flex min-w-0 shrink-0 items-center gap-2 text-xs font-semibold tracking-tight no-underline sm:gap-3 sm:text-sm">
      <span aria-hidden="true" class="grid size-8 place-items-center rounded-full bg-[var(--accent)] text-sm font-black text-[var(--accent-contrast)] sm:size-9">L.</span>
      <span>Leenus Darnal<span class="text-[var(--accent)]">.</span></span>
    </a>

    <nav aria-label="Main navigation" class="flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--muted)] sm:gap-4 sm:text-sm lg:gap-7">
      <a href="#work" class="inline-flex min-h-11 items-center rounded-full px-2 transition-colors hover:text-[var(--ink)] sm:px-1">Work</a>
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
          Small web tools, practical applications and experiments made to simplify everyday tasks.
        </p>
        <div class="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
          <a href="#work" class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:-translate-y-0.5 sm:gap-3 sm:px-6 sm:py-3.5 hover:shadow-[0_12px_30px_color-mix(in_srgb,var(--accent)_20%,transparent)]">
            Explore my work <span aria-hidden="true">↓</span>
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
          <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">01 / SELECTED WORK</p>
          <h2 id="work-heading" class="text-[clamp(1.8rem,7vw,2.25rem)] font-semibold tracking-[-0.06em] sm:text-4xl">Things I've made<span class="text-[var(--accent)]">.</span></h2>
        </div>
        <p class="w-full max-w-xs text-sm leading-6 text-[var(--muted)] sm:w-auto">A few projects built to solve small problems and make everyday tasks easier.</p>
      </div>

      <article aria-labelledby="project-pixelforge-title" aria-describedby="project-pixelforge-description" class="group overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))]">
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
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">FEATURED PROJECT · IMAGE EDITOR</p>
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
            <div class="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold sm:mt-9">
              <a class="inline-flex items-center gap-2 text-[var(--accent)] transition hover:gap-3" href={projects[0].live} target="_blank" rel="noopener noreferrer">Open editor <span>↗</span></a>
              <a class="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]" href="/projects/{projects[0].slug}/">Read case study <span>↗</span></a>
              <a class="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]" href={projects[0].source} target="_blank" rel="noopener noreferrer">Source code <span>↗</span></a>
            </div>
            <p class="mt-6 text-[11px] leading-5 text-[var(--muted)]">Offline-first editing with local autosaves. Export a .pfs project file to keep a separate backup of your work.</p>
          </div>
        </div>
      </article>

      <div class="mt-5 grid gap-5 lg:grid-cols-2">
        {#each projects.slice(1) as project}
          <article aria-labelledby="project-{project.visual}-title" aria-describedby="project-{project.visual}-description" class="group overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))]">
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
                    <span class="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-2 py-1 font-mono text-[8px] text-[var(--accent-contrast)]">CUTOUT</span>
                  </div>
                </div>
              {/if}
              <p class="absolute bottom-4 right-5 rounded-full bg-[var(--panel)]/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">{project.visual === 'metro' ? 'Actual app screenshot' : 'Interface illustration'} · {project.number}</p>
            </div>
            <div class="min-w-0 p-5 sm:p-7 lg:p-8">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">{project.type}</p>
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
              <div class="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold sm:mt-7">
                {#if project.live}
                  <a class="inline-flex items-center gap-2 text-[var(--accent)] transition hover:gap-3" href={project.live} target="_blank" rel="noopener noreferrer">Open project <span>↗</span></a>
                {/if}
                <a class="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]" href="/projects/{project.slug}/">Read case study <span>↗</span></a>
                <a class="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]" href={project.source} target="_blank" rel="noopener noreferrer">Source code <span>↗</span></a>
              </div>
            </div>
          </article>
        {/each}
      </div>
    </section>

    <section id="contact" aria-labelledby="contact-heading" class="scroll-mt-12 border-y border-[var(--line)] py-16 sm:py-20 lg:py-24">
      <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">02 / SAY HELLO</p>
      <div class="mt-5 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 id="contact-heading" class="max-w-2xl text-[clamp(2.25rem,7vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.07em] sm:text-6xl">Have something<br class="hidden sm:block" /> interesting in mind?</h2>
          <p class="mt-5 max-w-lg text-sm leading-7 text-[var(--muted)]">I'm always happy to hear about ideas, useful tools and interesting projects.</p>
        </div>
        <div class="flex flex-wrap gap-3 text-sm font-semibold sm:gap-4">
          <a class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-[var(--accent-contrast)] transition hover:-translate-y-0.5 sm:px-5" href="mailto:leenus.darnal@gmail.com">Send an email ↗</a>
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
