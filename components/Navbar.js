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
    const metricaId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || '109839456'

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
    { href: '/blog', label: 'Блог' }, // Добавлена вкладка Блога
  ]

  return (
    <header className='sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-slate-200 dark:border-neutral-900 text-slate-900 dark:text-slate-100'>
      <div className='max-w-5xl mx-auto px-6 h-16 flex items-center justify-between'>
        {/* Логотип */}
        <Link href='/' className='flex flex-col leading-none select-none'>
          <span className='font-extrabold text-base tracking-wider'>
            SQUASH
          </span>
          <span className='text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-0.5'>
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
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Десктопная кнопка темы (Мгновенное переключение иконки через CSS) */}
          <button
            onClick={toggleTheme}
            className='w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
          >
            <span className='block dark:hidden select-none text-sm'>🌙</span>
            <span className='hidden dark:block select-none text-sm'>☀️</span>
          </button>
        </nav>

        {/* Мобильная зона */}
        <div className='flex items-center gap-2 md:hidden'>
          {/* Мобильная кнопка темы (Мгновенное переключение иконки через CSS) */}
          <button
            onClick={toggleTheme}
            className='w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-amber-400'
          >
            <span className='block dark:hidden select-none text-sm'>🌙</span>
            <span className='hidden dark:block select-none text-sm'>☀️</span>
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
                        : 'text-amber-600 bg-slate-100'
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
