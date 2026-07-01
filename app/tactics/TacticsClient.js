'use client'

import CourtVisualizer from '@/components/CourtVisualizer'
import TacticsBoard from '@/components/TacticsBoard'

export default function TacticsClient() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 transition-colors duration-300 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <div className='max-w-4xl w-full'>
        <header className='mb-12 text-center'>
          <div className='inline-flex border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-600 dark:text-neutral-400 rounded px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4'>
            Физика и тактика сквоша
          </div>
          <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
            Тактический планшет
          </h1>
          <p className='text-base leading-relaxed max-w-2xl mx-auto text-slate-500 dark:text-slate-400'>
            Разберите геометрию отскоков и траекторию полета мяча. Кликайте на
            удары ниже, чтобы увидеть их физику на интерактивном корте.
          </p>
        </header>

        {/* 3D-Корт */}
        <CourtVisualizer />

        {/* Наш тактический планшет */}
        <div className='mt-12'>
          <TacticsBoard />
        </div>
      </div>
    </div>
  )
}
