import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const outputDirectory = 'static/images/project-previews';
const viewport = { width: 1440, height: 900 };

const targets = [
  {
    name: 'PixelForge Studio',
    file: 'pixelforge.jpg',
    url: 'https://pixelforge-studio-pied.vercel.app/',
    expectedText: 'PixelForge STUDIO',
    colorScheme: 'dark'
  },
  {
    name: 'PixelCutout',
    file: 'pixelcutout.jpg',
    url: 'https://pixelcutout-three.vercel.app/',
    expectedText: 'Make your subject',
    colorScheme: 'dark'
  },
  {
    name: 'Sikkim Government Salary Calculator',
    file: 'salary-calculator.jpg',
    url: 'https://sikkim-government-salary-calculator.vercel.app/',
    expectedText: 'Sikkim Government Salary Calculator',
    colorScheme: 'light'
  }
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const target of targets) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      colorScheme: target.colorScheme,
      reducedMotion: 'reduce'
    });

    try {
      const page = await context.newPage();
      const response = await page.goto(target.url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });

      if (!response || response.status() >= 400) {
        throw new Error(`${target.name} returned HTTP ${response?.status() ?? 'no response'}`);
      }

      await page.waitForFunction(
        expected => document.body?.innerText?.includes(expected),
        target.expectedText,
        { timeout: 30000 }
      );
      await page.waitForTimeout(1200);

      const path = `${outputDirectory}/${target.file}`;
      await page.screenshot({
        path,
        type: 'jpeg',
        quality: 82,
        fullPage: false,
        animations: 'disabled'
      });

      console.log(`Captured ${target.name}: ${path} (${response.status()})`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
