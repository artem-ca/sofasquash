// app/encyclopedia/page.js (Серверный компонент)
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { racquets } from '../../data/racquets'
import { glossaryTerms } from '../../data/glossary'
import { buildPageMetadata } from '@/constants/site'

export const metadata = buildPageMetadata({
  title: 'Энциклопедия сквоша — Ракетки, игроки, термины и правила',
  description:
    'Обзор справочной базы Squash Portal: энциклопедия ракеток, профили игроков PSA, глоссарий терминов и официальные правила сквоша — всё в одном месте.',
  path: '/encyclopedia',
})

function getPlayersCount() {
  try {
    const dir = path.join(process.cwd(), 'players')
    if (!fs.existsSync(dir)) return 0
    return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).length
  } catch {
    return 0
  }
}

export default function EncyclopediaPage() {
  const racquetsCount = racquets.length
  const glossaryCount = glossaryTerms.length
  const playersCount = getPlayersCount()
  const rulesCount = 14

  // Плавная «капля» головы ракетки (используется и как обод, и как маска для струн)
  const headPath =
    'M0 -15 C -6.5 -16.5 -9 -23 -9 -30 C -9 -37.5 -5 -42.5 0 -42.5 C 5 -42.5 9 -37.5 9 -30 C 9 -23 6.5 -16.5 0 -15 Z'

  const sections = [
    {
      href: '/racquets',
      icon: (
        <svg
          viewBox='0 0 64 64'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-11 h-11 text-slate-900 dark:text-slate-100'
          aria-hidden='true'
        >
          <defs>
            <clipPath id='sq-head-clip'>
              <path d={headPath} />
            </clipPath>
          </defs>
          <g transform='translate(32 40)'>
            {[-32, 32].map((angle) => (
              <g key={angle} transform={`rotate(${angle}) translate(0 12)`}>
                {/* Струны */}
                <g
                  clipPath='url(#sq-head-clip)'
                  strokeWidth='0.85'
                  opacity='0.8'
                >
                  {[-6, -3, 0, 3, 6].map((x) => (
                    <line key={`v${x}`} x1={x} y1='-43' x2={x} y2='-14' />
                  ))}
                  {[-39, -34, -29, -24, -19].map((y) => (
                    <line key={`h${y}`} x1='-10' y1={y} x2='10' y2={y} />
                  ))}
                </g>
                {/* Обод головы (плавная капля) */}
                <path d={headPath} strokeWidth='2.3' />
                {/* Ручка */}
                <line x1='0' y1='0' x2='0' y2='-15' strokeWidth='3.2' />
                {/* Набалдашник */}
                <circle
                  cx='0'
                  cy='0.5'
                  r='1.9'
                  fill='currentColor'
                  stroke='none'
                />
              </g>
            ))}
          </g>
        </svg>
      ),
      title: 'Ракетки',
      stat: `${racquetsCount}+ моделей`,
      desc: 'Интерактивная энциклопедия сквош-ракеток с фильтрами по бренду, весу, балансу, форме головы и году. Сравнивайте модели по характеристикам и находите свою.',
    },
    {
      href: '/players',
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-11 h-11 text-slate-900 dark:text-slate-100'
          aria-hidden='true'
        >
          <path d='M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0' />
        </svg>
      ),
      title: 'Игроки',
      stat: `${playersCount} профилей`,
      desc: 'Обширная база данных игроков: профессионалы PSA World Tour, легенды сквоша и клубные игроки. Рейтинги, подробные характеристики, экипировка и биографии.',
    },
    {
      href: '/glossary',
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-11 h-11 text-slate-900 dark:text-slate-100'
          aria-hidden='true'
        >
          <path d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' />
        </svg>
      ),
      title: 'Глоссарий',
      stat: `${glossaryCount} терминов`,
      desc: 'Словарь сквош-сленга, названий ударов, судейской терминологии и разметки корта — в алфавитном порядке и с советами тренера.',
    },
    {
      href: '/rules',
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-11 h-11 text-slate-900 dark:text-slate-100'
          aria-hidden='true'
        >
          <path d='M12 5v14M4 7h16M8 19h8M5 7 4 12M19 7l1 5' />
          <circle cx='4' cy='14.3' r='2.3' />
          <circle cx='20' cy='14.3' r='2.3' />
          <circle cx='12' cy='7' r='1' fill='currentColor' stroke='none' />
        </svg>
      ),
      title: 'Правила',
      stat: `${rulesCount} глав`,
      desc: 'Официальные правила сквоша, разобранные по главам: подача, розыгрыш, помехи, апелляции, поведение и судейство.',
    },
  ]

  return (
    <div className='min-h-[calc(100vh-4rem)] px-6 py-16 lg:py-24 transition-colors duration-300 bg-slate-50 dark:bg-neutral-950'>
      <div className='max-w-5xl mx-auto w-full'>
        {/* Hero */}
        <header className='text-center mb-16 lg:mb-20'>
          <div className='enc-reveal inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'>
            Справочная база
          </div>
          <h1
            className='enc-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent leading-[1.05]'
            style={{ animationDelay: '0.08s' }}
          >
            Энциклопедия сквоша
          </h1>
          <p
            className='enc-reveal text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-slate-600 dark:text-slate-400'
            style={{ animationDelay: '0.16s' }}
          >
            Всё, что нужно знать о сквоше, собрано в одном месте: ракетки,
            игроки, термины и правила. Выберите раздел и погрузитесь в детали.
          </p>

          {/* Строка статистики */}
          <div className='mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4'>
            {[
              [`${racquetsCount}+`, 'ракеток'],
              [`${playersCount}`, 'игроков'],
              [`${glossaryCount}`, 'терминов'],
              [`${rulesCount}`, 'глав правил'],
            ].map(([value, label], i) => (
              <div
                key={label}
                className='enc-reveal text-center'
                style={{ animationDelay: `${0.24 + i * 0.08}s` }}
              >
                <div className='text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400'>
                  {value}
                </div>
                <div className='text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mt-1'>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Разделы энциклопедии */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          {sections.map((section, i) => (
            <div
              key={section.href}
              className='enc-reveal'
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <Link
                href={section.href}
                className='bling group relative flex flex-col h-full p-8 rounded-3xl border transition-all 
                duration-300 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20
               hover:border-amber-500/40 dark:hover:border-amber-500/40 hover:shadow-xl 
               dark:hover:shadow-amber-500/5 hover:-translate-y-1'
              >
                <div className='flex items-center justify-between mb-5'>
                  {section.icon}
                  <span
                    className='text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 
                  dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                  >
                    {section.stat}
                  </span>
                </div>

                <h2
                  className='text-2xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100 
                group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'
                >
                  {section.title}
                </h2>
                <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400 flex-1'>
                  {section.desc}
                </p>

                <div
                  className='mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider 
                text-amber-600 dark:text-amber-500'
                >
                  Открыть раздел
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2.5'
                    stroke='currentColor'
                    className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
                    />
                  </svg>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Нижний CTA */}
        <div
          className='enc-reveal mt-16 text-center'
          style={{ animationDelay: '0.95s' }}
        >
          <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
            Хотите не только справку, но и практику? Загляните в тренерский блог
            и на тактический планшет.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600
               text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95'
            >
              Читать блог
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2.5'
                stroke='currentColor'
                className='w-4 h-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
                />
              </svg>
            </Link>
            <Link
              href='/tactics'
              className='inline-flex items-center gap-2 px-6 py-3 rounded-2xl border font-bold text-sm transition-all 
              active:scale-95 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300
               hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400'
            >
              Тактический планшет
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
