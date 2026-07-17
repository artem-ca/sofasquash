'use client'

import { useState, useEffect, useRef } from 'react'

// Плавающая панель + модальная таблица сравнения ракеток.
// Используется и в общем каталоге (/racquets), и на страницах брендов.
// comparisonList — выбранные ракетки, onClear — сброс всего списка.

const COMPARE_ROWS = [
  { title: 'Год выпуска', val: (r) => `${r.year} г` },
  { title: 'Вес рамы', val: (r) => `${r.weight} г` },
  { title: 'Баланс', val: (r) => `${r.balanceText} (${r.balanceNum} мм)` },
  { title: 'Форма головы', val: (r) => r.headShape },
  { title: 'Струнная формула', val: (r) => r.stringPattern },
  { title: 'Площадь головы', val: (r) => `${r.headSize} кв.см` },
  { title: 'Материал', val: (r) => r.material },
  { title: 'Амбассадор', val: (r) => r.player, accent: true },
]

export default function RacquetComparison({ comparisonList, onClear }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dialogRef = useRef(null)

  // Фокус-менеджмент модалки сравнения: переносим фокус внутрь при открытии,
  // возвращаем на элемент, с которого открыли, при закрытии, и закрываем по Escape
  useEffect(() => {
    if (!isModalOpen) return

    const previouslyFocused = document.activeElement
    dialogRef.current?.focus()

    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [isModalOpen])

  if (comparisonList.length === 0) return null

  return (
    <>
      {/* Плавающая панель */}
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-40 p-4 rounded-2xl border flex items-center justify-between gap-6 shadow-xl max-w-lg w-[90%] backdrop-blur-md animate-fade-in bg-white/95 dark:bg-neutral-900/90 border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-slate-200'>
        <div>
          <div className='text-xs font-bold uppercase tracking-wider text-amber-500'>
            Сравнение ракеток
          </div>
          <div className='text-xs text-slate-400 mt-0.5'>
            Выбрано моделей: {comparisonList.length} из 5
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer active:scale-95 transition-all'
        >
          Сравнить
        </button>
      </div>

      {/* Модальная таблица сравнения */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'>
          <div
            ref={dialogRef}
            tabIndex={-1}
            role='dialog'
            aria-modal='true'
            aria-label='Таблица сравнения ракеток'
            className='w-full max-w-2xl p-6 rounded-2xl border shadow-2xl relative bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100 focus:outline-none'
          >
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label='Закрыть окно сравнения'
              className='absolute top-4 right-4 text-slate-400 hover:text-slate-200 font-bold cursor-pointer text-xl'
            >
              ✕
            </button>

            <h2 className='text-xl font-bold mb-6 text-amber-500'>
              Таблица сравнения ракеток
            </h2>

            <div className='overflow-x-auto pb-4'>
              <table className='w-full text-xs text-left border-collapse min-w-[600px]'>
                <thead>
                  <tr className='border-b border-slate-200 dark:border-neutral-800'>
                    <th className='p-3 text-slate-500 font-bold uppercase tracking-wider w-[160px]'>
                      Параметр
                    </th>
                    {comparisonList.map((item) => (
                      <th
                        key={item.id}
                        className='p-3 font-bold text-amber-500 text-center w-[150px]'
                      >
                        {item.brand} <br />
                        <span className='text-slate-900 dark:text-slate-100 font-medium text-xs'>
                          {item.model}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='text-slate-700 dark:text-slate-300'>
                  {COMPARE_ROWS.map((row) => (
                    <tr
                      key={row.title}
                      className='border-b border-slate-200/50 dark:border-neutral-800/50'
                    >
                      <td className='p-3 font-bold text-slate-500'>
                        {row.title}
                      </td>
                      {comparisonList.map((item) => (
                        <td
                          key={item.id}
                          className={`p-3 font-semibold text-center ${row.accent ? 'italic text-amber-500' : ''}`}
                        >
                          {row.val(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='flex gap-3 justify-end mt-6'>
              <button
                onClick={() => {
                  onClear()
                  setIsModalOpen(false)
                }}
                className='px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/5 font-bold text-xs cursor-pointer transition-all'
              >
                Очистить список
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer transition-all'
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
