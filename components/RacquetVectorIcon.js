'use client'

// Векторный силуэт-заглушка
export default function RacquetVectorIcon() {
  return (
    <svg viewBox='0 0 100 200' className='w-full h-36 max-h-40 my-2 opacity-85'>
      <ellipse
        cx='50'
        cy='60'
        rx='28'
        ry='38'
        fill='transparent'
        className='stroke-amber-600 dark:stroke-amber-500'
        strokeWidth='3'
      />
      <line
        x1='35'
        y1='60'
        x2='65'
        y2='60'
        className='stroke-slate-300 dark:stroke-slate-700'
        strokeWidth='1'
      />
      <line
        x1='30'
        y1='45'
        x2='70'
        y2='45'
        className='stroke-slate-300 dark:stroke-slate-700'
        strokeWidth='1'
      />
      <line
        x1='30'
        y1='75'
        x2='70'
        y2='75'
        className='stroke-slate-300 dark:stroke-slate-700'
        strokeWidth='1'
      />
      <line
        x1='50'
        y1='25'
        x2='50'
        y2='95'
        className='stroke-slate-300 dark:stroke-slate-700'
        strokeWidth='1'
      />
      <line
        x1='40'
        y1='30'
        x2='40'
        y2='90'
        className='stroke-slate-300 dark:stroke-slate-700'
        strokeWidth='1'
      />
      <line
        x1='60'
        y1='30'
        x2='60'
        y2='90'
        className='stroke-slate-300 dark:stroke-slate-700'
        strokeWidth='1'
      />
      <path
        d='M30,95 L44,130 L56,130 L70,95'
        fill='transparent'
        className='stroke-amber-600 dark:stroke-amber-500'
        strokeWidth='3'
      />
      <rect
        x='45'
        y='130'
        width='10'
        height='60'
        rx='1'
        className='fill-slate-100 dark:fill-slate-800 stroke-amber-600 dark:stroke-amber-500'
        strokeWidth='2'
      />
      <rect
        x='43'
        y='190'
        width='14'
        height='6'
        rx='1'
        className='fill-amber-600 dark:fill-amber-500'
      />
    </svg>
  )
}
