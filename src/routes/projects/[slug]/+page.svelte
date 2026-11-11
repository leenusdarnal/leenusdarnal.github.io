<script>
  import { personalSpaceConfig } from '../../../lib/personal-space.config';
  import ImageComparison from '../../../lib/ImageComparison.svelte';
  import ProjectQuickStart from '../../../lib/ProjectQuickStart.svelte';

  let { data } = $props();
  let project = $derived(data.project);

  function upgradePreviewImage(event, imageUrl) {
    const image = event.currentTarget;
    if (!image || !imageUrl || image.dataset.previewUpgraded === 'true') return;

    let candidateUrl;
    try {
      candidateUrl = new URL(imageUrl, window.location.href);
    } catch {
      return;
    }
    if (candidateUrl.origin !== window.location.origin || candidateUrl.href === image.currentSrc || candidateUrl.href === image.src) return;

    const candidate = new Image();
    candidate.decoding = 'async';
    candidate.onload = () => {
      if (!image.isConnected) return;
      image.dataset.previewUpgraded = 'true';
      image.src = candidateUrl.href;
      image.classList.remove('size-20');
      image.classList.add('h-auto', 'max-h-[560px]', 'w-full', 'object-contain');
    };
    candidate.src = candidateUrl.href;
  }

</script>

<svelte:head>
  <title>{project ? `${project.name} — ${personalSpaceConfig.identity.name}` : `Project not found — ${personalSpaceConfig.identity.name}`}</title>
  <meta name="description" content={project?.caseStudy.summary ?? `Project details from ${personalSpaceConfig.identity.name}.`} />
  <meta name="author" content={personalSpaceConfig.site.author} />
  {#if project}
    <meta property="og:type" content="article" />
    <meta property="og:title" content={`${project.name} — ${personalSpaceConfig.identity.name}`} />
    <meta property="og:description" content={project.caseStudy.summary} />
    <meta property="og:image" content={personalSpaceConfig.site.projectSocialImage.url} />
    <meta property="og:image:type" content={personalSpaceConfig.site.projectSocialImage.type} />
    <meta property="og:image:alt" content={personalSpaceConfig.site.projectSocialImage.alt} />
    <meta name="twitter:card" content={personalSpaceConfig.site.twitterCard} />
    <meta name="twitter:title" content={`${project.name} — ${personalSpaceConfig.identity.name}`} />
    <meta name="twitter:description" content={project.caseStudy.summary} />
    <meta name="twitter:image" content={personalSpaceConfig.site.projectSocialImage.url} />
    <link rel="canonical" href={`${personalSpaceConfig.site.url}projects/${project.slug}/`} />
  {/if}
</svelte:head>
<div class="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
  <header class="detail-header -mx-4 flex items-center justify-between border-b border-[var(--line)] px-4 pb-5 pt-2 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
    <a href="/" class="flex items-center gap-3 text-sm font-semibold no-underline">
      <span aria-hidden="true" class="grid size-9 place-items-center rounded-full bg-[var(--accent)] font-black text-[var(--accent-contrast)]" style="color: var(--accent-contrast)">{personalSpaceConfig.identity.monogram}</span>
      {personalSpaceConfig.identity.name}<span class="text-[var(--accent)]">.</span>
    </a>
    <a href="/#work" class="inline-flex min-h-11 items-center rounded-full border border-[var(--line)] px-4 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]">All projects</a>
  </header>

  {#if project}
    <main class="py-14 sm:py-20">
      <a href="/#work" class="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]">← Back to projects</a>
      <p class="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{project.number} / {project.caseStudy.category}</p>
      <h1 class="mt-4 max-w-4xl text-[clamp(2.7rem,9vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.075em]">{project.name}<span class="text-[var(--accent)]">.</span></h1>
      <p class="mt-7 max-w-3xl text-xl leading-relaxed tracking-[-0.03em] text-[var(--muted)] sm:text-2xl">{project.caseStudy.summary}</p>

      <div class="mt-10 flex flex-wrap gap-3">
        {#if project.live}
          <a href={project.live} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:-translate-y-0.5" style="color: var(--accent-contrast)">Open project ↗</a>
        {/if}
        <a href={project.source} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--accent)]">View source code ↗</a>
      </div>
      <ProjectQuickStart audience={project.audience} firstAction={project.firstAction} />

      {#if project.caseStudy.previewImage}
        <figure class="mt-14 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--panel)]">
          <div class="flex min-h-[260px] items-center justify-center bg-[var(--panel-soft)] p-5 sm:min-h-[340px] sm:p-8">
            <img
              src={project.caseStudy.previewFallback ?? project.caseStudy.previewImage}
              alt={project.caseStudy.previewAlt ?? project.name + ' application preview'}
              width={project.slug === 'metronome' ? 416 : 1440}
              height={project.slug === 'metronome' ? 314 : 1000}
              sizes="(max-width: 768px) calc(100vw - 2rem), 896px"
              loading="lazy"
              decoding="async"
              onload={(event) => upgradePreviewImage(event, project.caseStudy.previewImage)}
              class={project.slug === 'metronome' ? 'block h-auto w-full object-contain' : 'size-20 object-contain'}
            />
          </div>
          <figcaption class="border-t border-[var(--line)] px-4 py-3 text-xs text-[var(--muted)] sm:px-6">
            {project.slug === 'metronome' ? 'Source repository screenshot' : 'Live application screenshot'}
            {#if project.caseStudy.previewSourceUrl}
              · <a href={project.caseStudy.previewSourceUrl} target="_blank" rel="noopener noreferrer" class="underline underline-offset-4">
                {project.slug === 'metronome' ? 'source repository' : 'live application'}
              </a>
            {/if}
          </figcaption>
        </figure>
      {:else if project.live}
        <aside class="mt-14 flex flex-col gap-3 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">Live application</p>
            <p class="mt-2 text-sm leading-6 text-[var(--muted)]">Open the application to see its current interface.</p>
          </div>
          <a href={project.live} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)]" style="color: var(--accent-contrast)">View live app ↗</a>
        </aside>
      {/if}

      {#if project.slug === 'pixelforge-studio'}
        <ImageComparison />
      {/if}

      <div class="mt-16 grid gap-12 border-t border-[var(--line)] pt-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-16">
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" class="text-2xl font-semibold tracking-[-0.05em]">Overview</h2>
          <p class="mt-5 text-base leading-8 text-[var(--muted)]">{project.caseStudy.description}</p>
          <h2 class="mt-12 text-2xl font-semibold tracking-[-0.05em]">Key features</h2>
          <ul class="mt-5 grid gap-3 sm:grid-cols-2">
            {#each project.caseStudy.highlights as item}
              <li class="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 text-sm leading-6">
                <span aria-hidden="true" class="mt-2 size-2 shrink-0 rounded-full bg-[var(--accent)]"></span>{item}
              </li>
            {/each}
          </ul>
          {#if project.caseStudy.approach?.length}
            <h2 class="mt-12 text-2xl font-semibold tracking-[-0.05em]">Implementation notes</h2>
            <ul class="mt-5 grid gap-3">
              {#each project.caseStudy.approach as item}
                <li class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 text-sm leading-7 text-[var(--muted)]">{item}</li>
              {/each}
            </ul>
          {/if}
          {#if project.caseStudy.constraints?.length}
            <h2 class="mt-12 text-2xl font-semibold tracking-[-0.05em]">Constraints & trade-offs</h2>
            <ul class="mt-5 grid gap-3">
              {#each project.caseStudy.constraints as item}
                <li class="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] p-4 text-sm leading-7 text-[var(--muted)]">
                  <span aria-hidden="true" class="mt-2 size-2 shrink-0 rounded-full bg-[var(--accent)]"></span>{item}
                </li>
              {/each}
            </ul>
          {/if}
          {#if project.caseStudy.nextSteps?.length}
            <h2 class="mt-12 text-2xl font-semibold tracking-[-0.05em]">Next steps</h2>
            <ul class="mt-5 grid gap-3">
              {#each project.caseStudy.nextSteps as item}
                <li class="rounded-2xl border border-[var(--line)] p-4 text-sm leading-7 text-[var(--muted)]">{item}</li>
              {/each}
            </ul>
          {/if}
          {#if project.caseStudy.disclaimer}
            <aside class="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] p-5">
              <h2 class="font-semibold">Important note</h2>
              <p class="mt-2 text-sm leading-7 text-[var(--muted)]">{project.caseStudy.disclaimer}</p>
            </aside>
          {/if}
          {#if project.caseStudy.privacy}
            <aside class="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] p-5">
              <h2 class="font-semibold">Privacy and files</h2>
              <p class="mt-2 text-sm leading-7 text-[var(--muted)]">{project.caseStudy.privacy}</p>
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
            <p class="mt-3 text-sm text-[var(--muted)]">{project.caseStudy.role}</p>
          </section>
        </aside>
      </div>
    </main>
  {:else}
    <main class="grid min-h-[60vh] content-center py-16">
      <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">404 / NOT FOUND</p>
      <h1 class="mt-4 text-4xl font-semibold tracking-[-0.06em]">Project not found.</h1>
      <p class="mt-4 max-w-lg leading-7 text-[var(--muted)]">This project page may have moved. Return to the homepage to browse the projects and experiments.</p>
      <a href="/#work" class="mt-7 inline-flex min-h-11 w-fit items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)]" style="color: var(--accent-contrast)">Explore all projects</a>
    </main>
  {/if}

  <footer class="border-t border-[var(--line)] py-7 text-xs text-[var(--muted)]">
    © {new Date().getFullYear()} {personalSpaceConfig.identity.name} · <a href="/" class="underline-offset-4 hover:underline">Homepage</a>
  </footer>
</div>
