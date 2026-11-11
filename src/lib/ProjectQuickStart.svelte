<script>
  let { audience, firstAction } = $props();
</script>

<dl aria-label="Project quick start" class="mt-5 grid gap-3 sm:grid-cols-2">
  <div class="min-w-0 rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
    <dt class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]">Good for</dt>
    <dd class="mt-2 text-xs leading-6 text-[var(--muted)]">{audience}</dd>
  </div>
  <div class="min-w-0 rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-4">
    <dt class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]">First step</dt>
    <dd class="mt-2 text-xs leading-6 text-[var(--muted)]">{firstAction}</dd>
  </div>
</dl>
