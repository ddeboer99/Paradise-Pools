import { inquiryTopics, retailLocations, ratings } from '../data/form-options.js';
import { poolModels } from '../data/pools.js';

const MAX_BODY_BYTES = 16_384;
const emailPattern = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const responseHeaders = {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex',
};
function reply(status, message, extra = {}) {
  return new Response(JSON.stringify({ ok: status === 200, message, ...extra }), { status, headers: responseHeaders });
}
const unavailable = () => reply(503, 'Online submissions are temporarily unavailable. Please call (574) 264-2488 or email service@thinkparadisepools.com.');

class SubmissionError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new SubmissionError(413, 'Your message is too long. Please shorten it and try again.');
  const reader = request.body?.getReader();
  if (!reader) throw new SubmissionError(400, 'Please complete the form.');
  let length = 0;
  let text = '';
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new SubmissionError(413, 'Your message is too long. Please shorten it and try again.');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally { reader.releaseLock(); }
  try { return JSON.parse(text); } catch { throw new SubmissionError(400, 'We could not read this submission. Please try again.'); }
}

function field(data, key, label, max, optional = false, multiline = false) {
  const raw = data[key];
  if (optional && (raw === undefined || raw === '')) return '';
  if (typeof raw !== 'string' || !raw.trim() || raw.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(raw) || (!multiline && /[\r\n]/.test(raw))) {
    throw new SubmissionError(400, `Please enter a valid ${label}.`);
  }
  return raw.trim();
}
function choice(data, key, label, choices) {
  const value = field(data, key, label, 120);
  if (!choices.includes(value)) throw new SubmissionError(400, `Please choose a valid ${label}.`);
  return value;
}
function validate(data, type) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new SubmissionError(400, 'Please complete the form.');
  if (data.website !== undefined && data.website !== '') throw new SubmissionError(400, 'We could not accept this submission.');
  const name = field(data, 'name', 'name', 100);
  const email = field(data, 'email', 'email address', 254, type === 'feedback');
  if (email && !emailPattern.test(email)) throw new SubmissionError(400, 'Please enter a valid email address.');
  const token = field(data, 'token', 'spam-protection verification', 2048);
  const submissionId = field(data, 'submissionId', 'submission identifier', 36);
  if (!uuidPattern.test(submissionId)) throw new SubmissionError(400, 'Please refresh the page and try again.');
  if (type === 'contact') {
    const phone = field(data, 'phone', 'phone number', 40);
    if (!/^[+()\d\s.\-xext]+$/i.test(phone) || phone.replace(/\D/g, '').length < 7) throw new SubmissionError(400, 'Please enter a valid phone number.');
    return { name, email, phone, token, submissionId,
      interest: choice(data, 'interest', 'topic', inquiryTopics),
      message: field(data, 'message', 'message (up to 5,000 characters)', 5000, false, true),
    };
  }
  return { name, email, token, submissionId,
    location: choice(data, 'location', 'retail location', retailLocations),
    model: choice(data, 'model', 'pool model', poolModels.map(model => model.id)),
    rating: choice(data, 'rating', 'rating', ratings),
    review: field(data, 'review', 'pool story (up to 5,000 characters)', 5000, false, true),
  };
}

// Only this function receives an injectable fetch for isolated tests. Production
// entrypoints always use the real fetch and fixed provider URLs below.
export async function handleSubmission(context, type, fetcher = fetch) {
  const { request, env } = context;
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...responseHeaders, Allow: 'POST' } });
  if (!['contact', 'feedback'].includes(type)) return reply(404, 'Form not found.');
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin !== url.origin) return reply(403, 'Please submit the form from this website.');
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply(415, 'Please submit the form from this website.');

  const recipient = type === 'contact' ? env.CONTACT_TO_EMAIL : env.FEEDBACK_TO_EMAIL;
  const allowedOrigins = (env.FORM_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  if (!allowedOrigins.includes(origin) || !env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY || !emailPattern.test(env.FORM_FROM_EMAIL || '') || !emailPattern.test(recipient || '')) return unavailable();
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  // Public Turnstile dummy secrets must never authorize a public deployment.
  if (!isLocal && /^[123]x0+AA$/.test(env.TURNSTILE_SECRET_KEY)) return unavailable();

  let data;
  try { data = validate(await readBody(request), type); }
  catch (error) {
    if (error instanceof SubmissionError) return reply(error.status, error.message);
    return reply(400, 'We could not read this submission. Please try again.');
  }

  let verification;
  try {
    const result = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: data.token }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!result.ok) return unavailable();
    verification = await result.json();
  } catch { return unavailable(); }
  if (!verification || typeof verification !== 'object' || Array.isArray(verification)) return unavailable();
  if (verification.success !== true || verification.hostname !== url.hostname || verification.action !== type) {
    return reply(400, 'Spam protection could not be verified. Please try the verification again.');
  }

  const details = type === 'contact'
    ? `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nInterest: ${data.interest}\n\n${data.message}`
    : `Name: ${data.name}\nEmail: ${data.email || 'Not provided'}\nLocation: ${data.location}\nPool model: ${poolModels.find(model => model.id === data.model).name}\nRating: ${data.rating}\n\n${data.review}\n\nOwner feedback is private. Obtain permission before publishing.`;
  try {
    const result = await fetcher('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `paradise-${type}-${data.submissionId}` },
      body: JSON.stringify({
        from: `Paradise Pools Website <${env.FORM_FROM_EMAIL}>`, to: [recipient],
        subject: type === 'contact' ? `Website inquiry: ${data.interest}` : 'Website owner feedback',
        text: details, ...(data.email ? { reply_to: data.email } : {}),
      }),
    });
    const response = await result.json();
    if (!result.ok || typeof response.id !== 'string' || !response.id) throw new Error('Provider did not accept message');
    return reply(200, type === 'contact' ? 'Thank you! Your message has been submitted to our team.' : 'Thank you! Your feedback has been submitted privately to our team.');
  } catch {
    // Do not log form contents, tokens, provider bodies, or secrets.
    return reply(502, 'We could not confirm your message was sent. Please try again or call (574) 264-2488.');
  }
}
