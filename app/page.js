// app/page.js (Серверный компонент)
import Link from 'next/link'
import Image from 'next/image'
import { Oswald } from 'next/font/google'
import { racquets } from '@/data/racquets'
import { racquetBrands } from '@/data/racquetBrands'
import { glossaryTerms } from '@/data/glossary'
import { ruleChapters } from '@/data/rules'
import { tacticsData, SHOT_LABELS } from '@/data/tactics'
import { getContentEntries, getContentSlugs } from '@/lib/content'
import { formatDate } from '@/utils/date'
import { buildPageMetadata } from '@/constants/site'
import { countryFlags } from '@/constants/countryFlags'
import HeroCourtSignature from '@/components/HeroCourtSignature'
import CourtVisualizer from '@/components/CourtVisualizer'

// Отдельный «плакатный» шрифт только для вордмарка на главной — не трогает
// системный шрифт остального сайта. Условный (не вариативный) начерк,
// нужен явный weight; кириллица — обязательна для остального текста хиро.
const wordmarkFont = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: '700',
  display: 'swap',
})

export const metadata = buildPageMetadata({
  title: 'SQUASH PORTAL — интерактивная база знаний о сквоше',
  description:
    'Энциклопедия ракеток и игроков, глоссарий терминов, официальные правила, тактический планшет и тренерский блог — всё о сквоше на русском языке в одном месте.',
  path: '',
})

// Склонение по числу: 1 статья, 2 статьи, 5 статей
function postsWord(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'статья'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'статьи'
  return 'статей'
}

// Склонение по числу: 1 удар, 2 удара, 6 ударов
function hitsWord(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'удар'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'удара'
  return 'ударов'
}

const ArrowIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='2.5'
    stroke='currentColor'
    className={className}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
    />
  </svg>
)

const EncyclopediaIcon = (
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
    <rect x='3' y='3' width='8' height='8' rx='2' />
    <rect x='13' y='3' width='8' height='8' rx='2' />
    <rect x='3' y='13' width='8' height='8' rx='2' />
    <rect x='13' y='13' width='8' height='8' rx='2' />
  </svg>
)

const TacticsIcon = (
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
    <path d='M4 20 10 6l4 10 6-12' />
    <circle cx='20' cy='4' r='1.4' fill='currentColor' stroke='none' />
  </svg>
)

const BlogIcon = (
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
    <path d='M4 5.5A1.5 1.5 0 0 1 5.5 4h9.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 1 .439 1.061V18.5A1.5 1.5 0 0 1 17.5 20h-12A1.5 1.5 0 0 1 4 18.5v-13Z' />
    <path d='M8 9h8M8 13h8M8 17h4' />
  </svg>
)

// Термин дня — вычисляется один раз при загрузке модуля (сборке страницы),
// а не в теле компонента, чтобы не звать Date.now() во время рендера
const termOfDay = glossaryTerms[Math.floor(Date.now() / 86400000) % glossaryTerms.length]

// Витрина ракеток на главной — по одной флагманской модели от разных брендов,
// с проверенными на диске фото (не все 254 модели имеют изображение).
const FEATURED_RACQUET_IDS = [
  'tecnifibre-carboflex-120-x-top-v2',
  'dunlop-cx-120-2025',
  'head-cyber-edge-2024',
  'harrow-bancroft-executive-doubles',
]

export default function HomePage() {
  const racquetsCount = racquets.length
  const playersCount = getContentSlugs('players').length
  const glossaryCount = glossaryTerms.length
  const rulesCount = ruleChapters.length
  const hitsCount = Object.keys(tacticsData).length
  const shotNames = Object.values(SHOT_LABELS)

  const posts = getContentEntries('posts')
    .map(({ slug, data }) => ({
      slug,
      title: data.title || 'Без названия',
      date: data.date || '',
      summary: data.summary || '',
      topics: Array.isArray(data.topics) ? data.topics : [],
    }))
    .sort((a, b) => b.date.localeCompare(a.date))

  const postsCount = posts.length
  const latestPosts = posts.slice(0, 3)
  const blogTopics = [...new Set(posts.flatMap((post) => post.topics))].slice(0, 6)

  const featuredRacquets = FEATURED_RACQUET_IDS.map((id) =>
    racquets.find((r) => r.id === id),
  ).filter(Boolean)

  // Топ-4 действующих игрока по рейтингу PSA — у мужского и женского туров
  // свой отсчёт, поэтому сортировка по номеру ранга естественно даёт вперемешку
  // лидеров обоих туров, без ручного отбора конкретных имён.
  const featuredPlayers = getContentEntries('players')
    .map(({ slug, data }) => ({ slug, ...data }))
    .filter((p) => p.status === 'active' && p.rank && p.photo)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4)

  // Эти же 4 числа больше нигде не дублируются — единственное место, где они
  // показаны, это карточка «Энциклопедия» (см. hubs ниже).
  const encyclopediaStats = [
    [`${racquetsCount}+`, 'ракеток'],
    [`${playersCount}`, 'игроков'],
    [`${glossaryCount}`, 'терминов'],
    [`${rulesCount}`, 'глав правил'],
  ]

  const hubs = [
    {
      href: '/encyclopedia',
      icon: EncyclopediaIcon,
      title: 'Энциклопедия',
      tagline: 'Ракетки, игроки, глоссарий и полный свод правил в одной базе.',
      body: (
        <div className='grid grid-cols-2 gap-2.5'>
          {encyclopediaStats.map(([value, label]) => (
            <div
              key={label}
              className='rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-900/30 px-3 py-2.5'
            >
              <div className='text-lg font-extrabold text-amber-600 dark:text-amber-400'>
                {value}
              </div>
              <div className='text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mt-0.5'>
                {label}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      href: '/tactics',
      icon: TacticsIcon,
      title: 'Тактика',
      tagline: `${hitsCount} ${hitsWord(hitsCount)} на 3D-модели корта в масштабе 1:1.`,
      body: (
        <div className='flex flex-wrap gap-1.5'>
          {shotNames.map((name) => (
            <span
              key={name}
              className='px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-200 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
            >
              {name}
            </span>
          ))}
        </div>
      ),
    },
    {
      href: '/blog',
      icon: BlogIcon,
      title: 'Блог',
      tagline: `${postsCount} ${postsWord(postsCount)} о технике, экипировке и тактике.`,
      body: (
        <div className='flex flex-wrap gap-1.5'>
          {blogTopics.map((topic) => (
            <span
              key={topic}
              className='px-2.5 py-1 rounded-full text-[11px] font-bold border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 text-slate-500 dark:text-slate-400'
            >
              {topic}
            </span>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className='relative overflow-hidden min-h-[calc(100vh-4rem)] px-6 py-16 lg:py-24 transition-colors duration-300 bg-slate-50 dark:bg-neutral-950'>
      {/* Фоновое свечение — смещено к схеме корта, а не за заголовок */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden'
      >
        <div className='motion-safe:animate-pulse absolute right-[6%] top-[-160px] h-[460px] w-[460px] rounded-full bg-amber-400/20 dark:bg-amber-500/15 blur-[110px]' />
      </div>

      <div className='relative max-w-6xl mx-auto w-full'>
        {/* Hero: тезис слева, сигнатурная схема корта справа */}
        <header className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center mb-20 lg:mb-24'>
          <div className='lg:col-span-7'>
            <h1 className={`${wordmarkFont.className} mb-1 flex flex-wrap text-6xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight text-slate-900 dark:text-amber-400`}>
              {'SQUASH'.split('').map((letter, i) => (
                <span
                  key={i}
                  className='letter-drop'
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <p
              className='enc-reveal text-lg sm:text-xl font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-500 mb-6'
              style={{ animationDelay: '0.45s' }}
            >
              Portal
            </p>
            <p
              className='enc-reveal text-xl sm:text-2xl font-bold leading-snug text-slate-700 dark:text-slate-200 mb-4'
              style={{ animationDelay: '0.55s' }}
            >
              От тина до Т-зоны — сквош разобран по полочкам.
            </p>
            <p
              className='enc-reveal text-base sm:text-lg leading-relaxed max-w-xl text-slate-600 dark:text-slate-400 mb-8'
              style={{ animationDelay: '0.65s' }}
            >
              Официальные правила WSF, база ракеток и игроков PSA, глоссарий
              терминов и разбор ударов на модели корта — всё о сквоше в одном
              месте, на русском языке.
            </p>
            <div className='enc-reveal' style={{ animationDelay: '0.75s' }}>
              <Link
                href='/tactics'
                className='inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95'
              >
                Разобрать удары на корте
                <ArrowIcon className='w-4 h-4 shrink-0' />
              </Link>
            </div>
          </div>

          <div
            className='enc-reveal lg:col-span-5'
            style={{ animationDelay: '0.5s' }}
          >
            <div className='rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 p-5 shadow-sm'>
              <HeroCourtSignature />
              <p className='mt-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                Траектория драйва — самого частого удара в сквоше
              </p>
            </div>
          </div>
        </header>

        {/* Карточки-хабы — у каждой своё содержимое вместо одинакового текста */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20'>
          {hubs.map((hub, i) => (
            <div
              key={hub.href}
              className='enc-reveal'
              style={{ animationDelay: `${0.7 + i * 0.12}s` }}
            >
              <Link
                href={hub.href}
                className='bling group relative flex flex-col h-full p-8 rounded-3xl border transition-all duration-300 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 hover:border-amber-500/40 dark:hover:border-amber-500/40 hover:shadow-xl dark:hover:shadow-amber-500/5 hover:-translate-y-1'
              >
                <div className='mb-5'>{hub.icon}</div>

                <h2 className='text-2xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'>
                  {hub.title}
                </h2>
                <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-5'>
                  {hub.tagline}
                </p>

                <div className='flex-1'>{hub.body}</div>

                <div className='mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500'>
                  Открыть раздел
                  <ArrowIcon className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Витрина энциклопедии: ракетки и игроки — то же наполнение, что за карточкой
            «Энциклопедия» выше, но уже с реальными фото вместо чисел */}
        <section className='mb-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            <div>
              <h2 className='text-xl font-extrabold tracking-tight mb-1 text-slate-900 dark:text-slate-100'>
                Ракетки
              </h2>
              <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
                {racquetsCount}+ моделей с параметрами, фото и сравнением.
              </p>
              <div className='grid grid-cols-2 gap-3 mb-5'>
                {featuredRacquets.map((racquet) => {
                  const brandSlug = racquetBrands[racquet.brand]?.slug
                  return (
                    <Link
                      key={racquet.id}
                      href={brandSlug ? `/racquets/${brandSlug}` : '/racquets'}
                      className='group rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 overflow-hidden hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-colors'
                    >
                      <div className='aspect-square bg-white flex items-center justify-center p-5'>
                        <Image
                          src={racquet.images[0]}
                          alt={`${racquet.brand} ${racquet.model}`}
                          width={200}
                          height={200}
                          className='object-contain h-full w-auto transition-transform duration-300 group-hover:scale-105'
                        />
                      </div>
                      <div className='px-3 pb-3'>
                        <div className='text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400'>
                          {racquet.brand}
                        </div>
                        <div className='text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1'>
                          {racquet.model}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <Link
                href='/racquets'
                className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 hover:underline'
              >
                Весь каталог ракеток
                <ArrowIcon />
              </Link>
            </div>

            <div>
              <h2 className='text-xl font-extrabold tracking-tight mb-1 text-slate-900 dark:text-slate-100'>
                Игроки
              </h2>
              <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
                {playersCount} профилей — от лидеров PSA до легенд сквоша.
              </p>
              <div className='grid grid-cols-2 gap-3 mb-5'>
                {featuredPlayers.map((player) => {
                  const flag = countryFlags[player.countryCode] || ''
                  return (
                    <Link
                      key={player.slug}
                      href={`/players/${player.slug}`}
                      className='group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900/40'
                    >
                      <Image
                        src={player.photo}
                        alt={player.name}
                        fill
                        sizes='(max-width: 1024px) 25vw, 12vw'
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/10 to-transparent' />
                      <span className='absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-950/70 text-white'>
                        PSA #{player.rank}
                      </span>
                      {flag && (
                        <span className='absolute top-2 right-2 text-sm' title={player.country}>
                          {flag}
                        </span>
                      )}
                      <span className='absolute bottom-2 left-2 right-2 text-[11px] font-bold text-white line-clamp-1'>
                        {player.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
              <Link
                href='/players'
                className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 hover:underline'
              >
                Вся база игроков
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* Интерактивная схема разметки — та же геометрия, что и в правилах,
            но с наведением/тапом по каждой линии и зоне */}
        <section className='mb-20'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100'>
              Разберитесь в разметке корта
            </h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto'>
              Наведите курсор, коснитесь или пройдитесь по Tab, чтобы узнать
              назначение и размеры каждой линии и зоны.
            </p>
          </div>
          <CourtVisualizer />
          <div className='text-center'>
            <Link
              href='/rules'
              className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 hover:underline'
            >
              Полный свод официальных правил
              <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* Термин дня — живой пример из карточки «Энциклопедия» выше, стабильно меняется при каждой пересборке сайта */}
        <section
          className='enc-reveal mb-20'
          style={{ animationDelay: '1.05s' }}
        >
          <div className='relative overflow-hidden rounded-3xl border border-amber-200/70 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-500/10 dark:via-neutral-900/20 dark:to-neutral-900/20 p-8 sm:p-10'>
            <span className='inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4'>
              <span aria-hidden='true' className='inline-block w-4 h-0.5 rounded-full bg-amber-500 dark:bg-amber-400' />
              Термин дня
            </span>
            <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-slate-100'>
              {termOfDay.term}
            </h2>
            <p className='text-sm sm:text-base leading-relaxed max-w-2xl text-slate-600 dark:text-slate-400'>
              {termOfDay.definition}
            </p>
            {termOfDay.tip && (
              <p className='mt-4 text-sm leading-relaxed max-w-2xl text-slate-500 dark:text-slate-500'>
                <span className='font-bold text-amber-600 dark:text-amber-400'>
                  Совет тренера:{' '}
                </span>
                {termOfDay.tip}
              </p>
            )}
            <Link
              href='/glossary'
              className='mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 hover:underline'
            >
              Весь глоссарий
              <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* Тизер блога */}
        {latestPosts.length > 0 && (
          <section className='mb-20'>
            <div
              className='enc-reveal text-center mb-10'
              style={{ animationDelay: '1.2s' }}
            >
              <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100'>
                Последние статьи
              </h2>
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                Свежие материалы из тренерского блога Squash Portal
              </p>
            </div>

            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className='bling group relative flex flex-col h-full p-6 rounded-2xl border transition-all duration-300 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 hover:border-amber-500/20 dark:hover:border-amber-500/30 hover:shadow-lg dark:hover:shadow-amber-500/5'
                >
                  <span className='text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500'>
                    {formatDate(post.date)}
                  </span>
                  <h3 className='text-xl font-bold mt-2 mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'>
                    {post.title}
                  </h3>
                  <p className='text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3 flex-1'>
                    {post.summary}
                  </p>
                  <div className='mt-6 text-xs font-bold text-amber-600 dark:text-amber-500 group-hover:underline inline-flex items-center gap-1.5 relative z-10'>
                    Читать статью
                    <ArrowIcon />
                  </div>
                </Link>
              ))}
            </div>

            <div className='text-center mt-10'>
              <Link
                href='/blog'
                className='inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-500 hover:underline'
              >
                Все статьи блога
                <ArrowIcon />
              </Link>
            </div>
          </section>
        )}

        {/* Финальный CTA */}
        <div
          className='enc-reveal text-center'
          style={{ animationDelay: '1.45s' }}
        >
          <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
            Новичок в сквоше? Начните с официальных правил игры.
          </p>
          <Link
            href='/rules'
            className='inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base shadow-lg transition-all active:scale-95'
          >
            Читать официальные правила сквоша
            <ArrowIcon className='w-5 h-5 shrink-0' />
          </Link>
        </div>
      </div>
    </div>
  )
}
