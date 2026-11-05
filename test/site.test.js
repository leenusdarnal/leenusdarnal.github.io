import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const buildFile = (path) => resolve(process.cwd(), 'build', path);
const home = await readFile(buildFile('index.html'), 'utf8');

test('homepage includes accessible document structure', () => {
  assert.match(home, /<html lang="en"/);
  assert.match(home, /href="#main"[^>]*>Skip to content/);
  assert.match(home, /<main[^>]*id="main"/);
  assert.match(home, /aria-label="Main navigation"/);
  assert.match(home, /aria-pressed="false"/);
});

test('homepage includes primary SEO metadata and canonical URL', () => {
  assert.match(home, /<title>Leenus Darnal — I build useful things<\/title>/);
  assert.match(home, /name="description"/);
  assert.match(home, /rel="canonical" href="https:\/\/leenusdarnal\.github\.io\/"/);
  assert.match(home, /property="og:image"/);
  assert.match(home, /name="twitter:card" content="summary_large_image"/);
  assert.match(home, /application\/ld\+json/);
});

test('all original project demo and source links remain available', () => {
  for (const url of [
    'https://pixelforge-studio-pied.vercel.app/',
    'https://github.com/leenusdarnal/pixelforge-studio',
    'https://react-metronome-dusky.vercel.app/',
    'https://github.com/leenusdarnal/react-metronome',
    'https://sikkim-government-salary-calculator.vercel.app/',
    'https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR'
  ]) {
    assert.ok(home.includes(url), 'Missing project link: ' + url);
  }
});

test('each project detail page is prerendered and links to its live project', async () => {
  const projects = [
    ['pixelforge-studio', 'https://pixelforge-studio-pied.vercel.app/'],
    ['metronome', 'https://react-metronome-dusky.vercel.app/'],
    ['sikkim-salary-calculator', 'https://sikkim-government-salary-calculator.vercel.app/']
  ];

  for (const [slug, liveUrl] of projects) {
    const page = await readFile(buildFile('projects/' + slug + '/index.html'), 'utf8');
    assert.ok(page.includes(liveUrl), 'Missing live project link on ' + slug);
    assert.ok(page.includes('View source code'), 'Missing source action on ' + slug);
    assert.ok(page.includes('rel="canonical"'), 'Missing canonical URL on ' + slug);
  }
});

test('robots and sitemap are included in the static build', async () => {
  const robots = await readFile(buildFile('robots.txt'), 'utf8');
  const sitemap = await readFile(buildFile('sitemap.xml'), 'utf8');
  assert.ok(robots.includes('Sitemap: https://leenusdarnal.github.io/sitemap.xml'));
  for (const slug of ['pixelforge-studio', 'metronome', 'sikkim-salary-calculator']) {
    assert.ok(sitemap.includes('/projects/' + slug + '/'), 'Sitemap missing ' + slug);
  }
});
