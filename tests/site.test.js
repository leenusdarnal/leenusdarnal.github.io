import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const buildUrl = new URL('../build/', import.meta.url);
const html = await readFile(new URL('index.html', buildUrl), 'utf8');
const robots = await readFile(new URL('robots.txt', buildUrl), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', buildUrl), 'utf8');
const feed = await readFile(new URL('feed.xml', buildUrl), 'utf8');
const fallback = await readFile(new URL('404.html', buildUrl), 'utf8');
const source = await readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8');
const personalSpaceConfigSource = await readFile(new URL('../src/lib/personal-space.config.ts', import.meta.url), 'utf8');
const projectsSource = await readFile(new URL('../src/lib/projects.ts', import.meta.url), 'utf8');
const projectRouteSource = await readFile(new URL('../src/routes/projects/[slug]/+page.js', import.meta.url), 'utf8');
const projectDetailSource = await readFile(new URL('../src/routes/projects/[slug]/+page.svelte', import.meta.url), 'utf8');
const appHtmlSource = await readFile(new URL('../src/app.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/app.css', import.meta.url), 'utf8');
const labControls = await readFile(new URL('../src/lib/LabControls.svelte', import.meta.url), 'utf8');
const developerTools = await readFile(new URL('../src/lib/DeveloperTools.svelte', import.meta.url), 'utf8');
const repoMetadata = await readFile(new URL('../src/lib/RepoMetadata.svelte', import.meta.url), 'utf8');
const projectActions = await readFile(new URL('../src/lib/ProjectActions.svelte', import.meta.url), 'utf8');
const monitorWorkflow = await readFile(new URL('../.github/workflows/monitor-sites.yml', import.meta.url), 'utf8');

test('homepage includes a meaningful page title and description', () => {
  assert.match(html, /<title>Leenus Darnal — I build useful things<\/title>/);
  assert.match(html, /<meta name="description" content="A personal space for useful web tools/);
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

test('homepage includes a concise About section and navigation link', () => {
  assert.match(html, /href="#about"[^>]*>About<\/a>/);
  assert.match(html, /id="about"/);
  assert.match(html, /Curious by nature/);
  assert.match(html, /little corner of the internet for browser-native tools/);
});


test('homepage is framed as a personal project space, not a job-search portfolio', () => {
  assert.match(html, />Projects<\/a>/);
  assert.match(html, /PROJECTS &amp; EXPERIMENTS/);
  assert.match(html, /Things I like exploring/);
  assert.match(personalSpaceConfigSource, /A personal space for useful web tools/);
  assert.doesNotMatch(source, /resume|résumé|download cv|hire me|open to work|job seeking|personal developer portfolio/i);
});

test('all existing live project destinations are preserved', () => {
  for (const url of [
    'https://pixelforge-studio-pied.vercel.app/',
    'https://react-metronome-dusky.vercel.app/',
    'https://sikkim-government-salary-calculator.vercel.app/',
    'https://pixelcutout-three.vercel.app/'
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
  assert.match(projectsSource, /name: 'PixelCutout'/);
  assert.match(projectsSource, /https:\/\/pixelcutout-three\.vercel\.app\//);
  assert.match(projectsSource, /https:\/\/github\.com\/leenusdarnal\/pixelcutout/);
  assert.match(projectsSource, /AI and no-AI removal modes/);
  assert.match(projectsSource, /Images stay on your device/);
  assert.match(projectActions, /\{#if project\.live\}/);
});

test('PixelForge portfolio details match its current SvelteKit project', () => {
  assert.match(projectsSource, /stack: \['SvelteKit', 'Tailwind CSS', 'Canvas API'\]/);
  assert.match(projectsSource, /Editable text layers/);
  assert.match(projectsSource, /24 MP document target/);
  assert.match(projectsSource, /offline-first image editor/);
  assert.match(projectsSource, /local \.pfs project files/);
});

test('salary calculator is clearly identified as an independent reference tool', () => {
  assert.match(projectsSource, /not an official Government of Sikkim calculator/);
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
  assert.match(html, /property="og:image" content="https:\/\/leenusdarnal\.github\.io\/og-image\.png"/);
  assert.match(html, /property="og:image:type" content="image\/png"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
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
    assert.ok(page.includes('<h1'), 'Missing page heading: ' + name);
    assert.ok(page.includes(name), 'Missing project name in case study: ' + name);
    assert.ok(page.includes('<title>') && page.includes('Leenus Darnal</title>'), 'Missing page title: ' + name);
    assert.match(page, /rel="canonical"/);
    assert.ok(page.includes('href="/#work"') || page.includes('href="/"'), 'Missing return navigation: ' + name);
  }
});

test('sitemap includes every prerendered project case study', () => {
  for (const slug of [
    'pixelforge-studio',
    'metronome',
    'sikkim-government-salary-calculator',
    'pixelcutout'
  ]) {
    assert.ok(sitemap.includes(`https://leenusdarnal.github.io/projects/${slug}/`), 'Missing sitemap URL: ' + slug);
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

test('CI validates pull requests and main pushes with supported dependency installs', async () => {
  const ci = await readFile(new URL('../.github/workflows/verify-sveltekit.yml', import.meta.url), 'utf8');
  assert.match(ci, /pull_request:/);
  assert.match(ci, /branches: \[main\]/);
  assert.match(ci, /push:\n\s+branches: \[main,/);
  assert.match(ci, /npm install/);
  assert.match(ci, /run: npm install/);
});

test('Pages deployment uses reproducible cached installs and only deploys main', async () => {
  const deploy = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(deploy, /branches:\n\s+- main/);
  assert.match(deploy, /npm install/);
  assert.match(deploy, /path: build/);
});


test('Metronome case study uses its genuine source-repository screenshot from the shared catalogue', async () => {
  const page = await readFile(new URL('projects/metronome/index.html', buildUrl), 'utf8');
  assert.ok(projectsSource.includes('https://raw.githubusercontent.com/leenusdarnal/react-metronome/master/screenshots/react-metronome.png'));
  assert.match(projectsSource, /previewSourceUrl:/);
  assert.ok(page.includes('https://raw.githubusercontent.com/leenusdarnal/react-metronome/master/screenshots/react-metronome.png'));
  assert.match(page, /Actual application screenshot/);
  assert.match(page, /alt="Screenshot of the Metronome web app interface/);
});

test('projects without verified screenshots are not presented as photographed interfaces', async () => {
  const projects = ['pixelforge-studio', 'sikkim-government-salary-calculator', 'pixelcutout'];
  for (const slug of projects) {
    const page = await readFile(new URL(`projects/${slug}/index.html`, buildUrl), 'utf8');
    assert.match(page, /An authentic screenshot is not yet available/);
    assert.match(page, /View live app/);
  }
});

test('homepage uses genuine application branding and the source screenshot distinctly', () => {
  assert.match(html, /Source repository screenshot/);
  assert.ok(html.includes('https://pixelforge-studio-pied.vercel.app/icons/icon.svg'));
  assert.ok(html.includes('https://pixelcutout-three.vercel.app/pixelcutout-icon.svg'));
  assert.doesNotMatch(html, /Interface illustration/);
  assert.ok(projectsSource.includes('react-metronome/master/screenshots/react-metronome.png'));
});


test('the genuine Metronome screenshot reserves its intrinsic aspect ratio and loads lazily', () => {
  assert.ok(html.includes('react-metronome/master/screenshots/react-metronome.png') && html.includes('width="416" height="314"'));
  assert.ok(html.includes('loading="lazy" decoding="async"'));
});

test('case studies provide social preview metadata', async () => {
  for (const slug of ['pixelforge-studio', 'metronome', 'sikkim-government-salary-calculator', 'pixelcutout']) {
    const page = await readFile(new URL(`projects/${slug}/index.html`, buildUrl), 'utf8');
    assert.match(page, /property="og:image"/);
    assert.match(page, /name="twitter:card" content="summary_large_image"/);
  }
});


test('accent buttons use theme-aware high-contrast foregrounds', async () => {
  assert.ok(!html.includes('text-[#10150d]'));
  assert.ok(html.includes('text-[var(--accent-contrast)]'));
  for (const slug of ['pixelforge-studio', 'metronome', 'sikkim-government-salary-calculator', 'pixelcutout']) {
    const page = await readFile(new URL(`projects/${slug}/index.html`, buildUrl), 'utf8');
    assert.ok(!page.includes('text-[#10150d]'));
  }
});

test('the home link accessible name includes its visible brand label', () => {
  assert.ok(html.includes('aria-label="L. Leenus Darnal. — home"'));
});

test('homepage project preview panels use real app brand assets', () => {
  assert.ok(html.includes('https://pixelforge-studio-pied.vercel.app/icons/icon.svg'));
  assert.ok(html.includes('https://pixelcutout-three.vercel.app/pixelcutout-icon.svg'));
});


test('homepage social preview uses a PNG and an Apple touch icon is linked', () => {
  assert.match(html, /og-image\.png/);
  assert.match(html, /twitter:image" content="https:\/\/leenusdarnal\.github\.io\/og-image\.png"/);
  assert.match(appHtmlSource, /apple-touch-icon\.png/);
});

test('Slate & Emerald reference palette and sticky glass navigation are applied', () => {
  assert.match(css, /--page:\s*#f8fafc/);
  assert.match(css, /--panel:\s*#ffffff/);
  assert.match(css, /--panel-soft:\s*#f1f5f9/);
  assert.match(css, /--page:\s*#0b0f19/);
  assert.match(css, /--panel:\s*#111827/);
  assert.match(css, /--panel-soft:\s*#1e293b/);
  assert.match(css, /backdrop-filter:\s*blur\(12px\)/);
  assert.match(source, /site-header/);
  assert.match(source, /personal-space\.config\.ts/);
  assert.ok(source.includes("import('../lib/PersonalSpaceConfigurator.svelte')"));
  assert.match(personalSpaceConfigSource, /export const personalSpaceConfig =/);
  assert.match(personalSpaceConfigSource, /palette: 'Slate & Emerald'/);
  assert.match(personalSpaceConfigSource, /hosting: 'GitHub Pages'/);
  assert.match(personalSpaceConfigSource, /defaultTheme: 'system'/);
  assert.match(personalSpaceConfigSource, /themeStorageKey: 'site-theme'/);
  assert.match(css, /--font-mono: "Fira Code"/);
});




test('personal-space panel is driven by a dedicated TypeScript config module', () => {
  for (const field of ['identity:', 'site:', 'appearance:', 'sections:', 'navigation:', 'content:', 'focus:', 'principles:', 'socialImage:', 'defaultTheme:']) {
    assert.ok(personalSpaceConfigSource.includes(field), `Missing config field: ${field}`);
  }
  assert.match(source, /personalSpaceConfig\.content\.personalSpace\.focus/);
  assert.match(source, /personalSpaceConfig\.content\.personalSpace\.principles/);
  assert.match(source, /personalSpaceConfig\.site\.title/);
  assert.match(source, /personalSpaceConfig\.appearance\.themeStorageKey/);
  assert.match(source, /personalSpaceConfig\.sections\.projects/);
  assert.match(source, /personalSpaceConfig\.navigation\.filter/);
  assert.match(source, /JSON\.stringify\(\{/);
  assert.match(html, /personal-space\.config\.ts/);
  assert.match(html, /leenus\.lab/);
  assert.match(html, /GitHub Pages/);
  assert.match(html, /Useful over flashy/);
  assert.match(html, /Curiosity over perfection/);
});

test('theme colour metadata matches the current Slate & Emerald surfaces', () => {
  assert.match(source, /personalSpaceConfig\.appearance\.themeColors\.dark/);
  assert.match(source, /personalSpaceConfig\.appearance\.themeColors\.light/);
});

test('accent foregrounds are explicitly applied to visible CTA text', async () => {
  assert.ok(source.includes('style="color: var(--accent-contrast)"'));
  const detail = await readFile(new URL('../src/routes/projects/[slug]/+page.svelte', import.meta.url), 'utf8');
  assert.ok(detail.includes('style="color: var(--accent-contrast)"'));
});


test('project cards expose category filters, live GitHub metadata and quick clone actions', () => {
  assert.match(source, /data-project-card/);
  assert.match(projectsSource, /categories: \['client-compute', 'svelte'\]/);
  assert.match(repoMetadata, /leenus_lab_repos_v1/);
  assert.match(repoMetadata, /3600000/);
  assert.match(repoMetadata, /stargazers_count/);
  assert.match(repoMetadata, /pushed_at/);
  assert.match(projectActions, /git clone /);
  assert.match(projectActions, /Inspect Architecture/);
});

test('client diagnostics report WebGPU, FP16, buffer limits, isolation and display capabilities', () => {
  for (const term of ['requestAdapter', 'shader-f16', 'maxBufferSize', 'crossOriginIsolated', 'deviceMemory', 'color-gamut: p3', 'Copy JSON Report']) {
    assert.ok(developerTools.includes(term), 'Missing diagnostics capability: ' + term);
  }
});

test('keyboard palette and raw JSON view are available without a UI dependency', () => {
  assert.match(developerTools, /metaKey \|\| event\.ctrlKey/);
  assert.match(developerTools, /ArrowDown/);
  assert.match(developerTools, /ArrowUp/);
  assert.match(developerTools, /Toggle Raw JSON Mode/);
  assert.match(developerTools, /<dialog/);
});

test('external font stylesheet requests are removed in favour of local system fallbacks', () => {
  assert.doesNotMatch(appHtmlSource, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});


test('command palette keyboard selection spans both commands and projects', () => {
  assert.match(developerTools, /paletteItems = \$derived/);
  assert.match(developerTools, /matchingProjects\.map/);
  assert.match(developerTools, /\(selectedIndex \+ 1\) % paletteItems\.length/);
  assert.match(developerTools, /\(selectedIndex - 1 \+ paletteItems\.length\) % paletteItems\.length/);
  assert.match(developerTools, /onToggleTheme/);
  assert.match(source, /onToggleTheme=\{toggleTheme\}/);
});

test('hardware diagnostics include SharedArrayBuffer, CPU, display and refresh telemetry', () => {
  for (const term of ['SharedArrayBuffer', 'crossOriginIsolated', 'hardwareConcurrency', 'maxStorageBufferBindingSize', 'devicePixelRatio', 'colorDepth', 'Refresh']) {
    assert.ok(developerTools.includes(term), 'Missing diagnostics detail: ' + term);
  }
  assert.match(developerTools, /Last checked:/);
});

test('copy actions include a clipboard fallback and accessible confirmation', () => {
  assert.match(developerTools, /document\.execCommand\('copy'\)/);
  assert.match(projectActions, /document\.execCommand\('copy'\)/);
  assert.match(projectActions, /aria-live="polite"/);
  assert.match(projectActions, /Could not copy the clone command/);
  assert.match(projectActions, /copyStatus/);
  assert.match(developerTools, /Clipboard unavailable/);
});

test('architecture drawers and command palette retain visible keyboard focus', () => {
  assert.match(css, /architecture-toggle/);
  assert.match(css, /command-item\[aria-selected="true"\]/);
  assert.match(css, /focus-visible/);
  assert.match(developerTools, /role="listbox"/);
  assert.match(developerTools, /aria-selected=\{selectedIndex === index\}/);
});

test('GitHub metadata cache validates TTL and aborts pending requests on unmount', () => {
  assert.match(repoMetadata, /stored\.timestamp <= now/);
  assert.match(repoMetadata, /AbortController/);
  assert.match(repoMetadata, /controller\.abort\(\)/);
  assert.match(developerTools, /Array\.isArray\(data\)/);
});


test('Inter and Fira Code are bundled locally instead of relying on remote font services', () => {
  assert.match(css, /@import "@fontsource\/inter\/400\.css"/);
  assert.match(css, /@import "@fontsource\/inter\/700\.css"/);
  assert.match(css, /@import "@fontsource\/fira-code\/400\.css"/);
  assert.match(css, /@import "@fontsource\/fira-code\/500\.css"/);
  assert.match(css, /--font-sans: "Inter"/);
  assert.match(css, /--font-mono: "Fira Code"/);
  assert.doesNotMatch(appHtmlSource, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});


test('source-only architecture experiments document verified repositories without inventing live demos', () => {
  const componentPath = new URL('../src/lib/ArchitectureExperiments.svelte', import.meta.url);
  return readFile(componentPath, 'utf8').then((component) => {
    for (const [name, repository] of [
      ['Breadit', 'https://github.com/leenusdarnal/breadit'],
      ['Chirp', 'https://github.com/leenusdarnal/chirp'],
      ['ROFC Web Hub', 'https://github.com/leenusdarnal/rofc-website']
    ]) {
      assert.ok(component.includes(name), 'Missing source experiment: ' + name);
      assert.ok(component.includes(repository), 'Missing source repository link: ' + repository);
    }
    assert.match(component, /Source only/);
    assert.match(component, /Inspect Architecture/);
    assert.match(component, /Browse source repository/);
    assert.doesNotMatch(component, /Launch App|Live Demo|vercel\.app/);
    for (const detail of [
      'Next.js App Router', 'NextAuth GitHub OAuth', 'PostgreSQL',
      'Next.js Pages Router', 'Clerk middleware', 'tRPC',
      'Upstash Redis', 'SvelteKit', 'Svelte 4', 'local WebP assets'
    ]) {
      assert.ok(component.includes(detail), 'Missing verified architecture detail: ' + detail);
    }
    assert.match(html, /More things in the workshop/);
    assert.match(html, /Source only/);
  });
});


test('cross-origin isolation shim scopes COOP and credentialless COEP to document navigations', async () => {
  const worker = await readFile(new URL('../static/coi-serviceworker.js', import.meta.url), 'utf8');
  const registration = await readFile(new URL('../src/lib/cross-origin-isolation.js', import.meta.url), 'utf8');
  assert.match(worker, /request\.mode !== 'navigate'/);
  assert.match(worker, /url\.origin !== self\.location\.origin/);
  assert.match(worker, /Cross-Origin-Opener-Policy', 'same-origin'/);
  assert.match(worker, /Cross-Origin-Embedder-Policy', 'credentialless'/);
  assert.match(worker, /new Response\(response\.body/);
  assert.doesNotMatch(worker, /caches\.open|caches\.match/);
  assert.match(registration, /navigator\.serviceWorker\.register\('\/coi-serviceworker\.js'/);
  assert.match(registration, /updateViaCache: 'none'/);
  assert.match(registration, /window\.isSecureContext/);
  assert.match(registration, /controllerchange/);
  assert.match(source, /registerCrossOriginIsolation/);
  assert.match(developerTools, /Reload to enable shared memory/);
  assert.match(developerTools, /reloadAttempted/);
  assert.match(developerTools, /Cross-origin isolation did not activate in this browser/);
  assert.match(developerTools, /crossOriginIsolation: isolationState/);
  assert.ok(developerTools.includes('runtime_inspector.sh'));
});


test('Lighthouse retains its raw report even when quality thresholds fail', async () => {
  const workflow = await readFile(new URL('../.github/workflows/lighthouse.yml', import.meta.url), 'utf8');
  const reporter = await readFile(new URL('../scripts/report-lighthouse.js', import.meta.url), 'utf8');
  const uploadIndex = workflow.indexOf('name: Upload Lighthouse report');
  const gateIndex = workflow.indexOf('name: Summarise audit scores and enforce quality floor');
  assert.ok(uploadIndex >= 0 && gateIndex > uploadIndex, 'The report must upload before the quality gate');
  assert.match(workflow.slice(uploadIndex, gateIndex), /if: always\(\)/);
  assert.match(workflow.slice(uploadIndex, gateIndex), /if-no-files-found: warn/);
  assert.match(reporter, /first-contentful-paint/);
  assert.match(reporter, /largest-contentful-paint/);
  assert.match(reporter, /total-blocking-time/);
  assert.match(reporter, /cumulative-layout-shift/);
  assert.match(reporter, /overallSavingsMs/);
  assert.match(reporter, /GITHUB_STEP_SUMMARY/);
});


test('source-only experiments provide a quick clone action without implying a live demo', async () => {
  const component = await readFile(new URL('../src/lib/ArchitectureExperiments.svelte', import.meta.url), 'utf8');
  assert.match(component, /async function copyClone\(repository\)/);
  assert.match(component, /git clone ' \+ repository \+ '\.git'/);
  assert.match(component, /navigator\.clipboard\?\.writeText/);
  assert.match(component, /document\.execCommand\('copy'\)/);
  assert.match(component, /aria-label=\{'Copy git clone command for ' \+ experiment\.name\}/);
  assert.match(component, /aria-live="polite"/);
  for (const repository of [
    'https://github.com/leenusdarnal/breadit',
    'https://github.com/leenusdarnal/chirp',
    'https://github.com/leenusdarnal/rofc-website'
  ]) {
    assert.ok(component.includes(repository), 'Missing quick-clone repository: ' + repository);
  }
});


test('Runtime Inspector reports real page performance, network and origin storage diagnostics', () => {
  for (const term of [
    'schemaVersion: 2',
    'getEntriesByType(\'navigation\')',
    'first-contentful-paint',
    'timeToFirstByteMs',
    'domContentLoadedMs',
    'reportedTransferBytes',
    'navigator.onLine',
    'effectiveType',
    'downlinkMbps',
    'storageApi.estimate',
    'storageApi.persisted',
    'viewportWidth',
    'prefers-reduced-motion',
    'Page performance & network',
    'Storage & device context',
    'Nothing is uploaded'
  ]) {
    assert.ok(developerTools.includes(term), 'Missing Runtime Inspector v2 capability: ' + term);
  }
  assert.match(developerTools, /window\.addEventListener\('online'/);
  assert.match(developerTools, /window\.addEventListener\('offline'/);
  assert.match(developerTools, /window\.removeEventListener\('online'/);
  assert.match(developerTools, /aria-live="polite"/);
  assert.match(css, /\.diagnostic-details > summary:focus-visible/);
  assert.match(css, /\.terminal-state\[data-online="false"\]/);
});

test('Runtime Inspector clearly qualifies browser hints and restricted transfer-size data', () => {
  assert.match(developerTools, /not a guaranteed internet-reachability test/);
  assert.match(developerTools, /cached resources/);
  assert.match(developerTools, /estimates for this site’s origin/);
  assert.match(developerTools, /does not read your files, browsing history or other sites’ storage/);
});


test('projects are maintained in a dedicated typed catalogue, separate from page layout', () => {
  assert.ok(source.includes("import('../lib/PersonalSpaceConfigurator.svelte')"));
  assert.match(projectsSource, /export const projects: readonly ProjectRecord\[\] = \[/);
  for (const slug of ['pixelforge-studio', 'metronome', 'sikkim-government-salary-calculator', 'pixelcutout']) {
    assert.ok(projectsSource.includes(slug), 'Missing project data: ' + slug);
  }
  assert.doesNotMatch(source, /const projects = \[/);
});

test('site identity, SEO, theme defaults, navigation and section visibility are config-driven', () => {
  for (const path of [
    'personalSpaceConfig.identity.name',
    'personalSpaceConfig.site.title',
    'personalSpaceConfig.site.description',
    'personalSpaceConfig.site.socialImage.url',
    'personalSpaceConfig.appearance.defaultTheme',
    'personalSpaceConfig.appearance.themeColors',
    'personalSpaceConfig.sections.about',
    'personalSpaceConfig.sections.contact',
    'personalSpaceConfig.content.hero.tags',
    'personalSpaceConfig.content.about.paragraphs',
    'personalSpaceConfig.content.contact.description'
  ]) {
    assert.ok(source.includes(path), 'Homepage is not wired to ' + path);
  }
  assert.match(source, /item\.section/);
  assert.match(source, /personalSpaceConfig\.site\.contactEmail/);
  assert.match(source, /personalSpaceConfig\.site\.repositoryUrl/);
});


test('homepage and case-study routes use the same single typed project catalogue', () => {
  assert.match(projectRouteSource, /import \{ projects \} from '\.\.\/\.\.\/\.\.\/lib\/projects'/);
  assert.match(projectRouteSource, /projects\.map\(\(\{ slug \}\)/);
  assert.doesNotMatch(projectRouteSource, /const projects = \[/);
  assert.match(projectDetailSource, /project\.caseStudy\.summary/);
  assert.match(projectDetailSource, /project\.caseStudy\.description/);
  assert.match(projectDetailSource, /project\.caseStudy\.highlights/);
  assert.match(projectDetailSource, /personalSpaceConfig\.identity\.name/);
  assert.match(projectDetailSource, /personalSpaceConfig\.site\.projectSocialImage/);
  assert.match(projectsSource, /readonly ProjectRecord\[\] = \[/);
  for (const slug of ['pixelforge-studio', 'metronome', 'sikkim-government-salary-calculator', 'pixelcutout']) {
    assert.ok(projectsSource.includes(slug), 'Missing shared project record: ' + slug);
    assert.ok(projectsSource.includes('caseStudy:'), 'Missing case study content in shared catalogue');
  }
});

test('project social image settings are centralized with the other site metadata', () => {
  assert.match(personalSpaceConfigSource, /projectSocialImage:/);
  assert.ok(personalSpaceConfigSource.includes('og-image.png'));
  assert.match(projectDetailSource, /personalSpaceConfig\.site\.projectSocialImage\.url/);
  assert.match(projectDetailSource, /personalSpaceConfig\.site\.url/);
});


test('Personal Space Configurator provides safe local drafts and a live preview', async () => {
  const configurator = await readFile(new URL('../src/lib/PersonalSpaceConfigurator.svelte', import.meta.url), 'utf8');
  assert.ok(source.includes("import('../lib/PersonalSpaceConfigurator.svelte')"));
  assert.ok(source.includes('<ConfiguratorComponent />'));
  for (const feature of [
    'leenus-lab-config-draft-v1',
    'localStorage.setItem',
    'localStorage.getItem',
    'localStorage.removeItem',
    'URL.createObjectURL',
    'leenus-lab-config-draft.json',
    'aria-live="polite"',
    'LIVE PREVIEW',
    'UNPUBLISHED',
    'src/lib/personal-space.config.ts',
    'Drafts stay in this browser'
  ]) {
    assert.ok(configurator.includes(feature), 'Missing configurator capability: ' + feature);
  }
  assert.match(configurator, /bind:value=\{draft\.headline\}/);
  assert.match(configurator, /bind:checked=\{draft\.sections\[section\]\}/);
  assert.match(configurator, /function resetDraft\(\)/);
  assert.match(configurator, /function exportDraft\(\)/);
});


test('Personal Space Configurator validates and bounds local drafts before save or export', async () => {
  const configurator = await readFile(new URL('../src/lib/PersonalSpaceConfigurator.svelte', import.meta.url), 'utf8');
  assert.match(configurator, /function validateDraft\(\)/);
  assert.match(configurator, /new URL\(draft\.githubUrl\)/);
  assert.match(configurator, /url\.protocol !== 'https:'/);
  assert.match(configurator, /url\.hostname !== 'github\.com'/);
  assert.match(configurator, /16384/);
  assert.match(configurator, /saved\.length > 16384/);
  assert.match(configurator, /Array\.isArray\(parsed\)/);
  assert.match(configurator, /maxlength="120"/);
  assert.match(configurator, /maxlength="254"/);
  assert.match(configurator, /const error = validateDraft\(\)/);
});

test('project imagery never labels generated mockups as authentic application screenshots', async () => {
  const homepage = await readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8');
  const projects = await readFile(new URL('../src/lib/projects.ts', import.meta.url), 'utf8');
  assert.match(homepage, /icons\/icon\.svg/);
  assert.match(homepage, /pixelcutout-icon\.svg/);
  assert.match(projects, /previewSourceUrl/);
  const detail = await readFile(new URL('../src/routes/projects/[slug]/+page.svelte', import.meta.url), 'utf8');
  assert.match(detail, /Actual application screenshot/);
  assert.doesNotMatch(homepage, /Interface illustration/);
  assert.doesNotMatch(homepage, /Enter amount/);
});


test('RSS feed is prerendered with project links and safe XML metadata', async () => {
  assert.match(feed, /<rss version="2\.0">/);
  assert.match(feed, /<title>PixelForge Studio<\/title>/);
  assert.match(feed, /projects\/pixelforge-studio\//);
  const feedRoute = await readFile(new URL('../src/routes/feed.xml/+server.js', import.meta.url), 'utf8');
  assert.match(feedRoute, /application\/rss\+xml/);
});

test('custom static fallback includes helpful recovery navigation and noindex metadata', async () => {
  assert.ok(fallback.length > 0, 'Static fallback should be generated');
  const errorPage = await readFile(new URL('../src/routes/+error.svelte', import.meta.url), 'utf8');
  assert.match(errorPage, /This page wandered off/);
  assert.match(errorPage, /noindex, nofollow/);
  assert.match(errorPage, /Browse projects/);
});

test('PixelForge comparison is local-only, bounded and accessible', async () => {
  const component = await readFile(new URL('../src/lib/ImageComparison.svelte', import.meta.url), 'utf8');
  assert.match(component, /URL\.createObjectURL/);
  assert.match(component, /URL\.revokeObjectURL/);
  assert.match(component, /20 \* 1024 \* 1024/);
  assert.match(component, /type="range"/);
  assert.match(component, /aria-label="Reveal original image"/);
  assert.match(component, /never uploaded/);
  assert.match(component, /clip-path/);
});

test('secure configuration publisher only accepts an allow-listed exported draft', async () => {
  const publisher = await readFile(new URL('../scripts/publish-personal-space-config.mjs', import.meta.url), 'utf8');
  const workflow = await readFile(new URL('../.github/workflows/publish-personal-space.yml', import.meta.url), 'utf8');
  assert.match(publisher, /const configStart = source\.indexOf/);
  assert.match(publisher, /github\.hostname !== 'github\.com'/);
  assert.match(publisher, /sectionKeys/);
  assert.match(publisher, /writeFile\(file, source\)/);
  assert.doesNotMatch(publisher, /eval\(|new Function\(/);
  assert.match(workflow, /workflow_dispatch/);
  assert.match(workflow, /pull-requests: write/);
  assert.match(workflow, /gh pr create/);
});


test('configuration publishing applies only validated fields and synchronises metadata', async () => {
  const root = await mkdtemp(join(tmpdir(), 'leenus-config-publisher-'));
  try {
    await mkdir(join(root, 'src/lib'), { recursive: true });
    await mkdir(join(root, 'scripts'), { recursive: true });
    await writeFile(join(root, 'src/lib/personal-space.config.ts'), personalSpaceConfigSource);
    const publisher = await readFile(new URL('../scripts/publish-personal-space-config.mjs', import.meta.url), 'utf8');
    const publisherPath = join(root, 'scripts/publish-personal-space-config.mjs');
    await writeFile(publisherPath, publisher);
    const config = {
      name: 'Test Person',
      title: 'Test personal site',
      description: 'A test description.',
      githubUrl: 'https://github.com/test-person',
      contactEmail: 'test@example.com',
      headline: 'Build useful things',
      heroDescription: 'A test hero description.',
      palette: 'Test palette',
      defaultTheme: 'light',
      sections: { projects: true, sourceExperiments: false, personalSpace: true, about: true, contact: false }
    };
    const run = (value) => spawnSync(process.execPath, [publisherPath], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, CONFIG_JSON: JSON.stringify({ config: value }) }
    });
    const valid = run(config);
    assert.equal(valid.status, 0, valid.stderr);
    const updated = await readFile(join(root, 'src/lib/personal-space.config.ts'), 'utf8');
    assert.match(updated, /name: "Test Person"/);
    assert.match(updated, /firstName: "Test"/);
    assert.match(updated, /lastName: "Person"/);
    assert.match(updated, /author: "Test Person"/);
    assert.ok(updated.includes('url: "https://github.com/test-person"'));
    assert.match(updated, /headline: "Build useful things"/);
    assert.match(updated, /sourceExperiments: false/);
    assert.match(updated, /contact: false/);

    const beforeInvalid = updated;
    const invalid = run({ ...config, githubUrl: 'javascript:alert(1)' });
    assert.notEqual(invalid.status, 0, 'Unsafe GitHub URL must be rejected');
    assert.equal(await readFile(join(root, 'src/lib/personal-space.config.ts'), 'utf8'), beforeInvalid);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test('developer tools and configurator are code-split until the user opens them', async () => {
  assert.match(labControls, /import\('\.\/DeveloperTools\.svelte'\)/);
  assert.ok(source.includes("import('../lib/PersonalSpaceConfigurator.svelte')"));
  assert.match(labControls, /aria-expanded=\{toolsOpen\}/);
  assert.match(source, /aria-expanded=\{configuratorOpen\}/);
  assert.match(repoMetadata, /setTimeout\(\(\) =>/);
});
