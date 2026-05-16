const CACHE_NAME = 'voas-v3';
const ASSETS = [
  './',
  './index.html',
  './dictionaries/en.js',
  './dictionaries/vi.js',
  './manifest.json',
  'icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
