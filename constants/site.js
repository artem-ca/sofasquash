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
  image = DEFAULT_OG_IMAGE,
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
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  }
}

// Хлебные крошки (Schema.org BreadcrumbList) для страниц статей и профилей.
// items: [{ name, path }], path — относительный ('/blog') или '' для главной.
export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.path ? `${SITE_URL}${item.path}` : SITE_URL,
    })),
  }
}

// Безопасная сериализация JSON-LD для dangerouslySetInnerHTML: экранируем
// </script>, чтобы вложенный пользовательский текст не мог разорвать тег.
export function jsonLdScript(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
