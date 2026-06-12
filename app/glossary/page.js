'use client'

import { useState } from 'react'
import { useTheme } from '@/components/ThemeContext'
import { glossaryTerms } from '../../data/glossary'

export default function GlossaryPage() {
  const { isDarkMode } = useTheme()

  // Состояния для поиска, фильтрации и аккордеонов
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLetter, setActiveLetter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const categories = ['all', 'Удары', 'Разметка', 'Правила', 'Сленг']

  // Собираем все уникальные первые буквы терминов для алфавитного фильтра
  const letters = [
    'all',
    ...new Set(glossaryTerms.map((item) => item.letter)),
  ].sort()

  // Логика фильтрации данных
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
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-neutral-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className='max-w-3xl w-full'>
        <header className='mb-12 text-center'>
          <div
            className={`inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${
              isDarkMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            Словарь сквоша 📖
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
              isDarkMode
                ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}
          >
            Глоссарий терминов
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Разбор профессиональных ударов, сквош-сленга, судейской терминологии
            и разметки корта в алфавитном порядке.
          </p>
        </header>

        {/* Панель поиска */}
        <div className='mb-6'>
          <input
            type='text'
            placeholder='Поиск термина или определения (например, боуст, ник)...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-all ${
              isDarkMode
                ? 'bg-neutral-900 border-neutral-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          />
        </div>

        {/* Фильтр по категориям */}
        <div className='flex flex-wrap gap-2 mb-4 justify-center'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setActiveLetter('all') // Сбрасываем букву при смене категории
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                  : isDarkMode
                    ? 'border-neutral-800 bg-neutral-900/30 text-slate-400 hover:border-neutral-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-xs'
              }`}
            >
              {cat === 'all' ? 'Все категории' : cat}
            </button>
          ))}
        </div>

        {/* Алфавитный указатель */}
        <div className='flex flex-wrap gap-1.5 mb-10 justify-center border-t border-b py-4 border-neutral-800/10'>
          {letters.map((letChar) => (
            <button
              key={letChar}
              onClick={() => setActiveLetter(letChar)}
              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer border ${
                activeLetter === letChar
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                  : isDarkMode
                    ? 'border-neutral-900 bg-neutral-900/10 text-slate-400 hover:border-neutral-800'
                    : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {letChar === 'all' ? 'Все' : letChar}
            </button>
          ))}
        </div>

        {/* Список терминов (аккордеоны) */}
        <div className='flex flex-col gap-3'>
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item) => {
              const isExpanded = expandedId === item.id

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isDarkMode
                      ? isExpanded
                        ? 'border-amber-500/40 bg-neutral-900/40 shadow-lg shadow-amber-500/2'
                        : 'border-neutral-800 bg-neutral-900/10 hover:border-neutral-700'
                      : isExpanded
                        ? 'border-amber-500/50 bg-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-amber-500/20'
                  }`}
                >
                  {/* Шапка аккордеона */}
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className='p-5 flex items-center justify-between cursor-pointer select-none'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-xl'>{item.emoji}</span>
                      <span
                        className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
                      >
                        {item.term}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-md ${
                          isDarkMode
                            ? 'border-neutral-800 text-slate-500'
                            : 'border-slate-200 text-slate-400'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span
                        className={`text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-500' : 'text-slate-500'}`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Раскрывающееся содержимое */}
                  {isExpanded && (
                    <div
                      className={`px-5 pb-5 pt-1 border-t text-sm leading-relaxed animate-fade-in ${
                        isDarkMode
                          ? 'border-neutral-800 text-slate-350'
                          : 'border-slate-100 text-slate-600'
                      }`}
                    >
                      <p>{item.definition}</p>

                      {/* Блок "Совет тренера" */}
                      <div
                        className={`mt-4 p-4 rounded-xl border-l-4 border-amber-500 ${
                          isDarkMode
                            ? 'bg-amber-500/5 text-slate-300'
                            : 'bg-amber-50/50 text-slate-800'
                        }`}
                      >
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
