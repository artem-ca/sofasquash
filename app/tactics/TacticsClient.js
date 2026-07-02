'use client'

import CourtVisualizer from '@/components/CourtVisualizer'
import TacticsBoard from '@/components/TacticsBoard'
import PageHeader from '@/components/ui/PageHeader'

export default function TacticsClient() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 transition-colors duration-300 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <div className='max-w-4xl w-full'>
        <PageHeader
          badge='Физика и тактика сквоша'
          badgeVariant='neutral'
          title='Тактический планшет'
          subtitle='Разберите геометрию отскоков и траекторию полета мяча. Кликайте на удары ниже, чтобы увидеть их физику на интерактивном корте.'
          subtitleClassName='text-base leading-relaxed max-w-2xl mx-auto text-slate-500 dark:text-slate-400'
        />

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
