'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Разделы энциклопедии — вынесены в выпадающее меню «Энциклопедия»
const encyclopediaLinks = [
  {
    href: '/racquets',
    label: 'Ракетки',
    desc: 'Энциклопедия 250+ моделей: параметры, фильтры и сравнение',
  },
  {
    href: '/players',
    label: 'Игроки',
    desc: 'База игроков PSA World Tour, легенд и любителей',
  },
  {
    href: '/glossary',
    label: 'Глоссарий',
    desc: 'Термины, сленг и названия ударов с советами тренера',
  },
  {
    href: '/rules',
    label: 'Правила',
    desc: 'Официальные правила сквоша по 14 главам',
  },
]

// Верхнеуровневые ссылки навбара (без разделов энциклопедии)
const primaryLinks = [
  { href: '/', label: 'Главная' },
  { href: '/tactics', label: 'Тактика' },
  { href: '/blog', label: 'Блог' },
]

const encyclopediaHrefs = encyclopediaLinks.map((l) => l.href)

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

  const isEncyclopediaActive =
    pathname === '/encyclopedia' ||
    encyclopediaHrefs.some(
      (href) => pathname === href || pathname.startsWith(`${href}/`),
    )

  const desktopLinkClass = (isActive) =>
    `text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
      isActive
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
    }`

  const mobileLinkClass = (isActive) =>
    `px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? isDarkMode
          ? 'text-amber-400 bg-neutral-900/50'
          : 'text-amber-600 bg-slate-100'
        : isDarkMode
          ? 'text-slate-300 hover:bg-neutral-900 hover:text-amber-400'
          : 'text-slate-700 hover:bg-slate-50 hover:text-amber-600'
    }`

  return (
    <header className='sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-slate-200 dark:border-neutral-900 text-slate-900 dark:text-slate-100'>
      <div className='max-w-5xl mx-auto px-6 h-16 flex items-center justify-between'>
        {/* Логотип */}
        <Link href='/' className='flex flex-col leading-none select-none'>
          <span className='font-extrabold text-base tracking-wider'>
            SQUASH
          </span>
          <span className='text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest mt-0.5'>
            portal
          </span>
        </Link>

        {/* Десктопное меню */}
        <nav className='hidden md:flex items-center gap-6'>
          {/* Главная */}
          <Link href='/' className={desktopLinkClass(pathname === '/')}>
            Главная
          </Link>

          {/* Тактика и Блог */}
          {primaryLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={desktopLinkClass(pathname === link.href)}
              >
                {link.label}
              </Link>
            ))}

          {/* Энциклопедия — выпадающее меню */}
          <div className='relative group'>
            <Link
              href='/encyclopedia'
              className={`${desktopLinkClass(isEncyclopediaActive)} inline-flex items-center gap-1`}
            >
              Энциклопедия
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                className='w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m19.5 8.25-7.5 7.5-7.5-7.5'
                />
              </svg>
            </Link>

            {/* Панель дропдауна (появляется по наведению) */}
            <div className='absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200'>
              <div className='w-72 p-2 rounded-2xl border shadow-xl bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'>
                {encyclopediaLinks.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-500/10'
                          : 'hover:bg-slate-50 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <div
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isActive
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {item.label}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

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
          <button
            onClick={toggleTheme}
            className='w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-amber-400'
          >
            <span className='block dark:hidden select-none text-sm'>🌙</span>
            <span className='hidden dark:block select-none text-sm'>☀️</span>
          </button>
          {/* Кнопка-бургер  */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className='w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-slate-200'
          >
            <span className='text-lg'>{isMobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      {isMobileOpen && (
        <div className='md:hidden border-t animate-fade-in bg-white dark:bg-neutral-950 border-slate-200 dark:border-neutral-900'>
          <nav className='flex flex-col p-4 gap-2'>
            {/* Главная */}
            <Link
              href='/'
              onClick={() => setIsMobileOpen(false)}
              className={mobileLinkClass(pathname === '/')}
            >
              Главная
            </Link>

            {/* Энциклопедия + вложенные разделы */}
            <Link
              href='/encyclopedia'
              onClick={() => setIsMobileOpen(false)}
              className={mobileLinkClass(pathname === '/encyclopedia')}
            >
              Энциклопедия
            </Link>
            <div className='flex flex-col gap-1 ml-3 pl-3 border-l border-slate-200 dark:border-neutral-800'>
              {encyclopediaLinks.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-amber-600 dark:hover:text-amber-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Тактика и Блог */}
            {primaryLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={mobileLinkClass(pathname === link.href)}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </div>
      )}
    </header>
  )
}
