const CACHE_NAME = 'squash-portal-v2'
const SHELL_ASSETS = [
  '/',
  '/encyclopedia',
  '/racquets',
  '/players',
  '/tactics',
  '/glossary',
  '/rules',
  '/blog',
  '/manifest.json',
  '/icon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache)
          }
        }),
      ),
    ),
  )
  self.clients.claim()
})

function isHtmlNavigation(request) {
  if (request.mode === 'navigate') return true
  const accept = request.headers.get('accept') || ''
  return accept.includes('text/html')
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith('http')) return

  // HTML: network-first — после деплоя пользователи быстрее получают свежий контент
  if (isHtmlNavigation(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone))
          }
          return networkResponse
        })
        .catch(() => caches.match(event.request)),
    )
    return
  }

  // Статика: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone))
          }
          return networkResponse
        })
        .catch(() => null)

      return cachedResponse || networkFetch
    }),
  )
})
