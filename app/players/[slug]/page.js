// app/players/[slug]/page.js
import Image from 'next/image'
import Link from 'next/link'
import { countryFlags } from '@/constants/countryFlags'
import { buildPageMetadata } from '@/constants/site'
import { getContentSlugs, getContentEntry, markdownToHtml } from '@/lib/content'

// Генерация статических путей к страницам игроков
export async function generateStaticParams() {
  return getContentSlugs('players').map((slug) => ({ slug }))
}

// Генерация метаданных игрока для SEO
export async function generateMetadata({ params }) {
  const { slug } = await params
  const entry = getContentEntry('players', slug)

  if (!entry) {
    return {
      title: 'Игрок не найден — Squash Portal',
    }
  }

  const { data } = entry
  const statusLine = data.custom
    ? 'Клубный игрок и тренер.'
    : data.rank
      ? `Текущий ранг PSA: ${data.rank}.`
      : 'Легенда мирового сквоша.'

  return buildPageMetadata({
    title: `${data.name} (${data.nameEn}) — Профиль игрока в сквош`,
    description: `Биография, статистика, ракетка и достижения игрока в сквош: ${data.name}. ${statusLine}`,
    path: `/players/${slug}`,
  })
}

export default async function PlayerPage({ params }) {
  const { slug } = await params
  const entry = getContentEntry('players', slug)

  if (!entry) {
    return (
      <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200'>
        <h1 className='text-xl font-bold mb-4'>Игрок не найден</h1>
        <Link href='/players' className='text-amber-500 font-bold hover:underline text-sm'>
          Вернуться к списку игроков
        </Link>
      </div>
    )
  }

  const { data, content } = entry

  // Безопасный парсинг Markdown биографии в HTML
  const htmlContent = markdownToHtml(content)

  const flag = countryFlags[data.countryCode] || ''
  const initials = data.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-200'>
      <main className='px-4 py-10 lg:px-12 lg:py-16 w-full max-w-5xl mx-auto'>
        {/* Кнопка назад */}
        <div className='mb-8'>
          <Link
            href='/players'
            className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
          >
            ← К списку игроков
          </Link>
        </div>

        {/* Заголовок страницы */}
        <header className='mb-8 border-b border-neutral-100 dark:border-neutral-900 pb-6'>
          <div className='flex items-center gap-3 flex-wrap'>
            <h1 className='text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight'>
              {data.name}
            </h1>
            <span className='text-3xl' title={data.country}>
              {flag}
            </span>
          </div>
          <p className='text-sm text-neutral-400 dark:text-neutral-500 font-semibold mt-1'>
            {data.nameEn}
          </p>
        </header>

        {/* Двухколоночный макет в стиле Википедии */}
        <div className='flex flex-col md:flex-row gap-8 items-start'>
          {/* Левая колонка: Статья Википедии */}
          <div className='flex-1 order-2 md:order-1 w-full space-y-6'>
            <section className='prose dark:prose-invert max-w-none text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-4'>
              <h2 className='text-base font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-1.5 uppercase tracking-wider text-[11px]'>
                Биография и карьера
              </h2>
              <div
                className='markdown-content space-y-4'
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </section>
          </div>

          {/* Правая колонка: Карточка Википедии (Wikipedia Infobox) */}
          <div className='w-full md:w-80 order-1 md:order-2 shrink-0 border border-neutral-200 dark:border-neutral-900 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/10 overflow-hidden text-xs'>
            {/* Заголовок инфобокса */}
            <div className='bg-neutral-100 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-900 text-center font-bold text-neutral-900 dark:text-neutral-100'>
              {data.name}
            </div>

            {/* Фото или инициалы в инфобоксе */}
            <div className='p-4 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950/40'>
              <div className='w-full aspect-[3/4] rounded bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50'>
                {data.photo ? (
                  <Image
                    src={data.photo}
                    alt={data.name}
                    fill
                    sizes='(max-width: 768px) 100vw, 320px'
                    className='object-cover'
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center text-center opacity-60 dark:opacity-40'>
                    <span className='text-4xl font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider'>
                      {initials}
                    </span>
                    <span className='text-[8px] text-neutral-400 dark:text-neutral-600 font-bold uppercase tracking-widest mt-1.5'>
                      SQUASH PORTAL
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Таблица характеристик (Infobox Table) */}
            <table className='w-full border-collapse'>
              <tbody>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500 w-28'>Гражданство</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200'>{data.country} {flag}</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Возраст</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200'>{data.age} лет</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Дата рождения</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200'>{data.dob}</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Место рождения</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[170px]' title={data.birthplace}>{data.birthplace}</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Рост / Вес</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200'>{data.height} / {data.weight}</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Игровая рука</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200'>{data.plays}</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Ракетка</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200'>{data.racket}</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Опыт</td>
                  <td className='px-4 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200'>{data.experience}</td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60 bg-neutral-50/30 dark:bg-neutral-900/5'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Статус</td>
                  <td className='px-4 py-2.5 font-bold text-neutral-800 dark:text-neutral-200'>
                    {data.custom ? (
                      <span className='text-blue-600 dark:text-blue-400'>Любитель / Тренер</span>
                    ) : data.status === 'active' ? (
                      <span className='text-emerald-600 dark:text-emerald-400'>Активный</span>
                    ) : (
                      <span className='text-amber-600 dark:text-amber-500'>Завершил карьеру</span>
                    )}
                  </td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Рейтинг PSA</td>
                  <td className='px-4 py-2.5 font-bold text-neutral-800 dark:text-neutral-200'>
                    {data.custom ? '—' : data.rank ? `#${data.rank}` : '—'}
                  </td>
                </tr>
                <tr className='border-b border-neutral-100 dark:border-neutral-900/60'>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Пик рейтинга</td>
                  <td className='px-4 py-2.5 font-bold text-neutral-800 dark:text-neutral-200'>
                    {data.custom ? '—' : data.highestRank ? `#${data.highestRank}` : '—'}
                  </td>
                </tr>
                <tr>
                  <td className='px-4 py-2.5 font-bold text-neutral-400 dark:text-neutral-500'>Титулы PSA</td>
                  <td className='px-4 py-2.5 font-bold text-neutral-800 dark:text-neutral-200'>
                    {data.custom ? '—' : data.titles}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
