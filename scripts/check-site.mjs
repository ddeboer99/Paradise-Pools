import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { routePaths } from '../src/data/routes.js';

// Check the built pages, not just their source templates. This is a local
// migration regression check; the full legacy URL map remains a launch gate.
const origin = 'https://thinkparadisepools.com';
const paths = new Set(Object.values(routePaths));
const documents = new Map();
const titles = new Set();
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
}
for (const [path, html] of documents) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const target = new URL(href, `${origin}${path}`);
    if (target.pathname.startsWith('/_astro/')) continue;
    assert.ok(paths.has(target.pathname), `${path}: internal link ${href} has a built page`);
    if (target.hash) assert.ok(documents.get(target.pathname).includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${path}: anchor ${href} exists`);
  }
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const path of paths) assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`), `${path}: in sitemap`);
const notFound = await readFile('dist/404.html', 'utf8');
assert.match(notFound, /noindex/);
assert.ok(!notFound.includes('rel="canonical"'));
const preview = process.env.PUBLIC_SITE_INDEXABLE !== 'true';
if (preview) {
  for (const [path, html] of documents) assert.match(html, /name="robots" content="noindex, nofollow"/, `${path}: preview excluded from indexing`);
} else {
  for (const [path, html] of documents) assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/, `${path}: approved production pages are indexable`);
}
console.log(`Passed: ${paths.size} static pages, metadata, internal links/anchors, sitemap, 404 and ${preview ? 'preview noindex' : 'production'} checks.`);
