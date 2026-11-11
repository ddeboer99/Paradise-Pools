import { inquiryTopics, retailLocations, ratings } from '../data/form-options.js';

const options = values => values.map(value => `<option>${value}</option>`).join('');
function protection(type) {
  return `<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
    <div class="form-verification" data-form-verification></div>
    <p class="form-availability" data-form-availability>Online submissions are being prepared. You can call <a href="tel:+15742642488">(574) 264-2488</a> or <a href="mailto:service@thinkparadisepools.com">email our team</a>.</p>
    <noscript><p>Please enable JavaScript to submit this form, or contact our team by phone or email.</p></noscript>
    <button class="button button-coral" type="submit" disabled>${type === 'contact' ? 'Send message' : 'Send pool feedback'} <span aria-hidden="true">&#8594;</span></button>
    <p class="${type === 'contact' ? 'form-status' : 'review-status'}" data-form-status role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p>`;
}
export function quoteForm(compact = false) {
  return `<form id="contact-inquiry" class="inquiry-form${compact ? ' compact-form' : ''}" data-inquiry-form data-submission-form="contact" action="/api/contact" method="post">
    <div class="form-intro"><p class="eyebrow">A good place to start</p><h2>${compact ? 'What can we help with?' : 'Send us a note.'}</h2><p>Share a few details so our team can follow up with you.</p></div>
    <div class="form-fields">
      <label>Your name <span>*</span><input name="name" autocomplete="name" maxlength="100" required></label>
      <label>Email address <span>*</span><input name="email" type="email" autocomplete="email" maxlength="254" required></label>
      <label>Phone number <span>*</span><input name="phone" type="tel" autocomplete="tel" maxlength="40" required></label>
      <label>I'm interested in <span>*</span><select name="interest" required><option value="" disabled selected>Choose a topic</option>${options(inquiryTopics)}</select></label>
      <label class="form-wide">How can we help? <span>*</span><textarea name="message" rows="4" maxlength="5000" required placeholder="A little about your pool or project..."></textarea></label>
      <p class="form-privacy">Your message will be emailed to the Paradise Pools service team so we can respond to your inquiry. <a href="/privacy-policy/">Read our privacy policy</a>.</p>
      ${protection('contact')}
    </div>
  </form>`;
}
export function poolReviewSection(models) {
  return `<section class="section pool-review-section">
    <div class="pool-review-heading"><p class="eyebrow">Paradise Pools owners</p><h2>How does your pool fit your life?</h2><p>Share your pool model and experience with our team. We read every note.</p></div>
    <form class="pool-review-form" data-pool-review-form data-submission-form="feedback" action="/api/feedback" method="post">
      <label>Your name<input name="name" autocomplete="name" maxlength="100" required></label>
      <label>Email address (optional)<input name="email" type="email" autocomplete="email" maxlength="254"></label>
      <label>Retail location<select name="location" required><option value="" disabled selected>Choose a location</option>${options(retailLocations)}</select></label>
      <label>Pool model<select name="model" required><option value="" disabled selected>Choose a model</option>${models.map(model => `<option value="${model.id}">${model.name}</option>`).join('')}</select></label>
      <label>Your rating<select name="rating" required><option value="" disabled selected>Choose a rating</option>${options(ratings)}</select></label>
      <label class="review-wide">Your pool story<textarea name="review" rows="4" maxlength="5000" required placeholder="What do you enjoy about your pool?"></textarea></label>
      <p class="review-consent">Your feedback goes privately to the Paradise Pools service team. We will ask permission before sharing it publicly. <a href="/privacy-policy/">Read our privacy policy</a>.</p>
      ${protection('feedback')}
      <div class="review-public-links"><a href="https://www.google.com/maps/search/?api=1&query=Paradise+Pools+Elkhart+Indiana" target="_blank" rel="noreferrer">Elkhart customer reviews <span aria-hidden="true">&#8599;</span></a><a href="https://www.google.com/maps/search/?api=1&query=Paradise+Pools+Granger+Indiana" target="_blank" rel="noreferrer">Granger customer reviews <span aria-hidden="true">&#8599;</span></a></div>
    </form>
  </section>`;
}
