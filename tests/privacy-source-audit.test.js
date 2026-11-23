import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';

import { redactExcerpt, scanRepository } from '../scripts/audit-linked-app-privacy.mjs';

test('privacy source scan finds network, storage, file-transfer and local-processing patterns', async () => {
  const root = await mkdtemp(join(tmpdir(), 'privacy-audit-'));
  try {
    await mkdir(join(root, 'src'), { recursive: true });
    await writeFile(join(root, 'src', 'editor.ts'), [
      "const response = await fetch('https://models.example.test/model.onnx');",
      "const socket = new WebSocket('wss://example.test');",
      "localStorage.setItem('draft', JSON.stringify(draft));",
      "const database = indexedDB.open('local-editor');",
      "const form = new FormData(); form.append('image', imageFile);",
      "const url = URL.createObjectURL(blob);",
      "const worker = new Worker(new URL('./worker.js', import.meta.url));",
      "navigator.sendBeacon('/telemetry', payload);"
      "window.gtag('event', 'image_export');"
    ].join('\n'));
    const result = await scanRepository({
      name: 'Fixture App',
      repository: 'example/fixture',
      root,
      revision: 'fixture-sha'
    });

    const rules = new Set(result.findings.map((finding) => finding.rule));
    assert.ok(rules.has('fetch-api'));
    assert.ok(rules.has('remote-url-literal'));
    assert.ok(rules.has('websocket'));
    assert.ok(rules.has('local-storage'));
    assert.ok(rules.has('indexed-db'));
    assert.ok(rules.has('form-data'));
    assert.ok(rules.has('object-url-create'));
    assert.ok(rules.has('worker-construction'));
    assert.ok(rules.has('send-beacon'));
    assert.ok(rules.has('analytics-global'));
    assert.equal(result.revision, 'fixture-sha');
    assert.equal(result.sourceFilesScanned, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('package manifests identify candidate analytics and telemetry dependencies', async () => {
  const root = await mkdtemp(join(tmpdir(), 'privacy-audit-packages-'));
  try {
    await writeFile(join(root, 'package.json'), JSON.stringify({
      name: 'fixture',
      dependencies: { '@sentry/browser': '^8.0.0', svelte: '^5.0.0' },
      devDependencies: { 'posthog-js': '^1.0.0' }
    }));
    const result = await scanRepository({
      name: 'Fixture App',
      repository: 'example/fixture',
      root,
      revision: null
    });

    const packages = result.findings
      .filter((finding) => finding.rule === 'telemetry-or-analytics-package')
      .map((finding) => finding.excerpt);
    assert.ok(packages.some((value) => value.includes('@sentry/browser')));
    assert.ok(packages.some((value) => value.includes('posthog-js')));
    assert.equal(packages.length, 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('scanner excludes generated and installed dependency trees', async () => {
  const root = await mkdtemp(join(tmpdir(), 'privacy-audit-ignore-'));
  try {
    await mkdir(join(root, 'src'), { recursive: true });
    await mkdir(join(root, 'node_modules', 'example'), { recursive: true });
    await mkdir(join(root, 'dist'), { recursive: true });
    await writeFile(join(root, 'src', 'main.js'), "fetch('/same-origin');");
    await writeFile(join(root, 'node_modules', 'example', 'index.js'), "fetch('https://dependency.test');");
    await writeFile(join(root, 'dist', 'bundle.js'), "new WebSocket('wss://generated.test');");

    const result = await scanRepository({
      name: 'Fixture App',
      repository: 'example/fixture',
      root,
      revision: null
    });

    assert.equal(result.sourceFilesScanned, 1);
    assert.deepEqual(result.findings.map((finding) => finding.rule), ['fetch-api']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('source excerpts redact common token and credential forms', () => {
  const excerpt = redactExcerpt("fetch('https://example.test/?access_token=abc123&x=1', { headers: { Authorization: 'Bearer ghp_abcdefghijklmnopqrstuvwxyz123456' } });");
  assert.doesNotMatch(excerpt, /abc123/);
  assert.doesNotMatch(excerpt, /ghp_abcdefghijklmnopqrstuvwxyz123456/);
  assert.match(excerpt, /redacted/);
});

test('source audit report identifies its limits and required runtime follow-up', async () => {
  const root = await mkdtemp(join(tmpdir(), 'privacy-audit-report-'));
  try {
    await mkdir(join(root, 'src'), { recursive: true });
    await writeFile(join(root, 'src', 'main.js'), "const cache = await caches.open('app');");
    const result = await scanRepository({
      name: 'Fixture App',
      repository: 'example/fixture',
      root,
      revision: null
    });

    assert.equal(result.findings[0].category, 'storage');
    assert.equal(result.findings[0].line, 1);
    assert.equal(result.findings[0].file, 'src/main.js');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
