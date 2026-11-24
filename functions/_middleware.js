// Static _headers rules do not apply to Pages Functions responses.
// Cover the homepage, its legacy redirects, and APIs on every Pages preview.
export async function onRequest(context) {
  const response = await context.next();
  if (!new URL(context.request.url).hostname.endsWith('.pages.dev')) return response;

  const previewResponse = new Response(response.body, response);
  previewResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return previewResponse;
}
