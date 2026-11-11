export function GET({ site }) {
  // Allow crawling so a preview's noindex directive can be seen. No preview sitemap.
  const sitemap = import.meta.env.PUBLIC_SITE_INDEXABLE === 'true'
    ? `Sitemap: ${new URL('sitemap.xml', site)}\n` : '';
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
