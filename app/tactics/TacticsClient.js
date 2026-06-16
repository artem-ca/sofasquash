'use client'

import { useTheme } from '@/components/ThemeContext'
import TacticsBoard from '@/components/TacticsBoard'

export default function TacticsClient() {
  const { isDarkMode } = useTheme()

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-neutral-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className='max-w-4xl w-full'>
        <header className='mb-12 text-center'>
          <div
            className={`inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${
              isDarkMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            Физика и тактика сквоша
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
              isDarkMode
                ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}
          >
            Тактический планшет
          </h1>
          <p
            className={`text-base leading-relaxed max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Разберите геометрию отскоков и траекторию полета мяча. Кликайте на
            удары ниже, чтобы увидеть их физику на интерактивном корте.
          </p>
        </header>

        {/* Наш новый ультимативный тактический планшет */}
        <TacticsBoard isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}
