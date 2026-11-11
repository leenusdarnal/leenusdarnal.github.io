<script>
  import { onMount } from 'svelte';
  import LabControls from '../lib/LabControls.svelte';
  import ProjectActions from '../lib/ProjectActions.svelte';
  import ProjectQuickStart from '../lib/ProjectQuickStart.svelte';
  import ArchitectureExperiments from '../lib/ArchitectureExperiments.svelte';
  import { personalSpaceConfig } from '../lib/personal-space.config';
  import { projects } from '../lib/projects';
  import { registerCrossOriginIsolation } from '../lib/cross-origin-isolation.js';

  let theme = $state('dark');
  let configuratorOpen = $state(false);
  let configuratorLoading = $state(false);
  let configuratorStatus = $state('');
  /** @type {any} */
  let ConfiguratorComponent = $state(null);

  async function toggleConfigurator() {
    if (configuratorOpen) { configuratorOpen = false; return; }
    if (!ConfiguratorComponent && !configuratorLoading) {
      configuratorLoading = true;
      configuratorStatus = '';
      try {
        const module = await import('../lib/PersonalSpaceConfigurator.svelte');
        ConfiguratorComponent = module.default;
      } catch {
        configuratorStatus = 'The configuration playground could not be loaded. Refresh the page and try again.';
      } finally {
        configuratorLoading = false;
      }
    }
    if (ConfiguratorComponent) configuratorOpen = true;
  }

  const navigation = personalSpaceConfig.navigation.filter((item) => personalSpaceConfig.sections[item.section]);


  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: personalSpaceConfig.identity.name,
        url: personalSpaceConfig.site.url,
        description: personalSpaceConfig.site.description,
        sameAs: personalSpaceConfig.site.socialProfiles.map((profile) => profile.url)
      },
      {
        '@type': 'WebSite',
        name: personalSpaceConfig.site.title,
        description: personalSpaceConfig.site.description,
        url: personalSpaceConfig.site.url,
        publisher: { '@type': 'Person', name: personalSpaceConfig.identity.name }
      }
    ]
  });

  onMount(() => {
    try {
      const saved = localStorage.getItem(personalSpaceConfig.appearance.themeStorageKey);
      const preferred = personalSpaceConfig.appearance.defaultTheme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : personalSpaceConfig.appearance.defaultTheme;
      theme = saved === 'light' || saved === 'dark' ? saved : preferred;
    } catch {
      theme = 'dark';
    }
    document.documentElement.dataset.theme = theme;
    registerCrossOriginIsolation();
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(personalSpaceConfig.appearance.themeStorageKey, theme);
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }
</script>

<svelte:head>
  <title>{personalSpaceConfig.site.title}</title>
  <meta name="description" content={personalSpaceConfig.site.description} />
  <meta name="author" content={personalSpaceConfig.site.author} />
  <meta name="theme-color" content={theme === 'dark' ? personalSpaceConfig.appearance.themeColors.dark : personalSpaceConfig.appearance.themeColors.light} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={personalSpaceConfig.site.title} />
  <meta property="og:description" content={personalSpaceConfig.site.description} />
  <link rel="canonical" href={personalSpaceConfig.site.url} />
  <link rel="alternate" type="application/rss+xml" title={personalSpaceConfig.site.title + ' — RSS'} href="/feed.xml" />
  <meta property="og:url" content={personalSpaceConfig.site.url} />
  <meta property="og:image" content={personalSpaceConfig.site.socialImage.url} />
  <meta property="og:image:type" content={personalSpaceConfig.site.socialImage.type} />
  <meta property="og:image:width" content={String(personalSpaceConfig.site.socialImage.width)} />
  <meta property="og:image:height" content={String(personalSpaceConfig.site.socialImage.height)} />
  <meta property="og:image:alt" content={personalSpaceConfig.site.socialImage.alt} />
  <meta name="twitter:card" content={personalSpaceConfig.site.twitterCard} />
  <meta name="twitter:title" content={personalSpaceConfig.site.title} />
  <meta name="twitter:description" content={personalSpaceConfig.site.description} />
  <meta name="twitter:image" content={personalSpaceConfig.site.socialImage.url} />
  <script type="application/ld+json">{structuredData}</script>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 min-[480px]:px-5 sm:px-8 lg:px-10">
  <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-[var(--page)]" href="#main">Skip to content</a>

  <header class="site-header -mx-4 flex items-center justify-between gap-3 px-4 py-4 sm:-mx-8 sm:px-8 sm:py-5 lg:-mx-10 lg:px-10">
    <a href="#top" aria-label={personalSpaceConfig.identity.monogram + " " + personalSpaceConfig.identity.name + ". — home"} class="group flex min-w-0 shrink-0 items-center gap-2 text-xs font-semibold tracking-tight no-underline sm:gap-3 sm:text-sm">
      <span aria-hidden="true" class="grid size-8 place-items-center rounded-full bg-[var(--accent)] text-sm font-black text-[var(--accent-contrast)] sm:size-9" style="color: var(--accent-contrast)">{personalSpaceConfig.identity.monogram}</span>
      <span>{personalSpaceConfig.identity.name}<span class="text-[var(--accent)]">.</span></span>
    </a>

    <nav aria-label="Main navigation" class="flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--muted)] sm:gap-4 sm:text-sm lg:gap-7">
      {#each navigation as item}
        <a href={item.href} class="inline-flex min-h-11 items-center rounded-full px-2 transition-colors hover:text-[var(--ink)] sm:px-1">{item.label}</a>
      {/each}
      <a href={personalSpaceConfig.site.githubUrl} target="_blank" rel="noopener noreferrer" class="hidden transition-colors hover:text-[var(--ink)] sm:inline">GitHub ↗</a>
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
          {personalSpaceConfig.identity.firstName}<br />
          <span class="text-[var(--accent)]">{personalSpaceConfig.identity.lastName}.</span>
        </h1>
        <p class="mt-7 max-w-2xl text-xl font-medium leading-snug tracking-[-0.04em] text-[var(--ink)] sm:mt-9 sm:text-2xl lg:text-3xl">
          {personalSpaceConfig.content.hero.headline}<span class="text-[var(--accent)]">.</span>
        </p>
        <p class="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8 lg:text-lg">
          {personalSpaceConfig.content.hero.description}
        </p>
        <ul aria-label="Things I like exploring" class="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] sm:mt-6">
          {#each personalSpaceConfig.content.hero.tags as tag}
            <li class="rounded-full border border-[var(--line)] px-3 py-1.5">{tag}</li>
          {/each}
        </ul>
        <div class="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
          {#if personalSpaceConfig.sections.projects}
            <a href="#work" class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:-translate-y-0.5 sm:gap-3 sm:px-6 sm:py-3.5 hover:shadow-[0_12px_30px_color-mix(in_srgb,var(--accent)_20%,transparent)]" style="color: var(--accent-contrast)">
              Explore projects <span aria-hidden="true">↓</span>
            </a>
          {/if}
          <a href={personalSpaceConfig.site.githubUrl} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)] sm:px-6 sm:py-3.5">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div class="hidden md:block">
        <p class="border-l border-[var(--line)] pl-4 font-mono text-[10px] uppercase leading-6 tracking-[0.15em] text-[var(--muted)]">
          {personalSpaceConfig.content.hero.asideLines[0]}<br />
          {personalSpaceConfig.content.hero.asideLines[1]}<br />
          {personalSpaceConfig.content.hero.asideLines[2]}
        </p>
      </div>

      <div class="pointer-events-none absolute -right-5 top-20 -z-10 hidden select-none text-[18rem] font-black leading-none tracking-[-0.12em] text-[var(--accent)] opacity-[0.035] xl:block">L</div>
    </section>

    {#if personalSpaceConfig.sections.projects}
    <section id="work" aria-labelledby="work-heading" class="scroll-mt-12 pb-20 pt-4 sm:pb-28 sm:pt-8">
      <div class="mb-7 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] pb-5 sm:mb-9 sm:items-end sm:gap-4">
        <div>
          <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">01 / PROJECTS & EXPERIMENTS</p>
          <h2 id="work-heading" class="text-[clamp(1.8rem,7vw,2.25rem)] font-semibold tracking-[-0.06em] sm:text-4xl">Things I've made & explored<span class="text-[var(--accent)]">.</span></h2>
        </div>
        <p class="w-full max-w-xs text-sm leading-6 text-[var(--muted)] sm:w-auto">A growing collection of useful tools, side projects and experiments.</p>
      </div>

      <LabControls projects={[...projects]} onToggleTheme={toggleTheme} />

      <article data-project-card data-category={projects[0].categories.join(' ')} aria-labelledby="project-pixelforge-title" aria-describedby="project-pixelforge-description" class="project-card group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))]">
        <div class="grid lg:grid-cols-[1.12fr_0.88fr]">
          <div aria-hidden="true" class="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[var(--panel-soft)] p-0 sm:min-h-[300px] lg:min-h-[370px]">
            <img src={projects[0].caseStudy.previewImage} alt="" width="1440" height="900" sizes="(max-width: 1024px) 100vw, 640px" loading="lazy" decoding="async" class="absolute inset-0 size-full object-cover object-top" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/15"></div>
            <div class="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/20 bg-black/65 px-3 py-2 text-xs font-medium text-white backdrop-blur sm:left-5 sm:top-5">
              <img src="/images/project-icons/pixelforge-icon.svg" alt="" width="28" height="28" loading="lazy" decoding="async" class="size-7 rounded-md" />
              <span>PixelForge Studio</span>
            </div>
            <p class="absolute bottom-4 right-5 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur">Live application preview</p>
          </div>

          <div class="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-12">
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">FEATURED PROJECT · IMAGE EDITOR</p>
            <h3 id="project-pixelforge-title" class="mt-3 text-2xl font-semibold tracking-[-0.06em] sm:mt-4 sm:text-3xl lg:text-4xl">PixelForge Studio</h3>
            <p id="project-pixelforge-description" class="mt-5 text-sm leading-7 text-[var(--muted)]">A mobile-friendly, offline-first editor with layers, masks, selection tools and editable text. Projects and autosaves stay on your device, with .pfs files available for separate backups.</p>
            <ProjectQuickStart audience={projects[0].audience} firstAction={projects[0].firstAction} />
            <ul aria-label="PixelForge Studio highlights" class="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
              {#each projects[0].features as feature}
                <li class="flex items-center gap-2"><span aria-hidden="true" class="size-1.5 rounded-full bg-[var(--accent)]"></span>{feature}</li>
              {/each}
            </ul>
            <div class="mt-6 flex flex-wrap gap-2">
              {#each projects[0].stack as item}<span class="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[10px] text-[var(--muted)]">{item}</span>{/each}
            </div>
            <ProjectActions project={projects[0]} />
            <p class="mt-6 text-[11px] leading-5 text-[var(--muted)]">Offline-first editing with local autosaves. Export a .pfs project file to keep a separate backup of your work.</p>
          </div>
        </div>
      </article>

      <div class="mt-5 grid gap-5 lg:grid-cols-2">
        {#each projects.slice(1) as project}
          <article data-project-card data-category={project.categories.join(' ')} aria-labelledby="project-{project.visual}-title" aria-describedby="project-{project.visual}-description" class="project-card group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))]">
            <div aria-hidden="true" class="relative flex min-h-[210px] items-center justify-center overflow-hidden bg-[var(--panel-soft)] p-5 sm:min-h-[270px] sm:p-6">
              {#if project.visual === 'metro'}
                <div class="w-full max-w-[560px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-xl">
                  <img src="/images/metronome-preview.png" alt="" width="416" height="314" sizes="(max-width: 560px) 100vw, 560px" loading="lazy" decoding="async" class="block h-auto w-full object-contain" />
                </div>
                <p class="absolute bottom-4 right-5 rounded-full bg-[var(--panel)]/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Source repository screenshot</p>
              {:else}
                <div class="absolute inset-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-xl">
                  <img src={project.caseStudy.previewImage} alt="" width={project.caseStudy.previewWidth ?? 1440} height={project.caseStudy.previewHeight ?? 900} sizes="(max-width: 1024px) 100vw, 560px" loading="lazy" decoding="async" class="size-full object-cover object-top" />
                  <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-8">
                    <span class="text-xs font-medium text-white">{project.name}</span>
                    {#if project.visual === 'cutout'}
                      <img src="/images/project-icons/pixelcutout-icon.svg" alt="" width="24" height="24" loading="lazy" decoding="async" class="size-6 rounded-md" />
                    {:else}
                      <span class="grid size-6 place-items-center rounded-md bg-white/15 font-mono text-sm font-semibold text-white" aria-hidden="true">₹</span>
                    {/if}
                  </div>
                </div>
                <p class="absolute bottom-4 right-5 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur">Live application preview</p>
              {/if}
            </div>
            <div class="min-w-0 p-5 sm:p-7 lg:p-8">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">{project.type}</p>
              <h3 id="project-{project.visual}-title" class="mt-3 text-2xl font-semibold tracking-[-0.05em]">{project.name}</h3>
              <p id="project-{project.visual}-description" class="mt-3 text-sm leading-7 text-[var(--muted)] sm:min-h-[72px]">{project.description}</p>
              <ProjectQuickStart audience={project.audience} firstAction={project.firstAction} />
              <ul aria-label="{project.name} highlights" class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
                {#each project.features as feature}
                  <li class="flex items-center gap-2"><span aria-hidden="true" class="size-1.5 rounded-full bg-[var(--accent)]"></span>{feature}</li>
                {/each}
              </ul>
              <div class="mt-5 flex flex-wrap gap-2">
                {#each project.stack as item}<span class="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[10px] text-[var(--muted)]">{item}</span>{/each}
              </div>
              <ProjectActions {project} />
            </div>
          </article>
        {/each}
      </div>
    </section>
    {/if}

    <section id="updates" aria-labelledby="updates-heading" class="scroll-mt-12 border-t border-[var(--line)] py-14 sm:py-16">
      <div class="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">WHAT'S NEW · 11 NOV 2026</p>
          <h2 id="updates-heading" class="mt-3 text-[clamp(1.8rem,6vw,2.8rem)] font-semibold tracking-[-0.06em]">Recent improvements<span class="text-[var(--accent)]">.</span></h2>
        </div>
        <a href="https://github.com/leenusdarnal/leenusdarnal.github.io/commits/main" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] hover:underline">Full change history ↗</a>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <time datetime="2026-11-11" class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">11 Nov 2026 · Project guide</time>
          <h3 class="mt-3 text-lg font-semibold tracking-tight">Know where to start</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--muted)]">Each featured project now explains who it helps and the first action to take, so you can choose the right tool before opening it.</p>
          <a href="https://github.com/leenusdarnal/leenusdarnal.github.io/commit/6ad4f0f9e3860cb51714f1583da242ed2daf2210" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] hover:underline">Project guide changes ↗</a>
        </article>
        <article class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <time datetime="2026-11-11" class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">11 Nov 2026 · PixelForge</time>
          <h3 class="mt-3 text-lg font-semibold tracking-tight">Safer image comparisons</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--muted)]">The before-and-after comparison now handles clearing, replacing and resetting images more reliably, including temporary preview cleanup.</p>
          <a href="https://github.com/leenusdarnal/leenusdarnal.github.io/commit/6ad4f0f9e3860cb51714f1583da242ed2daf2210" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] hover:underline">Comparison improvements ↗</a>
        </article>
        <article class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <time datetime="2026-11-11" class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">11 Nov 2026 · Quality</time>
          <h3 class="mt-3 text-lg font-semibold tracking-tight">More complete browser checks</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--muted)]">Automated checks now cover responsive layouts, theme persistence, keyboard navigation and WCAG A/AA rules across the homepage and project notes.</p>
          <a href="https://github.com/leenusdarnal/leenusdarnal.github.io/actions" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] hover:underline">Quality checks ↗</a>
        </article>
      </div>
    </section>

    {#if personalSpaceConfig.sections.sourceExperiments}<ArchitectureExperiments />{/if}

    {#if personalSpaceConfig.sections.personalSpace}
    <section id="space" aria-labelledby="space-heading" class="space-config-section pb-4 pt-2">
      <div class="space-config-intro">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{personalSpaceConfig.content.personalSpace.eyebrow}</p>
          <h2 id="space-heading">{personalSpaceConfig.content.personalSpace.title}<span>.</span></h2>
        </div>
        <p>{personalSpaceConfig.content.personalSpace.intro}</p>
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
            <pre aria-label="Personal space configuration preview"><code>{JSON.stringify({
              identity: personalSpaceConfig.identity,
              palette: personalSpaceConfig.appearance.palette,
              hosting: personalSpaceConfig.site.hosting,
              focus: personalSpaceConfig.content.personalSpace.focus,
              principles: personalSpaceConfig.content.personalSpace.principles
            }, null, 2)}</code></pre>
          </div>

          <aside class="terminal-aside" aria-label="What this space is about">
            <div>
              <p class="terminal-label">THE IDEA</p>
              <h3>{personalSpaceConfig.content.personalSpace.headline}</h3>
              <p class="terminal-description">{personalSpaceConfig.content.personalSpace.statement}</p>
            </div>

            <div>
              <p class="terminal-label">WHAT YOU'LL FIND HERE</p>
              <ul class="terminal-focus-list">
                {#each personalSpaceConfig.content.personalSpace.focus as item, index}
                  <li><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item}</li>
                {/each}
              </ul>
            </div>

            <div class="terminal-principles" aria-label="Personal principles">
              {#each personalSpaceConfig.content.personalSpace.principles as principle}
                <span>{principle}</span>
              {/each}
            </div>

            <div class="terminal-meta">
              <span>HOME</span>
              <strong>{personalSpaceConfig.site.hosting}</strong>
            </div>
          </aside>
        </div>
      </div>

      <div class="mt-5">
        <button type="button" class="tool-pill" aria-expanded={configuratorOpen} aria-controls="personal-space-configurator" onclick={toggleConfigurator}>{configuratorOpen ? 'Hide configuration playground' : 'Edit this space & preview changes'}</button>
        <div id="personal-space-configurator" class="mt-4">
          {#if configuratorOpen && ConfiguratorComponent}
            <ConfiguratorComponent />
          {:else if configuratorLoading}
            <p class="rounded-xl border border-[var(--line)] p-4 text-sm text-[var(--muted)]" role="status">Loading configuration playground…</p>
          {:else if configuratorStatus}
            <p class="rounded-xl border border-[var(--line)] p-4 text-sm text-[var(--muted)]" role="alert">{configuratorStatus}</p>
          {/if}
        </div>
      </div>
    </section>
    {/if}

    <section id="faq" aria-labelledby="faq-heading" class="scroll-mt-12 border-t border-[var(--line)] py-16 sm:py-20">
      <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">QUICK ANSWERS</p>
      <h2 id="faq-heading" class="mt-3 text-[clamp(1.8rem,6vw,2.8rem)] font-semibold tracking-[-0.06em]">Before you get started<span class="text-[var(--accent)]">.</span></h2>
      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <article class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <h3 class="font-semibold">Are the tools free to use?</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--muted)]">The projects are published as browser apps. Check each live app for its current availability, browser requirements and any usage limits.</p>
        </article>
        <article class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <h3 class="font-semibold">Do my files leave my device?</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--muted)]">That depends on the tool and the feature you use. Read the Privacy and files note on its project page before working with sensitive material. AI features may download model files without uploading your image.</p>
        </article>
        <article class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <h3 class="font-semibold">Can I use the tools offline?</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--muted)]">Offline support varies. Some features need an initial download or an internet connection. Each project page explains known limitations; do not assume every feature works offline.</p>
        </article>
        <article class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <h3 class="font-semibold">Are salary estimates official?</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--muted)]">No. The Sikkim Government Salary Calculator is an independent reference tool. Confirm pay rules, rates and eligibility with current signed orders and your DDO / Accounts section.</p>
        </article>
      </div>
      <p class="mt-6 text-sm leading-7 text-[var(--muted)]">Found an issue or have an idea? Use the source link on the relevant project page to review the code or open its GitHub repository.</p>
    </section>

    {#if personalSpaceConfig.sections.about}
    <section id="about" aria-labelledby="about-heading" class="scroll-mt-12 border-t border-[var(--line)] py-16 sm:py-20 lg:py-24">
      <div class="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{personalSpaceConfig.content.about.eyebrow}</p>
          <h2 id="about-heading" class="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.07em]">{personalSpaceConfig.content.about.title}<br />{personalSpaceConfig.content.about.subtitle}</h2>
        </div>
        <div class="max-w-2xl">
          {#each personalSpaceConfig.content.about.paragraphs as paragraph, index}
            <p class:mt-5={index > 0} class="text-base leading-8 text-[var(--muted)] sm:text-lg">{paragraph}</p>
          {/each}
          <a href={personalSpaceConfig.site.githubUrl} target="_blank" rel="noopener noreferrer" class="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:gap-3">More on GitHub <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
    {/if}

    {#if personalSpaceConfig.sections.contact}
    <section id="contact" aria-labelledby="contact-heading" class="scroll-mt-12 border-y border-[var(--line)] py-16 sm:py-20 lg:py-24">
      <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{personalSpaceConfig.content.contact.eyebrow}</p>
      <div class="mt-5 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 id="contact-heading" class="max-w-2xl text-[clamp(2.25rem,7vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.07em] sm:text-6xl">{personalSpaceConfig.content.contact.title}</h2>
          <p class="mt-5 max-w-lg text-sm leading-7 text-[var(--muted)]">{personalSpaceConfig.content.contact.description}</p>
        </div>
        <div class="flex flex-wrap gap-3 text-sm font-semibold sm:gap-4">
          <a class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-[var(--accent-contrast)] transition hover:-translate-y-0.5 sm:px-5" href={"mailto:" + personalSpaceConfig.site.contactEmail} style="color: var(--accent-contrast)">Send an email ↗</a>
          <a class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 transition hover:border-[var(--accent)] sm:px-5" href={personalSpaceConfig.site.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>
    </section>
    {/if}
  </main>

  <footer class="flex flex-col justify-between gap-3 py-7 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:gap-4">
    <span>© {new Date().getFullYear()} {personalSpaceConfig.identity.name}</span>
    <span class="flex items-center gap-2">{personalSpaceConfig.site.builtWith} <span class="text-[var(--accent)]">✳</span></span>
    <a href={personalSpaceConfig.site.repositoryUrl} target="_blank" rel="noopener noreferrer" class="transition hover:text-[var(--ink)]">View source ↗</a>
  </footer>
</div>
