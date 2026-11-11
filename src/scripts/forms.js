let turnstileReady;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstileReady) turnstileReady = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('Verification timed out')), 15_000);
    window.paradiseTurnstileReady = () => { window.clearTimeout(timeout); resolve(window.turnstile); };
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=paradiseTurnstileReady';
    script.async = true;
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error('Verification could not load')); };
    document.head.append(script);
  });
  return turnstileReady;
}

export function initializeForms(root) {
  const siteKey = document.body.dataset.turnstileSiteKey;
  root.querySelectorAll('[data-submission-form]').forEach(async form => {
    const type = form.dataset.submissionForm;
    // Related service pages can select an existing topic, never arbitrary text.
    // Keep any value the visitor has already entered or the browser restored.
    const topic = new URLSearchParams(window.location.search).get('topic');
    const interest = form.querySelector('select[name="interest"]');
    if (type === 'contact' && interest && !interest.value && [...interest.options].some(option => option.value === topic)) {
      interest.value = topic;
    }
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-form-status]');
    const availability = form.querySelector('[data-form-availability]');
    const buttonLabel = button.textContent;
    let token = '';
    let submissionId;
    let busy = false;
    let widget;
    let turnstile;
    function message(text, state = '') {
      status.textContent = text;
      status.dataset.state = state;
    }
    // Keep the same id when retrying an uncertain network result. Edited input
    // gets a new id so Resend cannot mistake a new message for the old one.
    for (const eventName of ['input', 'change']) form.addEventListener(eventName, event => {
      if (event.target.name !== 'cf-turnstile-response') submissionId = undefined;
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      if (!token) { message('Please complete the spam-protection verification.', 'error'); return; }
      const data = Object.fromEntries(new FormData(form));
      delete data['cf-turnstile-response'];
      submissionId ||= crypto.randomUUID();
      data.token = token;
      data.submissionId = submissionId;
      busy = true;
      form.setAttribute('aria-busy', 'true');
      const controls = [...form.querySelectorAll('input:not([name="cf-turnstile-response"]), select, textarea')];
      controls.forEach(control => { control.disabled = true; });
      button.disabled = true;
      button.textContent = 'Sending…';
      message('Sending your message…');
      try {
        const response = await fetch(form.action, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data), signal: AbortSignal.timeout(30_000),
        });
        const result = await response.json();
        if (response.ok && result.ok === true) {
          form.reset();
          submissionId = undefined;
          message(result.message, 'success');
        } else {
          message(result.message || 'We could not confirm your message was sent. Please try again or call (574) 264-2488.', 'error');
        }
      } catch {
        message('We could not confirm your message was sent. Your details are still here. Please try again or call (574) 264-2488.', 'error');
      } finally {
        busy = false;
        token = '';
        form.removeAttribute('aria-busy');
        controls.forEach(control => { control.disabled = false; });
        button.textContent = buttonLabel;
        button.disabled = true;
        status.focus({ preventScroll: true });
        if (widget !== undefined) turnstile.reset(widget);
      }
    });
    if (!siteKey) return;
    availability.textContent = 'Loading spam protection…';
    try {
      turnstile = await loadTurnstile();
      widget = turnstile.render(form.querySelector('[data-form-verification]'), {
        // Compact remains within the form column on small phones, including
        // after resizing a page that initially loaded on a wide screen.
        sitekey: siteKey, action: type, theme: 'light', size: 'compact',
        callback: value => { token = value; button.disabled = busy; availability.hidden = true; },
        'expired-callback': () => {
          token = '';
          button.disabled = true;
          if (!busy && status.dataset.state !== 'success') message('Verification expired. Please verify again before sending.', 'error');
        },
        'error-callback': () => {
          token = '';
          button.disabled = true;
          availability.hidden = false;
          availability.textContent = 'Spam protection is unavailable. Please refresh the page or call (574) 264-2488.';
        },
      });
    } catch {
      availability.textContent = 'Spam protection could not load. Please refresh the page or call (574) 264-2488.';
    }
  });
}
