// app/blog/[slug]/page.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import Link from 'next/link'
import { formatDate } from '@/utils/date'

// Генерация статических путей к постам
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

// Генерация метаданных постов
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

  // Безопасный парсинг Markdown в HTML с ИИ-санитаризацией от XSS
  const rawHtml = marked.parse(content)
  const htmlContent = DOMPurify.sanitize(rawHtml)

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <main className='flex-1 px-6 py-12 lg:px-16 lg:py-20 max-w-4xl'>
        <header className='mb-8 pb-6 border-b border-slate-200 dark:border-neutral-800'>
          {/* Блок метаданных */}
          <div className='flex flex-wrap items-center gap-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
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
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100 leading-tight'>
            {data.title}
          </h1>
        </header>

        {/* Тело статьи */}
        <div
          className='markdown-content text-slate-800 dark:text-slate-300 text-sm leading-relaxed space-y-6'
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
