import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-static'

const BASE_URL = 'https://sofasquash.ru'

function getBlogEntries() {
  const postsDirectory = path.join(process.cwd(), 'posts')

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const filePath = path.join(postsDirectory, filename)
      const { data } = matter(fs.readFileSync(filePath, 'utf-8'))

      const lastModified = data.updated || data.date

      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: lastModified ? new Date(lastModified) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }
    })
}

export default function sitemap() {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/racquets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tactics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/rules`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  return [...staticPages, ...getBlogEntries()]
}
