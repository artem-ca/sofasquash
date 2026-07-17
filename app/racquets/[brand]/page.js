// app/racquets/[brand]/page.js — SEO-страница бренда ракеток
import Link from 'next/link'
import { racquets } from '@/data/racquets'
import { racquetBrands, brandBySlug } from '@/data/racquetBrands'
import {
  SITE_URL,
  buildPageMetadata,
  buildBreadcrumbJsonLd,
  jsonLdScript,
} from '@/constants/site'
import BrandRacquetsClient from './BrandRacquetsClient'

// Ракетки бренда, новые — выше
function brandRacquets(brandName) {
  return racquets
    .filter((r) => r.brand === brandName)
    .sort((a, b) => b.year - a.year || a.weight - b.weight)
}

// Склонение слова «модель» по числу: 1 модель, 22 модели, 25 моделей
function modelsWord(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'модель'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'модели'
  return 'моделей'
}

export function generateStaticParams() {
  return Object.values(racquetBrands).map((info) => ({ brand: info.slug }))
}

export async function generateMetadata({ params }) {
  const { brand } = await params
  const brandName = brandBySlug[brand]
  if (!brandName) return { title: 'Бренд не найден — Squash Portal' }

  const info = racquetBrands[brandName]
  const count = brandRacquets(brandName).length

  return buildPageMetadata({
    title: `Ракетки ${brandName} для сквоша — ${count} ${modelsWord(count)} и характеристики`,
    description: `${info.description} В каталоге ${count} ${modelsWord(count)} ${brandName} с параметрами веса, баланса, формы головы и сравнением.`,
    path: `/racquets/${info.slug}`,
  })
}

export default async function BrandPage({ params }) {
  const { brand } = await params
  const brandName = brandBySlug[brand]

  if (!brandName) {
    return (
      <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
        <h1 className='text-2xl font-bold mb-4'>Бренд не найден</h1>
        <Link href='/racquets' className='text-amber-500 font-bold hover:underline'>
          Вернуться в каталог ракеток
        </Link>
      </div>
    )
  }

  const info = racquetBrands[brandName]
  const list = brandRacquets(brandName)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Ракетки ${brandName} для сквоша`,
    itemListElement: list.slice(0, 50).map((racquet, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: `${racquet.brand} ${racquet.model}`,
        image: `${SITE_URL}${racquet.images[0] || '/icon.svg'}`,
        description: racquet.description,
        brand: { '@type': 'Brand', name: racquet.brand },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', path: '' },
    { name: 'Ракетки', path: '/racquets' },
    { name: brandName, path: `/racquets/${info.slug}` },
  ])

  return (
    <div className='min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />

      <main className='px-6 py-12 lg:px-16 lg:py-16 w-full max-w-6xl mx-auto'>
        {/* Кнопка назад */}
        <div className='mb-8'>
          <Link
            href='/racquets'
            className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors'
          >
            ← Все ракетки
          </Link>
        </div>

        {/* Заголовок бренда */}
        <header className='mb-10 border-b border-slate-200 dark:border-neutral-800 pb-8'>
          <div className='flex items-center gap-3 flex-wrap mb-3'>
            {info.country && (
              <span className='inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'>
                {info.country}
              </span>
            )}
            <span className='text-xs font-semibold text-slate-400 dark:text-slate-500'>
              {list.length} {modelsWord(list.length)} в каталоге
            </span>
          </div>
          <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
            Ракетки {brandName}
          </h1>
          <p className='text-sm font-semibold text-amber-600 dark:text-amber-500 mb-4'>
            {info.tagline}
          </p>
          <p className='text-base leading-relaxed max-w-3xl text-slate-600 dark:text-slate-400'>
            {info.description}
          </p>

          {info.ambassadors.length > 0 && (
            <div className='mt-5 flex items-center gap-2 flex-wrap'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                Играют:
              </span>
              {info.ambassadors.map((name) => (
                <span
                  key={name}
                  className='text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-slate-300'
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </header>

        <BrandRacquetsClient racquets={list} />

        {/* Перелинковка на другие бренды */}
        <section className='mt-12 pt-8 border-t border-slate-200 dark:border-neutral-800'>
          <h2 className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4'>
            Другие бренды
          </h2>
          <div className='flex flex-wrap gap-2'>
            {Object.entries(racquetBrands)
              .filter(([name]) => name !== brandName)
              .map(([name, other]) => (
                <Link
                  key={other.slug}
                  href={`/racquets/${other.slug}`}
                  className='text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 text-slate-600 dark:text-slate-400 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400'
                >
                  {name}
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  )
}
