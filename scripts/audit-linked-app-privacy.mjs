#!/usr/bin/env node
/**
 * Repeatable, conservative source-pattern audit for the three data-sensitive
 * apps linked from this site. Findings are review leads, never privacy verdicts.
 *
 * Run from the repository root after checking the linked repositories out into
 * audit-targets/<slug>.
 */
import { appendFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { basename, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SOURCE_EXTENSIONS = new Set([
  '.cjs', '.css', '.html', '.js', '.jsx', '.json', '.mjs', '.svelte',
  '.ts', '.tsx', '.vue', '.yaml', '.yml'
]);

export const IGNORED_DIRECTORIES = new Set([
  '.git', '.next', '.nuxt', '.svelte-kit', '.turbo', '.vercel',
  'artifacts', 'build', 'coverage', 'dist', 'node_modules', 'out',
  'playwright-report', 'test-results', 'vendor'
]);

export const RULES = [
  { category: 'network', id: 'fetch-api', pattern: /\bfetch\s*\(/i },
  { category: 'network', id: 'xml-http-request', pattern: /\bXMLHttpRequest\b/i },
  { category: 'network', id: 'send-beacon', pattern: /\bsendBeacon\s*\(/i },
  { category: 'network', id: 'websocket', pattern: /\b(?:new\s+)?WebSocket\s*\(/i },
  { category: 'network', id: 'event-source', pattern: /\b(?:new\s+)?EventSource\s*\(/i },
  { category: 'network', id: 'http-client-library', pattern: /\b(?:axios|ky|ofetch|superagent|graphql-request|urql)\b|@apollo\/client/i },

  { category: 'telemetry', id: 'analytics-global', pattern: /\b(?:gtag|ga\s*\(|dataLayer|_paq)\b/i },
  { category: 'telemetry', id: 'telemetry-sdk', pattern: /\b(?:posthog|mixpanel|amplitude|segment|sentry|hotjar|clarity|plausible|umami|matomo)\b/i },

  { category: 'storage', id: 'local-storage', pattern: /\blocalStorage\b/i },
  { category: 'storage', id: 'session-storage', pattern: /\bsessionStorage\b/i },
  { category: 'storage', id: 'indexed-db', pattern: /\bindexedDB\b/i },
  { category: 'storage', id: 'cache-storage', pattern: /\bcaches\s*\.\s*(?:open|match|keys|delete)\s*\(/i },
  { category: 'storage', id: 'service-worker', pattern: /\bserviceWorker\b/i },
  { category: 'storage', id: 'cookies', pattern: /\bdocument\s*\.\s*cookie\b/i },

  { category: 'file-transfer', id: 'form-data', pattern: /\b(?:new\s+)?FormData\s*\(/i },
  { category: 'file-transfer', id: 'multipart-content-type', pattern: /multipart\/form-data/i },

  { category: 'workers', id: 'worker-construction', pattern: /\bnew\s+(?:Shared)?Worker\s*\(/i },
  { category: 'workers', id: 'message-passing', pattern: /\.postMessage\s*\(/i },

  { category: 'file-processing', id: 'object-url-create', pattern: /\bURL\s*\.\s*createObjectURL\s*\(/i },
  { category: 'file-processing', id: 'image-bitmap', pattern: /\bcreateImageBitmap\s*\(/i },
  { category: 'file-processing', id: 'offscreen-canvas', pattern: /\bOffscreenCanvas\b/i },
  { category: 'file-processing', id: 'blob-or-file', pattern: /\b(?:new\s+)?(?:Blob|File)\s*\(/i },

  { category: 'external-reference', id: 'remote-url-literal', pattern: /https?:\/\/[a-z0-9.-]+(?::\d+)?/i }
];

const TELEMETRY_PACKAGE_PATTERN = /(?:analytics|segment|sentry|posthog|mixpanel|amplitude|hotjar|clarity|plausible|umami|matomo|google-analytics|gtag)/i;
const MAX_FILE_BYTES = 1_000_000;
const MAX_SOURCE_FILES = 20_000;
const MAX_FINDINGS_PER_REPOSITORY = 3_000;

export const DEFAULT_TARGETS = [
  {
    name: 'PixelForge Studio',
    repository: 'leenusdarnal/pixelforge-studio',
    path: 'audit-targets/pixelforge-studio'
  },
  {
    name: 'PixelCutout',
    repository: 'leenusdarnal/pixelcutout',
    path: 'audit-targets/pixelcutout'
  },
  {
    name: 'Sikkim Government Salary Calculator',
    repository: 'leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR',
    path: 'audit-targets/salary-calculator'
  }
];

export function redactExcerpt(value) {
  return String(value)
    .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [redacted]')
    .replace(/([?&](?:access_token|token|api[_-]?key|key|secret|password)=)[^&\s"'\x60]*/gi, '$1[redacted]')
    .replace(/((?:api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*["'\x60])[^"'\x60]+(["'\x60])/gi, '$1[redacted]$2')
    .replace(/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,})\b/g, '[redacted-token]')
    .slice(0, 240);
}

async function collectSourceFiles(root, current = root, files = []) {
  const entries = await readdir(current, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const fullPath = join(current, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      await collectSourceFiles(root, fullPath, files);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;
    if (entry.name.endsWith('.min.js')) continue;

    const details = await stat(fullPath);
    if (details.size > MAX_FILE_BYTES) continue;

    files.push(fullPath);
    if (files.length > MAX_SOURCE_FILES) {
      throw new Error(`Source file limit exceeded under ${root} (${MAX_SOURCE_FILES}). Narrow the audit scope before continuing.`);
    }
  }

  return files;
}

function repositoryRevision(root) {
  const result = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

function addFinding(findings, finding) {
  if (findings.length < MAX_FINDINGS_PER_REPOSITORY) findings.push(finding);
}

export async function scanRepository({ name, repository, root, revision = undefined }) {
  const absoluteRoot = resolve(root);
  const files = await collectSourceFiles(absoluteRoot);
  const findings = [];
  let manifestsScanned = 0;

  for (const file of files) {
    const relativePath = relative(absoluteRoot, file).replaceAll('\\', '/');
    let source;

    try {
      source = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    if (source.includes('\0')) continue;

    if (basename(file) === 'package.json') {
      manifestsScanned += 1;
      try {
        const manifest = JSON.parse(source);
        for (const section of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
          for (const [packageName, version] of Object.entries(manifest[section] ?? {})) {
            if (TELEMETRY_PACKAGE_PATTERN.test(packageName)) {
              addFinding(findings, {
                category: 'dependency',
                rule: 'telemetry-or-analytics-package',
                file: relativePath,
                line: null,
                excerpt: `${packageName}: ${String(version).slice(0, 60)}`
              });
            }
          }
        }
      } catch {
        addFinding(findings, {
          category: 'manifest',
          rule: 'invalid-package-json',
          file: relativePath,
          line: null,
          excerpt: 'package.json could not be parsed'
        });
      }
    }

    const lines = source.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (!line.trim()) continue;

      for (const rule of RULES) {
        if (!rule.pattern.test(line)) continue;
        addFinding(findings, {
          category: rule.category,
          rule: rule.id,
          file: relativePath,
          line: index + 1,
          excerpt: redactExcerpt(line.trim())
        });
      }
    }
  }

  findings.sort((a, b) =>
    a.file.localeCompare(b.file) ||
    (a.line ?? 0) - (b.line ?? 0) ||
    a.category.localeCompare(b.category) ||
    a.rule.localeCompare(b.rule)
  );

  return {
    name,
    repository,
    revision: revision === undefined ? repositoryRevision(absoluteRoot) : revision,
    sourceFilesScanned: files.length,
    packageManifestsScanned: manifestsScanned,
    findings,
    findingsTruncated: findings.length >= MAX_FINDINGS_PER_REPOSITORY
  };
}

export function buildMarkdownReport(report) {
  const lines = [
    '# Linked application privacy source scan',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '> This is a static source-pattern scan, not a runtime network trace, dependency security audit, or privacy certification. Matches are candidate review locations; they do not prove that a request is made or that user data is transmitted.',
    '',
    '## Scope and limits',
    '',
    ...report.limitations.map((item) => `- ${item}`),
    '',
    '## Repository summaries',
    '',
    '| Project | Revision | Source files | Package manifests | Candidate matches |',
    '| --- | --- | ---: | ---: | ---: |',
    ...report.repositories.map((item) =>
      `| ${item.name} | ${item.revision ?? 'unknown'} | ${item.sourceFilesScanned} | ${item.packageManifestsScanned} | ${item.findings.length}`),
    ''
  ];

  for (const repository of report.repositories) {
    lines.push(
      `## ${repository.name}`,
      '',
      `Repository: [${repository.repository}](https://github.com/${repository.repository})  `,
      `Revision: ${repository.revision ?? 'unknown'}  `,
      `Scanned source files: ${repository.sourceFilesScanned}; package manifests: ${repository.packageManifestsScanned}`,
      ''
    );

    if (repository.findings.length === 0) {
      lines.push('No candidate patterns were found in the scanned files. This is not proof that the application has no network or storage behaviour.', '');
      continue;
    }

    lines.push('| Category | Pattern | File | Line | Excerpt (redacted) |', '| --- | --- | --- | ---: | --- |');
    for (const finding of repository.findings) {
      const excerpt = finding.excerpt.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      lines.push(`| ${finding.category} | ${finding.rule} | \`${finding.file}\` | ${finding.line ?? '—'} | \`${excerpt}\` |`);
    }
    if (repository.findingsTruncated) {
      lines.push('', '> Finding list reached the per-repository safety cap; narrow the scan and review the omitted patterns.', '');
    } else {
      lines.push('');
    }
  }

  lines.push(
    '## Required manual follow-up',
    '',
    '- Trace requests in a clean browser profile while using each core workflow.',
    '- Confirm whether any outbound request body contains user images, payroll details, or other user-entered content.',
    '- Inspect localStorage, sessionStorage, IndexedDB, Cache Storage, cookies and service-worker registrations in the browser.',
    '- Review transitive dependencies, dynamically loaded scripts, model downloads and third-party runtime assets.',
    '- Record the tested app revision and browser/OS version alongside every conclusion.',
    '',
    'A match in this report is a lead for code review. A missing match is not proof of absence.'
  );

  return lines.join('\n');
}

const LIMITATIONS = [
  'Scans first-party source/config files with a bounded set of extensions; generated output, dependency folders, lockfiles and large files are excluded.',
  'Pattern matching can miss aliased APIs, computed access, indirect SDK use, runtime-loaded code and transitive dependency behaviour.',
  'Comments, examples, dead code and same-origin service-worker fetches can produce matches that are not user-data uploads.',
  'Remote URL literals may be documentation links, model/CDN references or user-initiated destinations rather than automatic requests.',
  'The scan does not run the applications, inspect their browser storage, observe network payloads, or certify privacy behaviour.'
];

export async function runAudit({ workspace = process.cwd(), generatedAt = new Date().toISOString() } = {}) {
  const repositories = [];
  for (const target of DEFAULT_TARGETS) {
    const root = resolve(workspace, target.path);
    const result = await scanRepository({ ...target, root });
    repositories.push(result);
  }

  const report = {
    schemaVersion: 1,
    evidenceType: 'static-source-pattern-scan',
    generatedAt,
    limitations: LIMITATIONS,
    repositories
  };

  const outputDirectory = resolve(workspace, 'artifacts/privacy-source-audit');
  await mkdir(outputDirectory, { recursive: true });
  const jsonPath = join(outputDirectory, 'report.json');
  const markdownPath = join(outputDirectory, 'summary.md');
  const markdown = buildMarkdownReport(report);

  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(markdownPath, `${markdown}\n`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }

  return { report, jsonPath, markdownPath, markdown };
}

async function main() {
  const result = await runAudit();
  process.stdout.write(`${result.markdown}\n`);
  process.stdout.write(`\nWrote ${result.jsonPath} and ${result.markdownPath}\n`);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
  main().catch((error) => {
    process.stderr.write(`Privacy source audit failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
