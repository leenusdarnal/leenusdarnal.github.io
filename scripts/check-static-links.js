import { readdir, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';

const root = resolve('build');
const htmlFiles = [];
const broken = [];
let checked = 0;

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.html') htmlFiles.push(path);
  }
}

function isExternal(url) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url) || url.startsWith('#');
}

async function checkReference(raw, htmlFile) {
  const value = raw.trim();
  if (!value || isExternal(value)) return;
  const withoutQuery = value.split(/[?#]/, 1)[0];
  if (!withoutQuery) return;

  let decoded;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch {
    broken.push({ page: relative(root, htmlFile), url: value, reason: 'invalid URL encoding' });
    return;
  }

  const fromPage = relative(root, dirname(htmlFile));
  const candidate = decoded.startsWith('/')
    ? decoded.slice(1)
    : resolve(fromPage, decoded);
  const target = resolve(root, candidate || '.');
  if (target !== root && !target.startsWith(root + sep)) {
    broken.push({ page: relative(root, htmlFile), url: value, reason: 'path escapes build output' });
    return;
  }

  checked++;
  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      await stat(resolve(target, 'index.html'));
    }
  } catch {
    if (!extname(target)) {
      try {
        await stat(resolve(target, 'index.html'));
        return;
      } catch {}
    }
    broken.push({ page: relative(root, htmlFile), url: value, reason: 'target not found in build output' });
  }
}

await walk(root);
if (htmlFiles.length === 0) throw new Error('No generated HTML pages found in build/.');

for (const htmlFile of htmlFiles) {
  const html = await (await import('node:fs/promises')).readFile(htmlFile, 'utf8');
  const attribute = /\b(?:href|src|poster)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  for (const match of html.matchAll(attribute)) await checkReference(match[1] ?? match[2] ?? '', htmlFile);

  const srcset = /\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  for (const match of html.matchAll(srcset)) {
    for (const candidate of (match[1] ?? match[2] ?? '').split(',')) {
      const url = candidate.trim().split(/\s+/, 1)[0];
      if (url) await checkReference(url, htmlFile);
    }
  }
}

if (broken.length) {
  console.error('Broken internal references were found:');
  for (const item of broken) console.error(`- ${item.page}: ${item.url} (${item.reason})`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} local references across ${htmlFiles.length} generated HTML pages; no broken targets found.`);
}
