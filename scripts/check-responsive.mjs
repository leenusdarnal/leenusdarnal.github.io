import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = (process.env.SITE_URL || 'https://leenusdarnal.github.io/').replace(/\/$/, '') + '/';
const outputDir = 'artifacts/responsive';
const viewports = [
  { name: 'phone-360', width: 360, height: 800, mobile: true },
  { name: 'phone-390', width: 390, height: 844, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'small-desktop-1024', width: 1024, height: 900, mobile: false },
  { name: 'desktop-1440', width: 1440, height: 1000, mobile: false }
];

const report = {
  site: baseUrl,
  testedAt: new Date().toISOString(),
  viewports: [],
  caseStudy: null
};
const browserErrors = [];
let browser;

async function inspectOverflow(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const offenders = [...document.querySelectorAll('body *')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 &&
          rect.height > 0 &&
          style.position !== 'fixed' &&
          rect.right > window.innerWidth + 1 &&
          rect.left >= -1;
      })
      .slice(0, 12)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        className: typeof element.className === 'string' ? element.className.slice(0, 120) : null,
        right: Math.round(element.getBoundingClientRect().right)
      }));

    return {
      viewportWidth: window.innerWidth,
      documentWidth: root.scrollWidth,
      bodyWidth: body.scrollWidth,
      hasHorizontalOverflow: root.scrollWidth > window.innerWidth + 1,
      offenders
    };
  });
}

async function checkViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.mobile,
    hasTouch: viewport.mobile,
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    serviceWorkers: 'allow'
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  try {
    const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    assert.ok(response, viewport.name + ': homepage did not return a response');
    assert.ok(response.status() < 400, viewport.name + ': homepage returned HTTP ' + response.status());
    await page.locator('#work').waitFor({ state: 'attached', timeout: 20_000 });
    await page.getByRole('heading', { name: 'Before you get started.' }).waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts?.ready);
    await page.getByRole('heading', { name: 'Recent improvements.' }).waitFor({ state: 'visible' });

    const technicalTextFontSize = await page.locator('.terminal-body pre code').evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize)
    );
    assert.ok(
      technicalTextFontSize >= 12,
      viewport.name + ': technical preview text is smaller than 12px (' + technicalTextFontSize + 'px)'
    );

    const smallReadableText = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const offenders = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent?.trim()) continue;
        const element = node.parentElement;
        if (!element || element.closest('h1, h2, h3, h4, h5, h6, svg, [aria-hidden="true"]')) continue;
        if (element.getClientRects().length === 0) continue;
        const size = Number.parseFloat(getComputedStyle(element).fontSize);
        if (size < 12) offenders.push({ tag: element.tagName.toLowerCase(), text: node.textContent.trim().slice(0, 50), size });
      }
      return offenders.slice(0, 12);
    });
    assert.deepEqual(
      smallReadableText,
      [],
      viewport.name + ': visible reading text below 12px: ' + JSON.stringify(smallReadableText)
    );

    const initialLayout = await inspectOverflow(page);
    assert.equal(
      initialLayout.hasHorizontalOverflow,
      false,
      viewport.name + ': horizontal overflow detected: ' + JSON.stringify(initialLayout)
    );

    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    for (const [label, hash] of [['Projects', '#work'], ['About', '#about'], ['Contact', '#contact']]) {
      const link = navigation.getByRole('link', { name: label, exact: true });
      assert.equal(await link.count(), 1, viewport.name + ': missing ' + label + ' navigation link');
      await link.click();
      await page.waitForFunction((expected) => window.location.hash === expected, hash);
    }

    assert.equal(
      await page.locator('article[data-project-card]').count(),
      4,
      viewport.name + ': expected four featured project cards'
    );
    for (const slug of ['pixelforge-studio', 'metronome', 'sikkim-government-salary-calculator', 'pixelcutout']) {
      assert.ok(
        await page.locator('a[href="/projects/' + slug + '/"]').count(),
        viewport.name + ': missing case-study link for ' + slug
      );
    }

    const themeButton = page.getByRole('button', { name: /^Switch to (light|dark) theme$/ });
    assert.equal(await themeButton.count(), 1, viewport.name + ': theme button is missing or unnamed');
    const themeBefore = await page.locator('html').getAttribute('data-theme');
    await themeButton.click();
    const themeAfter = await page.locator('html').getAttribute('data-theme');
    assert.notEqual(themeAfter, themeBefore, viewport.name + ': theme button did not change the theme');
    assert.equal(
      await page.evaluate(() => localStorage.getItem('site-theme')),
      themeAfter,
      viewport.name + ': theme preference was not saved'
    );
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction((expected) => document.documentElement.getAttribute('data-theme') === expected, themeAfter);
    assert.equal(
      await page.locator('html').getAttribute('data-theme'),
      themeAfter,
      viewport.name + ': saved theme was not restored after reload'
    );

    await page.screenshot({
      path: outputDir + '/homepage-' + viewport.name + '.png',
      fullPage: true,
      animations: 'disabled'
    });

    const finalLayout = await inspectOverflow(page);
    assert.equal(
      finalLayout.hasHorizontalOverflow,
      false,
      viewport.name + ': horizontal overflow appeared after interactions: ' + JSON.stringify(finalLayout)
    );
    assert.deepEqual(pageErrors, [], viewport.name + ': uncaught browser errors');
    browserErrors.push(...pageErrors.map((message) => viewport.name + ': ' + message));

    report.viewports.push({
      ...viewport,
      httpStatus: response.status(),
      initialLayout,
      finalLayout,
      projectCards: 4,
      themePersistence: true,
      technicalTextFontSize,
      smallReadableText,
      recentUpdatesVisible: true,
      navigation: 'passed',
      browserErrors: pageErrors
    });
    console.log('PASS ' + viewport.name + ' (' + viewport.width + '×' + viewport.height + ')');
  } catch (error) {
    await page.screenshot({
      path: outputDir + '/failure-' + viewport.name + '.png',
      fullPage: true,
      animations: 'disabled'
    }).catch(() => {});
    throw error;
  } finally {
    await context.close();
  }
}

try {
  await mkdir(outputDir, { recursive: true });
  browser = await chromium.launch({ headless: true });

  for (const viewport of viewports) {
    await checkViewport(browser, viewport);
  }

  const detailContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    serviceWorkers: 'allow'
  });
  const detailPage = await detailContext.newPage();
  const detailErrors = [];
  detailPage.on('pageerror', (error) => detailErrors.push(error.message));

  try {
    const detailUrl = new URL('projects/pixelforge-studio/', baseUrl).toString();
    const response = await detailPage.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    assert.ok(response && response.status() < 400, 'PixelForge case study did not load successfully');
    await detailPage.getByRole('heading', { name: 'Compare your PixelForge edits.' }).waitFor({ state: 'visible' });
    await detailPage.getByText('Good for', { exact: true }).waitFor({ state: 'visible' });
    await detailPage.getByText('First step', { exact: true }).waitFor({ state: 'visible' });
    assert.equal(await detailPage.locator('input[type="file"]').count(), 2, 'PixelForge comparison should expose two local file inputs');
    assert.equal(await detailPage.locator('input[type="range"]').count(), 0, 'Comparison slider should remain hidden until both images are selected');

    const layout = await inspectOverflow(detailPage);
    assert.equal(layout.hasHorizontalOverflow, false, 'PixelForge case study has horizontal overflow: ' + JSON.stringify(layout));
    assert.deepEqual(detailErrors, [], 'PixelForge case study raised uncaught browser errors');
    await detailPage.screenshot({
      path: outputDir + '/pixelforge-case-study-phone.png',
      fullPage: true,
      animations: 'disabled'
    });

    report.caseStudy = {
      url: detailUrl,
      httpStatus: response.status(),
      layout,
      localFileInputs: 2,
      comparisonInitiallyEmpty: true,
      browserErrors: detailErrors
    };
    console.log('PASS PixelForge mobile case study');
  } finally {
    await detailContext.close();
  }

  const metronomeContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    serviceWorkers: 'allow'
  });
  const metronomePage = await metronomeContext.newPage();
  try {
    const metronomeUrl = new URL('projects/metronome/', baseUrl).toString();
    const response = await metronomePage.goto(metronomeUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    assert.ok(response && response.status() < 400, 'Metronome case study did not load successfully');
    const preview = metronomePage.locator('img[alt="Screenshot of the Metronome web app interface from its source repository."]');
    await preview.waitFor({ state: 'visible', timeout: 20_000 });
    await preview.evaluate((image) => image.decode());
    const previewDetails = await preview.evaluate((image) => ({
      src: image.currentSrc,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight
    }));
    assert.equal(new URL(previewDetails.src).origin, new URL(baseUrl).origin, 'Metronome screenshot should be served by this site');
    assert.ok(previewDetails.naturalWidth > 0 && previewDetails.naturalHeight > 0, 'Metronome screenshot did not decode');
    report.metronomePreview = { url: metronomeUrl, ...previewDetails };
    await metronomePage.screenshot({
      path: outputDir + '/metronome-case-study-phone.png',
      fullPage: true,
      animations: 'disabled'
    });
    console.log('PASS locally hosted Metronome case-study preview');
  } finally {
    await metronomeContext.close();
  }

  assert.deepEqual(browserErrors, [], 'Uncaught browser errors were recorded');
  await writeFile(outputDir + '/report.json', JSON.stringify(report, null, 2) + '\n');
  console.log('Responsive browser QA passed for all ' + viewports.length + ' viewport profiles and PixelForge case study.');
} catch (error) {
  await writeFile(outputDir + '/report.json', JSON.stringify({ ...report, failure: error.message }, null, 2) + '\n');
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
