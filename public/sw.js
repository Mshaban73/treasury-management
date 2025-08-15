const CACHE_NAME = 'treasury-app-cache-v1';

// هنحدد الملفات الأساسية اللي لازم تتحفظ في الكاش
const urlsToCache = [
  '/',                        // الصفحة الرئيسية
  '/index.html',              // الملف الرئيسي
  '/manifest.json',           // الـ manifest (لو موجود في public)

  // الملفات اللي اتولدت بعد build
  '/assets/index-oBL6UVLs.js',
  '/assets/manifest-CKlQnITO.json',
];

// Install event: caching core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache and caching assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: serve from cache first, then update
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => cachedResponse); // لو مفيش نت رجّع الكاش

      return cachedResponse || fetchPromise;
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
