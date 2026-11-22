import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [homepage, styles, responsive] = await Promise.all([
  readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8'),
  readFile(new URL('../src/app.css', import.meta.url), 'utf8'),
  readFile(new URL('../scripts/check-responsive.mjs', import.meta.url), 'utf8')
]);

test('the Refactoring UI system defines fixed HSL palette, spacing and elevation tokens', () => {
  for (const shade of ['950', '900', '800', '700', '600', '500', '400', '300', '200', '100', '50']) {
    assert.ok(styles.includes('--neutral-' + shade + ': hsl('), 'Missing neutral shade ' + shade);
  }
  for (const shade of ['950', '900', '800', '700', '600', '500', '400', '300', '200', '100']) {
    assert.ok(styles.includes('--emerald-' + shade + ': hsl('), 'Missing emerald shade ' + shade);
  }
  for (const token of ['--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--space-8', '--space-12', '--space-16', '--space-24']) {
    assert.ok(styles.includes(token), 'Missing spacing token ' + token);
  }
  for (const level of [1, 2, 3, 4, 5]) assert.ok(styles.includes('--elevation-' + level + ':'));
});

test('the hero pairs the introduction with useful tools and avoids fixed viewport height', () => {
  const start = homepage.indexOf('<section id="top"');
  const end = homepage.indexOf('</section>', start);
  assert.ok(start >= 0 && end > start, 'Homepage hero exists');
  const hero = homepage.slice(start, end);
  assert.ok(hero.includes('hero-title'));
  assert.ok(hero.includes('hero-tool-launcher'));
  assert.ok(hero.includes('hero-aside-note'));
  assert.ok(!hero.includes('min-h-[540px]') && !hero.includes('min-h-[600px]') && !hero.includes('min-h-[650px]'));
  assert.ok(hero.includes('personalSpaceConfig.content.hero.headline'));
  assert.ok(hero.includes("heroTagLinks[tag] ?? '#work'"));
  assert.ok(hero.includes('focus-visible:outline-offset-2'));
  assert.equal((hero.match(/href={project\.live}/g) ?? []).length, 1);
});

test('narrow screens use an accessible disclosure menu without obscuring the theme toggle', () => {
  const start = homepage.indexOf('<nav aria-label="Main navigation"');
  const end = homepage.indexOf('</nav>', start);
  assert.ok(start >= 0 && end > start, 'Main navigation exists');
  const nav = homepage.slice(start, end);
  assert.ok(nav.includes('details class="mobile-navigation"'));
  assert.ok(nav.includes('summary class="mobile-navigation-trigger"'));
  assert.equal((nav.match(/aria-label={theme === 'dark'/g) ?? []).length, 1);
  assert.ok(responsive.includes("navigation.locator('details.mobile-navigation')"));
  assert.ok(responsive.includes("await mobileNavigation.locator('summary').click()"));
});

test('homepage project cards use consistent featured and standard elevation treatments', () => {
  assert.ok(homepage.includes('home-project-card--featured'));
  assert.ok(homepage.includes('home-project-card--standard'));
  assert.ok(styles.includes('.home-project-card:hover'));
  assert.ok(styles.includes('.home-project-card--featured'));
});
