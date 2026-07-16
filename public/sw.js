const CACHE_NAME = 'squash-portal-v5'
const OFFLINE_URL = '/offline'
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
  '/search-index.json',
  OFFLINE_URL,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Кешируем каждый ресурс отдельно: единичный 404 не должен срывать
      // всю установку (иначе офлайн-кеш не создастся вовсе).
      Promise.allSettled(SHELL_ASSETS.map((asset) => cache.add(asset))),
    ),
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

  // Только свой origin: сторонние запросы (Яндекс.Метрика, шрифты) идут мимо
  // кеша напрямую в сеть — иначе кеш бесконтрольно растёт чужими ответами.
  if (new URL(event.request.url).origin !== self.location.origin) return

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
        // ignoreVary: сервер отдаёт `Vary: Accept-Encoding`, а браузер при
        // навигации шлёт другой набор кодировок — без этого офлайн-фолбэк
        // из кеша не находит страницу. Если и в кеше пусто (страницу ни разу
        // не открывали онлайн), показываем статичный /offline вместо ошибки
        // браузера.
        .catch(() =>
          caches
            .match(event.request, { ignoreVary: true })
            .then((cached) => cached || caches.match(OFFLINE_URL)),
        ),
    )
    return
  }

  // Статика: stale-while-revalidate
  event.respondWith(
    caches.match(event.request, { ignoreVary: true }).then((cachedResponse) => {
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
