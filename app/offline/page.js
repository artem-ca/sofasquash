'use client'

import Link from 'next/link'

// Показывается service worker'ом (public/sw.js), когда запрошенная страница
// недоступна и в сети, и в офлайн-кеше. Кешируемые разделы (см. SHELL_ASSETS
// в sw.js) при этом продолжают открываться нормально.
const cachedLinks = [
  { href: '/', label: 'Главная' },
  { href: '/rules', label: 'Правила' },
  { href: '/glossary', label: 'Глоссарий' },
  { href: '/players', label: 'Игроки' },
]

export default function OfflinePage() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12 text-center bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <div className='text-7xl mb-6 select-none'>📡</div>
      <h1 className='text-3xl font-extrabold tracking-tight mb-3 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
        Вы офлайн
      </h1>
      <p className='text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8'>
        Эта страница ещё не сохранена для офлайн-просмотра. Проверьте
        подключение к интернету и попробуйте снова — или откройте один из
        уже закешированных разделов ниже.
      </p>
      <div className='flex flex-wrap gap-2 justify-center mb-4'>
        {cachedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 text-slate-600 dark:text-slate-400 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400'
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={() => window.location.reload()}
        className='px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer'
      >
        Повторить
      </button>
    </div>
  )
}
