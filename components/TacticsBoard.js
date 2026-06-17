'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from './ThemeContext'
import { tacticsData } from '@/data/tactics'

export default function TacticsBoard() {
  const { isDarkMode } = useTheme() // Глобальная тема сайта

  // Локальное состояние темы: null (авто), 'dark' (темная), 'light' (светлая)
  const [themeOverride, setThemeOverride] = useState(null)

  // Итоговая тема ТОЛЬКО для прорисовки самого планшета
  const isComponentDark =
    themeOverride !== null ? themeOverride === 'dark' : isDarkMode

  const [activeShot, setActiveShot] = useState('drive')
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' })
  const tooltipRef = useRef(null)
  const dimensionsRef = useRef({ width: 120, height: 32 })

  const activeInfo = tacticsData[activeShot]

  useEffect(() => {
    if (tooltip.show && tooltipRef.current) {
      dimensionsRef.current = {
        width: tooltipRef.current.clientWidth,
        height: tooltipRef.current.clientHeight,
      }
    }
  }, [tooltip.text, tooltip.show])

  // Функция циклического переключения темы планшета
  const cycleLocalTheme = () => {
    if (themeOverride === null) {
      setThemeOverride('dark')
    } else if (themeOverride === 'dark') {
      setThemeOverride('light')
    } else {
      setThemeOverride(null)
    }
  }

  const handleMouseMove = (e) => {
    const container = e.currentTarget.closest('.tactics-wrapper')
    if (!container) return
    const rect = container.getBoundingClientRect()

    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    const actualWidth = dimensionsRef.current.width
    const actualHeight = dimensionsRef.current.height

    const GAP_X = 6
    const GAP_Y = 8
    const MIN_BORDER = 8

    let xPos = clientX + GAP_X
    if (clientX + GAP_X + actualWidth > rect.width) {
      xPos = clientX - actualWidth - GAP_X
    }
    xPos = Math.max(MIN_BORDER, xPos)

    let yPos = clientY - actualHeight - GAP_Y
    if (yPos < MIN_BORDER) {
      yPos = clientY + GAP_Y
    }

    setTooltip((prev) => ({
      ...prev,
      x: xPos,
      y: yPos,
    }))
  }

  const handleMouseEnter = (text) => {
    setTooltip((prev) => ({
      ...prev,
      show: true,
      text: text,
    }))
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({
      ...prev,
      show: false,
    }))
  }

  return (
    <div
      // Карточка всегда использует глобальную тему сайта isDarkMode
      className={`p-6 rounded-2xl border transition-all duration-300 relative tactics-wrapper ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20 text-slate-100'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      {/* ПАНЕЛЬ ПЕРЕКЛЮЧЕНИЯ ЛОКАЛЬНОЙ ТЕМЫ ПЛАНШЕТА (Один компактный тумблер) */}
      <div className='flex justify-end mb-4'>
        <button
          onClick={cycleLocalTheme}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
            isDarkMode
              ? 'bg-neutral-900 border-neutral-800 text-amber-400 hover:bg-neutral-850'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
          }`}
          title={
            themeOverride === null
              ? 'Режим планшета: Авто (соответствует сайту)'
              : themeOverride === 'dark'
                ? 'Режим планшета: Тёмный'
                : 'Режим планшета: Светлый'
          }
        >
          <span className='text-sm select-none'>
            {themeOverride === null
              ? '🌓'
              : themeOverride === 'dark'
                ? '🌙'
                : '☀️'}
          </span>
        </button>
      </div>

      {/* ПЛАВАЮЩИЙ ХИНТ У КУРСОРA */}
      {tooltip.show && (
        <div
          ref={tooltipRef}
          className='absolute pointer-events-none z-50 px-3 py-2 rounded-xl text-[10px] font-bold shadow-xl border backdrop-blur-md transition-all duration-75 max-w-[220px] w-max'
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            backgroundColor: isComponentDark
              ? 'rgba(10, 10, 12, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            borderColor: isComponentDark
              ? 'rgba(245, 158, 11, 0.3)'
              : 'rgba(217, 119, 6, 0.4)',
            color: isComponentDark ? '#fbbf24' : '#d97706',
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-8 items-center'>
        {/* Левая колонка: Интерактивный SVG-планшет */}
        <div className='flex flex-col items-center justify-center'>
          <svg
            viewBox='0 0 400 480'
            className='w-full max-w-[340px] h-auto select-none'
          >
            <rect
              x='40'
              y='30'
              width='320'
              height='420'
              strokeWidth='3'
              fill={isComponentDark ? '#0f0f12' : '#f8fafc'}
              stroke={isComponentDark ? '#26262c' : '#cbd5e1'}
            />

            <line
              x1='40'
              y1='290'
              x2='360'
              y2='290'
              stroke='#ef4444'
              strokeWidth='2'
            />
            <line
              x1='200'
              y1='290'
              x2='200'
              y2='450'
              stroke='#ef4444'
              strokeWidth='2'
            />

            {/* Левая зона подачи (3 стороны, без боковой стены) */}
            <path
              d='M 40,290 L 100,290 L 100,350 L 40,350'
              fill='transparent'
              stroke='#ef4444'
              strokeWidth='2'
            />
            {/* Правая зона подачи (3 стороны, без боковой стены) */}
            <path
              d='M 360,290 L 300,290 L 300,350 L 360,350'
              fill='transparent'
              stroke='#ef4444'
              strokeWidth='2'
            />

            <line
              x1='40'
              y1='30'
              x2='360'
              y2='30'
              stroke='#ef4444'
              strokeWidth='6'
            />
            <text
              x='200'
              y='20'
              textAnchor='middle'
              className='text-[10px] font-bold uppercase tracking-wider transition-colors duration-300'
              fill={isComponentDark ? '#64748b' : '#94a3b8'}
            >
              Передняя стена
            </text>

            <text
              x='200'
              y='472'
              textAnchor='middle'
              className='text-[10px] font-bold uppercase tracking-wider transition-colors duration-300'
              fill={isComponentDark ? '#64748b' : '#94a3b8'}
            >
              Задняя стена (Стекло)
            </text>

            {/* РЕНДЕРИНГ СИММЕТРИЧНЫХ ТРАЕКТОРИЙ И ХИТБОКСОВ */}
            {activeInfo.paths.map((path, idx) => (
              <g key={idx}>
                {/* Тонкая визуальная линия траектории */}
                <path
                  d={path}
                  fill='none'
                  stroke='#f59e0b'
                  strokeWidth='3'
                  strokeDasharray='6,6'
                  className='transition-all duration-300'
                />

                {/* Увеличили хитбокс до '28' */}
                <path
                  d={path}
                  fill='none'
                  stroke='transparent'
                  strokeWidth='28'
                  className='cursor-help'
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() =>
                    handleMouseEnter(activeInfo.tooltips[idx])
                  }
                  onMouseLeave={handleMouseLeave}
                />

                {/* Анимированная группа: Двухточечный черный/белый мяч */}
                <g className='cursor-help'>
                  <animateMotion
                    dur={activeInfo.dur || '2.0s'}
                    repeatCount='indefinite'
                    path={path}
                    key={`${activeShot}-${idx}`}
                  />
                  {/* Черный или белый матовый мяч в зависимости от темы */}
                  <circle
                    r='7.5'
                    fill={isComponentDark ? '#f8fafc' : '#1c1917'}
                    stroke={isComponentDark ? '#3f3f46' : '#94a3b8'}
                    strokeWidth='0.8'
                  />
                  {/* Две маленькие желтые точки */}
                  <circle cx='-2' cy='-1.5' r='1.2' fill='#fbbf24' />
                  <circle cx='2.5' cy='1.5' r='1.2' fill='#fbbf24' />
                </g>
              </g>
            ))}
          </svg>
        </div>

        {/* Правая колонка: Выбор удара и разбор */}
        <div className='flex flex-col justify-between h-full'>
          <div>
            <span className='text-xs font-bold text-amber-500 uppercase tracking-widest block mb-4'>
              Выберите тип удара:
            </span>

            {/* Кнопки выбора удара */}
            <div className='flex flex-wrap gap-2 mb-6'>
              {Object.keys(tacticsData).map((shotKey) => (
                <button
                  key={shotKey}
                  onClick={() => {
                    setActiveShot(shotKey)
                    setTooltip((prev) => ({ ...prev, show: false })) // Сброс хинта
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    activeShot === shotKey
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                      : isDarkMode // ✅ ИСПРАВЛЕНО: Теперь кнопки строго привязаны к глобальной теме сайта
                        ? 'border-neutral-800 bg-neutral-900/30 text-slate-400 hover:text-slate-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  {shotKey === 'drive'
                    ? 'Драйв'
                    : shotKey === 'boast'
                      ? 'Боуст'
                      : shotKey === 'crosscourt'
                        ? 'Кросс'
                        : shotKey === 'lob'
                          ? 'Лоб'
                          : shotKey === 'drop'
                            ? 'Дроп'
                            : 'Киллшот'}
                </button>
              ))}
            </div>

            {/* Карточка разбора (всегда сохраняет общую тему сайта isDarkMode) */}
            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-neutral-950/40 border-neutral-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h3
                className={`font-extrabold text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
              >
                {activeInfo.title}
              </h3>
              <p
                className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {activeInfo.desc}
              </p>

              {/* Тактическое применение */}
              <div className='mt-4 pt-3 border-t border-neutral-800/10'>
                <span className='text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1'>
                  Когда применять:
                </span>
                <p
                  className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  {activeInfo.when}
                </p>
              </div>

              {/* Частые ошибки */}
              <div className='mt-4 pt-3 border-t border-neutral-800/10'>
                <span className='text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1'>
                  Частая ошибка новичков:
                </span>
                <p
                  className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  {activeInfo.mistake}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
