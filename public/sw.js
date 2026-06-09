const CACHE_NAME = 'squash-rules-cache-v1'
const ASSETS_TO_CACHE = ['/', '/manifest.json', '/icon.svg']

// Установка: кэшируем базовые файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
  self.skipWaiting()
})

// Активация: очищаем старый кэш, если обновилась версия
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Обработка запросов: отдаем кэш, но параллельно обновляем его из сети (Stale-While-Revalidate)
// Безопасный перехват запросов (пропускает расширения браузера)
self.addEventListener('fetch', (event) => {
  // Игнорируем любые запросы, кроме стандартных http и https (решает баг с расширениями)
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, networkResponse))
            }
          })
          .catch(() => {})

        return cachedResponse
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone()
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone))
        }
        return networkResponse
      })
    }),
  )
})
