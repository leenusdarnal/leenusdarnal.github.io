import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const site = (process.env.SITE_URL || 'https://leenusdarnal.github.io/').replace(/\/$/, '') + '/';
const output = 'artifacts/responsive';
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const routes = ['pixelforge-studio', 'metronome', 'sikkim-government-salary-calculator', 'pixelcutout'];
const report = { site, testedAt: new Date().toISOString(), axeCoreVersion: '4.14.0', standards: tags, scans: [], keyboard: null, failure: null };
let browser;

async function makePage(theme, viewport) {
  const context = await browser.newContext({ viewport, serviceWorkers: 'allow' });
  await context.addInitScript((value) => {
    try { localStorage.setItem('site-theme', value); } catch {}
  }, theme);
  const page = await context.newPage();
  page.on('pageerror', (error) => {
    report.runtimeErrors ??= [];
    report.runtimeErrors.push(error.message);
  });
  return { context, page };
}

async function audit(page, label, url) {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async (standardTags) => window.axe.run(document, {
    runOnly: { type: 'tag', values: standardTags }
  }), tags);
  const violations = result.violations.map((item) => ({
    id: item.id,
    impact: item.impact,
    help: item.help,
    helpUrl: item.helpUrl,
    tags: item.tags,
    nodes: item.nodes.map((node) => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary
    }))
  }));
  report.scans.push({
    label,
    url,
    violations,
    passedRules: result.passes.length,
    incomplete: result.incomplete.map((item) => ({ id: item.id, impact: item.impact, help: item.help }))
  });
  console.log((violations.length ? 'FAIL ' : 'PASS ') + label + ': ' + violations.length + ' WCAG A/AA violations');
}

async function auditRoute(label, path, theme, viewport) {
  const { context, page } = await makePage(theme, viewport);
  try {
    const url = new URL(path, site).toString();
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert.ok(response && response.status() < 400, label + ': route failed to load');
    await page.locator('main').waitFor({ state: 'attached' });
    await page.evaluate(() => document.fonts?.ready);
    await audit(page, label, url);
  } finally {
    await context.close();
  }
}

async function tabUntilFocused(page, locator, label, limit = 80) {
  for (let index = 0; index < limit; index += 1) {
    if (await locator.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  assert.fail('Tab sequence did not reach ' + label);
}

async function keyboardAudit() {
  const { context, page } = await makePage('dark', { width: 390, height: 844 });
  const result = {
    skipLinkFirst: false,
    skipLinkActivatesMain: false,
    visibleFocusIndicator: false,
    themeKeyboardActivation: false,
    themePersists: false,
    developerToolsKeyboardActivation: false,
    commandPaletteKeyboardOpen: false,
    commandPaletteArrowNavigation: false,
    commandPaletteEscapeRestoresFocus: false
  };
  try {
    const response = await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert.ok(response && response.status() < 400, 'Keyboard QA homepage failed to load');

    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#main"]');
    assert.equal(await skip.evaluate((element) => element === document.activeElement), true, 'Skip link is not first in tab order');
    result.skipLinkFirst = true;

    const focus = await skip.evaluate((element) => {
      const style = getComputedStyle(element);
      return { outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth) };
    });
    assert.ok(focus.outlineStyle !== 'none' && focus.outlineWidth >= 2, 'Skip link focus indicator is not visible');
    result.visibleFocusIndicator = true;

    await page.keyboard.press('Enter');
    await page.waitForFunction(() => location.hash === '#main');
    result.skipLinkActivatesMain = true;

    const theme = page.getByRole('button', { name: /^Switch to (light|dark) theme$/ });
    await tabUntilFocused(page, theme, 'theme toggle');
    const previousTheme = await page.locator('html').getAttribute('data-theme');
    await page.keyboard.press('Space');
    await page.waitForFunction((oldTheme) => document.documentElement.getAttribute('data-theme') !== oldTheme, previousTheme);
    const currentTheme = await page.locator('html').getAttribute('data-theme');
    result.themeKeyboardActivation = true;
    assert.equal(await page.evaluate(() => localStorage.getItem('site-theme')), currentTheme);
    result.themePersists = true;

    const developer = page.getByRole('button', { name: 'For developers: inspect this site' });
    await tabUntilFocused(page, developer, 'developer tools toggle');
    await page.keyboard.press('Enter');
    const trigger = page.getByRole('button', { name: /Open command palette/ });
    await trigger.waitFor({ state: 'visible', timeout: 20000 });
    result.developerToolsKeyboardActivation = true;

    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    const search = page.getByRole('combobox', { name: 'Search commands and projects' });
    await search.waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.activeElement?.id === 'command-search');
    result.commandPaletteKeyboardOpen = true;

    const first = await search.getAttribute('aria-activedescendant');
    assert.ok(first, 'Combobox does not expose an active result');
    await page.keyboard.press('ArrowDown');
    const next = await search.getAttribute('aria-activedescendant');
    assert.ok(next && next !== first, 'ArrowDown did not update the active result');
    assert.equal(await page.locator('#' + next).getAttribute('aria-selected'), 'true');
    result.commandPaletteArrowNavigation = true;

    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#command-palette')?.open);
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label')?.includes('Open command palette'));
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
    result.commandPaletteEscapeRestoresFocus = true;

    report.keyboard = result;
    await page.screenshot({ path: output + '/keyboard-command-palette-focus.png', fullPage: false, animations: 'disabled' });
    console.log('PASS keyboard navigation and command-palette focus management');
  } finally {
    await context.close();
  }
}

try {
  await mkdir(output, { recursive: true });
  browser = await chromium.launch({ headless: true });

  await auditRoute('homepage-dark', '', 'dark', { width: 1440, height: 1000 });
  await auditRoute('homepage-light', '', 'light', { width: 1440, height: 1000 });

  // Audit lazily loaded developer controls and the open command palette.
  {
    const { context, page } = await makePage('dark', { width: 1440, height: 1000 });
    try {
      await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.getByRole('button', { name: 'For developers: inspect this site' }).click();
      await page.getByRole('button', { name: /Open command palette/ }).waitFor({ state: 'visible', timeout: 20000 });
      await audit(page, 'homepage-developer-tools-open', site);
      await page.keyboard.press('Control+k');
      await page.getByRole('dialog', { name: 'Command palette' }).waitFor({ state: 'visible' });
      await audit(page, 'homepage-command-palette-open', site);
      await page.screenshot({ path: output + '/accessibility-command-palette.png', fullPage: false, animations: 'disabled' });
    } finally {
      await context.close();
    }
  }

  for (const slug of routes) {
    await auditRoute('case-study-' + slug, 'projects/' + slug + '/', 'dark', { width: 1280, height: 900 });
  }

  await keyboardAudit();
  const violations = report.scans.flatMap((scan) => scan.violations.map((item) => ({
    scan: scan.label, id: item.id, impact: item.impact, help: item.help,
    targets: item.nodes.map((node) => node.target)
  })));
  report.totals = {
    scans: report.scans.length,
    violations: violations.length,
    passedRules: report.scans.reduce((sum, scan) => sum + scan.passedRules, 0),
    incompleteRules: report.scans.reduce((sum, scan) => sum + scan.incomplete.length, 0),
    uniqueViolationRules: [...new Set(violations.map((item) => item.id))]
  };
  await writeFile(output + '/accessibility-report.json', JSON.stringify(report, null, 2) + '\n');

  assert.equal(report.totals.violations, 0, 'axe found WCAG violations: ' + JSON.stringify(violations, null, 2));
  assert.deepEqual(report.runtimeErrors ?? [], [], 'Browser runtime errors occurred during accessibility QA');
  assert.ok(report.keyboard && Object.values(report.keyboard).every(Boolean), 'One or more keyboard checks failed');
  console.log('Accessibility QA passed: ' + report.totals.scans + ' axe scans, zero WCAG A/AA violations.');
} catch (error) {
  report.failure = error.message;
  await writeFile(output + '/accessibility-report.json', JSON.stringify(report, null, 2) + '\n');
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
