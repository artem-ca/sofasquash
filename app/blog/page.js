// app/blog/page.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

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
          date: data.date || '',
          author: data.author || 'Редакция',
          summary: data.summary || '',
        }
      })
      // Сортировка статей по дате (свежие сверху)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <div className='max-w-4xl w-full'>
        <header className='mb-12 text-center'>
          <div className='inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'>
            База знаний сквоша
          </div>
          <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
            Блог & Статьи
          </h1>
          <p className='text-base leading-relaxed max-w-2xl mx-auto text-slate-600 dark:text-slate-400'>
            Обучающие руководства, разборы экипировки и тактические заметки от
            команды Squash Portal.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2'>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className='p-6 rounded-2xl border transition-all duration-300 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 hover:border-amber-500/20 dark:hover:border-amber-500/30 flex flex-col justify-between h-full group hover:shadow-lg dark:hover:shadow-amber-500/5'
              >
                <div>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500'>
                    {post.date} • {post.author}
                  </span>
                  <h2 className='text-xl font-bold mt-2 mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'>
                    {post.title}
                  </h2>
                  <p className='text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3'>
                    {post.summary}
                  </p>
                </div>
                <div className='mt-6 text-xs font-bold text-amber-600 dark:text-amber-500 group-hover:underline'>
                  Читать статью ➡️
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-12 text-sm text-slate-500'>
            Статьи находятся в процессе публикации. Скоро здесь появится много
            интересного!
          </div>
        )}
      </div>
    </div>
  )
}
