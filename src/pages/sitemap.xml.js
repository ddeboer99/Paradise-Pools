import { routePaths } from '../data/routes.js';
export function GET({ site }) {
  const urls = Object.values(routePaths).map(path => `<url><loc>${new URL(path, site)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
