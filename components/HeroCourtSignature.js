'use client'

// Сигнатурная схема корта для хиро главной страницы — переиспользует
// визуальный язык и реальные данные вкладки «Тактика» (тот же viewBox,
// разметка и мяч Dunlop с двумя точками, что и в TacticsPlanView), но
// не завязана на неё: это отдельная декоративная иллюстрация.
import { useEffect, useRef } from 'react'
import { tacticsData } from '@/data/tactics'

const DRIVE_PATH = tacticsData.drive.paths[0]

export default function HeroCourtSignature() {
  const svgRef = useRef(null)

  // Уважаем «уменьшить движение»: SMIL не читает media query сам по себе,
  // ставим/снимаем паузу через нативный SVG API (тот же приём, что и в TacticsPlanView).
  useEffect(() => {
    const svg = svgRef.current
    if (!svg?.pauseAnimations) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => (mq.matches ? svg.pauseAnimations() : svg.unpauseAnimations())
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox='0 0 400 480'
      className='w-full h-auto select-none'
      role='img'
      aria-label='Схема корта сверху с траекторией удара драйв вдоль боковой стены'
    >
      <rect
        x='40'
        y='30'
        width='320'
        height='420'
        strokeWidth='3'
        className='fill-white dark:fill-neutral-900/40 stroke-slate-200 dark:stroke-neutral-800'
      />

      {/* короткая линия и центральная линия — вместе формируют Т-зону */}
      <line x1='40' y1='290' x2='360' y2='290' stroke='#ef4444' strokeWidth='2' />
      <line x1='200' y1='290' x2='200' y2='450' stroke='#ef4444' strokeWidth='2' />

      {/* зоны подачи */}
      <path d='M 40,290 L 100,290 L 100,350 L 40,350' fill='transparent' stroke='#ef4444' strokeWidth='2' />
      <path d='M 360,290 L 300,290 L 300,350 L 360,350' fill='transparent' stroke='#ef4444' strokeWidth='2' />

      {/* передняя стена */}
      <line x1='40' y1='30' x2='360' y2='30' stroke='#ef4444' strokeWidth='6' />
      <text
        x='200'
        y='20'
        textAnchor='middle'
        className='text-[10px] font-bold uppercase tracking-wider fill-slate-400 dark:fill-slate-500'
      >
        Передняя стена
      </text>

      <circle cx='200' cy='290' r='4' fill='#f59e0b' className='motion-safe:animate-pulse' />
      <text
        x='210'
        y='304'
        className='text-[9px] font-bold uppercase tracking-wider fill-amber-600 dark:fill-amber-400'
      >
        Т-зона
      </text>

      {/* траектория удара драйв — тот же путь, что и на вкладке «Тактика» */}
      <path d={DRIVE_PATH} fill='none' stroke='#f59e0b' strokeWidth='3' strokeDasharray='6,6' />

      <g>
        <animateMotion dur='2.4s' repeatCount='indefinite' path={DRIVE_PATH} />
        <circle
          r='7.5'
          className='fill-stone-900 dark:fill-slate-50 stroke-slate-400 dark:stroke-zinc-700'
          strokeWidth='0.8'
        />
        <circle cx='-2' cy='-1.5' r='1.2' fill='#fbbf24' />
        <circle cx='2.5' cy='1.5' r='1.2' fill='#fbbf24' />
      </g>
    </svg>
  )
}
