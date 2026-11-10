<script>
  let { projects = [], onToggleTheme = () => {} } = $props();
  let activeFilter = $state('all');
  let toolsOpen = $state(false);
  let toolsLoading = $state(false);
  let openPaletteOnMount = $state(false);
  /** @type {any} */
  let DeveloperTools = $state(null);
  let loadError = $state('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'client-compute', label: 'Client Compute' },
    { id: 'full-stack', label: 'Full-Stack' },
    { id: 'svelte', label: 'Svelte' },
    { id: 'react', label: 'React' }
  ];
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

  async function loadDeveloperTools(launchPalette = false) {
    if (launchPalette) openPaletteOnMount = true;
    if (!DeveloperTools && !toolsLoading) {
      toolsLoading = true;
      loadError = '';
      try {
        const module = await import('./DeveloperTools.svelte');
        DeveloperTools = module.default;
      } catch {
        loadError = 'Developer tools could not be loaded. Refresh the page and try again.';
      } finally {
        toolsLoading = false;
      }
    }
    if (DeveloperTools) toolsOpen = true;
  }

  function toggleDeveloperTools() {
    if (toolsOpen) {
      toolsOpen = false;
      openPaletteOnMount = false;
    } else {
      void loadDeveloperTools();
    }
  }

  /** @param {KeyboardEvent} event */
  function handleGlobalKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !toolsOpen) {
      event.preventDefault();
      void loadDeveloperTools(true);
    }
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
      <button type="button" class="tool-pill" aria-expanded={toolsOpen} aria-controls="developer-tools-panel" onclick={toggleDeveloperTools}>{toolsOpen ? 'Hide developer tools' : 'Open developer tools'}</button>
    </div>
  </div>
  <p class="sr-only" aria-live="polite">{visibleProjectCount} projects shown.</p>
  <div id="developer-tools-panel" class="mt-4">
    {#if toolsOpen && DeveloperTools}
      <DeveloperTools {projects} {onToggleTheme} {openPaletteOnMount} onPaletteOpened={() => openPaletteOnMount = false} />
    {:else if toolsLoading}
      <p class="mt-4 rounded-xl border border-[var(--line)] p-4 text-sm text-[var(--muted)]" role="status">Loading developer tools…</p>
    {:else if loadError}
      <p class="mt-4 rounded-xl border border-[var(--line)] p-4 text-sm text-[var(--muted)]" role="alert">{loadError}</p>
    {/if}
  </div>
</section>
