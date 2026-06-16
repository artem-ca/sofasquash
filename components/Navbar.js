'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Отслеживаем смену адреса в Next.js и вручную отправляем событие просмотра в Метрику
  useEffect(() => {
    // Вставьте ваш реальный ID счетчика вместо 98765432:
    const metricaId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || '98765432'

    if (
      metricaId !== '0' &&
      typeof window !== 'undefined' &&
      typeof window.ym === 'function'
    ) {
      window.ym(parseInt(metricaId, 10), 'hit', pathname)
    }
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/racquets', label: 'Ракетки' },
    { href: '/tactics', label: 'Тактика' },
    { href: '/glossary', label: 'Глоссарий' },
    { href: '/rules', label: 'Правила' },
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
        <Link href='/' className='flex flex-col leading-none select-none'>
          <span className='font-extrabold text-base tracking-wider'>
            {/* SOFA RULES */}
            SQUASH
          </span>
          <span className='text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-0.5'>
            {/* Squash Portal 2026 */}
            portal
          </span>
        </Link>

        {/* Десктопное меню */}
        <nav className='hidden md:flex items-center gap-6'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                  isActive
                    ? isDarkMode
                      ? 'text-amber-400'
                      : 'text-amber-600' // Светится золотом, если активна
                    : isDarkMode
                      ? 'text-slate-400 hover:text-amber-400'
                      : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Кнопка темы */}
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

        {/* Мобильная зона */}
        <div className='flex items-center gap-2 md:hidden'>
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'text-amber-400 bg-neutral-900/50'
                        : 'text-amber-600 bg-slate-100' // Светится золотом и выделяет фон
                      : isDarkMode
                        ? 'text-slate-300 hover:bg-neutral-900 hover:text-amber-400'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-amber-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
