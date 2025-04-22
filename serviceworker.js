// Service Worker for DJ On Top GitHub Repositories
const CACHE_NAME = 'djontop-repo-cache-v1.0.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/animations.js',
  '/images/favicon.svg',
  '/images/og-image.jpg',
  '/images/profile-placeholder.jpg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  // Take control of all clients as soon as activated
  self.clients.claim();
  
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

// Fetch event - network first, then cache strategy for better updates
self.addEventListener('fetch', event => {
  // Skip cross-origin requests like GitHub API
  if (event.request.url.startsWith('https://api.github.com')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(event.request)
      .then(response => {
        // If we got a valid response, clone it and update the cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If we don't have it in cache and network failed, 
            // and it's a navigation request (HTML), return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // Otherwise just return a simple response
            return new Response('Network error occurred', {
              status: 408,
              headers: {'Content-Type': 'text/plain'}
            });
          });
      })
  );
}); 