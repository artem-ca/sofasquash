import Link from 'next/link'

export const metadata = {
  title: 'Страница не найдена — Squash Portal',
}

const quickLinks = [
  { href: '/', label: 'Главная' },
  { href: '/encyclopedia', label: 'Энциклопедия' },
  { href: '/blog', label: 'Блог' },
  { href: '/tactics', label: 'Тактика' },
]

export default function NotFound() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12 text-center bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <div className='text-7xl mb-6 select-none'>🎾</div>
      <h1 className='text-6xl font-extrabold tracking-tight mb-3 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
        404
      </h1>
      <p className='text-lg font-bold mb-2'>Мяч ушёл в аут</p>
      <p className='text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8'>
        Такой страницы не существует — возможно, она была перемещена или вы
        ошиблись адресом. Вернитесь на корт по одной из ссылок ниже.
      </p>
      <div className='flex flex-wrap gap-2 justify-center'>
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 text-slate-600 dark:text-slate-400 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400'
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
