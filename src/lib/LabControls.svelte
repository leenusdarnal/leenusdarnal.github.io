<script>
  let { projects = [], onToggleTheme = () => {} } = $props();
  let toolsOpen = $state(false);
  let toolsLoading = $state(false);
  let openPaletteOnMount = $state(false);
  /** @type {any} */
  let DeveloperTools = $state(null);
  let loadError = $state('');

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

<section class="lab-controls" aria-label="Developer tools">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <p class="max-w-xl text-sm leading-6 text-[var(--muted)]">Want to explore the implementation? Open the optional developer tools for browser capabilities, diagnostics and the command palette.</p>
    <button type="button" class="tool-pill" aria-expanded={toolsOpen} aria-controls="developer-tools-panel" onclick={toggleDeveloperTools}>{toolsOpen ? 'Hide developer tools' : 'For developers: inspect this site'}</button>
  </div>
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
