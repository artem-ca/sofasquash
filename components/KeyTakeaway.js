export default function KeyTakeaway({ title, children, emoji, isDarkMode }) {
  // Компонент карточки ключевых моментов, адаптированный под смену тем
  return (
    <div
      className={`my-6 p-5 rounded-xl border transition-all duration-300 ${
        isDarkMode
          ? 'border-amber-500/15 bg-neutral-900/40 hover:border-amber-500/30'
          : 'border-amber-500/30 bg-amber-50/50 hover:border-amber-500/50 shadow-xs'
      }`}
    >
      <div
        className={`font-bold mb-2 flex items-center gap-2 text-base ${
          isDarkMode ? 'text-slate-200' : 'text-amber-950'
        }`}
      >
        <span className='text-xl'>{emoji}</span> {title}
      </div>
      <p
        className={`text-sm leading-relaxed m-0 ${
          isDarkMode ? 'text-slate-400' : 'text-amber-900/80'
        }`}
      >
        {children}
      </p>
    </div>
  )
}
