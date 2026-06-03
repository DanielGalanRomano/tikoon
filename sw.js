const CACHE_NAME = 'matear-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('[SW] Error en cache:', err))
  );
  self.skipWaiting();
});

// Activación - limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Network First con fallback a cache
self.addEventListener('fetch', event => {
  // Ignorar peticiones a Google Sheets API
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar la respuesta para cachearla
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        // Fallback a cache cuando no hay conexión
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // Si es una petición de página, devolver el index.html cacheado
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Contenido no disponible offline', {
              status: 404,
              statusText: 'Not Found'
            });
          });
      })
  );
});

// Sincronización en segundo plano para solicitudes pendientes
self.addEventListener('sync', event => {
  if (event.tag === 'sync-mateadas') {
    event.waitUntil(syncMateadas());
  }
});

async function syncMateadas() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.match('pending-requests');
  if (requests) {
    // Procesar solicitudes pendientes
    console.log('[SW] Sincronizando solicitudes pendientes');
  }
}
