'use client'

import { useState } from 'react'
import { useTheme } from './ThemeContext'

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/rules', label: 'Правила' },
    { href: '/racquets', label: 'Энциклопедия' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-md ${
        isDarkMode
          ? 'bg-neutral-950/80 border-neutral-900 text-slate-100'
          : 'bg-white/80 border-slate-200 text-slate-900'
      }`}
    >
      <div className='max-w-5xl mx-auto px-6 h-16 flex items-center justify-between'>
        {/* Логотип */}
        <a href='/' className='flex flex-col leading-none select-none'>
          <span className='font-extrabold text-base tracking-wider'>
            SOFA RULES
          </span>
          <span className='text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-0.5'>
            Squash Portal 2026
          </span>
        </a>

        {/* Десктопное меню */}
        <nav className='hidden md:flex items-center gap-6'>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                isDarkMode
                  ? 'text-slate-400 hover:text-amber-400'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Кнопка смены темы (Десктоп) */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
              isDarkMode
                ? 'bg-neutral-900 border-neutral-800 text-amber-400 hover:bg-neutral-850'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </nav>

        {/* Мобильная зона управления */}
        <div className='flex items-center gap-2 md:hidden'>
          {/* Кнопка смены темы (Мобилка) */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer ${
              isDarkMode
                ? 'bg-neutral-900 border-neutral-800 text-amber-400'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Кнопка бургер-меню */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              isDarkMode
                ? 'bg-neutral-900 text-slate-200'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            <span className='text-lg'>{isMobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      {isMobileOpen && (
        <div
          className={`md:hidden border-t animate-fade-in ${
            isDarkMode
              ? 'bg-neutral-950 border-neutral-900'
              : 'bg-white border-slate-200'
          }`}
        >
          <nav className='flex flex-col p-4 gap-2'>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isDarkMode
                    ? 'text-slate-300 hover:bg-neutral-900 hover:text-amber-400'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-amber-600'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
