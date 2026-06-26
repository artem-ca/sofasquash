'use client'

import { useState, useEffect } from 'react'
import { racquets } from '../../data/racquets'
import RacquetCard from '@/components/RacquetCard'
import RacquetDetailModal from '@/components/RacquetDetailModal'
import { useTheme } from '@/components/ThemeContext'

export default function RacquetsPage() {
  const { isDarkMode } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedWeight, setSelectedWeight] = useState('all')
  const [selectedShape, setSelectedShape] = useState('all')
  const [selectedBalance, setSelectedBalance] = useState('all')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')

  const [comparisonList, setComparisonList] = useState([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [selectedRacquet, setSelectedRacquet] = useState(null)

  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => setWarningMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [warningMessage])

  const toggleComparison = (racquet) => {
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
  }

  const filteredRacquets = racquets.filter((racquet) => {
    const matchesSearch =
      racquet.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      racquet.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBrand =
      selectedBrand === 'all' || racquet.brand === selectedBrand
    const matchesShape =
      selectedShape === 'all' || racquet.headShape === selectedShape
    const matchesBalance =
      selectedBalance === 'all' || racquet.balanceText === selectedBalance
    const matchesAgeGroup =
      selectedAgeGroup === 'all' || racquet.ageGroup === selectedAgeGroup

    let matchesWeight = true
    if (selectedWeight === 'light') matchesWeight = racquet.weight < 120
    if (selectedWeight === 'medium')
      matchesWeight = racquet.weight >= 120 && racquet.weight <= 130
    if (selectedWeight === 'heavy') matchesWeight = racquet.weight > 130

    let matchesYear = true
    if (selectedYear === '2024-2026')
      matchesYear = racquet.year >= 2024 && racquet.year <= 2026
    if (selectedYear === '2020-2023')
      matchesYear = racquet.year >= 2020 && racquet.year <= 2023
    if (selectedYear === '2015-2019')
      matchesYear = racquet.year >= 2015 && racquet.year <= 2019
    if (selectedYear === '2010-2014')
      matchesYear = racquet.year >= 2010 && racquet.year <= 2014
    if (selectedYear === 'under-2010') matchesYear = racquet.year < 2010

    return (
      matchesSearch &&
      matchesBrand &&
      matchesShape &&
      matchesBalance &&
      matchesWeight &&
      matchesAgeGroup &&
      matchesYear
    )
  })

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30'>
      <main className='flex-1 px-6 py-12 lg:px-16 lg:py-20 w-full'>
        <div className='max-w-6xl mx-auto w-full mb-12'>
          <header className='mb-12 text-center'>
            <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
              Энциклопедия ракеток
            </h1>
            <p className='text-base leading-relaxed text-slate-600 dark:text-slate-400'>
              Технический разбор, параметры веса, геометрия и сравнение
              профессиональных сквош-ракеток (WSF).
            </p>
          </header>

          <section className='p-6 rounded-2xl border transition-all border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 shadow-xs'>
            <div className='mb-4'>
              <input
                type='text'
                placeholder='Поиск среди 160 моделей по бренду или названию (например, Dunlop, Harrow)...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-all bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100'
              />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
              {['Brand', 'Weight', 'Shape', 'Balance', 'AgeGroup', 'Year'].map(
                (filterType) => {
                  const stateMap = {
                    Brand: {
                      val: selectedBrand,
                      set: setSelectedBrand,
                      opt: [
                        ['all', 'Все бренды'],
                        ['Harrow', 'Harrow'],
                        ['Head', 'Head'],
                        ['Tecnifibre', 'Tecnifibre'],
                        ['Dunlop', 'Dunlop'],
                        ['Oliver', 'Oliver'],
                        ['Karakal', 'Karakal'],
                        ['Eye', 'Eye'],
                        ['Prince', 'Prince'],
                        ['Black Knight', 'Black Knight'],
                        ['Wilson', 'Wilson'],
                        ['Salming', 'Salming'],
                        ['Unsquashable', 'Unsquashable'],
                        ['Xamsa', 'Xamsa'],
                      ],
                    },
                    Weight: {
                      val: selectedWeight,
                      set: setSelectedWeight,
                      opt: [
                        ['all', 'Любой вес'],
                        ['light', 'Легкие (<120г)'],
                        ['medium', 'Средние (120-130г)'],
                        ['heavy', 'Тяжелые (>130г)'],
                      ],
                    },
                    Shape: {
                      val: selectedShape,
                      set: setSelectedShape,
                      opt: [
                        ['all', 'Любая форма'],
                        ['Каплевидная', 'Каплевидная'],
                        ['Классическая', 'Классическая'],
                      ],
                    },
                    Balance: {
                      val: selectedBalance,
                      set: setSelectedBalance,
                      opt: [
                        ['all', 'Любой баланс'],
                        ['В голову', 'В голову'],
                        ['Нейтральный', 'Нейтральный'],
                        ['В ручку', 'В ручку'],
                      ],
                    },
                    AgeGroup: {
                      val: selectedAgeGroup,
                      set: setSelectedAgeGroup,
                      opt: [
                        ['all', 'Любой возраст'],
                        ['Взрослая', 'Взрослая'],
                        ['Детская', 'Детская'],
                      ],
                    },
                    Year: {
                      val: selectedYear,
                      set: setSelectedYear,
                      opt: [
                        ['all', 'Любой год'],
                        ['2024-2026', '2024-2026 (Новинки)'],
                        ['2020-2023', '2020-2023'],
                        ['2015-2019', '2015-2019'],
                        ['2010-2014', '2010-2014'],
                        ['under-2010', 'До 2010 (Ретро)'],
                      ],
                    },
                  }[filterType]

                  return (
                    <select
                      key={filterType}
                      value={stateMap.val}
                      onChange={(e) => stateMap.set(e.target.value)}
                      className='px-3 py-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100'
                    >
                      {stateMap.opt.map(([v, label]) => (
                        <option key={v} value={v}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )
                },
              )}
            </div>
          </section>
        </div>

        {warningMessage && (
          <div className='p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-bold mb-6 text-center animate-bounce'>
            {warningMessage}
          </div>
        )}

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 w-full'>
          {filteredRacquets.map((racquet) => (
            <RacquetCard
              key={racquet.id}
              racquet={racquet}
              isDarkMode={isDarkMode}
              isCompared={
                !!comparisonList.find((item) => item.id === racquet.id)
              }
              onClick={() => setSelectedRacquet(racquet)}
            />
          ))}
        </div>

        {comparisonList.length > 0 && (
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
              onClick={() => setIsCompareModalOpen(true)}
              className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer active:scale-95 transition-all'
            >
              Сравнить
            </button>
          </div>
        )}

        {selectedRacquet && (
          <RacquetDetailModal
            racquet={selectedRacquet}
            isDarkMode={isDarkMode}
            isCompared={
              !!comparisonList.find((item) => item.id === selectedRacquet.id)
            }
            onToggleComparison={toggleComparison}
            onClose={() => setSelectedRacquet(null)}
          />
        )}

        {isCompareModalOpen && (
          <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'>
            <div className='w-full max-w-2xl p-6 rounded-2xl border shadow-2xl relative bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100'>
              <button
                onClick={() => setIsCompareModalOpen(false)}
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
                    {[
                      'Year',
                      'Weight',
                      'Balance',
                      'Shape',
                      'String',
                      'Size',
                      'Material',
                      'Player',
                    ].map((param) => {
                      const labelMap = {
                        Year: {
                          title: 'Год выпуска',
                          val: (item) => `${item.year} г`,
                        },
                        Weight: {
                          title: 'Вес рамы',
                          val: (item) => `${item.weight} г`,
                        },
                        Balance: {
                          title: 'Баланс',
                          val: (item) =>
                            `${item.balanceText} (${item.balanceNum} мм)`,
                        },
                        Shape: {
                          title: 'Форма головы',
                          val: (item) => item.headShape,
                        },
                        String: {
                          title: 'Струнная формула',
                          val: (item) => item.stringPattern,
                        },
                        Size: {
                          title: 'Площадь головы',
                          val: (item) => `${item.headSize} кв.см`,
                        },
                        Material: {
                          title: 'Материал',
                          val: (item) => item.material,
                        },
                        Player: {
                          title: 'Амбассадор',
                          val: (item) => item.player,
                        },
                      }[param]

                      return (
                        <tr
                          key={param}
                          className='border-b border-slate-200/50 dark:border-neutral-800/50'
                        >
                          <td className='p-3 font-bold text-slate-500'>
                            {labelMap.title}
                          </td>
                          {comparisonList.map((item) => (
                            <td
                              key={item.id}
                              className={`p-3 font-semibold text-center ${param === 'Player' ? 'italic text-amber-500' : ''}`}
                            >
                              {labelMap.val(item)}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className='flex gap-3 justify-end mt-6'>
                <button
                  onClick={() => setComparisonList([])}
                  className='px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/5 font-bold text-xs cursor-pointer transition-all'
                >
                  Очистить список
                </button>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer transition-all'
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
