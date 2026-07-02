// app/blog/page.js
import BlogClient from './BlogClient'
import PageHeader from '@/components/ui/PageHeader'
import { getContentEntries } from '@/lib/content'
import { buildPageMetadata } from '@/constants/site'

export const metadata = buildPageMetadata({
  title: 'Блог о сквоше — Обучение, тактика и обзоры',
  description:
    'Профессиональные статьи, руководства по выбору ракеток, разборы тактики и сленга от экспертов Squash Portal.',
  path: '/blog',
})

export default function BlogPage() {
  const posts = getContentEntries('posts')
    .map(({ slug, data }) => ({
      slug,
      title: data.title || 'Без названия',
      date: data.date || '', // Сохраняем в формате ISO YYYY-MM-DD для сортировки
      author: data.author || 'Редакция',
      summary: data.summary || '',
      topics: Array.isArray(data.topics) ? data.topics : [],
    }))
    // Хронологически точная сортировка ISO-строк (свежие сверху)
    .sort((a, b) => b.date.localeCompare(a.date))

  // Собираем уникальный список тем для фильтра (по алфавиту)
  const topics = [...new Set(posts.flatMap((post) => post.topics))].sort(
    (a, b) => a.localeCompare(b, 'ru'),
  )

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100 transition-colors duration-300'>
      <main className='flex-1 px-6 py-12 lg:px-16 lg:py-20 w-full'>
        <div className='max-w-4xl mx-auto w-full'>
          <PageHeader
            title='Блог'
            subtitle='Обучающие руководства, разборы экипировки и тактические заметки от команды Squash Portal.'
          />
        </div>

        <BlogClient posts={posts} topics={topics} />
      </main>
    </div>
  )
}
