import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const buildUrl = new URL('../build/', import.meta.url);
const html = await readFile(new URL('index.html', buildUrl), 'utf8');
const robots = await readFile(new URL('robots.txt', buildUrl), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', buildUrl), 'utf8');
const source = await readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8');
const personalSpaceConfigSource = await readFile(new URL('../src/lib/personal-space.config.ts', import.meta.url), 'utf8');
const appHtmlSource = await readFile(new URL('../src/app.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/app.css', import.meta.url), 'utf8');
const labControls = await readFile(new URL('../src/lib/LabControls.svelte', import.meta.url), 'utf8');
const projectActions = await readFile(new URL('../src/lib/ProjectActions.svelte', import.meta.url), 'utf8');
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
  assert.match(source, /personal space for practical web tools/i);
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
  assert.match(source, /name: 'PixelCutout'/);
  assert.match(source, /https:\/\/pixelcutout-three\.vercel\.app\//);
  assert.match(source, /https:\/\/github\.com\/leenusdarnal\/pixelcutout/);
  assert.match(source, /AI and no-AI removal modes/);
  assert.match(source, /Images stay on your device/);
  assert.match(projectActions, /\{#if project\.live\}/);
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


test('Metronome case study uses its genuine source-repository screenshot', async () => {
  const page = await readFile(new URL('projects/metronome/index.html', buildUrl), 'utf8');
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

test('homepage labels illustrative project art and the real screenshot distinctly', () => {
  assert.match(html, /Actual app screenshot/);
  assert.match(html, /Interface illustration/);
  assert.match(source, /react-metronome\/master\/screenshots\/react-metronome\.png/);
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

test('small decorative editor status text remains readable', () => {
  assert.ok(html.includes('text-white/70'));
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
  assert.match(source, /import \{ personalSpaceConfig \}/);
  assert.match(personalSpaceConfigSource, /export const personalSpaceConfig =/);
  assert.match(personalSpaceConfigSource, /palette: 'Slate & Emerald'/);
  assert.match(personalSpaceConfigSource, /hosting: 'GitHub Pages'/);
  assert.match(css, /--font-mono: "Fira Code"/);
});




test('personal-space panel is driven by a dedicated TypeScript config module', () => {
  for (const field of ['owner', 'handle', 'headline', 'statement', 'palette', 'hosting', 'focus', 'principles']) {
    assert.ok(personalSpaceConfigSource.includes(`${field}:`), `Missing config field: ${field}`);
  }
  assert.match(source, /personalSpaceConfig\.focus/);
  assert.match(source, /personalSpaceConfig\.principles/);
  assert.match(html, /personal-space\.config\.ts/);
  assert.match(html, /leenus\.lab/);
  assert.match(html, /GitHub Pages/);
  assert.match(html, /Useful over flashy/);
  assert.match(html, /Curiosity over perfection/);
});

test('theme colour metadata matches the current Slate & Emerald surfaces', () => {
  assert.ok(source.includes('content={theme === "dark" ? "#0b0f19" : "#f8fafc"}'));
});

test('accent foregrounds are explicitly applied to visible CTA text', async () => {
  assert.ok(source.includes('style="color: var(--accent-contrast)"'));
  const detail = await readFile(new URL('../src/routes/projects/[slug]/+page.svelte', import.meta.url), 'utf8');
  assert.ok(detail.includes('style="color: var(--accent-contrast)"'));
});


test('project cards expose category filters, live GitHub metadata and quick clone actions', () => {
  assert.match(source, /data-project-card/);
  assert.match(source, /categories: \['client-compute', 'svelte'\]/);
  assert.match(labControls, /leenus_lab_repos_v1/);
  assert.match(labControls, /3600000/);
  assert.match(labControls, /stargazers_count/);
  assert.match(labControls, /pushed_at/);
  assert.match(projectActions, /git clone /);
  assert.match(projectActions, /Inspect Architecture/);
});

test('client diagnostics report WebGPU, FP16, buffer limits, isolation and display capabilities', () => {
  for (const term of ['requestAdapter', 'shader-f16', 'maxBufferSize', 'crossOriginIsolated', 'deviceMemory', 'color-gamut: p3', 'Copy JSON Report']) {
    assert.ok(labControls.includes(term), 'Missing diagnostics capability: ' + term);
  }
});

test('keyboard palette and raw JSON view are available without a UI dependency', () => {
  assert.match(labControls, /metaKey \|\| event\.ctrlKey/);
  assert.match(labControls, /ArrowDown/);
  assert.match(labControls, /ArrowUp/);
  assert.match(labControls, /Toggle Raw JSON Mode/);
  assert.match(labControls, /<dialog/);
});

test('external font stylesheet requests are removed in favour of local system fallbacks', () => {
  assert.doesNotMatch(appHtmlSource, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});


test('command palette keyboard selection spans both commands and projects', () => {
  assert.match(labControls, /paletteItems = \$derived/);
  assert.match(labControls, /matchingProjects\.map/);
  assert.match(labControls, /\(selectedIndex \+ 1\) % paletteItems\.length/);
  assert.match(labControls, /\(selectedIndex - 1 \+ paletteItems\.length\) % paletteItems\.length/);
  assert.match(labControls, /onToggleTheme/);
  assert.match(source, /onToggleTheme=\{toggleTheme\}/);
});

test('hardware diagnostics include SharedArrayBuffer, CPU, display and refresh telemetry', () => {
  for (const term of ['SharedArrayBuffer', 'crossOriginIsolated', 'hardwareConcurrency', 'maxStorageBufferBindingSize', 'devicePixelRatio', 'colorDepth', 'Refresh']) {
    assert.ok(labControls.includes(term), 'Missing diagnostics detail: ' + term);
  }
  assert.match(labControls, /Last checked:/);
});

test('copy actions include a clipboard fallback and accessible confirmation', () => {
  assert.match(labControls, /document\.execCommand\('copy'\)/);
  assert.match(projectActions, /document\.execCommand\('copy'\)/);
  assert.match(projectActions, /aria-live="polite"/);
  assert.match(labControls, /Clipboard unavailable/);
});

test('architecture drawers and command palette retain visible keyboard focus', () => {
  assert.match(css, /architecture-toggle/);
  assert.match(css, /command-item\[aria-selected="true"\]/);
  assert.match(css, /focus-visible/);
  assert.match(labControls, /role="listbox"/);
  assert.match(labControls, /aria-selected=\{selectedIndex === index\}/);
});

test('GitHub metadata cache validates TTL and aborts pending requests on unmount', () => {
  assert.match(labControls, /stored\.timestamp <= now/);
  assert.match(labControls, /AbortController/);
  assert.match(labControls, /controller\.abort\(\)/);
  assert.match(labControls, /Array\.isArray\(data\)/);
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
  assert.match(registration, /https:/);
  assert.match(registration, /controllerchange/);
  assert.match(source, /registerCrossOriginIsolation/);
  assert.match(labControls, /Reload to enable shared memory/);
  assert.match(labControls, /crossOriginIsolation: isolationState/);
  assert.match(html, /runtime_inspector\.sh/);
});
