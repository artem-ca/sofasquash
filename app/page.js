'use client'

import { useTheme } from '@/components/ThemeContext'
import Link from 'next/link'
import CourtVisualizer from '@/components/CourtVisualizer'
import TacticsBoard from '@/components/TacticsBoard' // <-- Импортируем тактический планшет

export default function HomePage() {
  const { isDarkMode } = useTheme()

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20'>
      <div className='max-w-4xl w-full'>
        {/* Приветственный блок (Hero) */}
        <header className='mb-12 text-center'>
          <div
            className={`inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${
              isDarkMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            Добро пожаловать в мир сквоша
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
              isDarkMode
                ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}
          >
            SQUASH PORTAL
          </h1>
          <p
            className={`text-base leading-relaxed max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Ваш интерактивный справочник по сквошу. Изучайте разметку на
            3D-корте, читайте официальные правила и выбирайте лучшие ракетки.
          </p>
        </header>

        {/* 3D-Корт */}
        <CourtVisualizer isDarkMode={isDarkMode} />

        {/* Интерактивный тактический планшет (размещен под кортом на главной) */}
        <div className='mt-12'>
          <TacticsBoard isDarkMode={isDarkMode} />
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
