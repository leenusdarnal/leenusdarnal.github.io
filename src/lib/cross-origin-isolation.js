const STATE_EVENT = 'coi-service-worker-statechange';

/**
 * Register the GitHub Pages response-header shim.
 * The current document is not retroactively isolated: after the worker takes
 * control, the runtime inspector offers a deliberate reload to apply headers.
 */
export function registerCrossOriginIsolation() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    window.dispatchEvent(new Event(STATE_EVENT));
    return;
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.dispatchEvent(new Event(STATE_EVENT));
  });

  navigator.serviceWorker.register('/coi-serviceworker.js', {
    scope: '/',
    updateViaCache: 'none'
  }).then(() => {
    window.dispatchEvent(new Event(STATE_EVENT));
  }).catch((error) => {
    console.warn('Cross-origin isolation service worker could not be registered.', error);
    window.dispatchEvent(new Event(STATE_EVENT));
  });
}
