import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { routePaths } from '../src/data/routes.js';
import { poolModels, comparePoolModels } from '../src/data/pools.js';
import galleryPhotos from '../src/data/gallery.json' with { type: 'json' };
import { legacyShortlinks } from '../src/data/legacy-shortlinks.js';

// Check the built pages, not just their source templates. This is a local
// migration regression check; the full legacy URL map remains a launch gate.
const origin = 'https://thinkparadisepools.com';
const paths = new Set(Object.values(routePaths));
const documents = new Map();
const titles = new Set();
const assets = new Set();
for (const path of paths) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  documents.set(path, html);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one visible page heading`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique title`);
  titles.add(title);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${path}: description`);
  assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), `${path}: canonical`);
  assert.ok(!html.includes('href="#/'), `${path}: no hash-router navigation`);
  assert.ok(!html.includes('undefined'), `${path}: no missing template variables`);
  assert.match(html, /<main[^>]*>[\s\S]*<h1/, `${path}: content rendered without JavaScript`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${path}: unique element IDs`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(src?.startsWith('/assets/'), `${path}: image served locally`);
    assert.match(tag, /\bwidth="[1-9]\d*"/, `${path}: image width reserved`);
    assert.match(tag, /\bheight="[1-9]\d*"/, `${path}: image height reserved`);
    assets.add(src);
  }
  for (const [, src] of html.matchAll(/(?:data-src|src)="(\/assets\/[^"]+)"/g)) assets.add(src);
  for (const [, set] of html.matchAll(/(?:data-srcset|srcset)="([^"]+)"/g)) {
    for (const item of set.split(',')) assets.add(item.trim().split(' ')[0]);
  }
  for (const [, src] of html.matchAll(/url\('([^']+)'\)/g)) {
    assert.ok(src.startsWith('/assets/'), `${path}: background image served locally`);
    assets.add(src);
  }
}
for (const src of assets) await access(`dist${src}`);
for (const [path, html] of documents) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const target = new URL(href, `${origin}${path}`);
    if (target.pathname.startsWith('/_astro/')) continue;
    if (galleryPhotos.some(photo => photo.originalPath === target.pathname)) {
      await access(`dist${target.pathname}`);
      continue;
    }
    assert.ok(paths.has(target.pathname), `${path}: internal link ${href} has a built page`);
    if (target.hash) assert.ok(documents.get(target.pathname).includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${path}: anchor ${href} exists`);
  }
}
// These destinations existed on the live WordPress site. They must remain
// present even if no new navigation link happens to reference the fragment.
const retainedAnchors = {
  '/pool-construction/': ['rectangle', 'freeform', 'tanning-ledges', 'spas', 'color-finish', 'tile-options'],
  '/service/': ['automatic-pool-covers', 'equipment-repair', 'pool-inspections'],
};
for (const [path, ids] of Object.entries(retainedAnchors)) {
  for (const id of ids) assert.ok(documents.get(path).includes(`id="${id}"`), `${path}#${id}: retained legacy section`);
}
const builtModelOrder = [...documents.get('/pool-construction/').matchAll(/data-model-id="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(builtModelOrder, [...poolModels].sort((a, b) => comparePoolModels(a, b)).map(model => model.id), 'Initial catalog order must match the client default to keep lower anchor targets stable');
for (const [path, phone, address] of [
  ['/elkhart-store/', '+15742642488', '655 County Road 17, Suite 11'],
  ['/granger-store/', '+15742776444', '15065 State Road 23'],
]) {
  const html = documents.get(path);
  assert.ok(html, `${path}: retained store page`);
  assert.ok(html.includes(`href="tel:${phone}"`) && html.includes(address), `${path}: store contact details`);
  assert.ok(html.includes('id="store-details"'), `${path}: hours/directions anchor`);
  assert.ok(documents.get('/locations/').includes(`href="${path}"`), `${path}: linked from location overview`);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const gallery = documents.get('/photo-gallery/');
assert.ok(gallery, 'Retain the existing gallery page address');
assert.equal((gallery.match(/class="gallery-photo"/g) || []).length, galleryPhotos.length, 'All retained gallery photos are rendered without JavaScript');
for (const photo of galleryPhotos) assert.ok(gallery.includes(`href="${photo.originalPath}"`), `Gallery retains original media URL: ${photo.originalPath}`);
const seasonal = documents.get('/service/pool-opening-and-closing-contract/');
assert.ok(seasonal, 'Retain the existing seasonal page address');
assert.ok(seasonal.includes('href="/contact/?topic=Pool%20service%20or%20repair#contact-inquiry"'), 'Seasonal inquiries use the existing contact flow');
assert.ok(!seasonal.includes('<form'), 'Seasonal page does not introduce a separate contract or ordering form');
for (const path of paths) assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`), `${path}: in sitemap`);
// A future content edit must not leave a configured shortcut pointing at 404.
for (const [id, path] of Object.entries(legacyShortlinks)) {
  assert.ok(paths.has(path), `WordPress ?p=${id}: retained destination exists`);
  assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`), `WordPress ?p=${id}: destination in sitemap`);
}
const functionRoutes = JSON.parse(await readFile('dist/_routes.json', 'utf8'));
assert.deepEqual(functionRoutes.include, ['/', '/api/*'], 'Only homepage shortcuts and form APIs invoke Pages Functions');
assert.deepEqual(functionRoutes.exclude, [], 'Confirmed function paths are not excluded');
const staticRedirects = (await readFile('dist/_redirects', 'utf8')).split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
assert.deepEqual(staticRedirects, ['/sitemap_index.xml /sitemap.xml 301', '/page-sitemap.xml /sitemap.xml 301'], 'Only approved sitemap aliases are explicit static redirects');
const notFound = await readFile('dist/404.html', 'utf8');
assert.match(notFound, /noindex/);
assert.ok(!notFound.includes('rel="canonical"'));
const preview = process.env.PUBLIC_SITE_INDEXABLE !== 'true';
if (preview) {
  for (const [path, html] of documents) assert.match(html, /name="robots" content="noindex, nofollow"/, `${path}: preview excluded from indexing`);
} else {
  for (const [path, html] of documents) assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/, `${path}: approved production pages are indexable`);
}
console.log(`Passed: ${paths.size} static pages, ${assets.size} local image assets, image dimensions, metadata, internal links/anchors, sitemap, 404 and ${preview ? 'preview noindex' : 'production'} checks.`);
