// SAVRÉO v1.6 bêta — cache fiable : préférence au réseau, repli hors ligne.
const CACHE = 'savreo-assets-v163-20261022';
const ASSETS = ['./','./index.html','./styles.css?v=163','./curriculum-beta.js?v=163','./civic-pack-01.js?v=163','./party-directory-01.js?v=163','./essentials-pack-02.js?v=163','./world-pack-03.js?v=163','./life-pack-04.js?v=163','./public-pack-05.js?v=163','./app.js?v=163','./icon.svg','./manifest.webmanifest'];
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