import { legacyShortlinks } from '../src/data/legacy-shortlinks.js';

// Pages _redirects cannot match query parameters. Invoke this only at the
// homepage, alongside the existing /api/* routes; other pages stay static.
export function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  if (url.pathname !== '/' || !['GET', 'HEAD'].includes(request.method)) return context.next();

  const ids = url.searchParams.getAll('p');
  // An ambiguous, unknown or unresolved ID must not send visitors to a
  // guessed page. Leave it to the normal asset handler until reviewed.
  if (ids.length !== 1 || !Object.hasOwn(legacyShortlinks, ids[0])) return context.next();

  url.pathname = legacyShortlinks[ids[0]];
  url.searchParams.delete('p');
  // Relative destinations stay on the preview/production host. The request
  // cannot supply a redirect host or path; retain other query parameters.
  return new Response(null, {
    status: 301,
    headers: { Location: `${url.pathname}${url.search}` },
  });
}
