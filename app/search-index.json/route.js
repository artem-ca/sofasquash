// app/search-index.json/route.js
// Собирает единый поисковый индекс сайта в статический JSON во время сборки.
// При output:'export' Next рендерит GET-обработчик в файл out/search-index.json.
// Пересобирается автоматически на каждом build — ничего вручную обновлять не нужно.
import { getContentEntries, getContentSlugs, getContentEntry } from '@/lib/content'
import { racquets } from '@/data/racquets'
import { glossaryTerms } from '@/data/glossary'
import { ruleChapters } from '@/data/rules'

export const dynamic = 'force-static'

// Обрезаем длинный текст, чтобы индекс оставался компактным
const clip = (str, n) => {
  const s = (str || '').trim()
  return s.length > n ? s.slice(0, n) : s
}

// Markdown/HTML статьи блога → простой текст для полнотекстового поиска:
// убираем теги и базовую разметку, синтаксис markdown точности не требует
const stripMarkup = (raw) =>
  (raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

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

  // Статьи блога (реальные страницы) — индексируем полный текст статьи,
  // а не только summary, иначе поиск не находит совпадения внутри текста
  for (const slug of getContentSlugs('posts')) {
    const entry = getContentEntry('posts', slug)
    if (!entry) continue
    const { data, content } = entry
    docs.push({
      id: `post:${slug}`,
      type: 'post',
      title: data.title || slug,
      subtitle: Array.isArray(data.topics) ? data.topics.join(', ') : '',
      url: `/blog/${slug}`,
      text: clip(
        [data.summary, stripMarkup(content)].filter(Boolean).join(' '),
        6000,
      ),
    })
  }

  // Главы правил (deep-link к секции) — полный текст пунктов + врезка,
  // keywords добавляют жаргон/синонимы, которых нет дословно в тексте
  for (const c of ruleChapters) {
    docs.push({
      id: `rule:${c.id}`,
      type: 'rule',
      title: c.label,
      subtitle: 'Правила сквоша',
      url: `/rules#${c.id}`,
      text: [c.rules.join(' '), c.takeaway?.text, c.keywords]
        .filter(Boolean)
        .join(' '),
    })
  }

  return Response.json({ generatedAt: new Date().toISOString(), docs })
}
