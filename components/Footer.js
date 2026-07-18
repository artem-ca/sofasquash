import Link from 'next/link'

const columns = [
  {
    title: 'Энциклопедия',
    links: [
      { href: '/racquets', label: 'Ракетки' },
      { href: '/players', label: 'Игроки' },
      { href: '/glossary', label: 'Глоссарий' },
      { href: '/rules', label: 'Правила' },
    ],
  },
  {
    title: 'Тренировки',
    links: [
      { href: '/tactics', label: 'Тактический планшет' },
      { href: '/blog', label: 'Блог' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className='border-t bg-white dark:bg-neutral-950 border-slate-200 dark:border-neutral-900 text-slate-900 dark:text-slate-100'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-8'>
          <div className='col-span-2 sm:col-span-2'>
            <Link href='/' className='flex flex-col leading-none select-none w-fit'>
              <span className='font-extrabold text-base tracking-wider'>
                SQUASH
              </span>
              <span className='text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest mt-0.5'>
                portal
              </span>
            </Link>
            <p className='mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm'>
              Интерактивная база знаний о сквоше: правила, тактика, энциклопедия ракеток и игроков.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title}>
              <div className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3'>
                {column.title}
              </div>
              <ul className='flex flex-col gap-2'>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className='mt-10 pt-6 border-t border-slate-200 dark:border-neutral-900 text-xs text-slate-400 dark:text-slate-500'>
          © {year} Squash Portal · sofasquash.ru
        </div>
      </div>
    </footer>
  )
}
