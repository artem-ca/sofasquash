'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Реальный цвет страницы задаёт блокирующий скрипт в layout.js — он ставит
  // класс .dark на <html> до первого пейнта, а все стили завязаны на нативные
  // Tailwind dark: варианты. Поэтому здесь React-стейт нужен только для двух
  // вещей: хранить текущее значение (читают 5 компонентов) и переключать.
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Синхронизируем стейт с классом, который уже выставил блокирующий скрипт.
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const nextTheme = !isDarkMode
    setIsDarkMode(nextTheme)

    try {
      localStorage.setItem('theme', nextTheme ? 'dark' : 'light')
    } catch (e) {
      console.warn('Не удалось сохранить тему в localStorage')
    }

    document.documentElement.classList.toggle('dark', nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {/* transition-colors держим статично: фон завязан на класс .dark,
          а не на isDarkMode, поэтому первичная отрисовка не вспыхнет. */}
      <div className='min-h-screen overflow-x-hidden transition-colors duration-300 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
