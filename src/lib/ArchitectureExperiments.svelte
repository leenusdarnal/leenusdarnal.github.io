<script>
  let copiedRepository = $state('');
  let copyMessage = $state('');

  const experiments = [
    {
      name: 'Breadit',
      kind: 'Community app · Source experiment',
      summary: 'A Reddit-style community application with subreddit pages, subscriptions, posts, comments and voting.',
      repository: 'https://github.com/leenusdarnal/breadit',
      stack: ['Next.js App Router', 'React 18', 'TypeScript', 'Prisma 5', 'PostgreSQL', 'NextAuth'],
      architecture: [
        'Browser UI → Next.js App Router pages and route handlers.',
        'Authentication uses NextAuth GitHub OAuth with a Prisma adapter and JWT sessions.',
        'Prisma models connect users, communities, subscriptions, posts, comments and votes to PostgreSQL.',
        'The subreddit API validates input with Zod and creates a community plus its initial subscription.'
      ]
    },
    {
      name: 'Chirp',
      kind: 'Social feed · Source experiment',
      summary: 'A small social-feed application with user authentication, emoji posts, profiles and typed API procedures.',
      repository: 'https://github.com/leenusdarnal/chirp',
      stack: ['Next.js Pages Router', 'React 18', 'TypeScript', 'Clerk', 'tRPC', 'Prisma 4', 'MySQL', 'Upstash Redis'],
      architecture: [
        'Browser UI → Next.js Pages Router → Clerk middleware and authentication context.',
        'The tRPC layer exposes public and authenticated procedures with Zod input validation.',
        'Prisma stores post records in MySQL; Clerk supplies user identity and profile data.',
        'Post creation uses an Upstash Redis sliding-window limiter configured for three requests per minute.'
      ]
    },
    {
      name: 'ROFC Web Hub',
      kind: 'Project showcase · Source experiment',
      summary: 'A SvelteKit website presenting project pages for Sikkim Teachers Association, Chirp, e-Tourist Guide and college admission.',
      repository: 'https://github.com/leenusdarnal/rofc-website',
      stack: ['SvelteKit', 'Svelte 4', 'TypeScript', 'Vite 4', 'Tailwind CSS'],
      architecture: [
        'Browser → SvelteKit route layer → reusable Svelte page and project components.',
        'The homepage composes hero, project showcase and footer sections.',
        'Project detail routes render dedicated Svelte components for STA, Chirp, e-Tourist Guide and college admission.',
        'Project imagery is bundled as local WebP assets in the repository.'
      ]
    }
  ];

  /** @param {string} repository */
  async function copyClone(repository) {
    const command = 'git clone ' + repository + '.git';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        const field = document.createElement('textarea');
        field.value = command;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        let copied = false;
        try { copied = document.execCommand('copy'); } finally { field.remove(); }
        if (!copied) throw new Error('Clipboard unavailable');
      }
      copiedRepository = repository;
      copyMessage = 'Clone command copied to clipboard.';
    } catch {
      copiedRepository = '';
      copyMessage = 'Clipboard unavailable. Open the repository link to copy its clone URL.';
    }
  }
</script>

<section class="source-experiments" aria-labelledby="source-experiments-heading">
  <div class="source-experiments-intro">
    <div>
      <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">02 / CODE EXPERIMENTS</p>
      <h2 id="source-experiments-heading">More things in the workshop<span>.</span></h2>
    </div>
    <p>Smaller source-code explorations. Their repositories are available to inspect; no live demo is linked here.</p>
  </div>

  <div class="source-experiments-grid">
    {#each experiments as experiment}
      <article class="source-experiment-card">
        <div class="source-experiment-meta">
          <span>{experiment.kind}</span>
          <span class="source-only-label">Source only</span>
        </div>
        <h3>{experiment.name}</h3>
        <p class="source-experiment-summary">{experiment.summary}</p>
        <div class="source-stack" aria-label={experiment.name + ' technology stack'}>
          {#each experiment.stack as technology}
            <span>{technology}</span>
          {/each}
        </div>
        <details class="architecture-drawer source-architecture">
          <summary aria-label={'Inspect Architecture for ' + experiment.name}>
            Inspect Architecture <span class="architecture-toggle" aria-hidden="true">＋</span>
          </summary>
          <ol>
            {#each experiment.architecture as step}
              <li>{step}</li>
            {/each}
          </ol>
        </details>
        <div class="source-experiment-actions">
          <a class="source-repository-link" href={experiment.repository} target="_blank" rel="noopener noreferrer">
            Browse source repository ↗
          </a>
          <button
            type="button"
            class="clone-button"
            onclick={() => copyClone(experiment.repository)}
            aria-label={'Copy git clone command for ' + experiment.name}
          >
            {copiedRepository === experiment.repository ? 'Copied!' : '⧉ Clone'}
          </button>
        </div>
      </article>
    {/each}
  </div>
  <p class="sr-only" aria-live="polite">{copyMessage}</p>
</section>
