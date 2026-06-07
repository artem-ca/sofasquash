'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = !isDarkMode
    setIsDarkMode(nextTheme)
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
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
