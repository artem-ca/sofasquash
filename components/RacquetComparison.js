'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { racquets as allRacquets } from '@/data/racquets'

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

// Управляет списком сравнения + шарингом через URL (?compare=id1,id2,...).
// Общий для /racquets и /racquets/[brand] — id всегда ищутся по полному
// каталогу, поэтому ссылка со сравнением работает одинаково с любой страницы.
export function useRacquetComparison() {
  const [comparisonList, setComparisonList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')

  // Восстанавливаем список из ?compare= при загрузке и сразу открываем
  // таблицу, если моделей ≥2 — так поделённая ссылка ведёт прямо к сравнению
  useEffect(() => {
    const ids = new URLSearchParams(window.location.search).get('compare')
    if (!ids) return
    const found = ids
      .split(',')
      .map((id) => allRacquets.find((r) => r.id === id))
      .filter(Boolean)
      .slice(0, 5)
    if (found.length === 0) return
    setComparisonList(found)
    if (found.length >= 2) setIsModalOpen(true)
    // Читаем URL один раз при монтировании; allRacquets — стабильный
    // модульный импорт, а не пропс/стейт, поэтому в зависимостях не нужен
  }, [])

  // Синхронизируем список обратно в URL, чтобы текущее сравнение было можно
  // скопировать из адресной строки и переслать
  useEffect(() => {
    const url = new URL(window.location.href)
    if (comparisonList.length > 0) {
      url.searchParams.set('compare', comparisonList.map((r) => r.id).join(','))
    } else {
      url.searchParams.delete('compare')
    }
    window.history.replaceState({}, '', url)
  }, [comparisonList])

  useEffect(() => {
    if (!warningMessage) return
    const timer = setTimeout(() => setWarningMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [warningMessage])

  const toggle = useCallback(
    (racquet) => {
      const exists = comparisonList.find((item) => item.id === racquet.id)
      if (exists) {
        setComparisonList(comparisonList.filter((item) => item.id !== racquet.id))
        setWarningMessage('')
      } else {
        if (comparisonList.length >= 5) {
          setWarningMessage('Максимум 5 ракеток для сравнения!')
          return
        }
        setComparisonList([...comparisonList, racquet])
      }
    },
    [comparisonList],
  )

  const clear = useCallback(() => {
    setComparisonList([])
    setIsModalOpen(false)
  }, [])

  return {
    comparisonList,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    toggle,
    clear,
    warningMessage,
  }
}

export default function RacquetComparison({
  comparisonList,
  isModalOpen,
  onOpen,
  onClose,
  onClear,
}) {
  const dialogRef = useRef(null)

  // Фокус-менеджмент модалки сравнения: переносим фокус внутрь при открытии,
  // возвращаем на элемент, с которого открыли, при закрытии, и закрываем по Escape
  useEffect(() => {
    if (!isModalOpen) return

    const previouslyFocused = document.activeElement
    dialogRef.current?.focus()

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [isModalOpen, onClose])

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
          onClick={onOpen}
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
              onClick={onClose}
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
                onClick={onClear}
                className='px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/5 font-bold text-xs cursor-pointer transition-all'
              >
                Очистить список
              </button>
              <button
                onClick={onClose}
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
