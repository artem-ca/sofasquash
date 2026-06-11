'use client'

import RacquetVectorIcon from './RacquetVectorIcon'

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
      className={`p-6 rounded-2xl border transition-all cursor-pointer relative group flex flex-col items-center text-center ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20 hover:border-amber-500/30 shadow-md hover:shadow-amber-500/5'
          : 'border-slate-200 bg-white hover:border-amber-500/40 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Плашка "Выбрано к сравнению", если ракетка уже добавлена */}
      {isCompared && (
        <span
          className='absolute top-3 right-3 text-xs bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2 py-0.5 rounded-md font-bold'
          title='Ракетка добавлена к сравнению'
        >
          ⚖️ Выбрана
        </span>
      )}

      {/* Зона изображения */}
      <div className='w-full h-36 max-h-40 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/5 mt-2'>
        {hasImages ? (
          <img
            src={racquet.images[0]}
            alt={`${racquet.brand} ${racquet.model}`}
            className='object-contain h-full w-auto max-h-36 select-none group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <RacquetVectorIcon isDarkMode={isDarkMode} />
        )}
      </div>

      <div className='text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-6 mb-1'>
        {racquet.brand}
      </div>
      <h3
        className={`text-sm font-extrabold line-clamp-2 ${isDarkMode ? 'text-slate-200 group-hover:text-amber-400' : 'text-slate-800 group-hover:text-amber-600'} transition-colors`}
      >
        {racquet.model}
      </h3>
    </div>
  )
}
