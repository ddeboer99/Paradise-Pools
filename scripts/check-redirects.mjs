import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { routePaths } from '../src/data/routes.js';
import { legacyShortlinks } from '../src/data/legacy-shortlinks.js';

// Run against Wrangler, not Astro preview: the HTTP boundary matters here.
// This command intentionally refuses remote hosts and does not submit forms.
const args = process.argv.slice(2);
const base = new URL(args.find(arg => arg.startsWith('--base='))?.slice(7) || 'http://127.0.0.1:4174');
const reportPath = args.find(arg => arg.startsWith('--report='))?.slice(9);
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Use a local Pages runtime');
assert.equal(base.protocol, 'http:');
assert.ok(!base.username && !base.password && base.pathname === '/' && !base.search && !base.hash);
const origin = 'https://thinkparadisepools.com';
const results = [];
const pagePaths = Object.values(routePaths);

async function request(path, method = 'GET') {
  const response = await fetch(new URL(path, base), { method, redirect: 'manual', signal: AbortSignal.timeout(10000) });
  const body = await response.text();
  results.push({ method, path, status: response.status, location: response.headers.get('location'), contentType: response.headers.get('content-type') });
  return { response, body };
}
function checkPage(body, path) {
  assert.ok(body.includes(`rel="canonical" href="${origin}${path}"`), `${path}: final canonical`);
  assert.match(body, /name="robots" content="noindex, nofollow"/, `${path}: local preview noindex`);
  assert.equal((body.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: actual page content`);
}
async function checkRedirect(source, destination, expectedStatus, method = 'GET') {
  const { response } = await request(source, method);
  assert.equal(response.status, expectedStatus, `${method} ${source}: permanent status`);
  const target = new URL(response.headers.get('location'), base);
  assert.equal(target.href, new URL(destination, base).href, `${source}: exact same-host destination`);
  const final = await request(`${target.pathname}${target.search}`, method);
  assert.equal(final.response.status, 200, `${source}: one hop to a real 200, without a chain/loop`);
  if (method === 'GET') {
    if (target.pathname === '/sitemap.xml') {
      assert.match(final.response.headers.get('content-type'), /xml/);
      assert.ok(final.body.includes('<urlset'));
      assert.equal((final.body.match(/<loc>/g) || []).length, pagePaths.length);
      for (const path of pagePaths) assert.ok(final.body.includes(`<loc>${origin}${path}</loc>`));
    } else checkPage(final.body, target.pathname);
  }
}

for (const [id, destination] of Object.entries(legacyShortlinks)) {
  await checkRedirect(`/?p=${id}`, destination, 301);
  await checkRedirect(`/?p=${id}`, destination, 301, 'HEAD');
  await checkRedirect(`/?utm_source=legacy&p=${id}&tag=one&tag=two`, `${destination}?utm_source=legacy&tag=one&tag=two`, 301);
}
for (const source of ['/sitemap_index.xml', '/page-sitemap.xml']) {
  await checkRedirect(source, '/sitemap.xml', 301);
  await checkRedirect(source, '/sitemap.xml', 301, 'HEAD');
  await checkRedirect(`${source}?review=local`, '/sitemap.xml?review=local', 301);
}
// Verify Pages' existing normalization instead of duplicating it in _redirects.
for (const path of pagePaths.filter(path => path !== '/')) {
  await checkRedirect(path.slice(0, -1), path, 308);
}
await checkRedirect('/photo-gallery?utm_source=legacy', '/photo-gallery/?utm_source=legacy', 308);

for (const path of pagePaths) {
  const { response, body } = await request(path);
  assert.equal(response.status, 200, `${path}: retained direct visit`);
  assert.equal(response.headers.has('location'), false);
  checkPage(body, path);
}
// Preserve ordinary query use, and make the unfinished WordPress IDs explicit.
// Their current homepage fallback is NOT a completed migration or retirement.
for (const path of ['/?utm_source=local', '/?topic=Pool+service+or+repair', '/?p=6141', '/?p=6745', '/?p=6173', '/?p=999999', '/?p=5560&p=5562', '/service/?p=5560']) {
  const { response } = await request(path);
  assert.equal(response.headers.has('location'), false, `${path}: no guessed redirect`);
}
for (const path of ['/chemical-order-request-form/', '/image-license-and-use/',
  '/pool-chemicals/bioguard-trublue-promise-program-consumer-terms-conditions/',
  '/service/pool-maintenance-contract/', '/not-a-real-paradise-page/', '/missing/?p=5560']) {
  const { response, body } = await request(path);
  assert.equal(response.status, 404, `${path}: no homepage catch-all`);
  assert.match(body, /noindex/);
  assert.ok(!body.includes('rel="canonical"'), `${path}: no false homepage canonical`);
}
for (const path of ['/api/contact', '/api/feedback']) {
  const { response } = await request(path);
  assert.equal(response.status, 405, `${path}: still reaches its form handler`);
}
const report = {
  checkedAt: new Date().toISOString(), base: base.origin,
  confirmedShortlinks: Object.keys(legacyShortlinks).length, sitemapAliases: 2,
  nativeSlashAliases: pagePaths.length - 1, retainedPages: pagePaths.length,
  pendingShortlinks: ['6141', '6745', '6173'],
  scope: 'Local Wrangler HTTP checks only. No deployment, production host/TLS test or form delivery.',
  results,
};
if (reportPath) {
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}
console.log(`Passed: ${results.length} HTTP checks; 8 WordPress redirects, 2 sitemap redirects, ${report.nativeSlashAliases} native slash redirects, ${pagePaths.length} retained pages, preview noindex, real 404s and unchanged API routing.`);
console.log('Three unresolved WordPress IDs still fall through; their target decisions remain a launch gate.');
