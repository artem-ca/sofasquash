import { getContentEntries } from '@/lib/content'
import { SITE_URL } from '@/constants/site'

export const dynamic = 'force-static'

function getBlogEntries() {
  return getContentEntries('posts').map(({ slug, data }) => {
    const lastModified = data.updated || data.date

    return {
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  })
}

function getPlayerEntries() {
  return getContentEntries('players').map(({ slug }) => ({
    url: `${SITE_URL}/players/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
}

export default function sitemap() {
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/encyclopedia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/racquets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/players`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tactics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/rules`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  return [...staticPages, ...getBlogEntries(), ...getPlayerEntries()]
}
