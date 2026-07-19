'use client'

import { useState, useEffect, useRef } from 'react'
import { glossaryTerms } from '@/data/glossary'

// Соответствие словоформ из текста правил идентификаторам терминов глоссария
const termMapping = {
  жестянка: 'tin',
  жестянки: 'tin',
  лет: 'let',
  лета: 'let',
  строук: 'stroke',
  заступ: 'foot-fault',
  аут: 'out',
  аута: 'out',
  ауты: 'out',
  'переход подачи': 'hand-out',
}

const termsById = Object.fromEntries(
  glossaryTerms.map((item) => [item.id, item]),
)

export default function GlossaryTerm({ term }) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)

  // Тач-устройства: тултип открывается тапом, закрываем по тапу вне элемента
  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [isOpen])

  const termId = termMapping[term.toLowerCase()]
  const definition =
    (termId && termsById[termId]?.definition) ||
    'Определение термина не найдено в словаре.'

  return (
    <span
      ref={rootRef}
      className='relative inline-block'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type='button'
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
        onBlur={() => setIsOpen(false)}
        aria-expanded={isOpen}
        className='border-b border-dashed border-amber-500/70 font-semibold cursor-help transition-colors duration-150 mx-1 text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 bg-transparent p-0'
      >
        {term}
      </button>

      {isOpen && (
        <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl border text-xs leading-relaxed font-normal shadow-xl z-50 block pointer-events-none transition-all duration-200 bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300'>
          <span className='absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-neutral-900' />
          {definition}
        </span>
      )}
    </span>
  )
}
