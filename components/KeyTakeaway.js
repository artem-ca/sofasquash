export default function KeyTakeaway({ title, children, emoji, isDarkMode }) {
  return (
    <div className='my-6 p-5 rounded-xl border transition-all duration-300 border-amber-500/30 dark:border-amber-500/15 bg-amber-50/50 dark:bg-neutral-900/40 hover:border-amber-500/50 dark:hover:border-amber-500/30 shadow-xs'>
      <div className='font-bold mb-2 flex items-center gap-2 text-base text-amber-950 dark:text-slate-200'>
        <span className='text-xl'>{emoji}</span> {title}
      </div>
      <p className='text-sm leading-relaxed m-0 text-amber-900/80 dark:text-slate-400'>
        {children}
      </p>
    </div>
  )
}
