import { appendFile, readFile } from 'node:fs/promises';

const report = JSON.parse(await readFile('lighthouse-report.json', 'utf8'));
const categories = report.categories ?? {};
const audits = report.audits ?? {};
const minimums = {
  performance: 0.65,
  accessibility: 0.90,
  'best-practices': 0.85,
  seo: 0.90
};

const metricIds = [
  ['first-contentful-paint', 'First Contentful Paint'],
  ['largest-contentful-paint', 'Largest Contentful Paint'],
  ['speed-index', 'Speed Index'],
  ['total-blocking-time', 'Total Blocking Time'],
  ['cumulative-layout-shift', 'Cumulative Layout Shift'],
  ['interactive', 'Time to Interactive']
];
const metrics = metricIds
  .map(([id, label]) => ({ label, value: audits[id]?.displayValue ?? 'Not reported' }));

const opportunities = Object.entries(audits)
  .filter(([, audit]) => audit.score !== null && typeof audit.score === 'number' && audit.score < 1)
  .map(([id, audit]) => ({
    id,
    title: audit.title ?? id,
    score: audit.score,
    savingsMs: audit.details?.overallSavingsMs ?? 0,
    savingsBytes: audit.details?.overallSavingsBytes ?? 0
  }))
  .filter((audit) => audit.savingsMs > 0 || audit.savingsBytes > 0)
  .sort((a, b) => b.savingsMs - a.savingsMs || b.savingsBytes - a.savingsBytes)
  .slice(0, 8);

let failed = false;
const summary = ['## Lighthouse quality audit', '', '| Category | Score | Quality floor |', '|---|---:|---:|'];
for (const [name, minimum] of Object.entries(minimums)) {
  const score = categories[name]?.score;
  if (typeof score !== 'number') {
    console.error(`Missing Lighthouse category: ${name}`);
    summary.push(`| ${name} | Missing | ${Math.round(minimum * 100)} | `);
    failed = true;
    continue;
  }
  const percentage = Math.round(score * 100);
  console.log(`${name}: ${percentage}/100 (minimum ${Math.round(minimum * 100)})`);
  summary.push(`| ${name} | ${percentage}/100 | ${Math.round(minimum * 100)}/100 |`);
  if (score < minimum) {
    console.error(`Quality floor not met for ${name}`);
    failed = true;
  }
}

summary.push('', '### Performance metrics', '', '| Metric | Result |', '|---|---|');
for (const metric of metrics) {
  console.log(`${metric.label}: ${metric.value}`);
  summary.push(`| ${metric.label} | ${metric.value} |`);
}

summary.push('', '### Highest-impact opportunities', '');
if (opportunities.length) {
  for (const item of opportunities) {
    const savings = [
      item.savingsMs ? `${Math.round(item.savingsMs)} ms` : null,
      item.savingsBytes ? `${Math.round(item.savingsBytes / 1024)} KiB` : null
    ].filter(Boolean).join(' · ');
    console.log(`Opportunity: ${item.title} (${savings})`);
    summary.push(`- **${item.title}** — ${savings} (${item.id})`);
  }
} else {
  summary.push('- No measurable savings opportunities were reported.');
}

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary.join('\n') + '\n');
}

if (failed) process.exitCode = 1;
