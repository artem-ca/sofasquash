'use client'

import { useState } from 'react'
import RacquetVectorIcon from './RacquetVectorIcon'

export default function RacquetDetailModal({
  racquet,
  isDarkMode,
  isCompared,
  onToggleComparison,
  onClose,
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [imgError, setImgError] = useState(false)
  const hasImages = racquet.images && racquet.images.length > 0

  const handleNextImage = (e) => {
    e.stopPropagation()
    setImgError(false)
    setActiveImageIdx((prev) => (prev + 1) % racquet.images.length)
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setImgError(false)
    setActiveImageIdx(
      (prev) => (prev - 1 + racquet.images.length) % racquet.images.length,
    )
  }

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in'>
      <div className='w-full max-w-2xl p-6 rounded-2xl border shadow-2xl relative bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-slate-400 hover:text-amber-500 font-bold cursor-pointer text-xl'
        >
          ✕
        </button>

        <div className='grid md:grid-cols-2 gap-6 mt-4'>
          <div className='flex flex-col items-center justify-center bg-slate-950/5 p-4 rounded-xl relative h-64 overflow-hidden'>
            {hasImages && !imgError ? (
              <>
                <img
                  src={racquet.images[activeImageIdx]}
                  alt={`${racquet.brand} ${racquet.model}`}
                  width={500}
                  height={500}
                  onError={() => setImgError(true)}
                  className='object-contain h-full w-auto max-h-56 select-none'
                />
                {racquet.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className='absolute left-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center font-bold text-xs cursor-pointer'
                    >
                      ◀
                    </button>
                    <button
                      onClick={handleNextImage}
                      className='absolute right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center font-bold text-xs cursor-pointer'
                    >
                      ▶
                    </button>
                    <div className='absolute bottom-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-slate-300 font-bold'>
                      {activeImageIdx + 1} / {racquet.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <RacquetVectorIcon />
            )}
          </div>

          <div className='flex flex-col justify-between'>
            <div>
              <span className='text-xs font-bold text-amber-500 uppercase tracking-widest'>
                {racquet.brand}
              </span>
              <h2 className='text-xl font-extrabold mt-1 mb-3 text-slate-900 dark:text-slate-100'>
                {racquet.model}
              </h2>
              <p className='text-xs leading-relaxed mb-4 text-slate-500 dark:text-slate-400'>
                {racquet.description}
              </p>

              <div className='border-t text-xs divide-y border-slate-100 dark:border-neutral-800 divide-slate-100 dark:divide-neutral-800'>
                <div className='py-2 flex justify-between'>
                  <span className='text-slate-500'>Вес рамы:</span>
                  <span className='font-bold'>{racquet.weight} г</span>
                </div>
                <div className='py-2 flex justify-between'>
                  <span className='text-slate-500'>Баланс:</span>
                  <span className='font-bold'>
                    {racquet.balanceText} ({racquet.balanceNum} мм)
                  </span>
                </div>
                <div className='py-2 flex justify-between'>
                  <span className='text-slate-500'>Форма головы:</span>
                  <span className='font-bold'>{racquet.headShape}</span>
                </div>
                <div className='py-2 flex justify-between'>
                  <span className='text-slate-500'>Струнная формула:</span>
                  <span className='font-bold'>{racquet.stringPattern}</span>
                </div>
                <div className='py-2 flex justify-between'>
                  <span className='text-slate-500'>Площадь головы:</span>
                  <span className='font-bold'>{racquet.headSize} кв.см</span>
                </div>
                <div className='py-2 flex justify-between'>
                  <span className='text-slate-500'>Материал:</span>
                  <span className='font-bold'>{racquet.material}</span>
                </div>
                <div className='py-2 flex justify-between'>
                  <span className='text-slate-500'>Амбассадор:</span>
                  <span className='font-bold italic text-amber-500'>
                    {racquet.player}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => onToggleComparison(racquet)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                  isCompared
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                }`}
              >
                {isCompared
                  ? 'Убрать из сравнения ❌'
                  : 'Добавить к сравнению ⚖️'}
              </button>
              <button
                onClick={onClose}
                className='px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
              >
                Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
