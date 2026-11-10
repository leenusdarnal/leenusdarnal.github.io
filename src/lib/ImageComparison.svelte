<script>
  import { onDestroy } from 'svelte';

  let beforeUrl = $state('');
  let afterUrl = $state('');
  let beforeName = $state('');
  let afterName = $state('');
  let position = $state(50);
  let error = $state('');

  function loadImage(event, side) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      error = 'Choose a valid image file.';
      event.currentTarget.value = '';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      error = 'Each image must be 20 MB or smaller.';
      event.currentTarget.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
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
  }

  onDestroy(() => {
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
    <span class="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[9px] text-[var(--muted)]">NO UPLOADS</span>
  </div>

  <div class="mt-5 grid gap-3 sm:grid-cols-2">
    <label class="grid gap-2 rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--muted)]">
      <span class="font-mono uppercase tracking-[0.12em]">Original image</span>
      <input type="file" accept="image/*" onchange={(event) => loadImage(event, 'before')} class="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-3 file:py-2 file:font-semibold file:text-[var(--accent-contrast)]" />
      <span class="truncate" title={beforeName}>{beforeName || 'Choose a file · max 20 MB'}</span>
    </label>
    <label class="grid gap-2 rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--muted)]">
      <span class="font-mono uppercase tracking-[0.12em]">Edited export</span>
      <input type="file" accept="image/*" onchange={(event) => loadImage(event, 'after')} class="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-3 file:py-2 file:font-semibold file:text-[var(--accent-contrast)]" />
      <span class="truncate" title={afterName}>{afterName || 'Choose a file · max 20 MB'}</span>
    </label>
  </div>

  {#if error}<p class="mt-3 text-sm text-[var(--accent)]" role="alert">{error}</p>{/if}
  {#if beforeUrl && afterUrl}
    <div class="mt-5">
      <div class="relative isolate aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--line)] bg-[#101512]" style="--reveal: {position}%">
        <img src={afterUrl} alt="Edited image" class="absolute inset-0 size-full object-contain" />
        <img src={beforeUrl} alt="Original image" class="absolute inset-0 size-full object-contain" style="clip-path: inset(0 calc(100% - var(--reveal)) 0 0)" />
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
