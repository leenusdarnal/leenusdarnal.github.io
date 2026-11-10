<script>
  import { page } from '$app/state';
  import { personalSpaceConfig } from '../lib/personal-space.config';

  let status = $derived(page.status);
  let isNotFound = $derived(status === 404);
</script>

<svelte:head>
  <title>{isNotFound ? 'Page not found' : 'Something went wrong'} — {personalSpaceConfig.identity.name}</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description" content="Return to the homepage to browse projects and experiments." />
</svelte:head>

<main class="mx-auto grid min-h-screen w-full max-w-5xl content-center px-5 py-16 sm:px-8">
  <a href="/" class="mb-16 inline-flex w-fit items-center gap-3 text-sm font-semibold no-underline">
    <span aria-hidden="true" class="grid size-9 place-items-center rounded-full bg-[var(--accent)] font-black text-[var(--accent-contrast)]" style="color: var(--accent-contrast)">{personalSpaceConfig.identity.monogram}</span>
    {personalSpaceConfig.identity.name}<span class="text-[var(--accent)]">.</span>
  </a>
  <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{isNotFound ? '404 / NOT FOUND' : 'ERROR / TRY AGAIN'}</p>
  <h1 class="mt-4 max-w-3xl text-[clamp(2.8rem,9vw,5.8rem)] font-semibold leading-[0.95] tracking-[-0.075em]">{isNotFound ? 'This page wandered off.' : 'Something did not load as expected.'}<span class="text-[var(--accent)]">.</span></h1>
  <p class="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">{isNotFound ? 'The link may be outdated or the page may have moved. The projects and experiments are still waiting on the homepage.' : 'Try returning to the homepage. If the problem continues, come back a little later.'}</p>
  <div class="mt-8 flex flex-wrap gap-3">
    <a href="/" class="inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)]" style="color: var(--accent-contrast)">Back to homepage</a>
    <a href="/#work" class="inline-flex min-h-11 items-center rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold">Browse projects</a>
  </div>
  <p class="mt-16 font-mono text-[10px] text-[var(--muted)]">HTTP {status} · {personalSpaceConfig.site.hosting}</p>
</main>
