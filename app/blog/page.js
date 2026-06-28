// app/blog/page.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import BlogList from './BlogList'

export const metadata = {
  title: 'Блог о сквоше — Обучение, тактика и обзоры',
  description:
    'Профессиональные статьи, руководства по выбору ракеток, разборы тактики и сленга от экспертов Squash Portal.',
}

export default function BlogPage() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  let posts = []

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory)
    posts = filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => {
        const slug = filename.replace('.md', '')
        const filePath = path.join(postsDirectory, filename)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(fileContent)

        return {
          slug,
          title: data.title || 'Без названия',
          date: data.date || '', // Сохраняем в формате ISO YYYY-MM-DD для сортировки
          author: data.author || 'Редакция',
          summary: data.summary || '',
          topics: Array.isArray(data.topics) ? data.topics : [],
        }
      })
      // Хронологически точная сортировка ISO-строк (свежие сверху)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  // Собираем уникальный список тем для фильтра (по алфавиту)
  const topics = [...new Set(posts.flatMap((post) => post.topics))].sort(
    (a, b) => a.localeCompare(b, 'ru'),
  )

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <main className='flex-1 px-6 py-12 lg:px-16 lg:py-20 w-full'>
        <div className='max-w-4xl mx-auto w-full mb-12 text-center'>
          <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
            Блог
          </h1>
          <p className='text-base leading-relaxed max-w-2xl mx-auto text-slate-600 dark:text-slate-400'>
            Обучающие руководства, разборы экипировки и тактические заметки от
            команды Squash Portal.
          </p>
        </div>

        <BlogList posts={posts} topics={topics} />
      </main>
    </div>
  )
}
