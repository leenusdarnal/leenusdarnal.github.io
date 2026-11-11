<script>
  import { onMount } from 'svelte';

  let { projects = [], onToggleTheme = () => {}, openPaletteOnMount = false, onPaletteOpened = () => {} } = $props();
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
  let online = $state(true);
  let lastChecked = $state('');
  let isolationState = $state({ checked: false, supported: false, controlled: false, isolated: false, reloadAttempted: false });
  let isolationNeedsReload = $derived(isolationState.checked && isolationState.supported && isolationState.controlled && !isolationState.isolated && !isolationState.reloadAttempted);
  /** @type {HTMLDialogElement | null} */
  let palette = $state(null);
  /** @type {HTMLInputElement | null} */
  let searchInput = $state(null);
  /** @type {HTMLButtonElement | null} */
  let paletteTrigger = $state(null);

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
    schemaVersion: 2,
    generatedAt: lastChecked || null,
    crossOriginIsolation: isolationState,
    network: { ...(diagnostics.network ?? {}), online },
    performance: diagnostics.performance ?? {},
    storage: diagnostics.storage ?? {},
    environment: diagnostics.environment ?? {},
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

  /** @param {number | null | undefined} value */
  function formatDuration(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 'Not available';
    return Math.round(value) + ' ms';
  }

  /** @param {number | null | undefined} value */
  function formatBytes(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 'Not available';
    if (value < 1024) return Math.round(value) + ' B';
    if (value < 1024 ** 2) return (value / 1024).toFixed(1) + ' KB';
    if (value < 1024 ** 3) return (value / 1024 ** 2).toFixed(1) + ' MB';
    return (value / 1024 ** 3).toFixed(2) + ' GB';
  }

  async function collectDiagnostics() {
    if (checking) return;
    checking = true;
    try {
      const isolated = window.crossOriginIsolated === true;
      const sharedMemory = typeof SharedArrayBuffer === 'function';
      const navEntry = /** @type {PerformanceNavigationTiming | undefined} */ (performance.getEntriesByType('navigation')[0]) ?? null;
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
      const resources = performance.getEntriesByType('resource').map((entry) => /** @type {PerformanceResourceTiming} */ (entry));
      const reportedTransferBytes = resources.reduce((total, entry) => total + (Number(entry.transferSize) || 0), 0);
      const connection = Reflect.get(navigator, 'connection') ?? Reflect.get(navigator, 'mozConnection') ?? Reflect.get(navigator, 'webkitConnection');
      const storageApi = Reflect.get(navigator, 'storage');
      /** @type {{ supported: boolean, usageBytes: number | null, quotaBytes: number | null, persisted: boolean | null, error?: string }} */
      let storage = { supported: !!storageApi?.estimate, usageBytes: null, quotaBytes: null, persisted: null };
      if (storageApi?.estimate) {
        try {
          const estimate = await storageApi.estimate();
          storage.usageBytes = typeof estimate.usage === 'number' && Number.isFinite(estimate.usage) ? estimate.usage : null;
          storage.quotaBytes = typeof estimate.quota === 'number' && Number.isFinite(estimate.quota) ? estimate.quota : null;
          if (typeof storageApi.persisted === 'function') storage.persisted = await storageApi.persisted();
        } catch {
          storage = { ...storage, error: 'Storage estimate unavailable' };
        }
      }
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
        },
        network: {
          online: navigator.onLine,
          effectiveType: connection?.effectiveType ?? null,
          downlinkMbps: Number.isFinite(connection?.downlink) ? connection.downlink : null,
          rttMs: Number.isFinite(connection?.rtt) ? connection.rtt : null,
          saveData: typeof connection?.saveData === 'boolean' ? connection.saveData : null
        },
        performance: {
          navigationType: navEntry?.type ?? null,
          timeToFirstByteMs: navEntry && navEntry.responseStart > 0 ? navEntry.responseStart - navEntry.requestStart : null,
          domContentLoadedMs: typeof navEntry?.domContentLoadedEventEnd === 'number' && navEntry.domContentLoadedEventEnd > 0 ? navEntry.domContentLoadedEventEnd : null,
          loadCompleteMs: typeof navEntry?.loadEventEnd === 'number' && navEntry.loadEventEnd > 0 ? navEntry.loadEventEnd : null,
          firstContentfulPaintMs: fcp?.startTime ?? null,
          resourceCount: resources.length,
          reportedTransferBytes
        },
        storage,
        environment: {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          visibilityState: document.visibilityState,
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          devicePixelRatio: window.devicePixelRatio
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
            result.webgpu.maxBufferSize = max ? formatBytes(max) : 'Not reported';
            result.webgpu.maxStorageBufferBindingSize = adapter.limits?.maxStorageBufferBindingSize ?? null;
          } else result.webgpu.adapter = 'No compatible adapter';
        } catch (error) {
          result.webgpu.adapter = 'Adapter query failed';
          result.webgpu.error = error instanceof Error ? error.message : String(error);
        }
      } else result.webgpu.adapter = 'WebGPU unavailable';

      online = navigator.onLine;
      diagnostics = result;
      lastChecked = new Date().toISOString();
    } finally {
      checking = false;
    }
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
    online = navigator.onLine;
    collectDiagnostics();
    updateIsolationState();
    if (openPaletteOnMount) {
      requestAnimationFrame(() => {
        openPalette();
        onPaletteOpened();
      });
    }
    const handleOnlineChange = () => {
      online = navigator.onLine;
      diagnostics = { ...diagnostics, network: { ...(diagnostics.network ?? {}), online } };
    };
    window.addEventListener('online', handleOnlineChange);
    window.addEventListener('offline', handleOnlineChange);
    const handleIsolationChange = () => updateIsolationState();
    window.addEventListener('coi-service-worker-statechange', handleIsolationChange);
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('controllerchange', handleIsolationChange);
    return () => {
      window.removeEventListener('coi-service-worker-statechange', handleIsolationChange);
      window.removeEventListener('online', handleOnlineChange);
      window.removeEventListener('offline', handleOnlineChange);
      if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('controllerchange', handleIsolationChange);
    };
  });

</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<section class="lab-controls" aria-label="Developer tools">
  <div class="flex flex-wrap items-center justify-end gap-2">
    <button bind:this={paletteTrigger} type="button" class="tool-pill" aria-haspopup="dialog" aria-expanded={paletteOpen} aria-controls="command-palette" onclick={openPalette}>⌘K <span class="sr-only">Open command palette</span></button>
    <button type="button" class="tool-pill" aria-pressed={rawMode} onclick={() => rawMode = !rawMode}>{'{ }'} Raw</button>
  </div>
  {#if rawMode}
    <pre class="raw-json" aria-label="Raw project and client diagnostics JSON">{rawJson}</pre>
  {/if}
  <div class="terminal-card mt-5">
    <div class="terminal-header">
      <div class="flex flex-wrap items-center gap-2"><span class="terminal-dots" aria-hidden="true"><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span></span><span>runtime_inspector.sh · Client Diagnostics</span><span class="terminal-state" data-online={online}>{online ? "ONLINE" : "OFFLINE"}</span></div>
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
    <details class="diagnostic-details" open>
      <summary><span>Page performance & network</span><span class="diagnostic-hint">Browser timing APIs</span></summary>
      <div class="diagnostic-grid">
        <div><span>Browser connectivity</span><strong>{online ? 'Online (browser hint)' : 'Offline'}</strong></div>
        <div><span>Connection class</span><strong>{diagnostics.network?.effectiveType ?? 'Not exposed by browser'}</strong></div>
        <div><span>Downlink / round-trip</span><strong>{diagnostics.network?.downlinkMbps != null ? diagnostics.network.downlinkMbps + ' Mbps' : 'Downlink not exposed'} · {diagnostics.network?.rttMs != null ? diagnostics.network.rttMs + ' ms RTT' : 'RTT not exposed'}</strong></div>
        <div><span>Data saver</span><strong>{diagnostics.network?.saveData == null ? 'Not exposed by browser' : diagnostics.network.saveData ? 'Enabled' : 'Disabled'}</strong></div>
        <div><span>First contentful paint</span><strong>{formatDuration(diagnostics.performance?.firstContentfulPaintMs)}</strong></div>
        <div><span>Time to first byte</span><strong>{formatDuration(diagnostics.performance?.timeToFirstByteMs)}</strong></div>
        <div><span>DOM content loaded</span><strong>{formatDuration(diagnostics.performance?.domContentLoadedMs)}</strong></div>
        <div><span>Page load event</span><strong>{formatDuration(diagnostics.performance?.loadCompleteMs)}</strong></div>
        <div><span>Resources observed</span><strong>{diagnostics.performance?.resourceCount ?? 'Checking…'}</strong></div>
        <div><span>Transfer size reported</span><strong>{diagnostics.performance?.reportedTransferBytes > 0 ? formatBytes(diagnostics.performance.reportedTransferBytes) : 'Not reported (cache / browser limits)'}</strong></div>
      </div>
      <p class="diagnostic-footnote">Timing values describe this page load. Transfer sizes can be zero for cached resources or when the browser withholds cross-origin timing details. Network status is a browser hint, not a guaranteed internet-reachability test.</p>
    </details>
    <details class="diagnostic-details">
      <summary><span>Storage & device context</span><span class="diagnostic-hint">Local browser estimates</span></summary>
      <div class="diagnostic-grid">
        <div><span>Origin storage used</span><strong>{diagnostics.storage?.usageBytes != null ? formatBytes(diagnostics.storage.usageBytes) : 'Not available'}</strong></div>
        <div><span>Origin storage quota</span><strong>{diagnostics.storage?.quotaBytes != null ? formatBytes(diagnostics.storage.quotaBytes) : 'Not available'}</strong></div>
        <div><span>Persistent storage</span><strong>{diagnostics.storage?.persisted == null ? 'Not reported' : diagnostics.storage.persisted ? 'Granted' : 'Not granted'}</strong></div>
        <div><span>Viewport</span><strong>{diagnostics.environment?.viewportWidth ?? '—'} × {diagnostics.environment?.viewportHeight ?? '—'}</strong></div>
        <div><span>Page visibility</span><strong>{diagnostics.environment?.visibilityState ?? 'Not available'}</strong></div>
        <div><span>Reduced motion</span><strong>{diagnostics.environment?.reducedMotion == null ? 'Not available' : diagnostics.environment.reducedMotion ? 'Preferred' : 'Not requested'}</strong></div>
      </div>
      <p class="diagnostic-footnote">Storage figures are estimates for this site’s origin. The inspector does not read your files, browsing history or other sites’ storage.</p>
    </details>
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
    <p class="px-4 pb-2 text-[10px] leading-5 text-[var(--muted)]">Last checked: {lastChecked ? new Date(lastChecked).toLocaleTimeString() : 'Checking…'} · All diagnostics are measured in this browser tab. Nothing is uploaded; the JSON is copied only when you choose Copy JSON Report.</p>
    <p class="sr-only" aria-live="polite">{copyStatus}</p>
  </div>
</section>

<dialog id="command-palette" bind:this={palette} aria-label="Command palette" class="command-dialog" onclose={() => paletteOpen = false}>
  <div class="command-shell">
    <div class="flex items-center justify-between gap-3 border-b border-[var(--line)] p-3">
      <span class="font-mono text-xs text-[var(--muted)]">COMMAND PALETTE</span>
      <button type="button" class="tool-pill" onclick={closePalette}>Esc</button>
    </div>
    <input bind:this={searchInput} bind:value={query} oninput={() => selectedIndex = 0} id="command-search" class="command-input" type="text" role="combobox" aria-label="Search commands and projects" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={paletteOpen} aria-controls="command-results" aria-activedescendant={paletteItems[selectedIndex] ? "command-option-" + selectedIndex : undefined} placeholder="Search projects, tags or commands…" />
    <div id="command-results" class="max-h-[min(55vh,420px)] overflow-y-auto p-2" role="listbox" aria-label="Command and project results">
      {#each paletteItems as item, index}
        <button type="button" id={"command-option-" + index} role="option" tabindex="-1" aria-selected={selectedIndex === index} class="command-item" class:selected={selectedIndex === index} onclick={() => selectPaletteItem(index)} onmouseenter={() => selectedIndex = index}>
          <span>{item.label}</span><kbd>{item.kind === 'project' ? '↗' : '↵'}</kbd>
        </button>
      {/each}
      {#if paletteItems.length === 0}<p class="p-4 text-sm text-[var(--muted)]">No matching commands, projects or tags.</p>{/if}
    </div>
    <p class="border-t border-[var(--line)] px-4 py-3 text-[10px] text-[var(--muted)]">↑ ↓ navigate · Enter run · Esc close</p>
  </div>
</dialog>
