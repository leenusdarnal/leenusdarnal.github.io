import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const buildUrl = new URL('../build/', import.meta.url);
const html = await readFile(new URL('index.html', buildUrl), 'utf8');
const robots = await readFile(new URL('robots.txt', buildUrl), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', buildUrl), 'utf8');
const source = await readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/app.css', import.meta.url), 'utf8');
const monitorWorkflow = await readFile(new URL('../.github/workflows/monitor-sites.yml', import.meta.url), 'utf8');

test('homepage includes a meaningful page title and description', () => {
  assert.match(html, /<title>Leenus Darnal — I build useful things<\/title>/);
  assert.match(html, /<meta name="description" content="The personal site of Leenus Darnal\./);
});

test('homepage exposes the primary landmarks and skip link', () => {
  assert.match(html, /href="#main"[^>]*>Skip to content<\/a>/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /<nav\b[^>]*aria-label="Main navigation"[^>]*>/);
  assert.match(html, /aria-labelledby="work-heading"/);
  assert.match(html, /aria-labelledby="contact-heading"/);
});

test('theme control has an accessible name and describes both states', () => {
  assert.match(html, /aria-label="Switch to light theme"/);
  assert.match(source, /aria-label=\{theme === 'dark' \? 'Switch to light theme' : 'Switch to dark theme'\}/);
});

test('all existing live project destinations are preserved', () => {
  for (const url of [
    'https://pixelforge-studio-pied.vercel.app/',
    'https://react-metronome-dusky.vercel.app/',
    'https://sikkim-government-salary-calculator.vercel.app/'
  ]) {
    assert.ok(html.includes(url), 'Missing project URL: ' + url);
  }
});

test('daily uptime monitoring covers every live project demo', () => {
  for (const url of [
    'https://pixelforge-studio-pied.vercel.app/',
    'https://react-metronome-dusky.vercel.app/',
    'https://sikkim-government-salary-calculator.vercel.app/',
    'https://pixelcutout-three.vercel.app/'
  ]) {
    assert.ok(monitorWorkflow.includes(url), 'Missing monitored project URL: ' + url);
  }
  assert.match(monitorWorkflow, /schedule:/);
});

test('PixelCutout is listed with its source and local-processing features', () => {
  assert.match(source, /name: 'PixelCutout'/);
  assert.match(source, /https:\/\/pixelcutout-three\.vercel\.app\//);
  assert.match(source, /https:\/\/github\.com\/leenusdarnal\/pixelcutout/);
  assert.match(source, /AI and no-AI removal modes/);
  assert.match(source, /Images stay on your device/);
  assert.match(source, /\{#if project\.live\}/);
});

test('PixelForge portfolio details match its current SvelteKit project', () => {
  assert.match(source, /stack: \['SvelteKit', 'Tailwind CSS', 'Canvas API'\]/);
  assert.match(source, /Editable text layers/);
  assert.match(source, /24 MP document target/);
  assert.match(source, /offline-first editor/);
  assert.match(source, /local \.pfs project files/);
});

test('salary calculator is clearly identified as an independent reference tool', () => {
  assert.match(source, /not an official Government of Sikkim calculator/);
});

test('external links opened in new tabs use safe rel attributes', () => {
  const externalLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)];
  assert.ok(externalLinks.length > 0, 'Expected at least one external link');
  for (const [anchor] of externalLinks) {
    assert.match(anchor, /rel="noopener noreferrer"/);
  }
});

test('canonical and social metadata use the primary site URL', () => {
  assert.match(html, /rel="canonical" href="https:\/\/leenusdarnal\.github\.io\//);
  assert.match(html, /property="og:image" content="https:\/\/leenusdarnal\.github\.io\/og-image\.svg"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /application\/ld\+json/);
});

test('robots and sitemap are included in the static output', () => {
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Sitemap: https:\/\/leenusdarnal\.github\.io\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/leenusdarnal\.github\.io\/<\/loc>/);
});

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function readThemeVariables(block) {
  return Object.fromEntries(
    [...block.matchAll(/--(page|panel|panel-soft|ink|muted|accent):\s*(#[0-9a-fA-F]{6})/g)]
      .map(([, name, value]) => [name, value])
  );
}

test('theme text and accent colours meet 4.5:1 contrast against site surfaces', () => {
  const lightBlock = css.match(/:root\s*\{([^}]+)\}/)?.[1];
  const darkBlock = css.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)?.[1];
  assert.ok(lightBlock, 'Light theme variables must exist');
  assert.ok(darkBlock, 'Dark theme variables must exist');

  for (const [themeName, variables] of [
    ['light', readThemeVariables(lightBlock)],
    ['dark', readThemeVariables(darkBlock)]
  ]) {
    for (const foreground of ['ink', 'muted', 'accent']) {
      for (const background of ['page', 'panel', 'panel-soft']) {
        const ratio = contrastRatio(variables[foreground], variables[background]);
        assert.ok(
          ratio >= 4.5,
          themeName + ' theme ' + foreground + ' on ' + background + ' is ' + ratio.toFixed(2) + ':1'
        );
      }
    }
  }
});

test('layout includes responsive gutters, type and hero sizing for phone through desktop', () => {
  assert.ok(html.includes('px-4 min-[480px]:px-5 sm:px-8 lg:px-10'));
  assert.ok(html.includes('text-[clamp(3.1rem,11vw,8.8rem)]'));
  assert.ok(html.includes('min-h-0 content-center gap-8 py-20 sm:min-h-[540px]'));
  assert.ok(html.includes('md:grid-cols-[minmax(0,1fr)_180px]'));
  assert.ok(html.includes('xl:grid-cols-[minmax(0,1fr)_220px]'));
});

test('mobile navigation and primary actions retain comfortable touch targets', () => {
  assert.ok(html.includes('min-h-11'));
  assert.ok(html.includes('size-11 shrink-0 place-items-center'));
});

test('the document prevents horizontal page overflow and retains reduced-motion support', () => {
  assert.ok(css.includes('overflow-x: clip'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(css.includes('scroll-padding-top: 1rem'));
});


test('each selected project has a prerendered case study page', async () => {
  const projects = [
    ['pixelforge-studio', 'PixelForge Studio'],
    ['metronome', 'Metronome'],
    ['sikkim-government-salary-calculator', 'Sikkim Government Salary Calculator'],
    ['pixelcutout', 'PixelCutout']
  ];

  for (const [slug, name] of projects) {
    const page = await readFile(new URL(`projects/${slug}/index.html`, buildUrl), 'utf8');
    assert.match(page, new RegExp(`<h1[^>]*>${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}`));
    assert.match(page, /<title>.*Leenus Darnal<\\/title>/);
    assert.match(page, /rel="canonical"/);
    assert.match(page, /href="\\/\\#work"|href="\\/"/);
  }
});

test('homepage links each project to its case study', () => {
  for (const slug of [
    'pixelforge-studio',
    'metronome',
    'sikkim-government-salary-calculator',
    'pixelcutout'
  ]) {
    assert.ok(html.includes(`/projects/${slug}/`), 'Missing case study link: ' + slug);
  }
});
