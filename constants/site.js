export const SITE_URL = 'https://sofasquash.ru'

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: 'Squash Portal — интерактивная база знаний о сквоше',
}

export function buildPageMetadata({
  title,
  description,
  path = '',
  type = 'website',
}) {
  const url = path ? `${SITE_URL}${path}` : SITE_URL

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Squash Portal',
      locale: 'ru_RU',
      type,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}
