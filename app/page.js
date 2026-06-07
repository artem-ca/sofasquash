'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ThemeContext'
import CourtVisualizer from '@/components/CourtVisualizer'
import GlossaryTerm from '@/components/GlossaryTerm'

export default function HomePage() {
  const { isDarkMode } = useTheme()

  // Состояния для логики правила 2.7
  const [sofaCount, setSofaCount] = useState(0)
  const [easterEggText, setEasterEggText] = useState('')
  const [isBouncing, setIsBouncing] = useState(false)
  const [isQuizPassed, setIsQuizPassed] = useState(false)

  const achievements = [
    { threshold: 5, title: 'Подающая надежды 🌱', emoji: '🌱' },
    { threshold: 15, title: 'Гроза сквоша ⚡', emoji: '⚡' },
    { threshold: 30, title: 'Непревзойдённая', emoji: '⛰️' },
    { threshold: 50, title: 'Королева Переподач 👑', emoji: '👑' },
    {
      threshold: 100,
      title: 'Абсолютное доминирование (Уровень: Бог) 💅',
      emoji: '💅',
    },
  ]

  const currentAchievement = [...achievements]
    .reverse()
    .find((ach) => sofaCount >= ach.threshold)
  const currentTitle = currentAchievement
    ? currentAchievement.title
    : 'Начало пути 🎾'

  const unlockedBadges = achievements.filter(
    (ach) => sofaCount >= ach.threshold,
  )
  if (isQuizPassed) {
    unlockedBadges.push({
      title: 'Профессор Сквоша 🎓',
      emoji: '🎓',
    })
  }

  // Загрузка локальных данных Софы при монтировании
  useEffect(() => {
    const savedCount = localStorage.getItem('sofaCount')
    if (savedCount) {
      setSofaCount(parseInt(savedCount, 10))
    }

    const savedQuiz = localStorage.getItem('isQuizPassed')
    if (savedQuiz === 'true') {
      setIsQuizPassed(true)
    }

    // Регистрация Service Worker для PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('PWA Service Worker зарегистрирован!'))
          .catch((err) => console.warn('Ошибка PWA:', err))
      })
    }
  }, [])

  // Клик по переподаче
  const handleSofaServe = () => {
    const nextCount = sofaCount + 1
    setSofaCount(nextCount)
    localStorage.setItem('sofaCount', nextCount.toString())

    const phrases = [
      'Софа, идеальная подача! 🎉',
      'Соперник плачет в углу... 😭',
      'Правило 2.7 в действии! 🎯',
      'Энергия Софочки зашкаливает! ⚡',
      'Подача принята... ой, нет, переподаем! 😂',
      'Ещё одна безупречная попытка! 👑',
      'Софа диктует свои правила! 💅',
      'Судья безмолвно кивает... 🤐',
      'Софа делает эйс при любой погоде! 🌪️',
      'Ты же моя умничка ❤️',
      'Давай ещё раз, кошка 🐈‍⬛',
    ]
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
    setEasterEggText(randomPhrase || 'Ты же моя умничка ❤️')

    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 300)
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-12 lg:py-20'>
      <div className='max-w-4xl w-full'>
        {/* Приветственный блок */}
        <header className='mb-12 text-center'>
          <div
            className={`inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${
              isDarkMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            Добро пожаловать в мир сквоша
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
              isDarkMode
                ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}
          >
            SQUASH PORTAL
          </h1>
          <p
            className={`text-base leading-relaxed max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Ваш интерактивный справочник по сквошу. Изучайте разметку на
            3D-корте, читайте официальные правила и выбирайте лучшие ракетки.
          </p>
        </header>

        {/* 3D-Корт */}
        <CourtVisualizer isDarkMode={isDarkMode} />

        {/* Правило 2.7 (Софа) на Главной странице */}
        <section className='mt-12'>
          <div className='p-8 rounded-2xl border-2 border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/5 relative overflow-hidden transition-all'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none' />
            <div className='inline-block bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4'>
              👑 Эксклюзивное правило Софы
            </div>
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-base font-bold bg-amber-500/10 text-amber-500 w-10 h-10 flex items-center justify-center rounded-lg'>
                2.7
              </span>
              <h2 className='text-2xl font-bold text-amber-500'>Переподача</h2>
            </div>
            <div
              className={`border-l-4 border-amber-500 pl-6 my-6 italic text-base leading-relaxed ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              «Софочка имеет право переподавать мяч сколько угодно раз, пока
              подача не получится, независимо от того, почему подача не
              получилась. Будь то аут, ошибка подачи, невозможность ответить на
              приём этой самой подачи соперником или еще что-нибудь, во всех
              случаях Софа может делать переподачу до тех пор, пока в розыгрыше
              не будет 2 и более ударов».
            </div>

            {/* Зона интерактивной пасхалки */}
            <div
              className={`p-5 rounded-xl border border-amber-500/20 my-6 flex flex-col md:flex-row items-center justify-between gap-4 ${
                isDarkMode ? 'bg-amber-500/5' : 'bg-amber-50/50'
              }`}
            >
              <div>
                <div
                  className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  Всего переподач совершено:
                </div>
                <div
                  className={`text-3xl font-extrabold text-amber-500 mt-1 transition-transform duration-300 ${isBouncing ? 'scale-130 rotate-3' : 'scale-100'}`}
                >
                  {sofaCount}
                </div>
                {easterEggText && (
                  <div className='text-xs italic text-amber-600 mt-1 font-semibold animate-fade-in'>
                    {easterEggText}
                  </div>
                )}
              </div>
              <button
                onClick={handleSofaServe}
                className='w-full md:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2'
              >
                Переподать! 🎯
              </button>
            </div>

            {/* Награды */}
            <div className='pt-2 border-t border-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  Текущий титул Софы:
                </span>
                <div className='text-sm font-extrabold text-amber-500 mt-1'>
                  {currentTitle}
                </div>
              </div>
              {unlockedBadges.length > 0 && (
                <div className='pt-2'>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block sm:text-right ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
                  >
                    Разблокированные награды:
                  </span>
                  <div className='flex gap-1.5 mt-3 sm:justify-end'>
                    {unlockedBadges.map((badge, index) => (
                      <span
                        key={index}
                        className='w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm animate-bounce'
                        title={badge.title}
                        style={{
                          animationDelay: `${index * 150}ms`,
                          animationDuration: '1.2s',
                        }}
                      >
                        {badge.emoji}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ссылка на Правила */}
        <div className='mt-16 text-center'>
          <a
            href='/rules'
            className='inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base shadow-lg transition-all active:scale-95 cursor-pointer'
          >
            Читать официальные правила сквоша (14 глав) ➡️
          </a>
        </div>
      </div>
    </div>
  )
}
