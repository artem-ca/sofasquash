// app/blog/[slug]/page.js
import Link from 'next/link'
import { formatDate } from '@/utils/date'
import {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  buildPageMetadata,
  buildBreadcrumbJsonLd,
  jsonLdScript,
} from '@/constants/site'
import { getContentSlugs, getContentEntry, markdownToHtml } from '@/lib/content'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

// Генерация статических путей к постам
export async function generateStaticParams() {
  return getContentSlugs('posts').map((slug) => ({ slug }))
}

// Генерация метаданных постов
export async function generateMetadata({ params }) {
  const { slug } = await params
  const entry = getContentEntry('posts', slug)

  if (!entry) {
    return {
      title: 'Статья не найдена — Squash Portal',
    }
  }

  return buildPageMetadata({
    title: `${entry.data.title} — Блог Squash Portal`,
    description: entry.data.summary || 'Обучающие материалы по сквошу',
    path: `/blog/${slug}`,
    type: 'article',
  })
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const entry = getContentEntry('posts', slug)

  if (!entry) {
    return (
      <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
        <h1 className='text-2xl font-bold mb-4'>Статья не найдена</h1>
        <Link href='/blog' className='text-amber-500 font-bold hover:underline'>
          Вернуться в блог
        </Link>
      </div>
    )
  }

  const { data, content } = entry

  // Безопасный парсинг Markdown в HTML с санитайзингом от XSS
  const htmlContent = markdownToHtml(content)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.summary || 'Обучающие материалы по сквошу',
    image: [DEFAULT_OG_IMAGE.url],
    datePublished: data.date,
    dateModified: data.updated || data.date,
    author: {
      '@type': 'Person',
      name: data.author || 'Squash Portal',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Squash Portal',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  }

  const breadcrumbItems = [
    { name: 'Главная', path: '' },
    { name: 'Блог', path: '/blog' },
    { name: data.title, path: `/blog/${slug}` },
  ]
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems)

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      <main className='flex-1 w-full max-w-4xl'>
        <Breadcrumbs items={breadcrumbItems} />
        <header className='mb-8 pb-6 border-b border-slate-200 dark:border-neutral-800'>
          {/* Верхняя панель: кнопка назад слева, метаданные справа в одну линию */}
          <div className='flex items-center justify-between gap-4 mb-4'>
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-600 transition-colors shrink-0'
            >
              ← Назад в блог
            </Link>
            <div className='flex items-center justify-end gap-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right'>
              {data.updated && data.updated !== data.date && (
                <>
                  <span className='text-amber-600 dark:text-amber-500'>
                    Редакция: {formatDate(data.updated)}
                  </span>
                  <span>•</span>
                </>
              )}
              <span>Опубликовано: {formatDate(data.date)}</span>
              {data.author && (
                <>
                  <span>•</span>
                  <span className='text-slate-400 dark:text-slate-500 font-bold normal-case'>
                    {data.author}
                  </span>
                </>
              )}
            </div>
          </div>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight'>
            {data.title}
          </h1>
        </header>

        {/* Тело статьи */}
        <div
          className='markdown-content text-slate-800 dark:text-slate-300 text-base leading-relaxed space-y-6'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className='mt-12 pt-6 border-t border-slate-200 dark:border-neutral-800'>
          <Link
            href='/blog'
            className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-600 transition-colors'
          >
            ← Назад в блог
          </Link>
        </div>
      </main>
    </div>
  )
}
