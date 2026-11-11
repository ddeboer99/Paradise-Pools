import websiteTerms from '../data/website-terms.json' with { type: 'json' };

// Local review draft. Confirm business practices, final providers and effective
// date with Dan before publishing; this is not a legal-compliance certification.
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const sections = [
  ['information', 'Information we collect'],
  ['use', 'How we use information'],
  ['providers', 'Services that help us'],
  ['browser-services', 'Cookies, fonts & analytics'],
  ['retention', 'Keeping your information'],
  ['choices', 'Your choices'],
  ['security', 'Security'],
  ['external-links', 'Other websites'],
  ['privacy-contact', 'Contact us'],
  ['website-terms', 'Website terms'],
];

export function privacyPage() {
  return `<header class="policy-heading">
    <p class="eyebrow">Paradise Pools</p><h1>Privacy Policy</h1>
    <p class="policy-intro">How we handle information you share with us, the services that help this website work, and the choices available to you.</p>
    <p class="policy-draft"><strong>Draft for review · November 11, 2026</strong><span>This draft describes the planned website setup. It has not replaced the privacy policy on our current live website.</span></p>
  </header>
  <div class="policy-layout">
    <nav class="policy-nav" aria-label="Privacy policy sections"><p class="eyebrow">On this page</p>${sections.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>
    <article class="policy-content" aria-label="Privacy policy and website terms">
      <section id="information"><h2>Information we collect</h2>
        <p>We collect information you choose to share through our forms, email, phone calls or other direct contact.</p>
        <ul><li><strong>Contact and service inquiries:</strong> your name, email address, phone number, selected topic and message. You may also provide your pool address, cover details, preferred service dates or other information relevant to your request.</li><li><strong>Pool owner feedback:</strong> your name, optional email address, selected retail location, pool model, rating and pool story.</li><li><strong>Technical information:</strong> our hosting and security providers may process your IP address, browser information, requested pages and security signals to deliver the website and help prevent abuse.</li></ul>
      </section>
      <section id="use"><h2>How we use information</h2>
        <p>We use your information to respond to questions, discuss requested products or services, follow up about your pool and review feedback. We do not sell or rent the personal information you provide.</p>
        <p>Pool owner feedback is sent privately to our service team. We will ask permission before sharing it publicly. Sending an inquiry does not automatically add you to a mailing list through this website.</p>
        <p>We may contact you about specials, new products or services, or policy changes. You may ask us to stop marketing emails at any time.</p>
      </section>
      <section id="providers"><h2>Services that help us</h2>
        <p>We use service providers to operate the website, protect forms and deliver messages. Information may be processed by these providers as needed to support those functions and respond to your request.</p>
        <ul><li><strong>Cloudflare Pages and Pages Functions</strong> host the website and process form requests. <strong>Cloudflare Turnstile</strong> checks browser and network signals to help distinguish visitors from automated abuse. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare's Privacy Policy</a> and its <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer">Turnstile Privacy Addendum</a>.</li><li><strong>Resend</strong> delivers form submissions as email to our service inbox. It processes the message contents, email addresses and delivery information needed for that service. See <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend's Privacy Policy</a>.</li><li><strong>Business email services</strong> receive and store the messages delivered to our team. Any configured mailbox forwarding also routes a copy through the receiving email service.</li></ul>
        <p>These providers may process information in countries other than the one where you are located. Their processing and storage are also subject to their terms and privacy practices.</p>
      </section>
      <section id="browser-services"><h2>Cookies, fonts &amp; analytics</h2>
        <p>Security services may use cookies or similar browser technologies depending on their configuration. You can manage cookies in your browser settings, although restricting them may affect some security features or form functionality.</p>
        <p>The website loads its typefaces through Google Fonts. This connects your browser to Google to request font files and exposes technical request information, including your IP address. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</p>
        <p>Advertising pixels and visitor analytics tools have not been added to this version of the website. If that changes, we will review the information collected, any applicable choices and this policy before enabling them.</p>
      </section>
      <section id="retention"><h2>Keeping your information</h2>
        <p>Form submissions are delivered to our business email rather than a public posting. Messages and related correspondence may be kept with customer or service records.</p>
        <p>Our proposed approach is to keep information for as long as needed to respond, provide requested services, maintain appropriate business records and meet applicable recordkeeping requirements. Email copies, delivery logs and backups may follow the relevant providers' retention settings. Contact us if you have a question about a particular message or record.</p>
      </section>
      <section id="choices"><h2>Your choices</h2>
        <p>You can call us instead of using an online form. You can also contact us to ask what personal information we hold about you, request a correction or deletion, stop marketing emails, or raise a concern about its use.</p>
        <p>We may need to verify a request and consider applicable recordkeeping requirements before making a change. Tell us which information or communication your request concerns so we can help.</p>
      </section>
      <section id="security"><h2>Security</h2>
        <p>The planned public website uses HTTPS to protect information traveling between your browser and the website, along with form validation and spam protection. No internet transmission or storage system can be guaranteed completely secure.</p>
        <p>Our inquiry and feedback forms are not intended for payment-card details, passwords or other highly sensitive information. Please include only what is needed to discuss your pool or request.</p>
      </section>
      <section id="external-links"><h2>Other websites</h2>
        <p>Links to maps, videos, social media and manufacturers take you to other services. Their content and privacy practices are their responsibility. Review their policies when you choose to visit them.</p>
      </section>
      <section id="privacy-contact"><h2>Contact us about privacy</h2>
        <p>For a question or request about your information, contact Paradise Pools:</p>
        <address>655 County Road 17, Suite 11<br>Elkhart, IN 46516<br><a href="tel:+15742642488">(574) 264-2488</a><br><a href="mailto:service@thinkparadisepools.com">service@thinkparadisepools.com</a></address>
        <p>You can also use our <a href="/contact/">contact page</a> or find <a href="/locations/">both retail locations</a>. Learn more <a href="/about-us/">about Paradise Pools</a>.</p>
      </section>
      <section id="website-terms"><h2>Website Terms and Conditions</h2>
        ${websiteTerms.blocks.map(block => `<${block.tag}>${escapeHtml(block.text)}</${block.tag}>`).join('\n')}
      </section>
    </article>
  </div>`;
}
