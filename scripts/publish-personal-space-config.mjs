#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const raw = process.env.CONFIG_JSON;
if (!raw || raw.length > 65535) throw new Error('CONFIG_JSON is missing or exceeds the GitHub Actions input limit.');
const envelope = JSON.parse(raw);
const draft = envelope?.config;
if (!draft || typeof draft !== 'object' || Array.isArray(draft)) throw new Error('Expected an exported configuration object under config.');

const requiredStrings = ['name', 'title', 'description', 'githubUrl', 'contactEmail', 'headline', 'heroDescription', 'palette'];
for (const key of requiredStrings) if (typeof draft[key] !== 'string') throw new Error('Missing string field: ' + key);
const limits = { name: 80, title: 120, description: 240, githubUrl: 200, contactEmail: 254, headline: 100, heroDescription: 400, palette: 40 };
for (const [key, limit] of Object.entries(limits)) if (draft[key].length > limit) throw new Error(key + ' exceeds ' + limit + ' characters.');
if (!draft.name.trim() || !draft.title.trim() || !draft.description.trim() || !draft.headline.trim() || !draft.heroDescription.trim()) throw new Error('Required text fields cannot be empty.');
const github = new URL(draft.githubUrl);
if (github.protocol !== 'https:' || github.hostname !== 'github.com' || github.username || github.password) throw new Error('githubUrl must be an HTTPS GitHub profile URL.');
if (draft.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contactEmail)) throw new Error('contactEmail is not a valid email address.');
if (!['system', 'light', 'dark'].includes(draft.defaultTheme)) throw new Error('defaultTheme must be system, light or dark.');
const sectionKeys = ['projects', 'sourceExperiments', 'personalSpace', 'about', 'contact'];
if (!draft.sections || typeof draft.sections !== 'object' || Array.isArray(draft.sections)) throw new Error('sections must be an object.');
for (const key of sectionKeys) if (typeof draft.sections[key] !== 'boolean') throw new Error('sections.' + key + ' must be boolean.');

const file = 'src/lib/personal-space.config.ts';
let source = await readFile(file, 'utf8');
const configStart = source.indexOf('export const personalSpaceConfig = {');
if (configStart < 0) throw new Error('Could not locate the exported configuration object.');

function findBlock(name) {
  const re = new RegExp('\\b' + name + ':\\s*\\{', 'g');
  re.lastIndex = configStart;
  const match = re.exec(source);
  if (!match) throw new Error('Could not find config block: ' + name);
  const open = source.indexOf('{', match.index);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '\`') { quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return [open, i + 1];
    }
  }
  throw new Error('Unclosed config block: ' + name);
}

function setString(block, key, value) {
  const [start, end] = findBlock(block);
  const part = source.slice(start, end);
  const property = new RegExp('\\b' + key + ':\\s*');
  const match = property.exec(part);
  if (!match) throw new Error('Could not find string property: ' + block + '.' + key);
  const valueStart = match.index + match[0].length;
  const quote = part[valueStart];
  if (quote !== "'" && quote !== '"') throw new Error('Expected a string literal for ' + block + '.' + key);
  let cursor = valueStart + 1;
  let escaped = false;
  for (; cursor < part.length; cursor++) {
    const ch = part[cursor];
    if (escaped) escaped = false;
    else if (ch === '\\') escaped = true;
    else if (ch === quote) break;
  }
  if (cursor >= part.length) throw new Error('Unterminated string for ' + block + '.' + key);
  const absolute = start + valueStart;
  source = source.slice(0, absolute) + JSON.stringify(value) + source.slice(start + cursor + 1);
}

function setFirstSocialProfileUrl(value) {
  const [siteStart, siteEnd] = findBlock('site');
  const sitePart = source.slice(siteStart, siteEnd);
  const listStart = sitePart.indexOf('socialProfiles: [');
  if (listStart < 0) throw new Error('Could not find socialProfiles list.');
  const objectStart = sitePart.indexOf('{', listStart);
  const objectEnd = sitePart.indexOf('}', objectStart);
  if (objectStart < 0 || objectEnd < 0) throw new Error('Could not find the GitHub social profile.');
  const profile = sitePart.slice(objectStart, objectEnd + 1);
  const match = /\\burl:\\s*(['"])(?:\\\\.|[^'"])*\\1/.exec(profile);
  if (!match) throw new Error('Could not find the GitHub social profile URL.');
  const absolute = siteStart + objectStart + match.index;
  const prefix = match[0].slice(0, match[0].indexOf(match[1]));
  source = source.slice(0, absolute) + prefix + JSON.stringify(value) + source.slice(absolute + match[0].length);
}

function setBoolean(block, key, value) {
  const [start, end] = findBlock(block);
  const part = source.slice(start, end);
  const property = new RegExp('\\b' + key + ':\\s*(true|false)');
  const match = property.exec(part);
  if (!match) throw new Error('Could not find boolean property: ' + block + '.' + key);
  const absolute = start + match.index + match[0].lastIndexOf(match[1]);
  source = source.slice(0, absolute) + String(value) + source.slice(absolute + match[1].length);
}

setString('identity', 'name', draft.name.trim());
const nameParts = draft.name.trim().split(/\s+/);
setString('identity', 'firstName', nameParts.shift());
setString('identity', 'lastName', nameParts.join(' '));
setString('identity', 'monogram', draft.name.trim().slice(0, 1).toUpperCase() + '.');
for (const [key, value] of Object.entries({ title: draft.title.trim(), description: draft.description.trim(), author: draft.name.trim(), githubUrl: draft.githubUrl.trim(), contactEmail: draft.contactEmail.trim() })) setString('site', key, value);
setFirstSocialProfileUrl(draft.githubUrl.trim());
for (const [key, value] of Object.entries({ palette: draft.palette.trim(), defaultTheme: draft.defaultTheme })) setString('appearance', key, value);
for (const key of sectionKeys) setBoolean('sections', key, draft.sections[key]);
for (const [key, value] of Object.entries({ headline: draft.headline.trim(), description: draft.heroDescription.trim() })) setString('hero', key, value);

await writeFile(file, source);
console.log('Validated and updated allow-listed Personal Space configuration fields.');
