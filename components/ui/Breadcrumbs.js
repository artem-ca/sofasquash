import Link from 'next/link'

// Видимые хлебные крошки. items: [{ name, path }] — тот же формат,
// что и buildBreadcrumbJsonLd (constants/site.js), должны совпадать 1:1.
export default function Breadcrumbs({ items, className = '' }) {
  return (
    <nav aria-label='Хлебные крошки' className={`mb-6 ${className}`}>
      <ol className='flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500'>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.path || 'home'} className='flex items-center gap-1.5'>
              {i > 0 && <span aria-hidden='true'>/</span>}
              {isLast ? (
                <span className='text-slate-600 dark:text-slate-300' aria-current='page'>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path || '/'}
                  className='hover:text-amber-600 dark:hover:text-amber-400 transition-colors'
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
