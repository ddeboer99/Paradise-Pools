import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { routePaths } from '../src/data/routes.js';
import { legacyShortlinks } from '../src/data/legacy-shortlinks.js';
import legacyMedia from '../src/data/legacy-media.json' with { type: 'json' };

// Read-only deployment checks: never submit forms or contact the live domain.
const base = new URL(process.argv[2]);
assert.equal(base.protocol, 'https:');
assert.match(base.hostname, /^(?:[a-z0-9-]+\.)?paradise-pools-dan-preview\.pages\.dev$/);
assert.equal(base.pathname, '/');
assert.equal(base.search + base.hash + base.username + base.password + base.port, '');

async function get(path) {
  const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(30_000) });
  return response;
}
function noindex(response, path) {
  assert.match(response.headers.get('x-robots-tag') || '', /\bnoindex\b/, `${path}: noindex response header`);
}

for (const path of Object.values(routePaths)) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  noindex(response, path);
  const html = await response.text();
  assert.match(html, /name="robots" content="noindex, nofollow"/, `${path}: noindex meta`);
  assert.ok(html.includes(`rel="canonical" href="https://thinkparadisepools.com${path}"`), `${path}: retained canonical`);
}
for (const [id, destination] of Object.entries(legacyShortlinks)) {
  const response = await get(`/?p=${id}&utm_source=deployment-check`);
  assert.equal(response.status, 301, `/?p=${id}`);
  noindex(response, `/?p=${id}`);
  const target = new URL(response.headers.get('location'), base);
  assert.equal(target.origin, base.origin);
  assert.equal(target.pathname, destination);
  assert.equal(target.search, '?utm_source=deployment-check');
}
for (const path of ['/sitemap_index.xml', '/page-sitemap.xml']) {
  const response = await get(path);
  assert.equal(response.status, 301, path);
  assert.equal(new URL(response.headers.get('location'), base).href, new URL('/sitemap.xml', base).href);
}
for (const path of ['/api/contact', '/api/feedback']) {
  const response = await get(path); // GET verifies the handler without sending email.
  assert.equal(response.status, 405, `${path}: Functions deployed`);
  noindex(response, path);
}
const missing = await get('/deployment-check-missing-page/');
assert.equal(missing.status, 404);
noindex(missing, 'missing page');
const robots = await get('/robots.txt');
assert.equal(robots.status, 200);
assert.doesNotMatch(await robots.text(), /Sitemap:/i);
const asset = legacyMedia.assets[0];
const image = await get(asset.path);
assert.equal(image.status, 200, asset.path);
assert.equal(createHash('sha256').update(Buffer.from(await image.arrayBuffer())).digest('hex'), asset.sha256);
console.log(`Verified ${base.origin}: all 14 pages noindex, retained canonicals, legacy redirects, both Functions, real 404, robots, and original media.`);
