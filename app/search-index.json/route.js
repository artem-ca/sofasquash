// app/search-index.json/route.js
// Собирает единый поисковый индекс сайта в статический JSON во время сборки.
// При output:'export' Next рендерит GET-обработчик в файл out/search-index.json.
// Пересобирается автоматически на каждом build — ничего вручную обновлять не нужно.
import { getContentEntries } from '@/lib/content'
import { racquets } from '@/data/racquets'
import { glossaryTerms } from '@/data/glossary'
import { ruleChapters } from '@/data/rules'

export const dynamic = 'force-static'

// Обрезаем длинный текст, чтобы индекс оставался компактным
const clip = (str, n) => {
  const s = (str || '').trim()
  return s.length > n ? s.slice(0, n) : s
}

export function GET() {
  const docs = []

  // Игроки (реальные страницы + миниатюра-фото)
  for (const { slug, data } of getContentEntries('players')) {
    docs.push({
      id: `player:${slug}`,
      type: 'player',
      title: data.name || slug,
      subtitle: [data.country, data.nameEn].filter(Boolean).join(' · '),
      url: `/players/${slug}`,
      photo: data.photo || null,
      text: [data.nameEn, data.country, data.racket].filter(Boolean).join(' '),
    })
  }

  // Ракетки (открываются в каталоге с предзаполненным поиском)
  for (const r of racquets) {
    docs.push({
      id: `racquet:${r.id}`,
      type: 'racquet',
      title: `${r.brand} ${r.model}`,
      subtitle: [r.weight && `${r.weight} г`, r.balanceText, r.year]
        .filter(Boolean)
        .join(' · '),
      url: `/racquets?q=${encodeURIComponent(r.model)}`,
      text: [r.material, r.player, clip(r.description, 120)]
        .filter(Boolean)
        .join(' '),
    })
  }

  // Термины глоссария (deep-link раскрывает аккордеон)
  for (const t of glossaryTerms) {
    docs.push({
      id: `term:${t.id}`,
      type: 'term',
      title: t.term,
      subtitle: t.category,
      url: `/glossary#${t.id}`,
      text: clip(t.definition, 160),
    })
  }

  // Статьи блога (реальные страницы)
  for (const { slug, data } of getContentEntries('posts')) {
    docs.push({
      id: `post:${slug}`,
      type: 'post',
      title: data.title || slug,
      subtitle: Array.isArray(data.topics) ? data.topics.join(', ') : '',
      url: `/blog/${slug}`,
      text: clip(data.summary, 200),
    })
  }

  // Главы правил (deep-link к секции)
  for (const c of ruleChapters) {
    docs.push({
      id: `rule:${c.id}`,
      type: 'rule',
      title: c.label,
      subtitle: 'Правила сквоша',
      url: `/rules#${c.id}`,
      text: c.keywords || '',
    })
  }

  return Response.json({ generatedAt: new Date().toISOString(), docs })
}
