<script>
  import { onMount } from 'svelte';

  let { projects = [], onToggleTheme = () => {} } = $props();
  let activeFilter = $state('all');
  let paletteOpen = $state(false);
  let query = $state('');
  let selectedIndex = $state(0);
  let rawMode = $state(false);
  /** @type {any} */
  let diagnostics = $state({});
  let reportCopied = $state(false);
  let copyStatus = $state('');
  let checking = $state(false);
  let lastChecked = $state('');
  let isolationState = $state({ checked: false, supported: false, controlled: false, isolated: false, reloadAttempted: false });
  let isolationNeedsReload = $derived(isolationState.checked && isolationState.supported && isolationState.controlled && !isolationState.isolated && !isolationState.reloadAttempted);
  /** @type {HTMLDialogElement | null} */
  let palette = $state(null);
  /** @type {HTMLInputElement | null} */
  let searchInput = $state(null);
  /** @type {HTMLButtonElement | null} */
  let paletteTrigger = $state(null);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'client-compute', label: 'Client Compute' },
    { id: 'full-stack', label: 'Full-Stack' },
    { id: 'svelte', label: 'Svelte' },
    { id: 'react', label: 'React' }
  ];

  /** @type {Array<{label: string, keywords: string, run: () => void}>} */
  const commands = [
    { label: 'Theme: Toggle Light / Dark Mode', keywords: 'theme light dark appearance', run: () => onToggleTheme() },
    { label: 'Filter: Show WebGPU & Client Compute Projects', keywords: 'webgpu compute wasm client', run: () => setFilter('client-compute') },
    { label: 'Filter: Show Full-Stack Web Apps', keywords: 'full stack apps', run: () => setFilter('full-stack') },
    { label: 'Action: Copy Hardware Diagnostics JSON', keywords: 'copy hardware diagnostics json report', run: () => copyReport() },
    { label: 'View: Toggle Raw JSON Mode', keywords: 'raw json data', run: () => rawMode = !rawMode },
    { label: 'Open: GitHub Profile (github.com/leenusdarnal)', keywords: 'github profile source', run: () => window.open('https://github.com/leenusdarnal', '_blank', 'noopener,noreferrer') }
  ];

  let visibleCommands = $derived(commands.filter((item) => (item.label + ' ' + item.keywords).toLowerCase().includes(query.trim().toLowerCase())));
  let matchingProjects = $derived(projects.filter((p) => (p.name + ' ' + p.slug + ' ' + p.stack.join(' ') + ' ' + (p.categories ?? []).join(' ') + ' ' + (p.features ?? []).join(' ')).toLowerCase().includes(query.trim().toLowerCase())));
  let paletteItems = $derived([
    ...visibleCommands.map((item) => ({ kind: 'command', label: item.label, run: item.run })),
    ...matchingProjects.map((project) => ({ kind: 'project', label: 'Project: ' + project.name, run: () => window.open(project.live, '_blank', 'noopener,noreferrer') }))
  ]);
  let report = $derived({
    generatedAt: lastChecked || null,
    crossOriginIsolation: isolationState,
    browser: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      language: typeof navigator !== 'undefined' ? navigator.language : null,
      platform: typeof navigator !== 'undefined' ? navigator.platform : null,
      hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency ?? null : null
    },
    compute: diagnostics,
    display: {
      deviceMemoryGB: typeof navigator !== 'undefined' ? Reflect.get(navigator, 'deviceMemory') ?? null : null,
      colorGamutP3: typeof window !== 'undefined' ? window.matchMedia('(color-gamut: p3)').matches : null,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : null,
      colorDepth: typeof screen !== 'undefined' ? screen.colorDepth : null
    },
    projects: projects.map(({ name, slug, stack, live, source, categories }) => ({ name, slug, stack, live, source, categories }))
  });
  let rawJson = $derived(JSON.stringify(report, null, 2));
  let visibleProjectCount = $derived(activeFilter === 'all' ? projects.length : projects.filter((project) => (project.categories ?? []).includes(activeFilter)).length);

  /** @param {string} filter */
  function setFilter(filter) {
    activeFilter = filter;
    if (typeof document !== 'undefined') {
      document.querySelectorAll('[data-project-card]').forEach((element) => {
        const card = /** @type {HTMLElement} */ (element);
        card.hidden = filter !== 'all' && !card.dataset.category?.split(' ').includes(filter);
      });
    }
  }

  function openPalette() {
    paletteOpen = true;
    query = '';
    selectedIndex = 0;
    if (!palette?.open) palette?.showModal();
    requestAnimationFrame(() => searchInput?.focus());
  }

  function closePalette() {
    paletteOpen = false;
    if (palette?.open) palette.close();
    requestAnimationFrame(() => paletteTrigger?.focus());
  }

  /** @param {number} index */
  function selectPaletteItem(index) {
    const item = paletteItems[index];
    if (!item) return;
    closePalette();
    item.run();
  }

  /** @param {KeyboardEvent} event */
  function handleGlobalKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (paletteOpen) closePalette(); else openPalette();
      return;
    }
    if (!paletteOpen) return;
    if (event.key === 'ArrowDown' && paletteItems.length) {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % paletteItems.length;
    }
    if (event.key === 'ArrowUp' && paletteItems.length) {
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + paletteItems.length) % paletteItems.length;
    }
    if (event.key === 'Enter' && paletteItems[selectedIndex]) {
      event.preventDefault();
      selectPaletteItem(selectedIndex);
    }
    if (event.key === 'Escape') closePalette();
  }

  function updateIsolationState() {
    const supported = 'serviceWorker' in navigator && window.isSecureContext;
    const isolated = window.crossOriginIsolated === true;
    let reloadAttempted = false;
    try {
      reloadAttempted = sessionStorage.getItem('coi-isolation-reload-v1') === '1';
      if (isolated) sessionStorage.removeItem('coi-isolation-reload-v1');
    } catch {}
    isolationState = {
      checked: true,
      supported,
      controlled: supported && Boolean(navigator.serviceWorker.controller),
      isolated,
      reloadAttempted: reloadAttempted && !isolated
    };
  }

  function reloadForIsolation() {
    try { sessionStorage.setItem('coi-isolation-reload-v1', '1'); } catch {}
    window.location.reload();
  }

  async function collectDiagnostics() {
    if (checking) return;
    checking = true;
    /** @type {any} */
    const isolated = typeof window !== 'undefined' && window.crossOriginIsolated === true;
    const sharedMemory = typeof SharedArrayBuffer === 'function';
    /** @type {any} */
    const result = {
      webgpu: { available: false, adapter: 'Checking…', vendor: null, architecture: null, fp16: false, maxBufferSizeBytes: null, maxBufferSize: 'Unavailable', maxStorageBufferBindingSize: null, error: null },
      wasmThreads: {
        crossOriginIsolated: isolated,
        sharedArrayBuffer: sharedMemory,
        status: isolated && sharedMemory ? 'Active (COOP/COEP + SharedArrayBuffer)' : 'Single-thread mode (isolation or SharedArrayBuffer unavailable)'
      },
      memory: {
        deviceMemoryGB: Reflect.get(navigator, 'deviceMemory') ?? null,
        hardwareConcurrency: navigator.hardwareConcurrency ?? null
      },
      display: {
        colorGamutP3: window.matchMedia('(color-gamut: p3)').matches,
        gamut: window.matchMedia('(color-gamut: p3)').matches ? 'Display P3 wide gamut' : 'sRGB or unknown',
        devicePixelRatio: window.devicePixelRatio,
        colorDepth: screen.colorDepth
      }
    };
    const gpu = Reflect.get(navigator, 'gpu');
    if (gpu?.requestAdapter) {
      result.webgpu.available = true;
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
          result.webgpu.maxStorageBufferBindingSize = adapter.limits?.maxStorageBufferBindingSize ?? null;
        } else result.webgpu.adapter = 'No compatible adapter';
      } catch (error) {
        result.webgpu.adapter = 'Adapter query failed';
        result.webgpu.error = error instanceof Error ? error.message : String(error);
      }
    } else result.webgpu.adapter = 'WebGPU unavailable';
    diagnostics = result;
    lastChecked = new Date().toISOString();
    checking = false;
  }

  /** @param {string} text */
  async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } finally { field.remove(); }
    if (!copied) throw new Error('Clipboard access is unavailable');
    return true;
  }

  async function copyReport() {
    try {
      await writeClipboard(JSON.stringify({ ...report, generatedAt: new Date().toISOString() }, null, 2));
      reportCopied = true;
      copyStatus = 'Diagnostics JSON copied to clipboard.';
      setTimeout(() => reportCopied = false, 1800);
    } catch {
      reportCopied = false;
      copyStatus = 'Clipboard unavailable. Use Raw JSON to select and copy the report.';
    }
  }

  onMount(() => {
    collectDiagnostics();
    updateIsolationState();
    const handleIsolationChange = () => updateIsolationState();
    window.addEventListener('coi-service-worker-statechange', handleIsolationChange);
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('controllerchange', handleIsolationChange);
    let frame = 0;
    /** @param {PointerEvent} event */
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
    const cacheFresh = Number.isFinite(stored?.timestamp) && stored.timestamp <= now && now - stored.timestamp < 3600000 && Array.isArray(stored.data);
    /** @param {any[]} repos */
    const applyRepos = (repos) => {
      for (const project of projects) {
        const repoName = project.source.split('/').pop()?.toLowerCase();
        const repo = repos.find((item) => item.name?.toLowerCase() === repoName);
        const target = /** @type {HTMLElement | null} */ (document.querySelector('[data-repo-meta="' + project.slug + '"]'));
        const stars = /** @type {HTMLElement | null} */ (document.querySelector('[data-repo-stars="' + project.slug + '"]'));
        if (target && repo?.pushed_at) {
          target.textContent = 'Updated ' + relativeTime(repo.pushed_at);
          target.hidden = false;
        }
        if (stars && Number(repo?.stargazers_count) > 0) {
          stars.textContent = '★ ' + repo.stargazers_count;
          stars.hidden = false;
        }
      }
    };
    if (cacheFresh) applyRepos(stored.data);
    const controller = new AbortController();
    if (!cacheFresh) {
      fetch('https://api.github.com/users/leenusdarnal/repos?sort=updated&per_page=100', {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal
      })
        .then((response) => {
          if (!response.ok) throw new Error('GitHub API unavailable');
          return response.json();
        })
        .then((data) => {
          if (!Array.isArray(data)) throw new Error('Unexpected GitHub API response');
          applyRepos(data);
          try { sessionStorage.setItem('leenus_lab_repos_v1', JSON.stringify({ timestamp: Date.now(), data })); } catch {}
        })
        .catch(() => {});
    }
    return () => {
      controller.abort();
      window.removeEventListener('coi-service-worker-statechange', handleIsolationChange);
      if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('controllerchange', handleIsolationChange);
      window.removeEventListener('pointermove', moveSpotlight);
      cancelAnimationFrame(frame);
    };
  });

  /** @param {string} value */
  function relativeTime(value) {
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) return 'date unavailable';
    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    /** @type {Array<[string, number]>} */
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
          {filter.label} ({filter.id === 'all' ? projects.length : projects.filter((project) => (project.categories ?? []).includes(filter.id)).length})
        </button>
      {/each}
    </div>
    <div class="flex flex-wrap gap-2">
      <button bind:this={paletteTrigger} type="button" class="tool-pill" onclick={openPalette}>⌘K <span class="sr-only">Open command palette</span></button>
      <button type="button" class="tool-pill" aria-pressed={rawMode} onclick={() => rawMode = !rawMode}>{'{ }'} Raw</button>
    </div>
  </div>

  <p class="sr-only" aria-live="polite">{visibleProjectCount} projects shown.</p>
  {#if rawMode}
    <pre class="raw-json" aria-label="Raw project and client diagnostics JSON">{rawJson}</pre>
  {/if}

  <div class="terminal-card mt-5">
    <div class="terminal-header">
      <div class="flex flex-wrap items-center gap-2"><span class="terminal-dots" aria-hidden="true"><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span></span><span>runtime_inspector.sh · Client Diagnostics</span></div>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" class="tool-pill" onclick={collectDiagnostics} disabled={checking}>{checking ? 'Checking…' : 'Refresh'}</button>
        <button type="button" class="tool-pill" onclick={copyReport}>{reportCopied ? 'Copied!' : 'Copy JSON Report'}</button>
      </div>
    </div>
    <div class="diagnostic-grid">
      <div><span>GPU adapter</span><strong>{diagnostics.webgpu?.adapter ?? 'Checking…'}</strong></div>
      <div><span>Vendor / architecture</span><strong>{[diagnostics.webgpu?.vendor, diagnostics.webgpu?.architecture].filter(Boolean).join(' · ') || 'Checking…'}</strong></div>
      <div><span>FP16 shader</span><strong>{diagnostics.webgpu ? diagnostics.webgpu.fp16 ? 'Supported (half precision)' : 'FP32 only / unavailable' : 'Checking…'}</strong></div>
      <div><span>Max compute buffer</span><strong>{diagnostics.webgpu?.maxBufferSize ?? 'Checking…'}</strong></div>
      <div><span>WASM shared memory</span><strong>{diagnostics.wasmThreads?.status ?? 'Checking…'}</strong></div>
      <div><span>Cross-origin isolation</span><strong>{!isolationState.checked ? 'Checking…' : isolationState.isolated ? 'Active' : isolationState.controlled ? 'Ready after reload' : isolationState.supported ? 'Service worker installing' : 'Unavailable in this browser'}</strong></div>
      <div><span>Device memory tier</span><strong>{diagnostics.memory?.deviceMemoryGB ? diagnostics.memory.deviceMemoryGB + ' GB (reported)' : 'Not exposed by browser'}</strong></div>
      <div><span>CPU threads</span><strong>{diagnostics.memory?.hardwareConcurrency ?? 'Not exposed by browser'}</strong></div>
      <div><span>Display gamut</span><strong>{diagnostics.display?.gamut ?? 'Checking…'}</strong></div>
    </div>
    <div class="coi-status">
      {#if isolationNeedsReload}
        <span>Service worker is ready. Reload this page once to activate cross-origin isolation and shared-memory features.</span>
        <button type="button" class="tool-pill" onclick={reloadForIsolation}>Reload to enable shared memory</button>
      {:else if isolationState.isolated}
        <span>Cross-origin isolation is active for this page.</span>
      {:else if isolationState.reloadAttempted}
        <span>Cross-origin isolation did not activate in this browser. The standard fallback remains available.</span>
      {:else if isolationState.checked && isolationState.supported}
        <span>Preparing shared-memory mode. The current page remains in standard mode until the service worker controls a reload.</span>
      {:else if isolationState.checked}
        <span>Service workers are unavailable; browser diagnostics will use the standard fallback.</span>
      {:else}
        <span>Checking shared-memory mode…</span>
      {/if}
    </div>
    <p class="px-4 pb-2 text-[10px] leading-5 text-[var(--muted)]">Last checked: {lastChecked ? new Date(lastChecked).toLocaleTimeString() : 'Checking…'} · Browser-exposed capability data only. A reported adapter or feature does not mean every project uses that execution path.</p>
    <p class="sr-only" aria-live="polite">{copyStatus}</p>
  </div>
</section>

<dialog bind:this={palette} class="command-dialog" onclose={() => paletteOpen = false}>
  <div class="command-shell">
    <div class="flex items-center justify-between gap-3 border-b border-[var(--line)] p-3">
      <span class="font-mono text-xs text-[var(--muted)]">COMMAND PALETTE</span>
      <button type="button" class="tool-pill" onclick={closePalette}>Esc</button>
    </div>
    <input bind:this={searchInput} bind:value={query} oninput={() => selectedIndex = 0} class="command-input" placeholder="Search projects, tags or commands…" aria-label="Search commands and projects" />
    <div class="max-h-[min(55vh,420px)] overflow-y-auto p-2" role="listbox" aria-label="Command and project results">
      {#each paletteItems as item, index}
        <button type="button" role="option" aria-selected={selectedIndex === index} class="command-item" class:selected={selectedIndex === index} onclick={() => selectPaletteItem(index)} onmouseenter={() => selectedIndex = index}>
          <span>{item.label}</span><kbd>{item.kind === 'project' ? '↗' : '↵'}</kbd>
        </button>
      {/each}
      {#if paletteItems.length === 0}<p class="p-4 text-sm text-[var(--muted)]">No matching commands, projects or tags.</p>{/if}
    </div>
    <p class="border-t border-[var(--line)] px-4 py-3 text-[10px] text-[var(--muted)]">↑ ↓ navigate · Enter run · Esc close</p>
  </div>
</dialog>
