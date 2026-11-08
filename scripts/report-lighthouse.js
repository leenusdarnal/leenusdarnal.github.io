import { readFile } from 'node:fs/promises';

const report = JSON.parse(await readFile('lighthouse-report.json', 'utf8'));
const categories = report.categories ?? {};
const minimums = {
  performance: 0.65,
  accessibility: 0.90,
  'best-practices': 0.85,
  seo: 0.90
};

let failed = false;
for (const [name, minimum] of Object.entries(minimums)) {
  const score = categories[name]?.score;
  if (typeof score !== 'number') {
    console.error(`Missing Lighthouse category: ${name}`);
    failed = true;
    continue;
  }
  const percentage = Math.round(score * 100);
  console.log(`${name}: ${percentage}/100 (minimum ${Math.round(minimum * 100)})`);
  if (score < minimum) {
    console.error(`Quality floor not met for ${name}`);
    failed = true;
  }
}

if (failed) process.exitCode = 1;
