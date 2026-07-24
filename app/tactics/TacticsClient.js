'use client'

import dynamic from 'next/dynamic'
import PageHeader from '@/components/ui/PageHeader'

import CourtVisualizer from '@/components/CourtVisualizer'
import TacticsBoard from '@/components/TacticsBoard'

// WebGL-канвас не может рендериться на сервере при статическом экспорте
const Court3D = dynamic(() => import('@/components/Court3D'), {
  ssr: false,
  loading: () => (
    <div className='aspect-[4/3] sm:aspect-[16/10] w-full my-8 rounded-xl border animate-pulse border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900/40' />
  ),
})

export default function TacticsClient() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 transition-colors duration-300 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100'>
      <div className='max-w-6xl w-full'>
        <PageHeader
          title='Корт: Геометрия и Тактика'
          subtitle='Разберите разметку корта и траектории ударов на интерактивной 3D-модели в масштабе 1:1.'
          subtitleClassName='text-base leading-relaxed max-w-2xl mx-auto text-slate-500 dark:text-slate-400'
        />

        {/* Корт: вкладка «Описание» — разметка и зоны, «Удары» — траектории
            в двух проекциях (перспектива + план сверху) */}
        <Court3D />

        {/* <CourtVisualizer /> */}
        {/* <TacticsBoard /> */}
      </div>
    </div>
  )
}
