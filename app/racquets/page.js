'use client'

import { useState, useEffect } from 'react'
import { racquets } from '../../data/racquets'
import RacquetCard from '@/components/RacquetCard'
import RacquetDetailModal from '@/components/RacquetDetailModal'
import { useTheme } from '@/components/ThemeContext'

export default function RacquetsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Берем и состояние, и функцию переключения из нашего глобального контекста ThemeContext!
  const { isDarkMode, toggleTheme } = useTheme()

  // Состояния фильтрации и сравнения
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedWeight, setSelectedWeight] = useState('all')
  const [selectedShape, setSelectedShape] = useState('all')
  const [selectedBalance, setSelectedBalance] = useState('all')

  const [comparisonList, setComparisonList] = useState([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')

  // Новое состояние для открытого модального окна конкретной ракетки
  const [selectedRacquet, setSelectedRacquet] = useState(null)

  // Все локальные функции темы и useEffect удалены, так как ThemeProvider делает это за нас!

  // Логика добавления в сравнение
  const toggleComparison = (racquet) => {
    const exists = comparisonList.find((item) => item.id === racquet.id)
    if (exists) {
      setComparisonList(comparisonList.filter((item) => item.id !== racquet.id))
      setWarningMessage('')
    } else {
      if (comparisonList.length >= 5) {
        setWarningMessage('Максимум 5 ракеток для сравнения! ⚠️')
        setTimeout(() => setWarningMessage(''), 3000)
        return
      }
      setComparisonList([...comparisonList, racquet])
    }
  }

  // Фильтрация данных
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

    let matchesWeight = true
    if (selectedWeight === 'light') matchesWeight = racquet.weight < 120
    if (selectedWeight === 'medium')
      matchesWeight = racquet.weight >= 120 && racquet.weight <= 130
    if (selectedWeight === 'heavy') matchesWeight = racquet.weight > 130

    return (
      matchesSearch &&
      matchesBrand &&
      matchesShape &&
      matchesBalance &&
      matchesWeight
    )
  })

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30'>
      {/* Основная текстовая область документа */}
      <main className='flex-1 px-6 py-12 lg:px-16 lg:py-20 max-w-4xl mx-auto w-full'>
        <header className='mb-16'>
          <h1
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
              isDarkMode
                ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-slate-800 to-amber-800 bg-clip-text text-transparent'
            }`}
          >
            Ракетки
          </h1>
          <p
            className={`text-base leading-relaxed max-w-3xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Ракетки для сквоша и все, что с ними связано. Технический разбор,
            параметры веса, баланс и сравнение профессиональных сквош-ракеток.
          </p>
        </header>
        {/* Панель фильтров и поиска */}
        <section
          className={`p-6 rounded-2xl border mb-10 transition-all ${
            isDarkMode
              ? 'border-neutral-800 bg-neutral-900/20'
              : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          {/* Поиск */}
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Поиск по бренду или модели (например, Dunlop, Harrow)...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-all ${
                isDarkMode
                  ? 'bg-neutral-950 border-neutral-800 text-slate-100'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Селекты фильтрации */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={`px-3 py-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-950 border-neutral-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value='all'>Все бренды</option>
              <option value='Tecnifibre'>Tecnifibre</option>
              <option value='Dunlop'>Dunlop</option>
              <option value='Head'>Head</option>
              <option value='Harrow'>Harrow</option>
              <option value='Karakal'>Karakal</option>
            </select>

            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className={`px-3 py-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-950 border-neutral-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value='all'>Любой вес</option>
              <option value='light'>Легкие (&lt;120г)</option>
              <option value='medium'>Средние (120-130г)</option>
              <option value='heavy'>Тяжелые (&gt;130г)</option>
            </select>

            <select
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
              className={`px-3 py-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-950 border-neutral-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value='all'>Любая форма</option>
              <option value='Каплевидная'>Каплевидная</option>
              <option value='Классическая'>Классическая</option>
            </select>

            <select
              value={selectedBalance}
              onChange={(e) => setSelectedBalance(e.target.value)}
              className={`px-3 py-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-950 border-neutral-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value='all'>Любой баланс</option>
              <option value='В голову'>В голову</option>
              <option value='Нейтральный'>Нейтральный</option>
              <option value='В ручку'>В ручку</option>
            </select>
          </div>
        </section>
        {warningMessage && (
          <div className='p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-bold mb-6 text-center animate-bounce'>
            {warningMessage}
          </div>
        )}
        {/* Минималистичная сетка ракеток формата фото-название */}
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-6 mb-16'>
          {filteredRacquets.map((racquet) => (
            <RacquetCard
              key={racquet.id}
              racquet={racquet}
              isDarkMode={isDarkMode}
              isCompared={
                !!comparisonList.find((item) => item.id === racquet.id)
              }
              onClick={() => setSelectedRacquet(racquet)} // Клик по карточке открывает модальное окно
            />
          ))}
        </div>
        {/* Плавающая панель сравнения внизу */}
        {comparisonList.length > 0 && (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 p-4 rounded-2xl border flex items-center justify-between gap-6 shadow-xl max-w-lg w-[90%] backdrop-blur-md animate-fade-in ${
              isDarkMode
                ? 'bg-neutral-900/90 border-neutral-800 text-slate-200'
                : 'bg-white/95 border-slate-200 text-slate-800'
            }`}
          >
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
              Сравнить 📊
            </button>
          </div>
        )}
        {/* Персональное модальное окно деталей ракетки */}
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
        {/* Таблица сравнения ракеток бок о бок */}
        {isCompareModalOpen && (
          <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'>
            <div
              className={`w-full max-w-4xl p-6 rounded-2xl border shadow-2xl relative ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
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
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850'
                          : 'border-b border-slate-200'
                      }
                    >
                      <th className='p-3 text-slate-500 font-bold uppercase tracking-wider w-[150px]'>
                        Параметр
                      </th>
                      {comparisonList.map((item) => (
                        <th
                          key={item.id}
                          className='p-3 font-bold text-sm text-amber-500 w-[150px]'
                        >
                          {item.brand} <br />
                          <span
                            className={
                              isDarkMode
                                ? 'text-slate-100 font-medium text-xs'
                                : 'text-slate-900 font-medium text-xs'
                            }
                          >
                            {item.model}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}
                  >
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850/50'
                          : 'border-b border-slate-200/50'
                      }
                    >
                      <td className='p-3 font-bold text-slate-500'>Вес рамы</td>
                      {comparisonList.map((item) => (
                        <td key={item.id} className='p-3 font-semibold'>
                          {item.weight} г
                        </td>
                      ))}
                    </tr>
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850/50'
                          : 'border-b border-slate-200/50'
                      }
                    >
                      <td className='p-3 font-bold text-slate-500'>Баланс</td>
                      {comparisonList.map((item) => (
                        <td key={item.id} className='p-3 font-semibold'>
                          {item.balanceText} ({item.balanceNum} мм)
                        </td>
                      ))}
                    </tr>
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850/50'
                          : 'border-b border-slate-200/50'
                      }
                    >
                      <td className='p-3 font-bold text-slate-500'>
                        Форма головы
                      </td>
                      {comparisonList.map((item) => (
                        <td key={item.id} className='p-3 font-semibold'>
                          {item.headShape}
                        </td>
                      ))}
                    </tr>
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850/50'
                          : 'border-b border-slate-200/50'
                      }
                    >
                      <td className='p-3 font-bold text-slate-500'>
                        Струнная формула
                      </td>
                      {comparisonList.map((item) => (
                        <td key={item.id} className='p-3 font-semibold'>
                          {item.stringPattern}
                        </td>
                      ))}
                    </tr>
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850/50'
                          : 'border-b border-slate-200/50'
                      }
                    >
                      <td className='p-3 font-bold text-slate-500'>
                        Площадь головы
                      </td>
                      {comparisonList.map((item) => (
                        <td key={item.id} className='p-3 font-semibold'>
                          {item.headSize} кв.см
                        </td>
                      ))}
                    </tr>
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850/50'
                          : 'border-b border-slate-200/50'
                      }
                    >
                      <td className='p-3 font-bold text-slate-500'>Материал</td>
                      {comparisonList.map((item) => (
                        <td key={item.id} className='p-3 font-semibold'>
                          {item.material}
                        </td>
                      ))}
                    </tr>
                    <tr
                      className={
                        isDarkMode
                          ? 'border-b border-neutral-850/50'
                          : 'border-b border-slate-200/50'
                      }
                    >
                      <td className='p-3 font-bold text-slate-500'>
                        Амбассадор
                      </td>
                      {comparisonList.map((item) => (
                        <td
                          key={item.id}
                          className='p-3 font-semibold italic text-amber-500/80'
                        >
                          {item.player}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='flex gap-3 justify-end mt-6'>
                <button
                  onClick={() => setComparisonList([])}
                  className='px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/5 font-bold text-xs cursor-pointer transition-all'
                >
                  Очистить список 🔄
                </button>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer transition-all'
                >
                  Закрыть 🚪
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
