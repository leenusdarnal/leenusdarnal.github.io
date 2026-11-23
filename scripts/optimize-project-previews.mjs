#!/usr/bin/env node
/**
 * Generate responsive AVIF and WebP variants for the real application previews.
 *
 * The original screenshots remain untouched and are retained as the <img> fallback.
 * Run with: npm install --no-save --package-lock=false sharp@0.35.5
 *           node scripts/optimize-project-previews.mjs
 */
import sharp from 'sharp';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(ROOT, 'static/images/project-previews/optimized');
const REPORT_DIR = resolve(ROOT, 'artifacts/project-preview-optimization');
const WIDTHS = [480, 768, 1200, 1440];

export const PREVIEW_INPUTS = [
  { slug: 'pixelforge-studio', path: 'static/images/project-previews/pixelforge.jpg' },
  { slug: 'metronome', path: 'static/images/metronome-preview.png' },
  { slug: 'sikkim-government-salary-calculator', path: 'static/images/project-previews/salary-calculator.jpg' },
  { slug: 'pixelcutout', path: 'static/images/project-previews/pixelcutout.jpg' }
];

export async function optimizeProjectPreviews() {
  await mkdir(OUTPUT, { recursive: true });
  await mkdir(REPORT_DIR, { recursive: true });

  const projects = [];

  for (const item of PREVIEW_INPUTS) {
    const inputPath = resolve(ROOT, item.path);
    const sourceStats = await stat(inputPath);
    const sourceMetadata = await sharp(inputPath, { sequentialRead: true }).metadata();

    if (!sourceMetadata.width || !sourceMetadata.height) {
      throw new Error(`Cannot read image dimensions for ${item.path}`);
    }
    if (sourceMetadata.width < WIDTHS.at(-1)) {
      throw new Error(`${item.path} is ${sourceMetadata.width}px wide; expected at least ${WIDTHS.at(-1)}px for the configured srcset.`);
    }

    const variants = [];

    for (const width of WIDTHS) {
      const base = sharp(inputPath, { sequentialRead: true })
        .rotate()
        .resize({ width, withoutEnlargement: true, fit: 'inside' });

      const avifPath = join(OUTPUT, `${item.slug}-${width}.avif`);
      const webpPath = join(OUTPUT, `${item.slug}-${width}.webp`);

      await Promise.all([
        base.clone().avif({
          quality: 52,
          effort: 6,
          chromaSubsampling: '4:4:4'
        }).toFile(avifPath),
        base.clone().webp({
          quality: 82,
          effort: 6,
          smartSubsample: true
        }).toFile(webpPath)
      ]);

      const [avifStats, webpStats, avifMeta, webpMeta] = await Promise.all([
        stat(avifPath),
        stat(webpPath),
        sharp(avifPath).metadata(),
        sharp(webpPath).metadata()
      ]);

      for (const [format, metadata] of [['AVIF', avifMeta], ['WebP', webpMeta]]) {
        if (metadata.width !== width || metadata.height !== sourceMetadata.height * width / sourceMetadata.width) {
          // Rounding is expected for non-integral aspect ratios; validate width exactly.
          if (metadata.width !== width || !metadata.height) {
            throw new Error(`${format} variant dimension check failed for ${item.slug} at ${width}px.`);
          }
        }
      }

      variants.push({
        width,
        height: avifMeta.height,
        avif: { path: `static/images/project-previews/optimized/${item.slug}-${width}.avif`, bytes: avifStats.size },
        webp: { path: `static/images/project-previews/optimized/${item.slug}-${width}.webp`, bytes: webpStats.size }
      });
    }

    const largest = variants.at(-1);
    projects.push({
      slug: item.slug,
      source: item.path,
      sourceBytes: sourceStats.size,
      sourceWidth: sourceMetadata.width,
      sourceHeight: sourceMetadata.height,
      variants,
      largest: {
        avifBytes: largest.avif.bytes,
        webpBytes: largest.webp.bytes,
        avifSavingsPercent: Number(((1 - largest.avif.bytes / sourceStats.size) * 100).toFixed(1)),
        webpSavingsPercent: Number(((1 - largest.webp.bytes / sourceStats.size) * 100).toFixed(1))
      }
    });
  }

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    tool: `sharp ${sharp.versions.sharp}`,
    widths: WIDTHS,
    formats: ['avif', 'webp'],
    quality: { avif: 52, webp: 82 },
    originalsPreserved: true,
    projects
  };

  await writeFile(join(REPORT_DIR, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  optimizeProjectPreviews().catch((error) => {
    process.stderr.write(`Project preview optimization failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
