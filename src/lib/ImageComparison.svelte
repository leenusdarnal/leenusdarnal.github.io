<script>
  import { onDestroy } from 'svelte';

  const supportedTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/avif'
  ]);
  const maxFileBytes = 20 * 1024 * 1024;
  const maxImagePixels = 40_000_000;
  const pendingUrls = new Set();
  const pendingBySide = { before: '', after: '' };
  const selectionVersion = { before: 0, after: 0 };

  let beforeUrl = $state('');
  let afterUrl = $state('');
  let beforeName = $state('');
  let afterName = $state('');
  let position = $state(50);
  let error = $state('');
  let destroyed = false;

  function revokeUrl(url) {
    if (!url) return;
    pendingUrls.delete(url);
    if (pendingBySide.before === url) pendingBySide.before = '';
    if (pendingBySide.after === url) pendingBySide.after = '';
    URL.revokeObjectURL(url);
  }

  /** @param {Event} event @param {'before' | 'after'} side */
  function loadImage(event, side) {
    const input = /** @type {HTMLInputElement} */ (event.currentTarget);
    const file = input.files?.[0];
    if (!file) return;

    // Reset immediately so selecting the same file again still fires change.
    input.value = '';
    const version = ++selectionVersion[side];
    if (pendingBySide[side]) revokeUrl(pendingBySide[side]);

    if (!supportedTypes.has(file.type)) {
      error = 'Choose a PNG, JPEG, WebP, GIF or AVIF image.';
      return;
    }
    if (file.size > maxFileBytes) {
      error = 'Each image must be 20 MB or smaller.';
      return;
    }

    const url = URL.createObjectURL(file);
    pendingUrls.add(url);
    pendingBySide[side] = url;
    const probe = new Image();

    probe.onload = () => {
      if (!pendingUrls.has(url)) return;
      pendingUrls.delete(url);
      if (pendingBySide[side] === url) pendingBySide[side] = '';

      if (destroyed || version !== selectionVersion[side]) {
        URL.revokeObjectURL(url);
        return;
      }
      if (!probe.naturalWidth || !probe.naturalHeight || probe.naturalWidth * probe.naturalHeight > maxImagePixels) {
        URL.revokeObjectURL(url);
        error = 'Choose an image up to 40 megapixels.';
        return;
      }

      if (side === 'before') {
        if (beforeUrl) URL.revokeObjectURL(beforeUrl);
        beforeUrl = url;
        beforeName = file.name;
      } else {
        if (afterUrl) URL.revokeObjectURL(afterUrl);
        afterUrl = url;
        afterName = file.name;
      }
      error = '';
    };

    probe.onerror = () => {
      if (!pendingUrls.has(url)) return;
      pendingUrls.delete(url);
      if (pendingBySide[side] === url) pendingBySide[side] = '';
      URL.revokeObjectURL(url);
      if (!destroyed && version === selectionVersion[side]) {
        error = 'The selected image could not be decoded.';
      }
    };
    probe.src = url;
  }

  function clearComparison() {
    // Invalidate in-flight decodes before releasing their object URLs.
    selectionVersion.before += 1;
    selectionVersion.after += 1;
    for (const url of pendingUrls) URL.revokeObjectURL(url);
    pendingUrls.clear();
    pendingBySide.before = '';
    pendingBySide.after = '';
    if (beforeUrl) URL.revokeObjectURL(beforeUrl);
    if (afterUrl) URL.revokeObjectURL(afterUrl);
    beforeUrl = '';
    afterUrl = '';
    beforeName = '';
    afterName = '';
    position = 50;
    error = '';
  }

  onDestroy(() => {
    destroyed = true;
    for (const url of pendingUrls) URL.revokeObjectURL(url);
    pendingUrls.clear();
    if (beforeUrl) URL.revokeObjectURL(beforeUrl);
    if (afterUrl) URL.revokeObjectURL(afterUrl);
  });
</script>

<section class="mt-12 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-6" aria-labelledby="comparison-heading">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">LOCAL IMAGE TOOL</p>
      <h2 id="comparison-heading" class="mt-2 text-2xl font-semibold tracking-[-0.05em]">Compare your PixelForge edits.</h2>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Choose an original image and an edited export, then drag the divider to inspect the difference. Files are previewed locally in this tab and are never uploaded.</p>
    </div>
    {#if beforeUrl || afterUrl}
      <button type="button" onclick={clearComparison} class="inline-flex min-h-11 items-center rounded-full border border-[var(--line)] px-4 py-2 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]">Clear images</button>
    {:else}
      <span class="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[9px] text-[var(--muted)]">NO UPLOADS</span>
    {/if}
  </div>

  <div class="mt-5 grid gap-3 sm:grid-cols-2">
    <label class="grid gap-2 rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--muted)]">
      <span class="font-mono uppercase tracking-[0.12em]">Original image</span>
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onchange={(event) => loadImage(event, 'before')} class="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-3 file:py-2 file:font-semibold file:text-[var(--accent-contrast)]" />
      <span class="truncate" title={beforeName}>{beforeName || 'Choose a file · max 20 MB'}</span>
    </label>
    <label class="grid gap-2 rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--muted)]">
      <span class="font-mono uppercase tracking-[0.12em]">Edited export</span>
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onchange={(event) => loadImage(event, 'after')} class="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-3 file:py-2 file:font-semibold file:text-[var(--accent-contrast)]" />
      <span class="truncate" title={afterName}>{afterName || 'Choose a file · max 20 MB'}</span>
    </label>
  </div>

  <p class="sr-only" aria-live="polite" aria-atomic="true">
    {#if beforeName && afterName}
      Comparison ready for {beforeName} and {afterName}.
    {:else if beforeName}
      Original image loaded: {beforeName}.
    {:else if afterName}
      Edited image loaded: {afterName}.
    {/if}
  </p>

  {#if error}<p class="mt-3 text-sm text-[var(--accent)]" role="alert">{error}</p>{/if}
  {#if beforeUrl && afterUrl}
    <div class="mt-5">
      <div class="relative isolate aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--line)] bg-[#101512]" style="--reveal: {position}%">
        <img src={afterUrl} alt={afterName} class="absolute inset-0 size-full object-contain" />
        <img src={beforeUrl} alt={beforeName} class="absolute inset-0 size-full object-contain" style="clip-path: inset(0 calc(100% - var(--reveal)) 0 0)" />
        <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow-[0_0_0_1px_#111]" style="left: var(--reveal)">
          <span class="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-black/70 text-lg text-white">↔</span>
        </div>
        <span class="absolute left-3 top-3 z-20 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[9px] uppercase text-white">Original</span>
        <span class="absolute right-3 top-3 z-20 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[9px] uppercase text-white">Edited</span>
      </div>
      <label class="mt-4 grid gap-2 text-xs text-[var(--muted)]">
        <span class="flex justify-between"><span>Reveal original</span><span class="font-mono">{position}%</span></span>
        <input aria-label="Reveal original image" type="range" min="0" max="100" step="1" bind:value={position} class="w-full accent-[var(--accent)]" />
      </label>
    </div>
  {:else}
    <div class="mt-5 grid min-h-44 place-items-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--panel-soft)] px-5 py-8 text-center">
      <div>
        <p class="text-sm font-semibold text-[var(--ink)]">Your comparison will appear here.</p>
        <p class="mt-2 text-xs leading-5 text-[var(--muted)]">Select both images to activate the draggable before-and-after view.</p>
      </div>
    </div>
  {/if}
</section>
