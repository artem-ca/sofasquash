'use client'

import { useTheme } from '@/components/ThemeContext'
import RacquetVectorIcon from '@/components/RacquetVectorIcon'

export default function RacquetCard({
  racquet,
  isDarkMode,
  isCompared,
  onClick,
}) {
  const hasImages = racquet.images && racquet.images.length > 0

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-3xl transition-all duration-300 flex flex-col items-center justify-between text-center cursor-pointer group relative ${
        isDarkMode
          ? 'bg-neutral-950/20 border border-transparent hover:border-neutral-900'
          : 'bg-white border border-transparent hover:border-slate-100'
      }`}
    >
      {/* Изящный и очень тонкий индикатор сравнения в углу */}
      {isCompared && (
        <span
          className='absolute top-3 right-3 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold select-none z-10'
          title='Добавлено к сравнению'
        >
          ⚖️ Сравнение
        </span>
      )}

      {/* Зона изображения — свободное парение картинки без серого бокса */}
      <div className='w-full h-64 max-h-72 flex items-center justify-center bg-transparent mt-2 transition-transform duration-300 group-hover:scale-105'>
        {hasImages ? (
          <img
            src={racquet.images[0]}
            alt={`${racquet.brand} ${racquet.model}`}
            loading='lazy'
            width={500}
            height={500}
            className='object-contain h-full w-auto select-none'
          />
        ) : (
          <RacquetVectorIcon isDarkMode={isDarkMode} />
        )}
      </div>

      {/* Информационный блок в премиальном стиле скриншота */}
      <div className='mt-4 flex flex-col items-center'>
        <h3 className='font-normal text-sm sm:text-base tracking-wide leading-snug line-clamp-2 max-w-[220px] transition-colors duration-200'>
          <span className='text-amber-500 font-semibold mr-1.5'>
            {racquet.brand}
          </span>
          <span
            className={
              isDarkMode
                ? 'text-slate-200 group-hover:text-amber-400'
                : 'text-slate-800 group-hover:text-amber-600'
            }
          >
            {racquet.model}
          </span>
        </h3>
        {/* Строка параметров на месте цены в скриншоте */}
        <span className='text-xs font-normal tracking-wider mt-1.5 text-slate-500 dark:text-slate-500'>
          {racquet.weight} г • {racquet.balanceText}
        </span>
      </div>
    </div>
  )
}
