'use client'

// Единое поле поиска с кнопкой очистки
const variants = {
  // Крупное поле с янтарным фокусом (глоссарий)
  amber:
    'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-all bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100',
  // То же, но с приглушённым фоном — для поля внутри белой карточки (ракетки)
  'amber-muted':
    'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-all bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-100',
  // Компактное нейтральное поле (блог, игроки)
  neutral:
    'w-full px-3 py-2.5 rounded-md border text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-all bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100',
}

export default function SearchInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  variant = 'amber',
}) {
  return (
    <div className='relative w-full'>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel || placeholder}
        className={variants[variant]}
      />
      {value && (
        <button
          type='button'
          onClick={() => onChange('')}
          aria-label='Очистить поиск'
          className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xs cursor-pointer'
        >
          ✕
        </button>
      )}
    </div>
  )
}
