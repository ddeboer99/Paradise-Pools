import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleSubmission } from '../src/server/submissions.js';
import { onRequest as contactEndpoint } from '../functions/api/contact.js';
import { onRequest as feedbackEndpoint } from '../functions/api/feedback.js';

const origin = 'https://pools.example';
const env = { RESEND_API_KEY: 're_test_placeholder', TURNSTILE_SECRET_KEY: 'unit-test-secret', FORM_FROM_EMAIL: 'forms@pools.example', CONTACT_TO_EMAIL: 'service@pools.example', FEEDBACK_TO_EMAIL: 'service@pools.example', FORM_ALLOWED_ORIGINS: origin };
const common = { name: 'Test Visitor', email: 'visitor@example.com', website: '', token: 'test-token', submissionId: '12345678-1234-4234-8234-123456789012' };
const contact = { ...common, phone: '574-555-0100', interest: 'Pool service or repair', message: 'Local test only.\nNo real email should be sent.' };
const feedback = { ...common, location: 'Elkhart', model: 'apollo-14', rating: '5 - Excellent', review: 'Local feedback test.' };
function context(data = contact, options = {}) {
  return { env: { ...env, ...options.env }, request: new Request(`${origin}/api/${options.type || 'contact'}`, {
    method: options.method || 'POST', headers: { origin, 'content-type': 'application/json', ...options.headers },
    ...(options.method === 'GET' ? {} : { body: options.raw ?? JSON.stringify(data) }),
  }) };
}
function providers(options = {}) {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (url.includes('siteverify')) {
      if (options.challengeThrows) throw new Error('offline');
      if (options.challengeMalformed) return Response.json(null);
      return Response.json({ success: true, hostname: 'pools.example', action: options.type || 'contact', ...options.challenge }, { status: options.challengeStatus || 200 });
    }
    assert.equal(url, 'https://api.resend.com/emails');
    if (options.emailThrows) throw new Error('provider timed out');
    return Response.json(options.email ?? { id: 'mock-email-id' }, { status: options.emailStatus || 200 });
  };
  return { calls, fetcher };
}
for (const type of ['contact', 'feedback']) test(`${type} uses fixed recipient/sender, plain text, reply-to and a stable idempotency key`, async () => {
  const mocks = providers({ type });
  const data = { ...(type === 'contact' ? contact : feedback), to: 'unapproved@example.com', from: 'spoof@example.com' };
  const result = await handleSubmission(context(data, { type }), type, mocks.fetcher);
  assert.equal(result.status, 200);
  assert.equal((await result.json()).ok, true);
  assert.equal(mocks.calls.length, 2);
  assert.deepEqual(mocks.calls[1].body.to, ['service@pools.example']);
  assert.equal(mocks.calls[1].body.from, 'Paradise Pools Website <forms@pools.example>');
  assert.equal(mocks.calls[1].body.reply_to, 'visitor@example.com');
  assert.ok(!('html' in mocks.calls[1].body));
  assert.equal(mocks.calls[1].init.headers['Idempotency-Key'], `paradise-${type}-${common.submissionId}`);
  assert.match(result.headers.get('cache-control'), /no-store/);
});
test('feedback email is optional and model IDs are validated', async () => {
  const mocks = providers({ type: 'feedback' });
  assert.equal((await handleSubmission(context({ ...feedback, email: '' }), 'feedback', mocks.fetcher)).status, 200);
  assert.ok(!('reply_to' in mocks.calls[1].body));
  const noCalls = providers();
  assert.equal((await handleSubmission(context({ ...feedback, model: 'made-up' }), 'feedback', noCalls.fetcher)).status, 400);
  assert.equal(noCalls.calls.length, 0);
});
test('malformed fields, injected headers, honeypot, long input and missing tokens never reach providers', async () => {
  for (const patch of [{ email: 'not-an-email' }, { name: 'Visitor\r\nBcc: someone@example.com' }, { phone: '1' }, { interest: 'made-up' }, { message: 'x'.repeat(5001) }, { website: 'spam' }, { token: '' }, { submissionId: 'invalid' }, { name: {} }]) {
    const mocks = providers();
    assert.equal((await handleSubmission(context({ ...contact, ...patch }), 'contact', mocks.fetcher)).status, 400, JSON.stringify(patch).slice(0,80));
    assert.equal(mocks.calls.length, 0);
  }
});
test('HTTP boundaries reject unsupported methods, origins, content and oversized bodies', async () => {
  for (const [options, expected] of [
    [{ method: 'GET' }, 405], [{ headers: { origin: 'https://elsewhere.example' } }, 403],
    [{ headers: { 'content-type': 'text/plain' } }, 415], [{ raw: '{' }, 400], [{ raw: 'x'.repeat(17000) }, 413], [{ raw: '[]' }, 400],
  ]) {
    const mocks = providers();
    assert.equal((await handleSubmission(context(contact, options), 'contact', mocks.fetcher)).status, expected);
    assert.equal(mocks.calls.length, 0);
  }
});
test('both real Pages entrypoints fail closed while credentials are absent', async () => {
  for (const endpoint of [contactEndpoint, feedbackEndpoint]) {
    const result = await endpoint(context(contact, { env: { RESEND_API_KEY: '' } }));
    assert.equal(result.status, 503);
    assert.equal((await result.json()).ok, false);
  }
});
test('public deployments reject dummy secrets and unapproved origins', async () => {
  for (const patch of [{ TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' }, { FORM_ALLOWED_ORIGINS: 'https://another.example' }]) {
    const mocks = providers();
    assert.equal((await handleSubmission(context(contact, { env: patch }), 'contact', mocks.fetcher)).status, 503);
    assert.equal(mocks.calls.length, 0);
  }
});
test('failed, replayed, wrong-host or wrong-action challenges never send email', async () => {
  for (const challenge of [{ success: false, 'error-codes': ['timeout-or-duplicate'] }, { hostname: 'attacker.example' }, { action: 'feedback' }]) {
    const mocks = providers({ challenge });
    assert.equal((await handleSubmission(context(), 'contact', mocks.fetcher)).status, 400);
    assert.equal(mocks.calls.length, 1);
  }
});
test('provider outages and non-acceptance cannot return false success', async () => {
  for (const [options, expected] of [[{ challengeThrows: true }, 503], [{ challengeStatus: 503 }, 503], [{ challengeMalformed: true }, 503], [{ emailStatus: 429 }, 502], [{ emailThrows: true }, 502], [{ email: {} }, 502]]) {
    const mocks = providers(options);
    const result = await handleSubmission(context(), 'contact', mocks.fetcher);
    assert.equal(result.status, expected);
    assert.equal((await result.json()).ok, false);
  }
});
