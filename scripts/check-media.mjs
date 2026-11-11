import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';
import legacyMedia from '../src/data/legacy-media.json' with { type: 'json' };

// Verify originals against the saved capture; never fetch the live site here.
// --base additionally verifies actual static delivery from local Pages.
const args = process.argv.slice(2);
const baseArgument = args.find(arg => arg.startsWith('--base='))?.slice(7);
const base = baseArgument ? new URL(baseArgument) : null;
const reportPath = args.find(arg => arg.startsWith('--report='))?.slice(9);
if (base) {
  assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Use a local preview host');
  assert.equal(base.protocol, 'http:');
  assert.ok(!base.username && !base.password && base.pathname === '/' && !base.search && !base.hash);
}
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const results = [];
let cursor = 0;
async function worker() {
  while (cursor < legacyMedia.assets.length) {
    const asset = legacyMedia.assets[cursor++];
    assert.match(asset.path, /^\/wp-content\/uploads\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png)$/);
    const original = await readFile(`public${asset.path}`);
    assert.equal(original.length, asset.bytes, asset.path);
    assert.equal(sha256(original), asset.sha256, asset.path);
    const metadata = await sharp(original, { failOn: 'error' }).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.format, asset.format);
    // Decode actual pixels too; dimensions alone can miss truncated images.
    await sharp(original, { failOn: 'error' }).stats();
    const http = [];
    if (base) {
      for (const source of asset.sourceUrls) {
        const old = new URL(source);
        assert.equal(old.origin, legacyMedia.source);
        assert.equal(old.pathname, asset.path);
        const path = `${old.pathname}${old.search}`;
        const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
        assert.equal(response.status, 200, `${path}: actual image, not redirect/404`);
        const type = response.headers.get('content-type')?.split(';')[0];
        assert.equal(type, asset.contentType, `${path}: correct image content type`);
        const bytes = Buffer.from(await response.arrayBuffer());
        assert.equal(sha256(bytes), asset.sha256, `${path}: HTTP response preserves original bytes`);
        http.push({ path, status: response.status, contentType: type, bytes: bytes.length, sha256: sha256(bytes) });
      }
    }
    results.push({ path: asset.path, decoded: true, bytes: asset.bytes, width: asset.width, height: asset.height, http });
    if (results.length % 100 === 0) console.log(`Verified ${results.length}/${legacyMedia.assets.length} legacy files`);
  }
}
await Promise.all([worker(), worker(), worker()]);
results.sort((a, b) => a.path.localeCompare(b.path));
let missingPathStatus = null;
if (base) {
  const response = await fetch(new URL('/wp-content/uploads/not-a-real-paradise-media-file.jpg', base), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
  missingPathStatus = response.status;
  assert.equal(missingPathStatus, 404, 'Missing uploads do not return a homepage or arbitrary replacement');
  await response.body?.cancel();
}
const report = { checkedAt: new Date().toISOString(), base: base?.origin || null, files: results.length,
  bytes: results.reduce((sum, item) => sum + item.bytes, 0), imageRequests: results.reduce((sum, item) => sum + item.http.length, 0), missingPathStatus, results };
if (reportPath) {
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}
console.log(`Passed: ${report.files} decoded legacy images, ${report.bytes} preserved bytes${base ? `, ${report.imageRequests} exact HTTP responses and a genuine missing-media 404` : ''}.`);
