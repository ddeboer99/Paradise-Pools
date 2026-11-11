import { routePaths } from '../data/routes.js';
import { initializeForms } from './forms.js';

// Support bookmarks from Dan's original hash-routed draft, without intercepting
// ordinary section anchors such as #main and #seasonal-pricing-title.
function followLegacyBookmark() {
  const match = location.hash.match(/^#\/([^/]+)\/?$/);
  if (match && routePaths[match[1]]) location.replace(routePaths[match[1]]);
}
followLegacyBookmark();
window.addEventListener('hashchange', followLegacyBookmark);

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-navigation');
function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menu.hidden = !open;
}
toggle.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
const wideScreen = matchMedia('(min-width: 901px)');
wideScreen.addEventListener('change', () => setMenu(false));

document.addEventListener('click', event => {
  const jump = event.target.closest('[data-scroll-to]');
  if (jump) {
    document.getElementById(jump.dataset.scrollTo)?.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start',
    });
  }
  const tab = event.target.closest('[data-option-tab]');
  if (tab) {
    const group = tab.closest('[data-option-group]');
    group.querySelectorAll('[data-option-tab]').forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.getElementById(button.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  const thumb = event.target.closest('[data-option-thumb]');
  if (thumb) {
    const panel = thumb.closest('.option-panel');
    const image = panel.querySelector('.option-main');
    image.src = thumb.dataset.src;
    image.alt = thumb.dataset.alt;
    panel.querySelectorAll('[data-option-thumb]').forEach(button => {
      button.classList.toggle('is-active', button === thumb);
      button.setAttribute('aria-pressed', String(button === thumb));
    });
  }
});
document.addEventListener('keydown', event => {
  if (!event.target.matches('[data-option-tab]')) return;
  const tabs = [...event.target.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
  const current = tabs.indexOf(event.target);
  const indexes = { ArrowRight: (current + 1) % tabs.length, ArrowLeft: (current - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
  if (!(event.key in indexes)) return;
  event.preventDefault();
  const next = tabs[indexes[event.key]];
  next.click();
  next.focus();
});

initializeForms(document.querySelector('#main'));
if (document.body.dataset.route === 'new-pools') {
  import('./pool-catalog.js').then(({ initializeCatalog }) => initializeCatalog(document.querySelector('#main')));
}
