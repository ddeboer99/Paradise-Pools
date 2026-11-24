import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/_middleware.js';

test('Pages previews retain noindex for homepage, redirects, and API errors', async () => {
  for (const host of ['paradise-pools-dan-preview.pages.dev', 'abc.paradise-pools-dan-preview.pages.dev']) {
    for (const [path, status] of [['/', 200], ['/?p=5560', 301], ['/api/contact', 405]]) {
      const headers = status === 301 ? { location: '/pool-construction/' } : { 'content-type': 'text/plain' };
      const response = await onRequest({
        request: new Request(`https://${host}${path}`),
        next: () => new Response(status === 301 ? null : 'preserved response', { status, headers }),
      });
      assert.equal(response.status, status);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
      if (status === 301) assert.equal(response.headers.get('location'), '/pool-construction/');
      else assert.equal(await response.text(), 'preserved response');
    }
  }
});

test('custom domain responses retain their own indexing policy', async () => {
  const original = new Response('production', { headers: { 'x-robots-tag': 'existing-policy' } });
  const response = await onRequest({
    request: new Request('https://thinkparadisepools.com/'),
    next: () => original,
  });
  assert.equal(response, original);
  assert.equal(response.headers.get('x-robots-tag'), 'existing-policy');
});
