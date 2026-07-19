'use client'

import { useState, useRef, useEffect } from 'react'
import { tacticsData } from '@/data/tactics'

export default function TacticsBoard() {
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

  // Считает позицию тултипа внутри .tactics-wrapper по координатам курсора/фокуса
  const positionTooltip = (container, clientX, clientY) => {
    const rect = container.getBoundingClientRect()

    const x = clientX - rect.left
    const y = clientY - rect.top

    const actualWidth = dimensionsRef.current.width
    const actualHeight = dimensionsRef.current.height

    const GAP_X = 6
    const GAP_Y = 8
    const MIN_BORDER = 8

    let xPos = x + GAP_X
    if (x + GAP_X + actualWidth > rect.width) {
      xPos = x - actualWidth - GAP_X
    }
    xPos = Math.max(MIN_BORDER, xPos)

    let yPos = y - actualHeight - GAP_Y
    if (yPos < MIN_BORDER) {
      yPos = y + GAP_Y
    }

    return { x: xPos, y: yPos }
  }

  const handleMouseMove = (e) => {
    const container = e.currentTarget.closest('.tactics-wrapper')
    if (!container) return
    const { x, y } = positionTooltip(container, e.clientX, e.clientY)
    setTooltip((prev) => ({ ...prev, x, y }))
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

  // Клавиатура: позиционируем тултип у центра хитбокса (нет координат курсора)
  const handleFocus = (text, e) => {
    const path = e.currentTarget
    const container = path.closest('.tactics-wrapper')
    const svg = path.ownerSVGElement
    if (!container || !svg) return

    const bbox = path.getBBox()
    const point = svg.createSVGPoint()
    point.x = bbox.x + bbox.width / 2
    point.y = bbox.y + bbox.height / 2
    const screenPoint = point.matrixTransform(svg.getScreenCTM())

    setTooltip((prev) => ({
      ...prev,
      show: true,
      text,
      ...positionTooltip(container, screenPoint.x, screenPoint.y),
    }))
  }

  // Тач-устройства: hover недоступен, поэтому тап тоже показывает тултип у
  // точки касания. Не тоггл: реальный тап/клик сперва переводит фокус на
  // хитбокс (срабатывает handleFocus), затем всплывает сам click — если бы
  // это был тоггл, он гасил бы тултип, который handleFocus только что показал
  const handleClick = (text, e) => {
    const container = e.currentTarget.closest('.tactics-wrapper')
    if (!container) return
    setTooltip((prev) => ({
      ...prev,
      show: true,
      text,
      ...positionTooltip(container, e.clientX, e.clientY),
    }))
  }

  return (
    <div className='p-6 rounded-xl border transition-all duration-300 relative tactics-wrapper border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 text-slate-900 dark:text-slate-100'>
      {/* ПЛАВАЮЩИЙ ХИНТ У КУРСОРA (Позиционирование и стили вынесены в чистые Tailwind-классы) */}
      {tooltip.show && (
        <div
          ref={tooltipRef}
          className='absolute pointer-events-none z-50 px-3 py-2 rounded-lg text-[10px] font-bold shadow-xl border backdrop-blur-md transition-all duration-75 max-w-[220px] w-max bg-white/95 dark:bg-neutral-950/95 border-amber-600/40 dark:border-amber-500/30 text-amber-600 dark:text-amber-400'
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-8 items-start'>
        {/* Левая колонка: Интерактивный SVG-планшет */}
        <div className='flex flex-col items-center justify-center'>
          <svg
            viewBox='0 0 400 480'
            className='w-full max-w-[400px] h-auto select-none'
          >
            <rect
              x='40'
              y='30'
              width='320'
              height='420'
              strokeWidth='3'
              className='fill-slate-50 dark:fill-neutral-950 stroke-slate-200 dark:stroke-neutral-800'
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

            {/* Левая зона подачи */}
            <path
              d='M 40,290 L 100,290 L 100,350 L 40,350'
              fill='transparent'
              stroke='#ef4444'
              strokeWidth='2'
            />
            {/* Правая зона подачи */}
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
              className='text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 fill-slate-400 dark:fill-slate-500'
            >
              Передняя стена
            </text>

            <text
              x='200'
              y='472'
              textAnchor='middle'
              className='text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 fill-slate-400 dark:fill-slate-500'
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

                {/* Хитбокс: наведение (desktop), тап (touch), фокус (клавиатура) */}
                <path
                  d={path}
                  fill='none'
                  stroke='transparent'
                  strokeWidth='28'
                  tabIndex={0}
                  role='button'
                  aria-label={activeInfo.tooltips[idx]}
                  className='cursor-help focus:outline-none focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2'
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() =>
                    handleMouseEnter(activeInfo.tooltips[idx])
                  }
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleClick(activeInfo.tooltips[idx], e)}
                  onFocus={(e) => handleFocus(activeInfo.tooltips[idx], e)}
                  onBlur={handleMouseLeave}
                />

                {/* Анимированная группа: Двухточечный мяч */}
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
                    className='fill-stone-900 dark:fill-slate-50 stroke-slate-400 dark:stroke-zinc-700'
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
            {/* ШАПКА РАЗДЕЛА УДАРОВ */}
            <span className='text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest block mb-4'>
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
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    activeShot === shotKey
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                      : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-900 shadow-xs'
                  }`}
                >
                  {shotKey === 'drive'
                    ? 'Драйв'
                    : shotKey === 'boast'
                      ? 'Боуст'
                      : shotKey === 'reverse_boast'
                        ? 'Реверс-боуст'
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

            {/* Карточка разбора */}
            <div className='p-5 rounded-lg border transition-all duration-300 bg-slate-50 dark:bg-neutral-950/40 border-slate-200 dark:border-neutral-800 min-h-[310px] flex flex-col justify-between'>
              <div>
                <h2 className='font-extrabold text-base text-slate-900 dark:text-slate-100'>
                  {activeInfo.title}
                </h2>
                <p className='text-xs mt-2 leading-relaxed text-slate-500 dark:text-slate-400'>
                  {activeInfo.desc}
                </p>

                {/* Тактическое применение */}
                <div className='mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800/40'>
                  <span className='text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider block mb-1'>
                    Когда применять:
                  </span>
                  <p className='text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
                    {activeInfo.when}
                  </p>
                </div>
              </div>

              {/* Частые ошибки */}
              <div className='mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800/40'>
                <span className='text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1'>
                  Частая ошибка новичков:
                </span>
                <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
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
