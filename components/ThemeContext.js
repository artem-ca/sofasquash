'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null) // Добавлен дефолтный null для предотвращения ворнингов линтера

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Безопасная инициализация темы
  useEffect(() => {
    let dark = true
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        dark = savedTheme === 'dark'
      } else {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    } catch (e) {
      console.warn('Доступ к localStorage заблокирован браузером')
    }

    setIsDarkMode(dark)
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
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
