'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import MiniSearch from 'minisearch'

// Порядок и подписи групп результатов
const GROUPS = [
  { type: 'player', label: 'Игроки' },
  { type: 'racquet', label: 'Ракетки' },
  { type: 'term', label: 'Глоссарий' },
  { type: 'post', label: 'Блог' },
  { type: 'rule', label: 'Правила' },
]
const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.type, g.label]))

const TYPE_BADGE = {
  player: 'Игрок',
  racquet: 'Ракетка',
  term: 'Термин',
  post: 'Статья',
  rule: 'Правило',
}

const RECENT_KEY = 'search-recent'
const MAX_RESULTS = 24

// Подсветка совпадений запроса в тексте
function highlight(text, query) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return text
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) =>
    re.test(part) && tokens.includes(part.toLowerCase()) ? (
      <mark
        key={i}
        className='bg-amber-200/70 dark:bg-amber-500/30 text-inherit rounded-sm px-0.5'
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function SearchPalette({ open, onOpen, onClose }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [recent, setRecent] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [engine, setEngine] = useState(null) // { mini, docsMap } — заполняется один раз

  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocusRef = useRef(null)

  // Глобальные горячие клавиши: ⌘K / Ctrl+K везде, «/» — вне полей ввода
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault()
        onOpen()
        return
      }
      if (k === '/' && !open) {
        const el = document.activeElement
        const tag = el?.tagName
        const typing =
          tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable
        if (!typing) {
          e.preventDefault()
          onOpen()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpen])

  // Лениво подгружаем индекс при первом открытии
  const loadIndex = useCallback(async () => {
    if (engine || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/search-index.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { docs } = await res.json()
      const mini = new MiniSearch({
        fields: ['title', 'subtitle', 'text'],
        storeFields: ['type', 'title', 'subtitle', 'url', 'photo'],
        searchOptions: {
          boost: { title: 3, subtitle: 1.5 },
          prefix: true,
          fuzzy: 0.2,
          combineWith: 'AND',
        },
      })
      mini.addAll(docs)
      setEngine({ mini, docsMap: new Map(docs.map((d) => [d.id, d])) })
      setStatus('ready')
    } catch (e) {
      console.error('Не удалось загрузить поисковый индекс:', e)
      setStatus('error')
    }
  }, [engine, status])

  // При открытии: блокируем прокрутку, фокус на поле, читаем недавние запросы
  useEffect(() => {
    if (!open) return
    restoreFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    loadIndex()
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
      if (Array.isArray(saved)) setRecent(saved.slice(0, 6))
    } catch {}
    const t = setTimeout(() => inputRef.current?.focus(), 20)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
      restoreFocusRef.current?.focus?.()
    }
  }, [open, loadIndex])

  // Сбрасываем строку при закрытии
  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  // Результаты: плоский ранжированный список + разбивка на группы для отображения
  const { flat, grouped } = useMemo(() => {
    if (!query.trim() || !engine) return { flat: [], grouped: [] }
    const hits = engine.mini.search(query).slice(0, MAX_RESULTS)

    // Группируем по типу, запоминая лучший (максимальный) счёт группы
    const byType = new Map()
    for (const h of hits) {
      const doc = engine.docsMap.get(h.id)
      if (!doc) continue
      if (!byType.has(doc.type)) {
        byType.set(doc.type, { items: [], best: h.score })
      }
      byType.get(doc.type).items.push(doc)
    }
    // Порядок групп — по релевантности (лучшее совпадение сверху), а не фиксированный
    const grouped = [...byType.entries()]
      .sort((a, b) => b[1].best - a[1].best)
      .map(([type, { items }]) => ({ label: GROUP_LABEL[type], items }))
    const flat = grouped.flatMap((g) => g.items)
    return { flat, grouped }
  }, [query, engine])

  useEffect(() => setActiveIndex(0), [query])

  const saveRecent = useCallback((q) => {
    const trimmed = q.trim()
    if (!trimmed) return
    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
      const next = [trimmed, ...prev.filter((x) => x !== trimmed)].slice(0, 6)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const go = useCallback(
    (doc) => {
      if (!doc) return
      saveRecent(query)
      onClose()
      router.push(doc.url)
    },
    [query, saveRecent, onClose, router],
  )

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(flat[activeIndex])
    }
  }

  // Держим активный результат в зоне видимости
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  const showRecent = !query.trim()
  let renderIdx = -1

  return (
    <div
      className='fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] pb-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in'
      onMouseDown={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Поиск по сайту'
        className='w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Поле ввода */}
        <div className='flex items-center gap-3 px-4 border-b border-slate-100 dark:border-neutral-800'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='w-4 h-4 shrink-0 text-slate-400 dark:text-neutral-500'
          >
            <circle cx='11' cy='11' r='7' />
            <path strokeLinecap='round' d='m21 21-4.3-4.3' />
          </svg>
          <input
            ref={inputRef}
            type='text'
            role='combobox'
            aria-expanded='true'
            aria-controls='search-results'
            aria-activedescendant={
              flat[activeIndex] ? `sr-${activeIndex}` : undefined
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='Поиск игроков, ракеток, терминов, статей…'
            className='flex-1 bg-transparent py-4 text-sm outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500'
          />
          <kbd className='hidden sm:block text-[10px] font-bold text-slate-400 dark:text-neutral-500 border border-slate-200 dark:border-neutral-700 rounded px-1.5 py-0.5'>
            ESC
          </kbd>
        </div>

        {/* Результаты */}
        <div
          ref={listRef}
          id='search-results'
          role='listbox'
          aria-label='Результаты поиска'
          className='max-h-[60vh] overflow-y-auto py-2'
        >
          {showRecent ? (
            recent.length ? (
              <div className='px-2'>
                <div className='flex items-center justify-between px-2 py-1.5'>
                  <span className='text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500'>
                    Недавнее
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem(RECENT_KEY)
                      setRecent([])
                    }}
                    className='text-[11px] text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 cursor-pointer'
                  >
                    Очистить
                  </button>
                </div>
                {recent.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuery(q)
                      inputRef.current?.focus()
                    }}
                    className='flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-800/60 cursor-pointer'
                  >
                    <span className='text-slate-300 dark:text-neutral-600'>↺</span>
                    {q}
                  </button>
                ))}
              </div>
            ) : (
              <p className='px-5 py-8 text-center text-sm text-slate-400 dark:text-neutral-500'>
                {status === 'loading'
                  ? 'Загружаю индекс…'
                  : status === 'error'
                    ? 'Не удалось загрузить поиск. Попробуйте обновить страницу.'
                    : 'Начните вводить запрос — например, «Асал», «Carboflex» или «строук».'}
              </p>
            )
          ) : flat.length === 0 ? (
            <p className='px-5 py-8 text-center text-sm text-slate-400 dark:text-neutral-500'>
              {status === 'ready'
                ? `Ничего не найдено по запросу «${query}».`
                : 'Загружаю индекс…'}
            </p>
          ) : (
            grouped.map((group) => (
              <div key={group.label} className='px-2 mb-1'>
                <div className='px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500'>
                  {group.label}
                </div>
                {group.items.map((doc) => {
                  renderIdx += 1
                  const idx = renderIdx
                  const isActive = idx === activeIndex
                  return (
                    <div
                      key={doc.id}
                      id={`sr-${idx}`}
                      data-idx={idx}
                      role='option'
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => go(doc)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-500/10'
                          : 'hover:bg-slate-50 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      {/* Миниатюра игрока или буквенная иконка типа */}
                      {doc.type === 'player' && doc.photo ? (
                        <Image
                          src={doc.photo}
                          alt=''
                          width={32}
                          height={32}
                          className='w-8 h-8 rounded-full object-cover shrink-0 bg-slate-100 dark:bg-neutral-800'
                        />
                      ) : (
                        <span className='w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold uppercase bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400'>
                          {TYPE_BADGE[doc.type]?.[0] || '•'}
                        </span>
                      )}
                      <div className='min-w-0 flex-1'>
                        <div className='text-sm font-semibold text-slate-900 dark:text-slate-100 truncate'>
                          {highlight(doc.title, query)}
                        </div>
                        {doc.subtitle && (
                          <div className='text-xs text-slate-400 dark:text-neutral-500 truncate'>
                            {doc.subtitle}
                          </div>
                        )}
                      </div>
                      <span className='shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-300 dark:text-neutral-600'>
                        {TYPE_BADGE[doc.type]}
                      </span>
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Подсказки по клавишам */}
        <div className='hidden sm:flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 dark:border-neutral-800 text-[11px] text-slate-400 dark:text-neutral-500'>
          <span>
            <kbd className='font-sans font-bold'>↑↓</kbd> навигация
          </span>
          <span>
            <kbd className='font-sans font-bold'>↵</kbd> открыть
          </span>
          <span>
            <kbd className='font-sans font-bold'>esc</kbd> закрыть
          </span>
        </div>
      </div>
    </div>
  )
}
