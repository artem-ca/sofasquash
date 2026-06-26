'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('PWA Service Worker зарегистрирован!'))
        .catch((err) =>
          console.error('Ошибка регистрации Service Worker:', err),
        )
    }
  }, [])

  return null
}
