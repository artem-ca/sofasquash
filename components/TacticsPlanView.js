'use client'

import { useState, useRef, useEffect } from 'react'
import { tacticsData } from '@/data/tactics'

/**
 * Вид сверху («план») для выбранного удара — компаньон к 3D-корту.
 * Управляется снаружи: удар и стороны приходят пропсами, своего селектора нет.
 * Стороны берём из `paths3d[idx].side` — массивы `paths` / `paths3d` / `tooltips`
 * в data/tactics.js выровнены по индексу.
 */
export default function TacticsPlanView({
  activeShot,
  showLeft = true,
  showRight = true,
  paused = false,
}) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' })

  const tooltipRef = useRef(null)
  const svgRef = useRef(null)
  const dimensionsRef = useRef({ width: 120, height: 32 })

  const activeInfo = tacticsData[activeShot]

  // Пауза общая с 3D-кортом. У SMIL (`animateMotion`) нет React-пропа для этого —
  // замораживаем через нативный SVG-API, тогда мяч встаёт на месте, а не в начале пути.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg?.pauseAnimations) return
    if (paused) svg.pauseAnimations()
    else svg.unpauseAnimations()
  }, [paused, activeShot, showLeft, showRight])

  useEffect(() => {
    if (tooltip.show && tooltipRef.current) {
      dimensionsRef.current = {
        width: tooltipRef.current.clientWidth,
        height: tooltipRef.current.clientHeight,
      }
    }
  }, [tooltip.text, tooltip.show])

  // Прячем тултип при смене удара/сторон — он относился к прошлой траектории
  useEffect(() => {
    setTooltip((prev) => (prev.show ? { ...prev, show: false } : prev))
  }, [activeShot, showLeft, showRight])

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
    setTooltip((prev) => ({ ...prev, show: true, text }))
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }))
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

  if (!activeInfo) return null

  const visible = (activeInfo.paths ?? []).map((d, idx) => ({
    d,
    idx,
    side: activeInfo.paths3d?.[idx]?.side,
  }))

  return (
    <div className='relative tactics-wrapper'>
      {tooltip.show && (
        <div
          ref={tooltipRef}
          className='absolute pointer-events-none z-50 px-3 py-2 rounded-lg text-[10px] font-bold shadow-xl border backdrop-blur-md transition-all duration-75 max-w-[220px] w-max bg-white/95 dark:bg-neutral-950/95 border-amber-600/40 dark:border-amber-500/30 text-amber-600 dark:text-amber-400'
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox='0 0 400 480'
        className='w-full h-auto select-none'
        role='img'
        aria-label={`Вид сверху: ${activeInfo.title}`}
      >
        <rect
          x='40'
          y='30'
          width='320'
          height='420'
          strokeWidth='3'
          className='fill-slate-50 dark:fill-neutral-950 stroke-slate-200 dark:stroke-neutral-800'
        />

        <line x1='40' y1='290' x2='360' y2='290' stroke='#ef4444' strokeWidth='2' />
        <line x1='200' y1='290' x2='200' y2='450' stroke='#ef4444' strokeWidth='2' />

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

        <line x1='40' y1='30' x2='360' y2='30' stroke='#ef4444' strokeWidth='6' />
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

        {visible.map(({ d, idx, side }) => {
          if (side === 'left' && !showLeft) return null
          if (side === 'right' && !showRight) return null

          return (
            <g key={idx}>
              {/* Тонкая визуальная линия траектории */}
              <path
                d={d}
                fill='none'
                stroke='#f59e0b'
                strokeWidth='3'
                strokeDasharray='6,6'
                className='transition-all duration-300'
              />

              {/* Хитбокс: наведение (desktop), тап (touch), фокус (клавиатура) */}
              <path
                d={d}
                fill='none'
                stroke='transparent'
                strokeWidth='28'
                tabIndex={0}
                role='button'
                aria-label={activeInfo.tooltips?.[idx]}
                className='cursor-help focus:outline-none focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2'
                onMouseMove={handleMouseMove}
                onMouseEnter={() => handleMouseEnter(activeInfo.tooltips?.[idx])}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleClick(activeInfo.tooltips?.[idx], e)}
                onFocus={(e) => handleFocus(activeInfo.tooltips?.[idx], e)}
                onBlur={handleMouseLeave}
              />

              {/* Анимированная группа: двухточечный мяч */}
              <g className='cursor-help'>
                <animateMotion
                  dur={activeInfo.dur || '2.0s'}
                  repeatCount='indefinite'
                  path={d}
                  key={`${activeShot}-${idx}`}
                />
                <circle
                  r='7.5'
                  className='fill-stone-900 dark:fill-slate-50 stroke-slate-400 dark:stroke-zinc-700'
                  strokeWidth='0.8'
                />
                <circle cx='-2' cy='-1.5' r='1.2' fill='#fbbf24' />
                <circle cx='2.5' cy='1.5' r='1.2' fill='#fbbf24' />
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
