import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [monitor, captureWorkflow, captureScript, homepage, config, experiments, projects] = await Promise.all([
  readFile(new URL('../.github/workflows/monitor-sites.yml', import.meta.url), 'utf8'),
  readFile(new URL('../.github/workflows/capture-project-previews.yml', import.meta.url), 'utf8'),
  readFile(new URL('../scripts/capture-project-previews.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8'),
  readFile(new URL('../src/lib/personal-space.config.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/lib/ArchitectureExperiments.svelte', import.meta.url), 'utf8'),
  readFile(new URL('../src/lib/projects.ts', import.meta.url), 'utf8')
]);

test('uptime monitoring checks the authoritative homepage and excludes the obsolete Vercel alias', () => {
  assert.ok(monitor.includes('https://leenusdarnal.github.io/'));
  assert.doesNotMatch(monitor, /https:\/\/leenusdarnal\.vercel\.app\//);
  for (const url of [
    'https://pixelforge-studio-pied.vercel.app/',
    'https://react-metronome-dusky.vercel.app/',
    'https://sikkim-government-salary-calculator.vercel.app/',
    'https://pixelcutout-three.vercel.app/'
  ]) assert.ok(monitor.includes(url), 'Missing monitored application: ' + url);
});

test('Metronome preview is captured from its live application and deployed as a same-origin image', () => {
  assert.ok(captureScript.includes("name: 'Metronome'"));
  assert.ok(captureScript.includes("file: 'metronome-preview.png'"));
  assert.ok(captureScript.includes("outputDirectory: 'static/images'"));
  assert.ok(captureScript.includes("url: 'https://react-metronome-dusky.vercel.app/'"));
  assert.ok(captureScript.includes("expectedText: 'Metronome'"));
  assert.ok(projects.includes("previewSourceUrl: 'https://react-metronome-dusky.vercel.app/'"));
  assert.ok(projects.includes("previewSourceLabel: 'live application'"));
  assert.ok(captureWorkflow.includes('static/images/metronome-preview.png'));
  assert.ok(captureWorkflow.includes("workflow_run:"));
});

test('mobile navigation uses readable 13px labels and maintains 44px navigation targets', () => {
  const navigation = homepage.match(/<nav aria-label="Main navigation"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(navigation, 'Main navigation is present');
  assert.ok(navigation.includes('text-[13px]'));
  assert.match(navigation, /min-h-11/);
  assert.match(navigation, /size-11/);
});

test('hero topic pills are real, keyboard-accessible in-page links', () => {
  assert.match(homepage, /const heroTagLinks = \{/);
  assert.match(homepage, /href=\{heroTagLinks\[tag\] \?\? '#work'\}/);
  assert.match(homepage, /focus-visible:outline-offset-2/);
  for (const id of ['work', 'updates', 'faq']) {
    assert.ok(homepage.includes('id="' + id + '"'), 'Missing hero shortcut target #' + id);
  }
});

test('major homepage sections use one continuous numbering sequence', () => {
  assert.match(homepage, /01 \/ PROJECTS & EXPERIMENTS/);
  assert.match(experiments, /02 \/ CODE EXPERIMENTS/);
  assert.match(config, /eyebrow: '03 \/ PERSONAL SPACE'/);
  assert.match(config, /eyebrow: '04 \/ A LITTLE ABOUT ME'/);
  assert.match(config, /eyebrow: '05 \/ SAY HELLO'/);
});
