const CACHE_NAME = 'treasury-app-cache-v1';

// List of all files and external resources needed for the app to run offline.
const urlsToCache = [
  // App Shell
  '/',
  '/index.html',
  '/manifest.json',

  // Core Scripts
  '/index.tsx',
  '/App.tsx',
  
  // Local Vendor Dependencies
  '/vendor/react.js',
  '/vendor/react-dom.js',
  '/vendor/react-jsx-runtime.js',

  // App Logic
  '/types.ts',
  '/constants.ts',
  '/hooks/useLocalStorage.ts',
  '/context/AuthContext.tsx',

  // Components
  '/components/icons.tsx',
  '/components/LoginComponent.tsx',
  '/components/Dashboard.tsx',
  '/components/Modal.tsx',
  '/components/TransactionsView.tsx',
  '/components/DailyCountView.tsx',
  '/components/UsersView.tsx',
  
  // External Dependencies
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
];

// Install event: cache all the assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache)
          .catch(err => {
            console.error('Failed to cache resources on install:', err);
          });
      })
  );
});

// Fetch event: "stale-while-revalidate" strategy.
// Serve from cache first for speed, then update the cache from the network in the background.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then(networkResponse => {
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      }).catch(err => {
        console.warn(`Fetch failed for ${event.request.url}. Serving from cache if possible.`, err);
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
