'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from './ThemeContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchPalette from './SearchPalette'

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

// SVG-иконки вместо эмодзи — для единого рендера во всех ОС/браузерах
const MoonIcon = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
)

const SunIcon = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
  </svg>
)

const MenuIcon = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    className={className}
  >
    <path d='M4 6h16M4 12h16M4 18h16' />
  </svg>
)

const CloseIcon = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    className={className}
  >
    <path d='M6 6l12 12M18 6L6 18' />
  </svg>
)

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isEncOpen, setIsEncOpen] = useState(false)
  const [shortcutHint, setShortcutHint] = useState('⌘K')
  const pathname = usePathname()
  const headerRef = useRef(null)

  // На не-Mac показываем Ctrl K вместо ⌘K (после гидрации, без mismatch)
  useEffect(() => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
    if (!isMac) setShortcutHint('Ctrl K')
  }, [])

  // Закрываем мобильное меню по клику/тапу вне навбара и по Escape
  useEffect(() => {
    if (!isMobileOpen) return

    const handleOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMobileOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileOpen(false)
    }

    document.addEventListener('pointerdown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileOpen])

  // Закрываем дропдаун «Энциклопедия» по клику/тапу вне навбара и по Escape
  // (на touch-устройствах ширины ≥md group-hover недоступен, поэтому дропдаун
  // открывается по клику на шеврон и должен закрываться так же явно)
  useEffect(() => {
    if (!isEncOpen) return

    const handleOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsEncOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsEncOpen(false)
    }

    document.addEventListener('pointerdown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isEncOpen])

  // Закрываем дропдаун при переходе на другую страницу
  useEffect(() => {
    setIsEncOpen(false)
  }, [pathname])

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
    <>
    <header
      ref={headerRef}
      className='sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-slate-200 dark:border-neutral-900 text-slate-900 dark:text-slate-100'
    >
      <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
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
          {/* Кнопка поиска (командная палитра ⌘K) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label='Поиск по сайту'
            className='inline-flex items-center gap-2 h-9 w-56 pl-3 pr-2 rounded-md border cursor-pointer transition-colors bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-200/70 dark:hover:bg-neutral-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              className='w-4 h-4 shrink-0'
            >
              <circle cx='11' cy='11' r='7' />
              <path strokeLinecap='round' d='m21 21-4.3-4.3' />
            </svg>
            <span className='text-sm'>Поиск</span>
            <kbd className='ml-auto text-[11px] font-semibold tracking-[0.2em] px-1.5 py-0.5'>
              {shortcutHint}
            </kbd>
          </button>

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

          {/* Энциклопедия — выпадающее меню (наведение мышью или клик на шевроне для touch) */}
          <div className='relative group' onMouseLeave={() => setIsEncOpen(false)}>
            <div className='inline-flex items-center gap-1'>
              <Link
                href='/encyclopedia'
                className={desktopLinkClass(isEncyclopediaActive)}
              >
                Энциклопедия
              </Link>
              <button
                type='button'
                onClick={() => setIsEncOpen((open) => !open)}
                aria-expanded={isEncOpen}
                aria-label='Показать разделы энциклопедии'
                className={`${desktopLinkClass(isEncyclopediaActive)} cursor-pointer`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='3'
                  className={`w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180 ${isEncOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              </button>
            </div>

            {/* Панель дропдауна (появляется по наведению мышью или по клику на шевроне) */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 ${
                isEncOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible translate-y-1'
              }`}
            >
              <div className='w-72 p-2 rounded-2xl border shadow-xl bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'>
                {encyclopediaLinks.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsEncOpen(false)}
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
            aria-label='Переключить тему'
            className='w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
          >
            <MoonIcon className='block dark:hidden w-4 h-4' />
            <SunIcon className='hidden dark:block w-4 h-4' />
          </button>
        </nav>

        {/* Мобильная зона */}
        <div className='flex items-center gap-2 md:hidden'>
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label='Поиск по сайту'
            className='w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              className='w-4 h-4'
            >
              <circle cx='11' cy='11' r='7' />
              <path strokeLinecap='round' d='m21 21-4.3-4.3' />
            </svg>
          </button>
          <button
            onClick={toggleTheme}
            aria-label='Переключить тему'
            className='w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-amber-400'
          >
            <MoonIcon className='block dark:hidden w-4 h-4' />
            <SunIcon className='hidden dark:block w-4 h-4' />
          </button>
          {/* Кнопка-бургер  */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            className='w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-colors bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-slate-200'
          >
            {isMobileOpen ? (
              <CloseIcon className='w-4 h-4' />
            ) : (
              <MenuIcon className='w-4 h-4' />
            )}
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

      <SearchPalette
        open={isSearchOpen}
        onOpen={() => setIsSearchOpen(true)}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
