'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { countryFlags } from '@/constants/countryFlags'
import SearchInput from '@/components/ui/SearchInput'

export default function PlayersClient({ initialPlayers = [] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'male' | 'female' | 'retired'
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [sortBy, setSortBy] = useState('rank') // 'rank' | 'name' | 'titles'
  const [viewMode, setViewMode] = useState('grid') // 'grid' по умолчанию

  // Получаем уникальный список стран из базы данных
  const uniqueCountries = useMemo(() => {
    return [...new Set(initialPlayers.map((p) => p.country))].sort()
  }, [initialPlayers])

  // Фильтрация и сортировка игроков
  const filteredPlayers = useMemo(() => {
    let result = initialPlayers.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.racket.toLowerCase().includes(searchTerm.toLowerCase())

      let matchesTab = true
      if (activeTab === 'male') {
        matchesTab = player.gender === 'male' && player.status === 'active'
      } else if (activeTab === 'female') {
        matchesTab = player.gender === 'female' && player.status === 'active'
      } else if (activeTab === 'retired') {
        matchesTab = player.status === 'retired'
      } else if (activeTab === 'club') {
        matchesTab = player.custom
      }

      const matchesCountry =
        selectedCountry === 'all' || player.country === selectedCountry

      return matchesSearch && matchesTab && matchesCountry
    })

    // Явная локаль обязательна: ранги дублируются между мужским и женским
    // туром, а часть имён пока латиницей. Без неё порядок кириллица/латиница
    // зависит от локали среды, и SSR-порядок расходится с клиентским
    // (hydration mismatch).
    const byName = (a, b) => a.name.localeCompare(b.name, 'ru')

    result.sort((a, b) => {
      if (sortBy === 'rank') {
        if (a.status === 'retired' && b.status === 'active') return 1
        if (a.status === 'active' && b.status === 'retired') return -1
        if (a.status === 'active' && b.status === 'active') {
          // Игроки без ранга PSA (клубные, rank: null) — в конец списка
          const rankA = a.rank ?? Infinity
          const rankB = b.rank ?? Infinity
          if (rankA !== rankB) return rankA - rankB
          return byName(a, b)
        }
        return byName(a, b)
      } else if (sortBy === 'name') {
        return byName(a, b)
      } else if (sortBy === 'titles') {
        return b.titles - a.titles
      }
      return 0
    })

    return result
  }, [initialPlayers, searchTerm, activeTab, selectedCountry, sortBy])

  const tabCounts = useMemo(() => {
    return {
      all: initialPlayers.length,
      male: initialPlayers.filter(
        (p) => p.gender === 'male' && p.status === 'active',
      ).length,
      female: initialPlayers.filter(
        (p) => p.gender === 'female' && p.status === 'active',
      ).length,
      retired: initialPlayers.filter((p) => p.status === 'retired').length,
      club: initialPlayers.filter((p) => p.custom).length,
    }
  }, [initialPlayers])

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-300'>
      {/* Сетка растянута на всю ширину экрана (w-full max-w-none px-4 lg:px-8) */}
      <main className='flex-1 px-4 py-10 lg:px-8 lg:py-16 w-full max-w-none'>
        {/* Шапка и панель фильтров ограничены по ширине и отцентрированы; на всю ширину только карточки */}
        <div className='max-w-6xl mx-auto w-full'>
          {/* Заголовок страницы */}
          <header className='mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-6'>
            <div>
              <h1 className='text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100'>
                Игроки
              </h1>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl'>
                Реестр профессиональных сквошистов: топ-50 мужчин и женщин PSA
                World Tour, а также выдающиеся легенды мирового спорта.
              </p>
            </div>

            {/* Переключатель вида (Сетка / Список) - Сетка по умолчанию и идет первой */}
            <div className='flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-md self-start md:self-auto'>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Сетка
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Список
              </button>
            </div>
          </header>

          {/* Панель поиска и вкладок */}
          <section className='mb-8 space-y-4'>
            {/* Поиск и Вкладки в одну строку на десктопе */}
            <div className='flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between'>
              {/* Вкладки категорий */}
              <div className='flex items-center gap-1 border-b lg:border-none border-neutral-100 dark:border-neutral-900 pb-2 lg:pb-0 overflow-x-auto scrollbar-none'>
                {[
                  { id: 'all', label: 'Все' },
                  { id: 'male', label: 'Мужчины' },
                  { id: 'female', label: 'Женщины' },
                  { id: 'retired', label: 'Легенды' },
                  { id: 'club', label: 'Клуб' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        if (tab.id === 'retired' && sortBy === 'rank') {
                          setSortBy('titles')
                        } else if (
                          tab.id !== 'retired' &&
                          sortBy === 'titles'
                        ) {
                          setSortBy('rank')
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      {tab.label}
                      <span className='ml-1.5 text-[10px] opacity-60 font-normal'>
                        {tabCounts[tab.id]}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Поиск */}
              <div className='flex-1 max-w-md lg:ml-auto'>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder='Поиск по имени или стране...'
                  ariaLabel='Поиск по игрокам'
                  variant='neutral'
                />
              </div>
            </div>

            {/* Фильтры скрыты */}
            {/*
          <div className='h-px bg-neutral-100 dark:bg-neutral-900'></div>
          <div className='grid grid-cols-2 gap-3 max-w-md'>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className='px-2.5 py-2 rounded-md border text-xs font-medium cursor-pointer bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none'
            >
              <option value='all'>Все страны</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='px-2.5 py-2 rounded-md border text-xs font-medium cursor-pointer bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none'
            >
              {activeTab !== 'retired' && <option value='rank'>По рейтингу PSA</option>}
              <option value='titles'>По титулам</option>
              <option value='name'>По алфавиту</option>
            </select>
          </div>
          */}
          </section>
        </div>

        {/* Основной контент: Список или Сетка */}
        {filteredPlayers.length > 0 ? (
          viewMode === 'list' ? (
            /* ================= СПИСОК (STRICT LIST VIEW) ================= */
            <div className='border border-neutral-200/80 dark:border-neutral-900 rounded-lg overflow-hidden bg-white dark:bg-neutral-950/40 animate-fade-in'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse text-xs'>
                  <thead>
                    <tr className='border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider'>
                      <th className='p-3.5 pl-4 w-16 text-center'>Ранг</th>
                      <th className='p-3.5'>Имя игрока</th>
                      <th className='p-3.5 w-32'>Страна</th>
                      <th className='p-3.5 w-24 text-center'>Возраст</th>
                      <th className='p-3.5 hidden md:table-cell'>Ракетка</th>
                      <th className='p-3.5 w-20 text-center'>Титулы</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-neutral-100 dark:divide-neutral-900/60'>
                    {filteredPlayers.map((player) => {
                      const flag = countryFlags[player.countryCode] || ''
                      const isLegend = player.status === 'retired'

                      return (
                        <tr
                          key={player.id}
                          onClick={() => router.push(`/players/${player.id}`)}
                          className='hover:bg-neutral-50/80 dark:hover:bg-neutral-900/20 cursor-pointer transition-colors group'
                        >
                          {/* Ранг */}
                          <td className='p-3.5 pl-4 text-center font-semibold text-neutral-500 dark:text-neutral-400'>
                            {isLegend ? (
                              <span className='text-amber-500' title='Легенда'>
                                👑
                              </span>
                            ) : player.custom ? (
                              <span
                                className='text-neutral-400 dark:text-neutral-500'
                                title='Клубный игрок'
                              >
                                —
                              </span>
                            ) : (
                              `#${player.rank}`
                            )}
                          </td>
                          {/* Имя — единственная настоящая ссылка в строке;
                              остальные ячейки кликабельны через onClick на <tr> */}
                          <td className='p-3.5'>
                            <Link
                              href={`/players/${player.id}`}
                              className='font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors'
                            >
                              {player.name}
                            </Link>
                            <div className='text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5'>
                              {player.nameEn}
                            </div>
                          </td>
                          {/* Страна */}
                          <td className='p-3.5 text-neutral-600 dark:text-neutral-300 font-medium'>
                            <span className='mr-1.5'>{flag}</span>
                            {player.country}
                          </td>
                          {/* Возраст */}
                          <td className='p-3.5 text-center text-neutral-600 dark:text-neutral-400'>
                            {player.age}
                          </td>
                          {/* Ракетка */}
                          <td className='p-3.5 hidden md:table-cell text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[180px]'>
                            {player.racket}
                          </td>
                          {/* Титулы */}
                          <td className='p-3.5 text-center font-semibold text-neutral-700 dark:text-neutral-300'>
                            {player.titles}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ================= СЕТКА (STRICT GRID VIEW) ================= */
            /* Сетка растянута на всю ширину и использует больше колонок на больших экранах (grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6) */
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-16 animate-fade-in'>
              {filteredPlayers.map((player) => {
                const flag = countryFlags[player.countryCode] || ''
                const isLegend = player.status === 'retired'
                const initials = player.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)

                return (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}`}
                    className='rounded-lg transition-all duration-200 flex flex-col justify-between cursor-pointer bg-neutral-50 dark:bg-neutral-900/10 border border-neutral-200 dark:border-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 hover:shadow-xs overflow-hidden group aspect-[2/3] relative'
                  >
                    {/* Фото-зона на весь фон карточки */}
                    <div className='absolute inset-0 w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900/40 transition-transform duration-300 group-hover:scale-105'>
                      {player.photo ? (
                        <Image
                          src={player.photo}
                          alt={player.name}
                          fill
                          sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw'
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex flex-col items-center justify-center text-center opacity-60 dark:opacity-40'>
                          <span className='text-3xl font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider'>
                            {initials}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Градиентная подложка снизу для читаемости текста на фоне фото */}
                    <div className='absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent z-10'></div>

                    {/* Верхние бейджи поверх фото */}
                    <div className='absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20'>
                      {isLegend ? (
                        <span className='text-[8px] bg-amber-500/90 text-neutral-950 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm'>
                          Легенда
                        </span>
                      ) : player.custom ? (
                        <span className='text-[8px] bg-neutral-900/80 dark:bg-neutral-950/80 text-white dark:text-neutral-200 backdrop-blur-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-white/10 shadow-sm'>
                          Клубный
                        </span>
                      ) : (
                        <span className='text-[8px] bg-neutral-900/80 dark:bg-neutral-950/80 text-white dark:text-neutral-200 backdrop-blur-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-white/10 shadow-sm'>
                          PSA #{player.rank}
                        </span>
                      )}
                      <span
                        className='text-sm bg-neutral-900/40 dark:bg-neutral-950/40 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center shadow-sm'
                        title={player.country}
                      >
                        {flag}
                      </span>
                    </div>

                    {/* Текстовая информация в самом низу поверх градиента */}
                    <div className='absolute bottom-3 left-3 right-3 z-20 text-white'>
                      <h3 className='font-bold text-xs sm:text-sm tracking-tight line-clamp-1 group-hover:text-amber-400 transition-colors'>
                        {player.nameEn || player.name}
                      </h3>
                      <p className='text-[9px] text-neutral-300 dark:text-neutral-400 mt-0.5 font-medium'>
                        {player.country} • {player.age} лет
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        ) : (
          <div className='text-center py-16 border border-dashed border-neutral-200 dark:border-neutral-900 rounded-lg bg-neutral-50/30 dark:bg-neutral-900/5 mb-16'>
            <span className='text-2xl block mb-2'>🔍</span>
            <h3 className='text-sm font-bold text-neutral-700 dark:text-neutral-300'>
              Игроки не найдены
            </h3>
            <p className='text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-xs mx-auto'>
              Попробуйте изменить параметры фильтрации или поисковый запрос.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
