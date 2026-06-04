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

-----
// ── Cebate Uno Service Worker ──
const CACHE_NAME = 'cebate-uno-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

// ── INSTALL ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// ── ACTIVATE ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH (cache-first para estáticos, network-first para el API) ──
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // No cachear el Apps Script
  if (url.hostname === 'script.google.com') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

// ── PUSH (Web Push del servidor) ──
self.addEventListener('push', (event) => {
  let data = { titulo: 'Cebate Uno 🧉', cuerpo: 'Tenés una novedad', tipo: 'sistema', mateadaId: null };

  if (event.data) {
    try { data = { ...data, ...event.data.json() }; }
    catch (e) { data.cuerpo = event.data.text() || data.cuerpo; }
  }

  const options = {
    body: data.cuerpo,
    icon: './icons/icon-152.png',
    badge: './icons/icon-72.png',
    tag: `cebate-${data.tipo}-${Date.now()}`,
    renotify: true,
    data: { mateadaId: data.mateadaId, tipo: data.tipo },
    actions: data.mateadaId
      ? [{ action: 'ver', title: 'Ver mateada' }, { action: 'cerrar', title: 'Cerrar' }]
      : [{ action: 'cerrar', title: 'Cerrar' }],
  };

  event.waitUntil(
    self.registration.showNotification(data.titulo, options).then(() => {
      // Notificar a los clientes abiertos para que actualicen el badge
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            tipo: 'nueva-notificacion',
            titulo: data.titulo,
            cuerpo: data.cuerpo,
            tipoNotif: data.tipo,
            mateadaId: data.mateadaId,
          });
        });
      });
    })
  );
});

// ── NOTIFICATION CLICK ──
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const mateadaId = event.notification.data?.mateadaId;

  if (event.action === 'cerrar') return;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Si la app ya está abierta, enfocarla y mandar el ID
      const existente = clients.find((c) => c.url.includes('index.html') || c.url.endsWith('/'));
      if (existente) {
        existente.focus();
        if (mateadaId) existente.postMessage({ tipo: 'abrir-mateada', mateadaId });
        return;
      }
      // Si no está abierta, abrirla
      const url = mateadaId ? `./?mateada=${mateadaId}` : './';
      return self.clients.openWindow(url);
    })
  );
});
