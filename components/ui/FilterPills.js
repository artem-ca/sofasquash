'use client'

// Единый ряд кнопок-фильтров. options: [{ value, label }]
const pillVariants = {
  // Крупные бордюрные пилюли с янтарным активным состоянием (глоссарий)
  amber: {
    base: 'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer',
    active: 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold',
    inactive:
      'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-900 shadow-xs',
  },
  // Минималистичные пилюли с тёмным активным состоянием (блог, игроки)
  neutral: {
    base: 'px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
    active: 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950',
    inactive:
      'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200',
  },
}

export default function FilterPills({
  options,
  value,
  onChange,
  variant = 'amber',
  className = '',
}) {
  const styles = pillVariants[variant]

  return (
    <div className={className}>
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type='button'
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`${styles.base} ${isActive ? styles.active : styles.inactive}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
