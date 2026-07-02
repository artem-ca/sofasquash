// Единый заголовок страницы: бейдж + градиентный H1 + подзаголовок
const badgeStyles = {
  amber:
    'inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  neutral:
    'inline-flex border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-600 dark:text-neutral-400 rounded px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4',
}

export default function PageHeader({
  badge,
  badgeVariant = 'amber',
  title,
  subtitle,
  subtitleClassName = 'text-base leading-relaxed max-w-2xl mx-auto text-slate-600 dark:text-slate-400',
}) {
  return (
    <header className='mb-12 text-center'>
      {badge && <div className={badgeStyles[badgeVariant]}>{badge}</div>}
      <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text dark:text-transparent'>
        {title}
      </h1>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </header>
  )
}
