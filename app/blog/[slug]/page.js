// app/blog/[slug]/page.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Link from 'next/link'

// Генерация статических путей
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  if (!fs.existsSync(postsDirectory)) return []

  const filenames = fs.readdirSync(postsDirectory)
  return filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => ({
      slug: filename.replace('.md', ''),
    }))
}

// Генерация метаданных
export async function generateMetadata({ params }) {
  const { slug } = await params
  try {
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)

    return {
      title: `${data.title} — Блог Squash Portal`,
      description: data.summary || 'Обучающие материалы по сквошу',
    }
  } catch (e) {
    return {
      title: 'Статья не найдена — Squash Portal',
    }
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return (
      <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
        <h1 className='text-2xl font-bold mb-4'>Статья не найдена</h1>
        <Link href='/blog' className='text-amber-500 font-bold hover:underline'>
          Вернуться в блог
        </Link>
      </div>
    )
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const htmlContent = marked.parse(content)

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      {/* Контейнер увеличен до max-w-4xl */}
      <article className='max-w-4xl w-full'>
        {/* Интерактивная минималистичная кнопка-стрелка назад */}
        <Link
          href='/blog'
          className='inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 mb-8 cursor-pointer'
          aria-label='Назад в блог'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2.5'
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
            />
          </svg>
        </Link>

        <header className='mb-8 pb-6 border-b border-slate-200 dark:border-neutral-800'>
          {/* Блок двух раздельных дат */}
          <div className='flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            <span>Опубликовано: {data.date}</span>
            {data.updated && data.updated !== data.date && (
              <span className='text-amber-600 dark:text-amber-500'>
                Редакция: {data.updated}
              </span>
            )}
          </div>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100 leading-tight'>
            {data.title}
          </h1>
        </header>

        {/* Контент статьи */}
        <div
          className='markdown-content text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-6'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  )
}
