'use client'

import Link from 'next/link'
import CourtVisualizer from '@/components/CourtVisualizer'
import TacticsBoard from '@/components/TacticsBoard'

export default function HomePage() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20'>
      <div className='max-w-4xl w-full'>
        {/* Приветственный блок (Hero) */}
        <header className='mb-12 text-center'>
          <div className='inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'>
            Добро пожаловать в мир сквоша
          </div>
          <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
            SQUASH PORTAL
          </h1>
          <p className='text-base leading-relaxed max-w-2xl mx-auto text-slate-600 dark:text-slate-400'>
            Ваш интерактивный справочник по сквошу. Изучайте разметку на
            3D-корте, читайте официальные правила и выбирайте лучшие ракетки.
          </p>
        </header>

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
