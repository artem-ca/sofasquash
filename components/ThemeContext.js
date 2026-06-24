'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Безопасная инициализация темы — синхронизируем React-состояние с уже установленным классом
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
    setIsMounted(true) // Монтирование завершено — теперь переключения будут плавными
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
        className={`min-h-screen overflow-x-hidden ${
          isMounted ? 'transition-colors duration-300' : ''
        } bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
