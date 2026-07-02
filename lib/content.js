// lib/content.js — единая точка чтения markdown-контента (posts/, players/)
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

const resolveDir = (dir) => path.join(process.cwd(), dir)

// Список слагов всех .md-файлов каталога (для generateStaticParams)
export function getContentSlugs(dir) {
  const directory = resolveDir(dir)
  if (!fs.existsSync(directory)) return []

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => filename.replace(/\.md$/, ''))
}

// Frontmatter всех файлов каталога: [{ slug, data }]
export function getContentEntries(dir) {
  const directory = resolveDir(dir)

  return getContentSlugs(dir).map((slug) => {
    const fileContent = fs.readFileSync(
      path.join(directory, `${slug}.md`),
      'utf-8',
    )
    const { data } = matter(fileContent)
    return { slug, data }
  })
}

// Один файл целиком: { data, content } либо null, если файла нет
export function getContentEntry(dir, slug) {
  const filePath = path.join(resolveDir(dir), `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  return { data, content }
}

// Markdown → HTML с санитайзингом от XSS
export function markdownToHtml(markdown) {
  return DOMPurify.sanitize(marked.parse(markdown))
}
