'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null) // Добавлен дефолтный null для предотвращения ворнингов линтера

export function ThemeProvider({ children }) {
  // Инициализируем из класса, который выставил инлайн-скрипт в <head>.
  // Так состояние React сразу совпадает с реальной темой — без мелькания (FOUC).
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === 'undefined') return true
    return document.documentElement.classList.contains('dark')
  })

  // Поддержка системного переключателя темы: если пользователь меняет ОС-тему,
  // но ещё не выбирал вручную (нет записи в localStorage) — синхронизируемся.
  useEffect(() => {
    let savedTheme = null
    try {
      savedTheme = localStorage.getItem('theme')
    } catch (e) {
      // Доступ к localStorage заблокирован браузером — оставляем текущую тему
      return
    }
    if (savedTheme) return // тема уже зафиксирована выбором пользователя

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const dark = media.matches
      setIsDarkMode(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => {
    const nextTheme = !isDarkMode
    setIsDarkMode(nextTheme)

    try {
      localStorage.setItem('theme', nextTheme ? 'dark' : 'light')
    } catch (e) {
      console.warn('Не удалось сохранить тему в localStorage')
    }

    if (nextTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div
        className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
          isDarkMode
            ? 'bg-neutral-950 text-slate-100'
            : 'bg-slate-50 text-slate-900'
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
