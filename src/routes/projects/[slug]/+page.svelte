<script>
  let { data } = $props();
  const project = data.project;
</script>

<svelte:head>
  <title>{project ? `${project.name} — Leenus Darnal` : 'Project not found — Leenus Darnal'}</title>
  <meta name="description" content={project?.summary ?? 'Project details from Leenus Darnal.'} />
  {#if project}
    <meta property="og:type" content="article" />
    <meta property="og:title" content={`${project.name} — Leenus Darnal`} />
    <meta property="og:description" content={project.summary} />
    <link rel="canonical" href={`https://leenusdarnal.github.io/projects/${project.slug}/`} />
  {/if}
</svelte:head>

<div class="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
  <header class="flex items-center justify-between border-b border-[var(--line)] pb-5">
    <a href="/" class="flex items-center gap-3 text-sm font-semibold no-underline">
      <span aria-hidden="true" class="grid size-9 place-items-center rounded-full bg-[var(--accent)] font-black text-[#10150d]">L.</span>
      Leenus Darnal<span class="text-[var(--accent)]">.</span>
    </a>
    <a href="/#work" class="inline-flex min-h-11 items-center rounded-full border border-[var(--line)] px-4 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]">All projects</a>
  </header>

  {#if project}
    <main class="py-14 sm:py-20">
      <a href="/#work" class="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]">← Back to selected work</a>
      <p class="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{project.number} / {project.category}</p>
      <h1 class="mt-4 max-w-4xl text-[clamp(2.7rem,9vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.075em]">{project.name}<span class="text-[var(--accent)]">.</span></h1>
      <p class="mt-7 max-w-3xl text-xl leading-relaxed tracking-[-0.03em] text-[var(--muted)] sm:text-2xl">{project.summary}</p>

      <div class="mt-10 flex flex-wrap gap-3">
        {#if project.live}
          <a href={project.live} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#10150d] transition hover:-translate-y-0.5">Open project ↗</a>
        {/if}
        <a href={project.source} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--accent)]">View source code ↗</a>
      </div>

      <div class="mt-16 grid gap-12 border-t border-[var(--line)] pt-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-16">
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" class="text-2xl font-semibold tracking-[-0.05em]">Overview</h2>
          <p class="mt-5 text-base leading-8 text-[var(--muted)]">{project.description}</p>
          <h2 class="mt-12 text-2xl font-semibold tracking-[-0.05em]">Key features</h2>
          <ul class="mt-5 grid gap-3 sm:grid-cols-2">
            {#each project.highlights as item}
              <li class="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 text-sm leading-6">
                <span aria-hidden="true" class="mt-2 size-2 shrink-0 rounded-full bg-[var(--accent)]"></span>{item}
              </li>
            {/each}
          </ul>
          {#if project.disclaimer}
            <aside class="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] p-5">
              <h2 class="font-semibold">Important note</h2>
              <p class="mt-2 text-sm leading-7 text-[var(--muted)]">{project.disclaimer}</p>
            </aside>
          {/if}
          {#if project.privacy}
            <aside class="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] p-5">
              <h2 class="font-semibold">Privacy and files</h2>
              <p class="mt-2 text-sm leading-7 text-[var(--muted)]">{project.privacy}</p>
            </aside>
          {/if}
        </section>

        <aside class="space-y-8">
          <section aria-labelledby="stack-heading">
            <h2 id="stack-heading" class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">Built with</h2>
            <ul class="mt-4 flex flex-wrap gap-2">
              {#each project.stack as item}
                <li class="rounded-full border border-[var(--line)] px-3 py-2 font-mono text-[11px] text-[var(--muted)]">{item}</li>
              {/each}
            </ul>
          </section>
          <section aria-labelledby="role-heading">
            <h2 id="role-heading" class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">Project type</h2>
            <p class="mt-3 text-sm text-[var(--muted)]">{project.role}</p>
          </section>
        </aside>
      </div>
    </main>
  {:else}
    <main class="grid min-h-[60vh] content-center py-16">
      <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">404 / NOT FOUND</p>
      <h1 class="mt-4 text-4xl font-semibold tracking-[-0.06em]">Project not found.</h1>
      <p class="mt-4 max-w-lg leading-7 text-[var(--muted)]">This project page may have moved. Return to the homepage to browse the current portfolio.</p>
      <a href="/#work" class="mt-7 inline-flex min-h-11 w-fit items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#10150d]">Explore all projects</a>
    </main>
  {/if}

  <footer class="border-t border-[var(--line)] py-7 text-xs text-[var(--muted)]">
    © {new Date().getFullYear()} Leenus Darnal · <a href="/" class="underline-offset-4 hover:underline">Homepage</a>
  </footer>
</div>
