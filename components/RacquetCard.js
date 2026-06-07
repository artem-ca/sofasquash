'use client'

// Векторный силуэт-заглушка
function RacquetVectorIcon({ isDarkMode }) {
  return (
    <svg viewBox='0 0 100 200' className='w-full h-36 max-h-40 my-2 opacity-85'>
      <ellipse
        cx='50'
        cy='60'
        rx='28'
        ry='38'
        fill='transparent'
        stroke={isDarkMode ? '#f59e0b' : '#d97706'}
        strokeWidth='3'
      />
      <line
        x1='35'
        y1='60'
        x2='65'
        y2='60'
        stroke={isDarkMode ? '#334155' : '#cbd5e1'}
        strokeWidth='1'
      />
      <line
        x1='30'
        y1='45'
        x2='70'
        y2='45'
        stroke={isDarkMode ? '#334155' : '#cbd5e1'}
        strokeWidth='1'
      />
      <line
        x1='30'
        y1='75'
        x2='70'
        y2='75'
        stroke={isDarkMode ? '#334155' : '#cbd5e1'}
        strokeWidth='1'
      />
      <line
        x1='50'
        y1='25'
        x2='50'
        y2='95'
        stroke={isDarkMode ? '#334155' : '#cbd5e1'}
        strokeWidth='1'
      />
      <line
        x1='40'
        y1='30'
        x2='40'
        y2='90'
        stroke={isDarkMode ? '#334155' : '#cbd5e1'}
        strokeWidth='1'
      />
      <line
        x1='60'
        y1='30'
        x2='60'
        y2='90'
        stroke={isDarkMode ? '#334155' : '#cbd5e1'}
        strokeWidth='1'
      />
      <path
        d='M30,95 L44,130 L56,130 L70,95'
        fill='transparent'
        stroke={isDarkMode ? '#f59e0b' : '#d97706'}
        strokeWidth='3'
      />
      <rect
        x='45'
        y='130'
        width='10'
        height='60'
        rx='1'
        fill={isDarkMode ? '#1e293b' : '#f1f5f9'}
        stroke={isDarkMode ? '#f59e0b' : '#d97706'}
        strokeWidth='2'
      />
      <rect
        x='43'
        y='190'
        width='14'
        height='6'
        rx='1'
        fill={isDarkMode ? '#f59e0b' : '#d97706'}
      />
    </svg>
  )
}

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
