<script>
  let { data } = $props();
  const project = $derived(data.project);
</script>

<svelte:head>
  <title>{project.name} · Leenus Darnal</title>
  <meta name="description" content={project.description} />
  <meta name="author" content="Leenus Darnal" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={'https://leenusdarnal.github.io' + project.page} />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Leenus Darnal" />
  <meta property="og:title" content={project.name + ' · Leenus Darnal'} />
  <meta property="og:description" content={project.description} />
  <meta property="og:url" content={'https://leenusdarnal.github.io' + project.page} />
  <meta property="og:image" content="https://leenusdarnal.github.io/og-image.svg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={project.name + ' · Leenus Darnal'} />
  <meta name="twitter:description" content={project.description} />
  <meta name="twitter:image" content="https://leenusdarnal.github.io/og-image.svg" />
</svelte:head>

<div class="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10">
  <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-[var(--page)]" href="#main">Skip to content</a>

  <header class="flex items-center justify-between border-b border-[var(--line)] py-5">
    <a href="/" class="group flex items-center gap-3 text-sm font-semibold tracking-tight no-underline">
      <span class="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-sm font-black text-[var(--accent-contrast)]">L.</span>
      <span>Leenus Darnal<span class="text-[var(--accent)]">.</span></span>
    </a>
    <a href="/#work" class="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]">All projects</a>
  </header>

  <main id="main" tabindex="-1" class="py-20 sm:py-28">
    <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{project.number} / {project.type}</p>
    <h1 class="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.075em] sm:text-7xl">{project.name}<span class="text-[var(--accent)]">.</span></h1>
    <p class="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)]">{project.overview}</p>

    <div class="mt-10 flex flex-wrap gap-3">
      <a href={project.live} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--accent-contrast)] transition hover:-translate-y-0.5">Open project <span aria-hidden="true">↗</span></a>
      <a href={project.source} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3.5 text-sm font-semibold transition hover:border-[var(--accent)]">View source code <span aria-hidden="true">↗</span></a>
    </div>

    <section class="mt-20 border-t border-[var(--line)] pt-8">
      <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">About the project</p>
      <h2 class="mt-3 text-2xl font-semibold tracking-[-0.05em]">What it does</h2>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2">
        {#each project.capabilities as capability}
          <li class="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 text-sm leading-7 text-[var(--muted)]">
            <span class="mt-1 text-[var(--accent)]" aria-hidden="true">✳</span>
            <span>{capability}</span>
          </li>
        {/each}
      </ul>
    </section>

    <section class="mt-16 grid gap-8 border-t border-[var(--line)] pt-8 sm:grid-cols-[1fr_1fr]">
      <div>
        <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">Technology</p>
        <h2 class="mt-3 text-2xl font-semibold tracking-[-0.05em]">Built with</h2>
        <div class="mt-5 flex flex-wrap gap-2">
          {#each project.stack as item}
            <span class="rounded-full border border-[var(--line)] px-3 py-2 font-mono text-xs text-[var(--muted)]">{item}</span>
          {/each}
        </div>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">A note</p>
        <h2 class="mt-3 text-2xl font-semibold tracking-[-0.05em]">Good to know</h2>
        <p class="mt-5 text-sm leading-7 text-[var(--muted)]">{project.note}</p>
      </div>
    </section>

    <div class="mt-20 border-t border-[var(--line)] pt-7">
      <a href="/#work" class="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:gap-3"><span aria-hidden="true">←</span> Back to selected work</a>
    </div>
  </main>

  <footer class="flex flex-col justify-between gap-3 border-t border-[var(--line)] py-7 text-xs text-[var(--muted)] sm:flex-row sm:items-center">
    <span>© {new Date().getFullYear()} Leenus Darnal</span>
    <span>Built with SvelteKit & Tailwind CSS</span>
    <a href="https://github.com/leenusdarnal/leenusdarnal.github.io" target="_blank" rel="noopener noreferrer" class="transition hover:text-[var(--ink)]">View source ↗</a>
  </footer>
</div>
