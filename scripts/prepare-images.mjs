import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import sharp from 'sharp';
import { pages, renderRawPage } from '../src/content/pages.js';
import galleryPhotos from '../src/data/gallery.json' with { type: 'json' };

// Run intentionally when imagery changes; ordinary builds use committed assets
// and never depend on manufacturer image servers being available.
const html = Object.keys(pages).map(renderRawPage).join('\n');
const sources = [...new Set([
  ...[...html.matchAll(/(?:src|data-src)="(https:[^"]+)"/g)].map(match => match[1]),
  ...[...html.matchAll(/url\('(https:[^']+)'\)/g)].map(match => match[1]),
])].sort();
await mkdir('tmp/image-originals', { recursive: true });
await mkdir('public/assets/images', { recursive: true });
const manifest = {};
for (const url of sources) {
  const id = createHash('sha256').update(url).digest('hex').slice(0, 16);
  const cache = `tmp/image-originals/${id}`;
  let original;
  try { original = await readFile(cache); }
  catch {
    const response = await fetch(url, { headers: { 'User-Agent': 'ParadisePoolsAssetReview/1.0' }, signal: AbortSignal.timeout(30_000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image download failed: ${url}`);
    original = Buffer.from(await response.arrayBuffer());
    if (original.length > 12_000_000) throw new Error(`Image is unexpectedly large: ${url}`);
    await writeFile(cache, original);
  }
  const metadata = await sharp(original).metadata();
  if (!metadata.width || !metadata.height || (metadata.pages || 1) > 1) throw new Error(`Unsupported image: ${url}`);
  // Retain the gallery's public media addresses as well as responsive variants.
  // These exact local copies let old image links survive the hosting change.
  const galleryPhoto = galleryPhotos.find(photo => photo.source === url);
  if (galleryPhoto) {
    const originalUrl = new URL(url);
    if (originalUrl.origin !== 'https://thinkparadisepools.com' || originalUrl.pathname !== galleryPhoto.originalPath || !/^\/wp-content\/uploads\/[a-z0-9_-]+\.jpg$/i.test(galleryPhoto.originalPath)) throw new Error(`Unexpected gallery path: ${url}`);
    await mkdir('public/wp-content/uploads', { recursive: true });
    await writeFile(`public${galleryPhoto.originalPath}`, original);
  }
  const label = new URL(url).pathname.split('/').at(-1).replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]/gi, '-').slice(0, 48);
  const variants = [];
  for (const width of [...new Set([480, 960, 1600].map(size => Math.min(size, metadata.width)))]) {
    let src = `/assets/images/${label}-${id}-${width}.webp`;
    const info = await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(`public${src}`);
    // Some supplied JPEGs are already smaller than a same-size re-encode.
    // Preserve those originals rather than increasing the visitor's download.
    if (width === metadata.width && (!metadata.orientation || metadata.orientation === 1) && original.length < info.size && ['jpeg', 'png', 'webp'].includes(metadata.format)) {
      await unlink(`public${src}`);
      src = `/assets/images/${label}-${id}-${width}.${metadata.format === 'jpeg' ? 'jpg' : metadata.format}`;
      await writeFile(`public${src}`, original);
      info.size = original.length;
    }
    variants.push({ src, width: info.width, height: info.height, bytes: info.size });
  }
  const largest = variants.at(-1);
  manifest[url] = { src: largest.src, width: largest.width, height: largest.height, originalBytes: original.length, sources: variants };
}
await writeFile('src/data/images.json', `${JSON.stringify(manifest, null, 2)}\n`);
const originalBytes = Object.values(manifest).reduce((sum, image) => sum + image.originalBytes, 0);
const largestBytes = Object.values(manifest).reduce((sum, image) => sum + image.sources.at(-1).bytes, 0);
console.log(JSON.stringify({ images: sources.length, originalBytes, largestBytes, reductionPercent: Math.round(100 * (1 - largestBytes / originalBytes)) }, null, 2));
