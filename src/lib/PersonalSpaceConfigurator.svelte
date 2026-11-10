<script>
  import { onMount } from 'svelte';
  import { personalSpaceConfig } from './personal-space.config';

  const storageKey = 'leenus-lab-config-draft-v1';
  const defaults = {
    name: personalSpaceConfig.identity.name,
    title: personalSpaceConfig.site.title,
    description: personalSpaceConfig.site.description,
    githubUrl: personalSpaceConfig.site.githubUrl,
    contactEmail: personalSpaceConfig.site.contactEmail,
    headline: personalSpaceConfig.content.hero.headline,
    heroDescription: personalSpaceConfig.content.hero.description,
    palette: personalSpaceConfig.appearance.palette,
    defaultTheme: personalSpaceConfig.appearance.defaultTheme,
    sections: { ...personalSpaceConfig.sections }
  };
  /** @type {Array<keyof typeof defaults.sections>} */
  const sectionKeys = ['projects', 'sourceExperiments', 'personalSpace', 'about', 'contact'];
  /** @type {Array<'name' | 'title' | 'description' | 'githubUrl' | 'contactEmail' | 'headline' | 'heroDescription' | 'palette'>} */
  const draftStringKeys = ['name', 'title', 'description', 'githubUrl', 'contactEmail', 'headline', 'heroDescription', 'palette'];

  let draft = $state(structuredClone(defaults));
  let status = $state('No local draft saved');
  let hasSavedDraft = $state(false);

  onMount(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      if (saved.length > 16384) throw new Error('Saved draft is too large');
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid draft format');
      /** @type {{ name: string; title: string; description: string; githubUrl: string; contactEmail: string; headline: string; heroDescription: string; palette: string; defaultTheme: 'system' | 'light' | 'dark'; sections: Record<string, boolean> }} */
      const next = { ...defaults, sections: { ...defaults.sections } };
      for (const key of draftStringKeys) {
        if (typeof parsed[key] === 'string' && parsed[key].length <= 2000) next[key] = parsed[key];
      }
      if (['system', 'light', 'dark'].includes(parsed.defaultTheme)) next.defaultTheme = parsed.defaultTheme;
      if (parsed.sections && typeof parsed.sections === 'object' && !Array.isArray(parsed.sections)) {
        for (const key of sectionKeys) if (typeof parsed.sections[key] === 'boolean') next.sections[key] = parsed.sections[key];
      }
      draft = next;
      status = 'Restored your local draft';
      hasSavedDraft = true;
    } catch {
      status = 'Could not read the saved draft';
    }
  });

  function validateDraft() {
    if (!draft.name.trim() || !draft.title.trim() || !draft.description.trim() || !draft.headline.trim() || !draft.heroDescription.trim()) return 'Name, title, description and homepage copy are required.';
    if (draft.name.length > 80 || draft.title.length > 120 || draft.description.length > 240 || draft.headline.length > 100 || draft.heroDescription.length > 400 || draft.palette.length > 40) return 'One or more fields exceed the allowed length.';
    try {
      const url = new URL(draft.githubUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com') return 'Use a valid HTTPS GitHub profile URL.';
    } catch { return 'Enter a valid GitHub profile URL.'; }
    if (draft.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contactEmail)) return 'Enter a valid contact email or leave it blank.';
    if (draft.contactEmail.length > 254) return 'Contact email is too long.';
    return '';
  }

  function saveDraft() {
    const error = validateDraft();
    if (error) { status = error; return; }
    try {
      const serialised = JSON.stringify(draft);
      if (serialised.length > 16384) { status = 'Draft is too large to save.'; return; }
      localStorage.setItem(storageKey, serialised);
      status = 'Draft saved on this device';
      hasSavedDraft = true;
    } catch {
      status = 'Browser storage is unavailable; export your draft instead';
    }
  }

  function resetDraft() {
    draft = structuredClone(defaults);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Reset still works for the current page when storage is unavailable.
    }
    status = 'Preview reset to the published configuration';
    hasSavedDraft = false;
  }

  function exportDraft() {
    const error = validateDraft();
    if (error) { status = error; return; }
    const payload = {
      generatedAt: new Date().toISOString(),
      note: 'Preview draft only. Review and apply these values to src/lib/personal-space.config.ts before deploying.',
      config: draft
    };
    const file = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'leenus-lab-config-draft.json';
    anchor.click();
    URL.revokeObjectURL(url);
    status = 'Configuration draft exported';
  }
</script>

<section class="configurator mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)]" aria-labelledby="configurator-heading">
  <details>
    <summary class="flex min-h-14 cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
      <span class="min-w-0">
        <span class="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">CONFIGURATION PLAYGROUND</span>
        <span id="configurator-heading" class="mt-1 block text-sm font-semibold text-[var(--ink)]">Edit this space & preview changes</span>
      </span>
      <span class="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[9px] text-[var(--muted)]">LOCAL ONLY · PREVIEW</span>
    </summary>

    <div class="grid border-t border-[var(--line)] lg:grid-cols-[minmax(0,1fr)_minmax(260px,.8fr)]">
      <div class="min-w-0 p-4 sm:p-5">
        <div class="mb-5">
          <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">01 / SITE IDENTITY</p>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label class="config-field">Display name
              <input bind:value={draft.name} autocomplete="name" maxlength="80" required />
            </label>
            <label class="config-field">Browser / SEO title
              <input bind:value={draft.title} maxlength="120" required />
            </label>
            <label class="config-field sm:col-span-2">Site description
              <textarea bind:value={draft.description} rows="2" maxlength="240" required></textarea>
            </label>
            <label class="config-field">GitHub profile URL
              <input bind:value={draft.githubUrl} type="url" inputmode="url" maxlength="200" required />
            </label>
            <label class="config-field">Contact email
              <input bind:value={draft.contactEmail} type="email" maxlength="254" />
            </label>
          </div>
        </div>

        <div class="mb-5 border-t border-[var(--line)] pt-5">
          <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">02 / HOMEPAGE COPY</p>
          <div class="mt-3 grid gap-3">
            <label class="config-field">Hero headline
              <input bind:value={draft.headline} maxlength="100" required />
            </label>
            <label class="config-field">Hero description
              <textarea bind:value={draft.heroDescription} rows="3" maxlength="400" required></textarea>
            </label>
          </div>
        </div>

        <div class="mb-5 border-t border-[var(--line)] pt-5">
          <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">03 / APPEARANCE</p>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label class="config-field">Palette label (display name only)
              <input bind:value={draft.palette} maxlength="40" />
            </label>
            <label class="config-field">Default theme
              <select bind:value={draft.defaultTheme}>
                <option value="system">System preference</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>
          </div>
        </div>

        <div class="border-t border-[var(--line)] pt-5">
          <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">04 / SECTION VISIBILITY</p>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {#each sectionKeys as section}
              <label class="config-toggle">
                <input type="checkbox" bind:checked={draft.sections[section]} />
                <span>{section === 'sourceExperiments' ? 'Source experiments' : section === 'personalSpace' ? 'Personal space' : section.charAt(0).toUpperCase() + section.slice(1)}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <button type="button" class="config-action config-action-primary" onclick={saveDraft}>Save local draft</button>
          <button type="button" class="config-action" onclick={exportDraft}>Export JSON</button>
          <button type="button" class="config-action" onclick={resetDraft}>Reset</button>
        </div>
        <p class="mt-3 text-xs text-[var(--muted)]" role="status" aria-live="polite">{status}</p>
      </div>

      <aside class="min-w-0 border-t border-[var(--line)] bg-[var(--panel-soft)] p-4 sm:p-5 lg:border-l lg:border-t-0" aria-label="Live configuration preview">
        <div class="flex items-center justify-between gap-2">
          <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">LIVE PREVIEW</p>
          <span class="font-mono text-[9px] text-[var(--muted)]">UNPUBLISHED</span>
        </div>
        <div class="mt-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-5" style={draft.defaultTheme === 'light' ? '--page:#f8fafc;--panel:#ffffff;--panel-soft:#f1f5f9;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0' : draft.defaultTheme === 'dark' ? '--page:#0b0f19;--panel:#111827;--panel-soft:#172033;--ink:#f8fafc;--muted:#94a3b8;--line:#293548' : ''}>
          <p class="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--muted)]">{draft.name || 'Your name'} · {draft.palette || 'Palette'}</p>
          <h3 class="mt-4 break-words text-2xl font-semibold leading-tight tracking-[-0.06em] text-[var(--ink)]">{draft.headline || 'Your headline'}<span class="text-[var(--accent)]">.</span></h3>
          <p class="mt-3 break-words text-sm leading-6 text-[var(--muted)]">{draft.heroDescription || 'Your introduction will appear here.'}</p>
          <div class="mt-5 border-t border-[var(--line)] pt-4">
            <p class="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">SITE METADATA</p>
            <p class="mt-2 break-words text-sm font-semibold text-[var(--ink)]">{draft.title}</p>
            <p class="mt-1 break-words text-xs leading-5 text-[var(--muted)]">{draft.description}</p>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            {#each sectionKeys.filter((section) => draft.sections[section]) as section}
              <span class="rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-[9px] text-[var(--muted)]">{section}</span>
            {/each}
          </div>
        </div>
        <div class="mt-4 rounded-xl border border-[var(--line)] p-3">
          <p class="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">PUBLISHING WORKFLOW</p>
          <ol class="mt-2 space-y-2 text-xs leading-5 text-[var(--muted)]">
            <li><span class="text-[var(--accent)]">01</span> Edit and preview the values here.</li>
            <li><span class="text-[var(--accent)]">02</span> Export the JSON draft.</li>
            <li><span class="text-[var(--accent)]">03</span> Apply approved values to <code>src/lib/personal-space.config.ts</code>.</li>
            <li><span class="text-[var(--accent)]">04</span> Test, commit and deploy the site.</li>
          </ol>
        </div>
        <p class="mt-3 text-[10px] leading-5 text-[var(--muted)]">Drafts stay in this browser's local storage. They are not uploaded, shared or applied to the live site. {hasSavedDraft ? 'A saved draft is available on this device.' : 'Save a draft if you want to return to it later.'}</p>
      </aside>
    </div>
  </details>
</section>

<style>
  .config-field { display: grid; gap: .4rem; color: var(--muted); font: 500 .68rem/1.5 var(--font-mono); }
  .config-field input, .config-field textarea, .config-field select {
    width: 100%; min-width: 0; border: 1px solid var(--line); border-radius: .65rem;
    padding: .65rem .75rem; color: var(--ink); background: var(--page);
    font: 400 .78rem/1.6 var(--font-sans);
  }
  .config-field textarea { resize: vertical; }
  .config-field input:focus-visible, .config-field textarea:focus-visible, .config-field select:focus-visible,
  .config-toggle input:focus-visible, .config-action:focus-visible, .configurator summary:focus-visible {
    outline: 2px solid var(--accent); outline-offset: 3px;
  }
  .config-toggle { display: flex; min-width: 0; align-items: center; gap: .5rem; color: var(--muted); font-size: .7rem; }
  .config-toggle input { accent-color: var(--accent); }
  .config-action { min-height: 2.6rem; border: 1px solid var(--line); border-radius: 999px; padding: .55rem .85rem; color: var(--ink); font-size: .72rem; font-weight: 600; }
  .config-action:hover { border-color: var(--accent); }
  .config-action-primary { border-color: var(--accent); color: var(--accent-contrast); background: var(--accent); }
  .configurator summary::-webkit-details-marker { display: none; }
</style>
