'use client'

import { useState } from 'react'
import { useTheme } from '@/components/ThemeContext'
import { glossaryTerms } from '../../data/glossary'

export default function GlossaryPage() {
  const { isDarkMode } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLetter, setActiveLetter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const categories = ['all', 'Удары', 'Разметка', 'Правила', 'Сленг']

  const letters = [
    'all',
    ...new Set(glossaryTerms.map((item) => item.letter)),
  ].sort()

  const filteredTerms = glossaryTerms.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory
    const matchesLetter = activeLetter === 'all' || item.letter === activeLetter

    return matchesSearch && matchesCategory && matchesLetter
  })

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 transition-colors duration-300 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <div className='max-w-3xl w-full'>
        <header className='mb-12 text-center'>
          <div className='inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'>
            Словарь сквоша
          </div>
          <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
            Глоссарий терминов
          </h1>
          <p className='text-sm leading-relaxed max-w-2xl mx-auto text-slate-500 dark:text-slate-400'>
            Разбор профессиональных ударов, сквош-сленга, судейской терминологии
            и разметки корта в алфавитном порядке.
          </p>
        </header>

        <div className='mb-6'>
          <input
            type='text'
            placeholder='Поиск термина или определения (например, боуст, ник)...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-all bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100'
          />
        </div>

        <div className='flex flex-wrap gap-2 mb-4 justify-center'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setActiveLetter('all')
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                  : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-900 shadow-xs'
              }`}
            >
              {cat === 'all' ? 'Все категории' : cat}
            </button>
          ))}
        </div>

        <div className='flex flex-wrap gap-1.5 mb-10 justify-center border-t border-b py-4 border-neutral-800/10 dark:border-neutral-800/40'>
          {letters.map((letChar) => (
            <button
              key={letChar}
              onClick={() => setActiveLetter(letChar)}
              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer border ${
                activeLetter === letChar
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                  : 'border-slate-100 dark:border-neutral-900 bg-white dark:bg-neutral-900/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800'
              }`}
            >
              {letChar === 'all' ? 'Все' : letChar}
            </button>
          ))}
        </div>

        <div className='flex flex-col gap-3'>
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item) => {
              const isExpanded = expandedId === item.id

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? 'border-amber-500/50 dark:border-amber-500/40 bg-white dark:bg-neutral-900/40 shadow-md dark:shadow-lg'
                      : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 hover:border-amber-500/20 dark:hover:border-neutral-700'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className='p-5 flex items-center justify-between cursor-pointer select-none'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-xl'>{item.emoji}</span>
                      <span className='font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100'>
                        {item.term}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-md border-slate-200 dark:border-neutral-800 text-slate-400 dark:text-slate-500'>
                        {item.category}
                      </span>
                      <span
                        className={`text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-500' : 'text-slate-500'}`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className='px-5 pb-5 pt-1 border-t text-sm leading-relaxed animate-fade-in border-slate-100 dark:border-neutral-800 text-slate-600 dark:text-slate-300'>
                      <p>{item.definition}</p>

                      <div className='mt-4 p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-500/5 text-slate-800 dark:text-slate-300'>
                        <span className='text-xs font-bold text-amber-500 uppercase tracking-wider block mb-1'>
                          💡 Совет тренера:
                        </span>
                        <p className='text-xs leading-relaxed'>{item.tip}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className='text-center py-12 text-sm text-slate-500'>
              Ничего не найдено по вашему запросу 🔍
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
