import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/index.js';

// Expectations are the captured old-site URLs, independent of the runtime map.
const expected = [
  ['5560', '/pool-construction/'], ['5562', '/service/'],
  ['5566', '/pool-chemicals/'], ['5569', '/granger-store/'],
  ['5573', '/elkhart-store/'], ['5971', '/service/pool-opening-and-closing-contract/'],
  ['6064', '/photo-gallery/'], ['6113', '/privacy-policy/'],
];
function context(path, method = 'GET', headers = {}) {
  return {
    request: new Request(`https://preview.example${path}`, { method, headers }),
    next: () => new Response('asset fallback', { status: 200 }),
  };
}

test('all eight confirmed WordPress links permanently redirect on GET and HEAD', async () => {
  for (const [id, path] of expected) {
    for (const method of ['GET', 'HEAD']) {
      const result = await onRequest(context(`/?p=${id}`, method));
      assert.equal(result.status, 301);
      assert.equal(result.headers.get('location'), path);
      assert.equal(await result.text(), '');
    }
  }
});

test('removes only the legacy ID and preserves unrelated query values', async () => {
  const result = await onRequest(context('/?utm_source=old-site&p=5560&tag=one&tag=two&note=pool%20%26%20spa'));
  const target = new URL(result.headers.get('location'), 'https://preview.example');
  assert.equal(target.pathname, '/pool-construction/');
  assert.equal(target.searchParams.has('p'), false);
  assert.equal(target.searchParams.get('utm_source'), 'old-site');
  assert.deepEqual(target.searchParams.getAll('tag'), ['one', 'two']);
  assert.equal(target.searchParams.get('note'), 'pool & spa');
});

test('homepage, other paths, unconfirmed IDs and ambiguous requests are not redirected', async () => {
  for (const path of ['/', '/?utm_source=local', '/?topic=Pool+service+or+repair',
    '/?p=6141', '/?p=6745', '/?p=6173', '/?p=999999', '/?p=', '/?p=5560junk',
    '/?p=5560&p=5562', '/?p=5560&p=5560', '/?p=__proto__', '/?p=constructor',
    '/?page_id=5560', '/service/?p=5560', '/missing/?p=5560', '/api/contact?p=5560']) {
    const result = await onRequest(context(path));
    assert.equal(result.status, 200, path);
    assert.equal(result.headers.has('location'), false, path);
    assert.equal(await result.text(), 'asset fallback', path);
  }
  for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS']) {
    assert.equal((await onRequest(context('/?p=5560', method))).headers.has('location'), false, method);
  }
});

test('request parameters and forwarded headers cannot create an off-site redirect', async () => {
  const result = await onRequest(context('/?p=6064&next=https%3A%2F%2Felsewhere.example%2F&redirect=%2F%2Felsewhere.example', 'GET', {
    'x-forwarded-host': 'elsewhere.example', 'x-forwarded-proto': 'https',
  }));
  assert.equal(result.status, 301);
  assert.ok(result.headers.get('location').startsWith('/photo-gallery/?'));
  assert.equal(new URL(result.headers.get('location'), 'https://preview.example').origin, 'https://preview.example');
});
