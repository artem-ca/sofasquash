'use client'

import { useState } from 'react'

export default function GlossaryTerm({ term, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false)

  const glossary = {
    жестянка:
      'Звуковая панель в самом низу передней стены корта высотой 43 см. Попадание мяча в нее или ее верхний металлический бортик считается аутом.',
    жестянки:
      'Звуковая панель в самом низу передней стены корта высотой 43 см. Попадание мяча в нее или ее верхний металлический бортик считается аутом.',
    лет: 'Решение судьи переиграть розыгрыш без присуждения очков. Назначается при случайных или непредотвратимых помехах.',
    лета: 'Решение судьи переиграть розыгрыш без присуждения очков. Назначается при случайных или непредотвратимых помехах.',
    Лет: 'Решение судьи переиграть розыгрыш без присуждения очков. Назначается при случайных или непредотвратимых помехах.',
    строук:
      'Присуждение очка игроку из-за того, что соперник создал грубую или опасную помеху (например, заблокировал замах или прямую траекторию удара в стену).',
    Строук:
      'Присуждение очка игроку из-за того, что соперник создал грубую или опасную помеху (например, заблокировал замах или прямую траекторию удара в стену).',
    заступ:
      'Нарушение правил подачи, когда нога подающего полностью наступает на линию квадрата подачи в момент удара по мячу.',
    аут: 'Зона выше верхней красной линии на стенах корта или касание этой линии. Попадание мяча туда означает немедленный проигранный мяч.',
    аута: 'Зона выше верхней красной линии на стенах корта или касание этой линии. Попадание мяча туда означает немедленный проигранный мяч.',
    ауты: 'Зона выше верхней красной линии на стенах корта или касание этой линии. Попадание мяча туда означает немедленный проигранный мяч.',
    'переход подачи':
      'Ситуация, когда принимающий игрок выигрывает розыгрыш очка и забирает себе право подавать в следующем розыгрыше.',
  }

  const definition =
    glossary[term.toLowerCase()] || 'Определение термина не найдено в словаре.'

  return (
    <span
      className='relative inline-block'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className='border-b border-dashed border-amber-500/70 font-semibold cursor-help transition-colors duration-150 mx-1 text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300'>
        {term}
      </span>

      {isOpen && (
        <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl border text-xs leading-relaxed font-normal shadow-xl z-50 block pointer-events-none transition-all duration-200 bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300'>
          <span className='absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-neutral-900' />
          {definition}
        </span>
      )}
    </span>
  )
}
