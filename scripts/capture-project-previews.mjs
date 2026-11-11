import assert from 'node:assert/strict';
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const targets = [
  {
    name: 'pixelforge-studio',
    url: 'https://pixelforge-studio-pied.vercel.app/',
    readyText: ['PixelForge', 'Layer stack', 'Move tool']
  },
  {
    name: 'pixelcutout',
    url: 'https://pixelcutout-three.vercel.app/',
    readyText: ['Choose your method', 'Drop an image here']
  },
  {
    name: 'sikkim-government-salary-calculator',
    url: 'https://sikkim-government-salary-calculator.vercel.app/',
    readyText: ['Sikkim Government Salary Calculator', 'Choose your pay level and cell to continue.']
  }
];

const buildDir = join('build', 'images', 'project-previews');
const artifactDir = 'artifacts/project-previews';
const viewports = [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true }
];
const report = { capturedAt: new Date().toISOString(), viewports, projects: [] };
let browser;

try {
  await mkdir(buildDir, { recursive: true });
  await mkdir(artifactDir, { recursive: true });
  browser = await chromium.launch({ headless: true });

  for (const target of targets) {
    const result = { name: target.name, url: target.url, screenshots: [], errors: [] };
    report.projects.push(result);

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
        deviceScaleFactor: viewport.mobile ? 2 : 1,
        colorScheme: target.name === 'sikkim-government-salary-calculator' ? 'light' : 'dark',
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      try {
        const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        assert.ok(response, target.name + ': no HTTP response');
        assert.ok(response.status() >= 200 && response.status() < 400, target.name + ': HTTP ' + response.status());
        await page.locator('body').waitFor({ state: 'visible' });
        await page.evaluate(() => document.fonts?.ready);
        await page.waitForTimeout(1800);

        const bodyText = await page.locator('body').innerText();
        for (const expected of target.readyText) {
          assert.ok(bodyText.includes(expected), target.name + ': expected visible content was missing: ' + expected);
        }
        assert.deepEqual(pageErrors, [], target.name + ': uncaught browser errors');

        const filename = target.name + (viewport.name === 'mobile' ? '-mobile' : '') + '.png';
        const artifactPath = join(artifactDir, filename);
        await page.screenshot({
          path: artifactPath,
          type: 'png',
          fullPage: false,
          animations: 'disabled',
          caret: 'hide'
        });
        const screenshotStat = await stat(artifactPath);
        assert.ok(screenshotStat.size > 15_000, target.name + ': screenshot is unexpectedly small (' + screenshotStat.size + ' bytes)');

        if (viewport.name === 'desktop') {
          const buildPath = join(buildDir, filename);
          await copyFile(artifactPath, buildPath);
          result.desktop = '/images/project-previews/' + filename;
        }
        result.screenshots.push({
          viewport: viewport.name,
          width: viewport.width,
          height: viewport.height,
          path: artifactPath,
          bytes: screenshotStat.size,
          httpStatus: response.status()
        });
        console.log('PASS ' + target.name + ' ' + viewport.name + ' screenshot (' + screenshotStat.size + ' bytes)');
      } catch (error) {
        result.errors.push({ viewport: viewport.name, message: error.message });
        console.error('FAIL ' + target.name + ' ' + viewport.name + ': ' + error.message);
      } finally {
        await context.close();
      }
    }
  }
} catch (error) {
  report.fatalError = error.message;
  console.error(error);
} finally {
  await browser?.close();
  await mkdir(artifactDir, { recursive: true });
  await writeFile(join(artifactDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
}

const failed = report.projects.filter((project) => project.errors.length || !project.desktop);
if (failed.length) {
  console.error('Some project previews were not captured. The homepage keeps its local fallback images.');
  process.exitCode = 1;
} else {
  console.log('All authentic project preview screenshots were captured.');
}
