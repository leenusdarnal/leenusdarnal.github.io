<script>
  import { onMount } from 'svelte';

  let { projects = [] } = $props();
  let activeFilter = $state('all');
  let paletteOpen = $state(false);
  let query = $state('');
  let selectedIndex = $state(0);
  let rawMode = $state(false);
  let diagnostics = $state({});
  let reportCopied = $state(false);
  let palette;
  let searchInput;
  let matchingProjects = $derived(projects.filter((p) => (p.name + ' ' + p.slug + ' ' + p.stack.join(' ')).toLowerCase().includes(query.toLowerCase())));

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'client-compute', label: 'Client Compute' },
    { id: 'full-stack', label: 'Full-Stack' },
    { id: 'svelte', label: 'Svelte' },
    { id: 'react', label: 'React' }
  ];

  const commands = [
    { label: 'Theme: Toggle Light / Dark Mode', keywords: 'theme light dark appearance', run: () => document.querySelector('[aria-label^="Switch to"]')?.click() },
    { label: 'Filter: Show WebGPU & Client Compute Projects', keywords: 'webgpu compute wasm client', run: () => setFilter('client-compute') },
    { label: 'Filter: Show Full-Stack Web Apps', keywords: 'full stack apps', run: () => setFilter('full-stack') },
    { label: 'Action: Copy Hardware Diagnostics JSON', keywords: 'copy hardware diagnostics json report', run: () => copyReport() },
    { label: 'View: Toggle Raw JSON Mode', keywords: 'raw json data', run: () => rawMode = !rawMode },
    { label: 'Open: GitHub Profile (github.com/leenusdarnal)', keywords: 'github profile source', run: () => window.open('https://github.com/leenusdarnal', '_blank', 'noopener,noreferrer') }
  ];

  let visibleCommands = $derived(commands.filter((item) => (item.label + ' ' + item.keywords).toLowerCase().includes(query.toLowerCase())));
  let report = $derived({
    generatedAt: new Date().toISOString(),
    browser: { userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null, language: typeof navigator !== 'undefined' ? navigator.language : null, platform: typeof navigator !== 'undefined' ? navigator.platform : null },
    compute: diagnostics,
    display: { deviceMemoryGB: typeof navigator !== 'undefined' ? Reflect.get(navigator, 'deviceMemory') ?? null : null, colorGamutP3: typeof window !== 'undefined' ? window.matchMedia('(color-gamut: p3)').matches : null },
    projects: projects.map(({ name, slug, stack, live, source }) => ({ name, slug, stack, live, source }))
  });
  let rawJson = $derived(JSON.stringify(report, null, 2));

  function setFilter(filter) {
    activeFilter = filter;
    if (typeof document !== 'undefined') {
      document.querySelectorAll('[data-project-card]').forEach((card) => {
        card.hidden = filter !== 'all' && !card.dataset.category?.split(' ').includes(filter);
      });
    }
  }

  function openPalette() {
    paletteOpen = true;
    query = '';
    selectedIndex = 0;
    requestAnimationFrame(() => searchInput?.focus());
    if (!palette?.open) palette?.showModal();
  }

  function closePalette() {
    paletteOpen = false;
    if (palette?.open) palette.close();
  }

  function runCommand(item) {
    closePalette();
    item.run();
  }

  function handleGlobalKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (paletteOpen) closePalette(); else openPalette();
    }
    if (!paletteOpen) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, visibleCommands.length - 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); selectedIndex = Math.max(0, selectedIndex - 1); }
    if (event.key === 'Enter' && visibleCommands[selectedIndex]) { event.preventDefault(); runCommand(visibleCommands[selectedIndex]); }
    if (event.key === 'Escape') closePalette();
  }

  async function collectDiagnostics() {
    const result = {
      webgpu: { available: !!Reflect.get(navigator, 'gpu'), adapter: null, vendor: null, architecture: null, fp16: false, maxBufferSizeBytes: null, maxBufferSize: 'Unavailable' },
      wasmThreads: { crossOriginIsolated: !!window.crossOriginIsolated, status: window.crossOriginIsolated ? 'Active (cross-origin isolated)' : 'Single-thread mode / isolation unavailable' },
      memory: { deviceMemoryGB: Reflect.get(navigator, 'deviceMemory') ?? null },
      display: { colorGamutP3: window.matchMedia('(color-gamut: p3)').matches, gamut: window.matchMedia('(color-gamut: p3)').matches ? 'Display P3 wide gamut' : 'sRGB or unknown' }
    };
    const gpu = Reflect.get(navigator, 'gpu');
    if (gpu?.requestAdapter) {
      try {
        const adapter = await gpu.requestAdapter();
        if (adapter) {
          const info = adapter.info ?? {};
          const max = adapter.limits?.maxBufferSize ?? null;
          result.webgpu.adapter = 'Available';
          result.webgpu.vendor = info.vendor || 'Not disclosed';
          result.webgpu.architecture = info.architecture || 'Not disclosed';
          result.webgpu.fp16 = !!adapter.features?.has('shader-f16');
          result.webgpu.maxBufferSizeBytes = max;
          result.webgpu.maxBufferSize = max ? (max / 1024 ** 3 >= 1 ? (max / 1024 ** 3).toFixed(2) + ' GB' : Math.round(max / 1024 ** 2) + ' MB') : 'Not reported';
        } else result.webgpu.adapter = 'No compatible adapter';
      } catch (error) {
        result.webgpu.adapter = 'Adapter query failed';
        result.webgpu.error = error?.message ?? String(error);
      }
    } else result.webgpu.adapter = 'WebGPU unavailable';
    diagnostics = result;
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(rawJson);
      reportCopied = true;
      setTimeout(() => reportCopied = false, 1800);
    } catch {
      reportCopied = false;
    }
  }

  onMount(() => {
    collectDiagnostics();
    let frame = 0;
    const moveSpotlight = (event) => {
      if (!window.matchMedia('(pointer: fine)').matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', event.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', event.clientY + 'px');
      });
    };
    window.addEventListener('pointermove', moveSpotlight, { passive: true });
    const stored = (() => {
      try { return JSON.parse(sessionStorage.getItem('leenus_lab_repos_v1') || 'null'); } catch { return null; }
    })();
    const now = Date.now();
    const cacheFresh = stored?.timestamp && now - stored.timestamp < 3600000 && Array.isArray(stored.data);
    const applyRepos = (repos) => {
      for (const project of projects) {
        const repoName = project.source.split('/').pop()?.toLowerCase();
        const repo = repos.find((item) => item.name?.toLowerCase() === repoName);
        const target = document.querySelector('[data-repo-meta="' + project.slug + '"]');
        if (target && repo) {
          const ago = relativeTime(repo.pushed_at);
          target.textContent = 'Updated ' + ago;
          target.hidden = false;
          const stars = document.querySelector('[data-repo-stars="' + project.slug + '"]');
          if (stars && repo.stargazers_count > 0) { stars.textContent = '★ ' + repo.stargazers_count; stars.hidden = false; }
        }
      }
    };
    if (cacheFresh) applyRepos(stored.data);
    else fetch('https://api.github.com/users/leenusdarnal/repos?sort=updated&per_page=100', { headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => { if (!response.ok) throw new Error('GitHub API unavailable'); return response.json(); })
      .then((data) => { applyRepos(data); try { sessionStorage.setItem('leenus_lab_repos_v1', JSON.stringify({ timestamp: Date.now(), data })); } catch {} })
      .catch(() => {});
    return () => { window.removeEventListener('pointermove', moveSpotlight); cancelAnimationFrame(frame); };
  });

  function relativeTime(value) {
    if (!value) return 'recently';
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
    const units = [['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]];
    for (const [label, size] of units) if (seconds >= size) return Math.floor(seconds / size) + label + ' ago';
    return 'just now';
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<section class="lab-controls" aria-label="Project filters and developer tools">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap gap-2" aria-label="Filter projects">
      {#each filters as filter}
        <button type="button" aria-pressed={activeFilter === filter.id} onclick={() => setFilter(filter.id)} class:active={activeFilter === filter.id} class="filter-pill">
          {filter.label} ({filter.id === 'all' ? projects.length : projects.filter((project) => project.categories.includes(filter.id)).length})
        </button>
      {/each}
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="tool-pill" onclick={openPalette}>⌘K <span class="sr-only">Open command palette</span></button>
      <button type="button" class="tool-pill" aria-pressed={rawMode} onclick={() => rawMode = !rawMode}>{'{ }'} Raw</button>
    </div>
  </div>

  {#if rawMode}
    <pre class="raw-json" aria-label="Raw project and client diagnostics JSON">{rawJson}</pre>
  {/if}

  <div class="terminal-card mt-5">
    <div class="terminal-header">
      <div class="flex items-center gap-2"><span class="terminal-dots" aria-hidden="true"><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span></span><span>runtime_inspector.sh · Client Diagnostics</span></div>
      <button type="button" class="tool-pill" onclick={copyReport}>{reportCopied ? 'Copied!' : 'Copy JSON Report'}</button>
    </div>
    <div class="diagnostic-grid">
      <div><span>GPU adapter</span><strong>{diagnostics.webgpu?.adapter ?? 'Checking…'}</strong></div>
      <div><span>Vendor / architecture</span><strong>{[diagnostics.webgpu?.vendor, diagnostics.webgpu?.architecture].filter(Boolean).join(' · ') || 'Checking…'}</strong></div>
      <div><span>FP16 shader</span><strong>{diagnostics.webgpu ? diagnostics.webgpu.fp16 ? 'Supported (half precision)' : 'FP32 only / unavailable' : 'Checking…'}</strong></div>
      <div><span>Max compute buffer</span><strong>{diagnostics.webgpu?.maxBufferSize ?? 'Checking…'}</strong></div>
      <div><span>WASM shared memory</span><strong>{diagnostics.wasmThreads?.status ?? 'Checking…'}</strong></div>
      <div><span>Device memory tier</span><strong>{diagnostics.memory?.deviceMemoryGB ? diagnostics.memory.deviceMemoryGB + ' GB (reported)' : 'Not exposed by browser'}</strong></div>
      <div><span>Display gamut</span><strong>{diagnostics.display?.gamut ?? 'Checking…'}</strong></div>
    </div>
    <p class="px-4 pb-4 text-[10px] leading-5 text-[var(--muted)]">Browser-exposed capability data only. A reported adapter or feature does not mean every project uses that execution path.</p>
  </div>
</section>

<dialog bind:this={palette} class="command-dialog" onclose={() => paletteOpen = false}>
  <div class="command-shell">
    <div class="flex items-center justify-between gap-3 border-b border-[var(--line)] p-3">
      <span class="font-mono text-xs text-[var(--muted)]">COMMAND PALETTE</span>
      <button type="button" class="tool-pill" onclick={closePalette}>Esc</button>
    </div>
    <input bind:this={searchInput} bind:value={query} oninput={() => selectedIndex = 0} class="command-input" placeholder="Search projects, tags or commands…" aria-label="Search commands and projects" />
    <div class="max-h-[min(55vh,420px)] overflow-y-auto p-2">
      {#each visibleCommands as item, index}
        <button type="button" class="command-item" class:selected={selectedIndex === index} onclick={() => runCommand(item)}>
          <span>{item.label}</span><kbd>↵</kbd>
        </button>
      {/each}
      {#each matchingProjects as project}
        <a class="command-item" href={project.live} target="_blank" rel="noopener noreferrer"><span>Project: {project.name}</span><kbd>↗</kbd></a>
      {/each}
      {#if visibleCommands.length === 0 && matchingProjects.length === 0}<p class="p-4 text-sm text-[var(--muted)]">No matching commands, projects or tags.</p>{/if}
    </div>
    <p class="border-t border-[var(--line)] px-4 py-3 text-[10px] text-[var(--muted)]">↑ ↓ navigate · Enter run · Esc close</p>
  </div>
</dialog>
