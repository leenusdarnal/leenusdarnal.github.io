<script>
  let { project } = $props();
  let copied = $state(false);
  /** @type {Map<string, string[]>} */
  const architecture = new Map([
    ['pixelforge-studio', ['Browser-based image editing with a canvas-oriented workflow.', 'Published features include layers, masks, selection tools, editable text and local .pfs project files.', 'Offline-first behaviour and local autosaves are described in the project notes. Runtime details such as WebGPU, ONNX or worker isolation are not asserted here.']],
    ['metronome', ['React + TypeScript + Vite application.', 'Published functionality includes tempo control, playback and selectable time signatures.', 'The current homepage does not document backend services or a server-side feed architecture.']],
    ['sikkim-government-salary-calculator', ['Standalone browser reference calculator built with JavaScript, HTML and CSS.', 'Estimates gross pay, common deductions and in-hand salary.', 'It is an independent estimate tool, not an official Government of Sikkim calculator.']],
    ['pixelcutout', ['SvelteKit application using Transformers.js and ONNX Runtime.', 'Published features include AI and no-AI removal modes, local erase/restore tools and PNG, JPEG and WebP export.', 'The homepage describes local image handling; exact model/provider selection is not specified here.']]
  ]);
  async function copyClone() {
    const command = 'git clone ' + project.source + '.git';
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(command);
      else {
        const field = document.createElement('textarea');
        field.value = command;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        const ok = document.execCommand('copy');
        field.remove();
        if (!ok) throw new Error('Clipboard unavailable');
      }
      copied = true;
      setTimeout(() => copied = false, 1800);
    } catch { copied = false; }
  }
</script>

<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
  {#if project.live}<a href={project.live} target="_blank" rel="noopener noreferrer" class="font-semibold text-[var(--accent)] hover:underline">Launch App ↗</a>{/if}
  <a href={project.source} target="_blank" rel="noopener noreferrer" class="font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Source Code ↗</a>
  <a href={"/projects/" + project.slug + "/"} class="font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Project Notes ↗</a>
  <button type="button" class="clone-button" onclick={copyClone} aria-label="Copy git clone command" title="Copy git clone command">{copied ? 'Copied!' : '⧉ Clone'}</button>
  <span class="sr-only" aria-live="polite">{copied ? 'Clone command copied to clipboard.' : ''}</span>
</div>
<details class="architecture-drawer mt-4">
  <summary aria-label={"Inspect " + project.name + " architecture"}>Inspect Architecture <span class="architecture-toggle" aria-hidden="true">＋</span></summary>
  <ul>
    {#each architecture.get(project.slug) ?? ['Project implementation details have not yet been documented.'] as item}
      <li>{item}</li>
    {/each}
  </ul>
</details>
