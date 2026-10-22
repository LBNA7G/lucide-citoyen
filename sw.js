// SAVRÉO v0.8.1 — cache fiable : préférence au réseau, repli hors ligne.
const CACHE = 'savreo-assets-v081-20261022';
const ASSETS = ['./','./index.html','./styles.css?v=81','./app.js?v=81','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE && (key.startsWith('lucide-') || key.startsWith('savreo-'))).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin || new URL(req.url).pathname.startsWith('/api/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(req);
      if (response.ok && response.type === 'basic') await cache.put(req, response.clone());
      return response;
    } catch (error) {
      const stored = await cache.match(req);
      if (stored) return stored;
      if (req.mode === 'navigate') {
        const home = await cache.match('./index.html');
        if (home) return home;
      }
      throw error;
    }
  })());
});