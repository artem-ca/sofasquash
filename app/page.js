'use client'

import Link from 'next/link'
import CourtVisualizer from '@/components/CourtVisualizer'
import TacticsBoard from '@/components/TacticsBoard'
import PageHeader from '@/components/ui/PageHeader'

export default function HomePage() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20'>
      <div className='max-w-4xl w-full'>
        {/* Приветственный блок (Hero) */}
        <PageHeader
          badge='Добро пожаловать в мир сквоша'
          title='SQUASH PORTAL'
          subtitle='Ваш интерактивный справочник по сквошу. Изучайте разметку на 3D-корте, читайте официальные правила и выбирайте лучшие ракетки.'
        />

        {/* 3D-Корт */}
        <CourtVisualizer />

        {/* Интерактивный тактический планшет */}
        <div className='mt-12'>
          <TacticsBoard />
        </div>

        {/* Кнопка перехода к правилам */}
        <div className='mt-16 text-center'>
          <Link
            href='/rules'
            className='inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base shadow-lg transition-all active:scale-95 cursor-pointer'
          >
            Читать официальные правила сквоша (14 глав) ➡️
          </Link>
        </div>
      </div>
    </div>
  )
}
