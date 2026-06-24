// app/blog/[slug]/page.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Link from 'next/link'

// Генерация статических путей во время сборки для GitHub Pages
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

// Генерация метаданных для каждой статьи на сервере (делаем параметры асинхронными)
export async function generateMetadata({ params }) {
  const { slug } = await params // Обязательный await в Next 15+
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

// Объявляем компонент асинхронным (async)
export default async function PostPage({ params }) {
  const { slug } = await params // Обязательный await в Next 15+
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

  // Превращаем текст Markdown в чистый HTML
  const htmlContent = marked.parse(content)

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <article className='max-w-2xl w-full'>
        <Link
          href='/blog'
          className='text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 hover:underline block mb-8'
        >
          ⬅️ Назад в блог
        </Link>

        <header className='mb-8 pb-6 border-b border-slate-200 dark:border-neutral-800'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500'>
            {data.date} • {data.author}
          </span>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-slate-100 leading-tight'>
            {data.title}
          </h1>
        </header>

        {/* Рендеринг HTML-контента с применением кастомных стилей */}
        <div
          className='markdown-content text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-6'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  )
}
