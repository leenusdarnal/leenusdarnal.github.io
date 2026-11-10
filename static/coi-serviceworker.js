/*
 * GitHub Pages cannot configure response headers directly. This same-origin
 * navigation shim adds the two headers needed for cross-origin isolation.
 *
 * credentialless keeps no-CORS cross-origin resources (for example the
 * Metronome screenshot) loadable without sending cookies. CORS-mode requests
 * such as the GitHub API still rely on the remote server's CORS permission.
 * Only document navigations are rewritten; assets and API responses pass
 * through untouched. HTML is deliberately not cached.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const response = await fetch(request);
    if (response.type === 'opaque' || response.status === 0) return response;

    const headers = new Headers(response.headers);
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Embedder-Policy', 'credentialless');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  })().catch(() => Response.error()));
});
