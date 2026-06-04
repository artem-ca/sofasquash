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
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Запрос в сеть в фоновом режиме для обновления кэша
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, networkResponse))
            }
          })
          .catch(() => {
            /* Игнорируем сетевые ошибки в офлайне */
          })

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
