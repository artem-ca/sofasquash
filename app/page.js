'use client'

import { useState, useEffect, useRef } from 'react'

// Компонент карточки ключевых моментов, адаптированный под смену тем
function KeyTakeaway({ title, children, emoji, isDarkMode }) {
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

// Обновленный компонент подсказок по наведению (замените старый GlossaryTerm)
function GlossaryTerm({ term, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false)

  const glossary = {
    жестянка:
      'Звуковая панель в самом низу передней стены корта высотой 43 см. Попадание мяча в нее или ее верхний металлический бортик считается аутом.',
    жестянки:
      'Звуковая панель в самом низу передней стены корта высотой 43 см. Попадание мяча в нее или ее верхний металлический бортик считается аутом.',
    лет: 'Решение судьи переиграть розыгрыш без присуждения очков. Назначается при случайных или непредотвратимых помехах.',
    лета: 'Решение судьи переиграть розыгрыш без присуждения очков. Назначается при случайных или непредотвратимых помехах.',
    Лет: 'Решение судьи переиграть розыгрыш без присуждения очков. Назначается при случайных или непредотвратимых помехах.',
    строук:
      'Присуждение очка игроку из-за того, что соперник создал грубую или опасную помеху (например, заблокировал замах или прямую траекторию удара в стену).',
    Строук:
      'Присуждение очка игроку из-за того, что соперник создал грубую или опасную помеху (например, заблокировал замах или прямую траекторию удара в стену).',
    заступ:
      'Нарушение правил подачи, когда нога подающего полностью наступает на линию квадрата подачи в момент удара по мячу.',
    аут: 'Зона выше верхней красной линии на стенах корта или касание этой линии. Попадание мяча туда означает немедленный проигранный мяч.',
    аута: 'Зона выше верхней красной линии на стенах корта или касание этой линии. Попадание мяча туда означает немедленный проигранный мяч.',
    ауты: 'Зона выше верхней красной линии на стенах корта или касание этой линии. Попадание мяча туда означает немедленный проигранный мяч.',
    'переход подачи':
      'Ситуация, когда принимающий игрок выигрывает розыгрыш очка и забирает себе право подавать в следующем розыгрыше.',
  }

  const definition =
    glossary[term.toLowerCase()] || 'Определение термина не найдено в словаре.'

  return (
    <span
      className='relative inline-block'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        className={`border-b border-dashed border-amber-500/70 font-semibold cursor-help transition-colors duration-150 mx-1 ${
          isDarkMode
            ? 'text-amber-400 hover:text-amber-300'
            : 'text-amber-700 hover:text-amber-600'
        }`}
      >
        {term}
      </span>

      {isOpen && (
        <span
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl border text-xs leading-relaxed font-normal shadow-xl z-50 block pointer-events-none transition-all duration-200 ${
            isDarkMode
              ? 'bg-neutral-900 border-neutral-800 text-slate-300'
              : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          {/* Маленькая стрелочка внизу подсказки */}
          <span
            className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${
              isDarkMode ? 'border-t-neutral-900' : 'border-t-white'
            }`}
          />
          {definition}
        </span>
      )}
    </span>
  )
}

// Компонент интерактивной викторины (добавьте под GlossaryTerm)
function Quiz({ isDarkMode, onPerfectScore, isQuizPassed }) {
  const questions = [
    {
      q: 'Какова общая продолжительность разминки на корте перед началом матча?',
      options: [
        '10 минут (по 5 минут на каждую сторону)',
        '5 минут (по 2.5 минуты на каждую сторону)',
        '3 минуты (игроки разминаются вместе без смены сторон)',
      ],
      correct: 1,
      hint: 'Согласно правилу 4.1, разминка длится ровно 5 минут и делится строго поровну — по 2.5 минуты на каждую половину корта.',
    },
    {
      q: 'Что произойдет, если подающий во время удара заступил ногой за линию квадрата подачи (Foot Fault)?',
      options: [
        'Судья даст переподать (вторая попытка подачи)',
        'Розыгрыш будет остановлен и переигран сначала (Let)',
        'Право подачи и очко немедленно перейдут сопернику',
      ],
      correct: 2,
      hint: 'В сквоше нет второй попытки подачи (кроме правила Софы 2.7!). Любой заступ за линию квадрата — это мгновенный переход подачи сопернику (правило 5.3).',
    },
    {
      q: 'Игрок остановил замах, так как соперник стоял слишком близко и мог получить ракеткой по лицу. Что решит судья?',
      options: [
        'Stroke (Строук) — присудит очко игроку, который остановил замах',
        'Let (Лет) — розыгрыш будет переигран',
        'No Let (Нет лета) — очко отдадут сопернику',
      ],
      correct: 0,
      hint: 'Если замах заблокирован соперником, это грубое нарушение безопасности. Судья обязан присудить очко пострадавшему игроку (правило 8.3 — Stroke).',
    },
    {
      q: 'Игрок нанес удар, мяч летел по диагонали (через боковую стену), но попал в стоявшего на корте соперника. Решение судьи:',
      options: [
        'Stroke (Строук) — очко присуждается ударившему игроку',
        'Let (Лет) — розыгрыш переигрывается',
        'No Let (Нет лета) — очко отдается стоявшему сопернику',
      ],
      correct: 1,
      hint: 'По правилу 9.1, если мяч летел по диагонали (не напрямую в переднюю стену) и задел соперника, назначается переигрывание розыгрыша (Let).',
    },
    {
      q: 'Что произойдет, если посреди розыгрыша у игрока самостоятельно спадет бандана или выпадут защитные очки?',
      options: [
        'Судья остановит розыгрыш и назначит Let (переигровку)',
        'Игра продолжится, останавливаться запрещено',
        'Розыгрыш остановится, а виновный игрок немедленно проиграет очко',
      ],
      correct: 2,
      hint: 'По правилу 12.2, если личный предмет игрока падает на пол самостоятельно во время розыгрыша, игра останавливается, а игрок проигрывает очко.',
    },
  ]

  const [currentQ, setCurrentQ] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleOptionClick = (index) => {
    if (isAnswered) return
    setSelectedOpt(index)
    setIsAnswered(true)
    if (index === questions[currentQ].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    setSelectedOpt(null)
    setIsAnswered(false)
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setShowResults(true)
      if (score === questions.length) {
        onPerfectScore()
      }
    }
  }

  const handleRestart = () => {
    setCurrentQ(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setScore(0)
    setShowResults(false)
  }

  return (
    <section
      id='sec-quiz'
      className={`p-8 rounded-2xl border transition-all duration-300 mt-20 ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20'
          : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      <div className='flex items-center gap-3 mb-6'>
        <span className='text-lg'>🧠</span>
        <h2
          className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
        >
          Мини-квиз по правилам сквоша
        </h2>
      </div>

      {!showResults ? (
        <div>
          {/* Прогресс-бар */}
          <div className='w-full bg-neutral-800 h-1.5 rounded-full mb-6 overflow-hidden'>
            <div
              className='bg-amber-500 h-1.5 transition-all duration-300'
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className='mb-6'>
            <span className='text-xs font-bold text-amber-500 uppercase tracking-wider'>
              Вопрос {currentQ + 1} из {questions.length}
            </span>
            <p
              className={`text-base font-bold mt-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
            >
              {questions[currentQ].q}
            </p>
          </div>

          <div className='flex flex-col gap-3 mb-6'>
            {questions[currentQ].options.map((option, idx) => {
              let btnClass = isDarkMode
                ? 'border-neutral-800 bg-neutral-900/40 text-slate-350 hover:border-amber-500/30'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-500/50'

              if (isAnswered) {
                if (idx === questions[currentQ].correct) {
                  btnClass =
                    'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                } else if (idx === selectedOpt) {
                  btnClass = 'border-red-500 bg-red-500/10 text-red-400'
                } else {
                  btnClass = 'opacity-50 border-transparent'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-150 cursor-pointer ${btnClass}`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {isAnswered && (
            <div
              className={`p-4 rounded-xl mb-6 text-xs leading-relaxed animate-fade-in ${
                isDarkMode
                  ? 'bg-neutral-900/60 text-slate-400'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <strong>Объяснение:</strong> {questions[currentQ].hint}
            </div>
          )}

          {isAnswered && (
            <button
              onClick={handleNext}
              className='w-full md:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer float-right'
            >
              {currentQ < questions.length - 1
                ? 'Следующий вопрос ➡️'
                : 'Завершить тест 🏁'}
            </button>
          )}
          <div className='clear-both' />
        </div>
      ) : (
        <div className='text-center py-6'>
          <div className='text-4xl mb-4'>
            {score === questions.length ? '🏆👑🎖️' : '👍⚽🥎'}
          </div>
          <h3
            className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
          >
            Вы ответили правильно на {score} из {questions.length} вопросов!
          </h3>

          {score === questions.length ? (
            <div className='mt-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 max-w-md mx-auto text-sm text-amber-500 leading-relaxed font-semibold'>
              Идеальный результат! Секретное звание{' '}
              <span className='underline'>Профессор Сквоша 🎓»</span> успешно
              разблокировано для Софы и добавлено в её коллекцию наград!
            </div>
          ) : (
            <p className='text-sm text-slate-400 mt-2 max-w-md mx-auto'>
              Хорошая попытка! Чтобы разблокировать секретную награду Профессор
              Сквоша», вам нужно ответить правильно на все 5 вопросов.
              Попробуйте еще раз!
            </p>
          )}

          <button
            onClick={handleRestart}
            className='mt-6 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer'
          >
            Пройти тест заново 🔄
          </button>
        </div>
      )}
    </section>
  )
}

export default function RulesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('sec-1')

  // Состояния для нашей новой логики тем и счетчика
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [sofaCount, setSofaCount] = useState(0)
  const [easterEggText, setEasterEggText] = useState('')
  const [isBouncing, setIsBouncing] = useState(false)

  const [isQuizPassed, setIsQuizPassed] = useState(false)

  // Список достижений Софы (добавьте в начало компонента RulesPage)
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

  // Вычисляем текущее звание и список открытых ачивок на лету

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

  // Инициализация сохраненных данных при первом запуске
  useEffect(() => {
    // 1. Загрузка темы
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      setIsDarkMode(prefersDark)
    }

    // 2. Загрузка счетчика переподач Софы
    const savedCount = localStorage.getItem('sofaCount')
    if (savedCount) {
      setSofaCount(parseInt(savedCount, 10))
    }

    const savedQuiz = localStorage.getItem('isQuizPassed')
    if (savedQuiz === 'true') {
      setIsQuizPassed(true)
    }
  }, [])

  // Переключение темы оформления
  const toggleTheme = () => {
    const nextTheme = !isDarkMode
    setIsDarkMode(nextTheme)
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light')
  }

  // Обработчик 5/5 правильных ответов в квизе
  const handlePerfectQuizScore = () => {
    setIsQuizPassed(true)
    localStorage.setItem('isQuizPassed', 'true')
  }

  // Логика клика по переподаче Софы
  const handleSofaServe = () => {
    const nextCount = sofaCount + 1
    setSofaCount(nextCount)
    localStorage.setItem('sofaCount', nextCount.toString())

    // Случайные веселые фразы
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
    const randomPhraseWithFallback = randomPhrase || 'Ты же моя умничка ❤️'
    setEasterEggText(randomPhraseWithFallback)

    // Временная активация эффекта прыжка для счетчика
    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 300)
  }

  // Улучшенный Scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'sec-1',
        'sec-2',
        'sec-2-7',
        'sec-3',
        'sec-4',
        'sec-5',
        'sec-6',
        'sec-7',
        'sec-8',
        'sec-9',
        'sec-10',
        'sec-11',
        'sec-12',
        'sec-13',
        'sec-14',
      ]

      let currentSection = 'sec-1'
      let closestSection = 'sec-1'
      let minDistance = Infinity

      const triggerPoint = window.innerHeight * 0.3 // Зона фокуса 30% от верха экрана

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()

          if (rect.top <= triggerPoint) {
            currentSection = sectionId
          }

          const distanceToFocus = Math.abs(rect.top - triggerPoint)
          if (distanceToFocus < minDistance) {
            minDistance = distanceToFocus
            closestSection = sectionId
          }
        }
      }

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80

      setActiveSection(isAtBottom ? closestSection : currentSection)
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) =>
            console.log('PWA Service Worker зарегистрирован!', reg.scope),
          )
          .catch((err) =>
            console.warn('Ошибка регистрации Service Worker:', err),
          )
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { id: 'sec-1', label: '1. Игра', special: false },
    { id: 'sec-2', label: '2. Начисление очков', special: false },
    { id: 'sec-2-7', label: '2.7. Переподача', special: true },
    { id: 'sec-3', label: '3. Официальные лица', special: false },
    { id: 'sec-4', label: '4. Разминка', special: false },
    { id: 'sec-5', label: '5. Подача', special: false },
    { id: 'sec-6', label: '6. Розыгрыш', special: false },
    { id: 'sec-7', label: '7. Интервалы', special: false },
    { id: 'sec-8', label: '8. Помехи', special: false },
    { id: 'sec-9', label: '9. Попадание мяча в игрока', special: false },
    { id: 'sec-10', label: '10. Апелляции', special: false },
    { id: 'sec-11', label: '11. Мяч и экипировка', special: false },
    { id: 'sec-12', label: '12. Условия игры на корте', special: false },
    { id: 'sec-13', label: '13. Травмы и кровотечения', special: false },
    { id: 'sec-14', label: '14. Поведение на корте', special: false },
  ]

  return (
    <div
      className={`flex min-h-screen font-sans antialiased selection:bg-amber-500/30 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-neutral-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Мобильная кнопка переключения темы (☀️/🌙) */}
      <button
        onClick={toggleTheme}
        className={`lg:hidden fixed top-4 right-18 z-50 flex items-center justify-center w-12 h-12 rounded-xl shadow-lg cursor-pointer transition-all active:scale-95 border ${
          isDarkMode
            ? 'bg-neutral-900 border-neutral-800 text-amber-400'
            : 'bg-white border-slate-200 text-slate-700'
        }`}
        title='Переключить тему оформления'
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Мобильная кнопка открытия меню */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='lg:hidden fixed top-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg active:scale-95 cursor-pointer transition-transform'
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Затемняющая вуаль для мобилки */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className='lg:hidden fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-xs'
        />
      )}

      {/* Боковая панель навигации (Sidebar) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 p-6 flex flex-col overflow-y-auto border-r transition-all duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDarkMode
            ? 'bg-neutral-900/90 border-neutral-800/80'
            : 'bg-white/95 border-slate-200/80'
        }`}
      >
        <div className='flex items-center gap-3 mb-6'>
          <div>
            <span
              className={`font-extrabold text-lg tracking-wider block leading-tight ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              SQUASH RULES
            </span>
            <span className='text-[10px] text-amber-500 font-bold uppercase tracking-widest block'>
              Official Rules 2026
            </span>
          </div>
        </div>

        {/* Кнопка смены темы для десктопа */}
        <button
          onClick={toggleTheme}
          className={`hidden lg:flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-semibold border mb-6 transition-all duration-200 cursor-pointer ${
            isDarkMode
              ? 'bg-neutral-800/50 border-neutral-800 text-slate-300 hover:text-white hover:bg-neutral-850'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-xs'
          }`}
        >
          <span>Тема: {isDarkMode ? 'Темная 🌙' : 'Светлая ☀️'}</span>
          <span className='text-sm'>{isDarkMode ? '☀️' : '🌙'}</span>
        </button>

        <div className='text-xs uppercase tracking-widest text-slate-500 font-bold mb-4'>
          Разделы правил
        </div>
        <nav className='flex flex-col gap-1 pr-2'>
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                item.special
                  ? activeSection === item.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'border border-dashed border-amber-500/30 text-amber-500/90 hover:bg-amber-500/5'
                  : activeSection === item.id
                    ? isDarkMode
                      ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500 pl-3'
                      : 'bg-amber-50 text-amber-600 border-l-4 border-amber-500 pl-3'
                    : isDarkMode
                      ? 'text-slate-400 hover:bg-neutral-800/50 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Основная текстовая область документа */}
      <main className='lg:ml-80 flex-1 px-6 py-12 lg:px-16 lg:py-20 max-w-4xl'>
        <header className='mb-16'>
          <div
            className={`inline-block border px-3 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 mr-2 ${
              isDarkMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            Официальный регламент WSF
          </div>
          <div
            className={`inline-block border px-3 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${
              isDarkMode
                ? 'bg-neutral-900/60 text-slate-400 border-neutral-800'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            Редакция: сентябрь 2025 • Актуально на 2026
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
              isDarkMode
                ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-slate-800 to-amber-800 bg-clip-text text-transparent'
            }`}
          >
            Правила сквоша
          </h1>
          <p
            className={`text-base leading-relaxed max-w-3xl ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Одиночный разряд • Официальные правила Всемирной федерации сквоша
            (WSF)
          </p>
        </header>

        {/* Раздел 1. Игра */}
        <section id='sec-1' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              1
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Игра
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>1.1.</strong> Одиночный сквош играется на закрытом корте
              установленных размеров двумя игроками. Каждый из игроков
              использует ракетку, соответствующую стандартам Всемирной федерации
              сквоша (WSF), для ударов по официальному сквош-мячу.
            </p>
            <p>
              <strong>1.2.</strong> Каждый розыгрыш начинается с корректного
              ввода мяча в игру с помощью подачи. После этого игроки поочередно
              совершают удары по мячу до тех пор, пока розыгрыш не будет
              завершен в соответствии с правилами игры.
            </p>
            <p>
              <strong>1.3.</strong> Процесс игры должен оставаться непрерывным
              во всех случаях, когда это физически и технически возможно, за
              исключением установленных перерывов и форс-мажорных обстоятельств.
            </p>
          </div>
          <KeyTakeaway
            title='Главная философия корта'
            emoji='💡'
            isDarkMode={isDarkMode}
          >
            Сквош — бесконтактный спорт в ограниченном пространстве. Вы обязаны
            уступать дорогу сопернику и останавливать замах, если есть малейший
            риск нанести травму ракеткой или мячом.
          </KeyTakeaway>
        </section>

        {/* Раздел 2. Начисление очков */}
        <section id='sec-2' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              2
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Начисление очков
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>2.1.</strong> В сквоше используется система начисления
              очков Point-A-Rally (PAR). Победитель каждого розыгрыша получает
              ровно одно очко, независимо от того, кто из игроков вводил мяч в
              игру подачей.
            </p>
            <p>
              <strong>2.2.</strong> Гейм выигрывает игрок, первым набравший 11
              очков, за исключением ситуации «10-10» (10-all). При равном счете
              10-10 игра продолжается до тех пор, пока один из игроков не
              получит преимущество ровно в 2 очка (например, 12-10, 15-13,
              21-19).
            </p>
            <p>
              <strong>2.3.</strong> Стандартный соревновательный матч ведется до
              победы одного из игроков в 3 геймах (формат «лучший из 5 геймов»).
              По согласованию сторон или регламенту любительских лиг допускается
              проведение матчей до победы в 2 геймах (формат «лучший из 3»).
            </p>
          </div>
          <KeyTakeaway
            title='Что значит PAR 11?'
            emoji='📊'
            isDarkMode={isDarkMode}
          >
            Очко дается за каждый выигранный мяч. Подавать повторно после
            выигрыша очка на чужой подаче не нужно — вы просто забираете очко и
            право подавать переходит к вам.
          </KeyTakeaway>
        </section>

        {/* Раздел 2.7 (Специальный пункт с интерактивной пасхалкой) */}
        <section
          id='sec-2-7'
          className='scroll-mt-24 mb-16 p-8 rounded-2xl border-2 border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/5 relative overflow-hidden transition-all'
        >
          <div className='absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none' />

          <div className='flex items-center gap-4 mb-4'>
            <span className='text-base font-bold bg-amber-500/10 text-amber-500 w-10 h-10 flex items-center justify-center rounded-lg'>
              2.7
            </span>
            <h2 className='text-2xl font-bold text-amber-500'>
              Переподача (Эксклюзивное правило Софы 👑)
            </h2>
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
            случаях Софа может делать переподачу до тех пор, пока в розыгрыше не
            будет 2 и более ударов».
          </div>

          {/* Интерактивная зона пасхалки с ачивками */}
          <div
            className={`p-5 rounded-xl border border-amber-500/20 my-6 flex flex-col gap-6 ${
              isDarkMode ? 'bg-amber-500/5' : 'bg-amber-50/50'
            }`}
          >
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
              <div>
                <div
                  className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  Всего переподач совершено:
                </div>
                <div
                  className={`text-3xl font-extrabold text-amber-500 mt-1 transition-transform duration-300 ${
                    isBouncing ? 'scale-130 rotate-3' : 'scale-100'
                  }`}
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

            {/* Блок званий и ачивок */}
            <div
              className={`pt-2 border-t border-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
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

              {/* Рендеринг разблокированных значков */}
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

          <p className='text-xs text-amber-500/80 leading-relaxed'>
            * Примечание: Любые попытки соперника объявить переход подачи,
            ошибку линии (<GlossaryTerm term='заступ' isDarkMode={isDarkMode} />
            ) или забрать очко во время выполнения подачи Софой признаются
            недействительными. Софа забирает мяч и совершает новую попытку без
            штрафных санкций.
          </p>
        </section>

        {/* Раздел 3. Официальные лица */}
        <section id='sec-3' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              3
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Официальные лица
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>3.1.</strong> В состав судейской коллегии матча входят
              Рефери (Судья) и Маркер. Оба официальных лица обязаны письменно
              вести счет встречи, контролировать очередность подачи и
              правильность занятия квадратов игроками.
            </p>
            <p>
              <strong>3.2.</strong> При отсутствии возможности назначить двух
              судей, один арбитр совмещает обязанности Рефери и Маркера.
            </p>
            <p>
              <strong>3.3.</strong> Обязанности Маркера: ведение счета вслух,
              своевременное объявление переходов подачи и результатов ударов
              (например, "Out" (Аут), "Not up" (Грязный удар), "Down" (Ниже
              жестянки)).
            </p>
            <p>
              <strong>3.4.</strong> Обязанности Рефери: вынесение решений по
              апелляциям игроков, определение игровых помех (Let, No Let,
              Stroke), контроль за состоянием экипировки, фиксация нарушений
              поведения на корте. Решение Рефери является окончательным.
            </p>
          </div>
          <KeyTakeaway
            title='Кто главный на корте?'
            emoji='📢'
            isDarkMode={isDarkMode}
          >
            Маркер ведет счет и объявляет факты. Рефери решает спорные моменты.
            Если вы не согласны со счетом Маркера — вы имеете право остановить
            игру и подать апелляцию только Рефери.
          </KeyTakeaway>
        </section>

        {/* Раздел 4. Разминка */}
        <section id='sec-4' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              4
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Разминка
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>4.1.</strong> Непосредственно перед началом матча игрокам
              предоставляется совместное время на корте для разогрева своего
              тела и игрового мяча. Длительность разминки составляет ровно 5
              минут.
            </p>
            <p>
              <strong>4.2.</strong> Время разминки делится строго поровну:
              каждый игрок проводит по 2.5 минуты на правой и на левой сторонах
              корта. При переходе на другую сторону корта игроки меняются
              местами.
            </p>
            <p>
              <strong>4.3.</strong> В процессе разминки игроки должны
              обеспечивать сопернику равную возможность ударить по мячу.
              Запрещено удерживать мяч и греть его в одиночку.
            </p>
            <p>
              <strong>4.4.</strong> Если в ходе матча мяч повреждается и
              заменяется на новый, или если игра прерывается на длительное
              время, Рефери предоставляет игрокам дополнительную разминку для
              приведения мяча в рабочее состояние.
            </p>
          </div>
          <KeyTakeaway
            title='Зачем греть мяч?'
            emoji='🥎'
            isDarkMode={isDarkMode}
          >
            Профессиональный мяч для сквоша (с двумя желтыми точками)
            практически не прыгает в холодном состоянии. 5 минут разминки нужны
            не только вашим мышцам, но и молекулам резины внутри мяча.
          </KeyTakeaway>
        </section>

        {/* Раздел 5. Подача */}
        <section id='sec-5' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              5
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Подача
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>5.1.</strong> Право первой подачи в матче разыгрывается
              путем вращения ракетки (жеребьевкой). В начале каждого
              последующего гейма право первой подачи переходит к игроку,
              выигравшему предыдущий гейм.
            </p>
            <p>
              <strong>5.2.</strong> При переходе подачи (Hand-out) подающий
              имеет право выбрать для ввода мяча любой квадрат подачи (левый или
              правый). При удержании подачи и выигрыше очков подающий обязан
              каждый раз менять квадрат на противоположный.
            </p>
            <p>
              <strong>5.3.</strong> В момент соприкосновения ракетки с мячом у
              подающего хотя бы одна нога должна полностью находиться внутри
              выбранного квадрата подачи (Service Box), не касаясь его
              ограничительных линий.
            </p>
            <p>
              <strong>5.4.</strong> Подача признается правильной, если мяч
              подброшен с руки и направлен ударом ракетки напрямую в переднюю
              стену выше линии подачи (Service Line) и ниже линии
              <GlossaryTerm term='аута' isDarkMode={isDarkMode} /> (Out Line), а
              после отскока приземлился в противоположной задней четверти корта
              (за исключением случаев приема соперником с лёта).
            </p>
          </div>
          <KeyTakeaway
            title='Опасные ошибки на подаче (Foot Fault)'
            emoji='👟'
            isDarkMode={isDarkMode}
          >
            Нарушение правил постановки ног (наступление на линию квадрата во
            время подачи) карается мгновенным переходом подачи сопернику. В
            сквоше нет «второй подачи», как в теннисе — дается только одна
            попытка.
          </KeyTakeaway>
        </section>

        {/* Раздел 6. Розыгрыш */}
        <section id='sec-6' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              6
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Розыгрыш
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>6.1.</strong> После выполнения корректной подачи игроки
              совершают удары по мячу поочередно. Розыгрыш очка длится до тех
              пор, пока один из игроков не допустит ошибку или Рефери не
              остановит игру.
            </p>
            <p>
              <strong>6.2.</strong> Удар признается правильным, если мяч
              встречен ракеткой до его второго касания пола корта, направлен в
              переднюю стену выше звуковой панели (
              <GlossaryTerm term='жестянки' isDarkMode={isDarkMode} /> / tin) и
              ниже линии аута, при этом полет мяча не сопровождается касанием
              пола или стен до удара о переднюю стену (касание боковых стен
              допускается после удара по пути к передней стене).
            </p>
            <p>
              <strong>6.3.</strong> Мяч считается вышедшим из игры в случаях:
              касания любой линии{' '}
              <GlossaryTerm term='аута' isDarkMode={isDarkMode} /> на стенах
              корта, касания потолка, касания звуковой панели (
              <GlossaryTerm term='жестянки' isDarkMode={isDarkMode} />) или
              падения на пол до касания передней стены.
            </p>
          </div>
          <KeyTakeaway
            title='Линия — это аут!'
            emoji='🟥'
            isDarkMode={isDarkMode}
          >
            Важнейшее отличие сквоша от тенниса: все линии разметки на стенах
            корта (включая верхнюю планку жестянки) считаются зоной аута.
            Задевание линии мячом означает проигрыш очка.
          </KeyTakeaway>
        </section>

        {/* Раздел 7. Интервалы */}
        <section id='sec-7' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              7
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Интервалы
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>7.1.</strong> Время между окончанием пятиминутной разминки
              на корте и началом первого розыгрыша матча составляет строго 60
              секунд (1 минута).
            </p>
            <p>
              <strong>7.2.</strong> Между всеми геймами матча игрокам
              предоставляется фиксированный перерыв длительностью ровно 2 минуты
              (120 секунд) для отдыха, смены инвентаря и консультаций с
              тренером.
            </p>
            <p>
              <strong>7.3.</strong> В случае непредвиденного повреждения
              экипировки (включая защитные очки или обувь) игроку
              предоставляется перерыв до 2 минут на устранение неисправности.
              Если ремонт или замена невозможны в этот срок, игрок обязан
              продолжить игру или сдать текущий гейм.
            </p>
          </div>
          <KeyTakeaway
            title='Тайминг 2025/2026'
            emoji='⏱️'
            isDarkMode={isDarkMode}
          >
            Помните об изменениях правил: перерыв перед первым геймом сократился
            до 60 секунд, но отдых между геймами увеличился до полноценных 2
            минут. Контролируйте время, чтобы не получить предупреждение от
            судьи.
          </KeyTakeaway>
        </section>

        {/* Раздел 8. Помехи */}
        <section id='sec-8' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              8
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Помехи
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>8.1.</strong> Игрок, только что совершивший удар по мячу,
              обязан приложить все усилия, чтобы освободить корт и предоставить
              сопернику: свободную видимость мяча (fair view), беспрепятственный
              доступ к траектории движения мяча (access), пространство для
              выполнения разумного замаха и удара (reasonable swing), а также
              свободный коридор для направления мяча на переднюю стену.
            </p>
            <p>
              <strong>8.2.</strong> Если в процессе движения к мячу или замаха
              возникает помеха, игрок должен немедленно остановиться и голосом
              попросить "Let, please" (Лет).
            </p>
            <p>
              <strong>8.3.</strong> Судья анализирует ситуацию и выносит одно из
              трех решений:
            </p>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                <strong>No Let (Нет лета):</strong> Помеха была незначительной,
                или игрок симулировал её, или мяч физически было невозможно
                догнать. Выигрыш очка соперником.
              </li>
              <li>
                <strong>Let (Лет):</strong> Случайная помеха. Игрок мог нанести
                правильный удар, но остановился в целях безопасности. Розыгрыш
                переигрывается сначала.
              </li>
              <li>
                <strong>Stroke (Строук):</strong> Серьезная помеха. Соперник
                заблокировал замах ракетки или перекрыл траекторию удара прямо в
                переднюю стену. Пострадавшему присуждается очко.
              </li>
            </ul>
          </div>
          <KeyTakeaway
            title='Золотое правило безопасности'
            emoji='🛡️'
            isDarkMode={isDarkMode}
          >
            Никогда не бейте по мячу, если соперник стоит прямо перед вами или
            на линии вашего замаха. Просто остановитесь и попросите Let. Судья
            наградит вас очком (Stroke), а ваш соперник избежит травмы.
          </KeyTakeaway>
        </section>

        {/* Раздел 9. Попадание мяча в игрока */}
        <section id='sec-9' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              9
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Попадание мяча в игрока (Ball Hitting a Player)
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>9.1.</strong> Если мяч после удара летит к передней стене
              и касается соперника, его экипировки, одежды или ракетки:
            </p>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                Если удар летел напрямую в переднюю стену — ударившему игроку
                присуждается <strong>Stroke</strong> (выигрыш очка).
              </li>
              <li>
                Если удар летел по диагонали (сначала в боковую стену) —
                назначается <strong>Let</strong> (переигровка).
              </li>
            </ul>
            <p>
              <strong>9.2.</strong> Если мяч касается самого игрока, который
              совершил удар, или его собственной экипировки — этот игрок
              немедленно проигрывает очко.
            </p>
          </div>
          <KeyTakeaway
            title='Мяч попал в соперника?'
            emoji='🎯'
            isDarkMode={isDarkMode}
          >
            Если вы нанесли удар, и мяч попал в соперника, стоящего у передней
            стены, очко ваше. Но если вы сами задели себя мячом или наступили на
            него — очко присуждается сопернику.
          </KeyTakeaway>
        </section>

        {/* Раздел 10. Апелляции */}
        <section id='sec-10' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              10
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Апелляции
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>10.1.</strong> Игрок имеет право остановить розыгрыш и
              обратиться к Рефери с апелляцией на любое решение или отсутствие
              объявления Маркера (например, если Маркер не заметил аут или
              двойной отскок мяча от пола).
            </p>
            <p>
              <strong>10.2.</strong> Апелляция должна быть подана немедленно
              после спорного эпизода и до выполнения следующей подачи.
            </p>
            <p>
              <strong>10.3.</strong> Если Рефери удовлетворяет апелляцию игрока,
              розыгрыш переигрывается (Let) или очко присуждается апеллирующему
              игроку (в зависимости от ситуации). Если апелляция отклонена,
              решение Маркера остается в силе.
            </p>
          </div>
          <KeyTakeaway
            title='Как подать апелляцию?'
            emoji='📢'
            isDarkMode={isDarkMode}
          >
            Голосом скажите: «Let, please» или «Appeal». Сделать это нужно сразу
            после спорного удара. Если вы продолжили розыгрыш и ударили по мячу,
            апелляция за предыдущий удар больше не принимается.
          </KeyTakeaway>
        </section>

        {/* Раздел 11. Мяч и экипировка */}
        <section id='sec-11' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              11
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Мяч и экипировка (The Ball & Equipment)
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>11.1.</strong> Игровой мяч и ракетки должны строго
              соответствовать техническим спецификациям WSF (см. Приложение 5).
              Замена мяча во время игры допускается только с разрешения Рефери,
              если мяч пришел в негодность (лопнул или деформировался).
            </p>
            <p>
              <strong>11.2.</strong> Если в процессе розыгрыша мяч лопнул, этот
              розыгрыш аннулируется, и назначается переигрывание (Let).
            </p>
            <p>
              <strong>11.3.</strong> Использование защитных очков (Protective
              Eyewear), соответствующих международным стандартам безопасности,
              является строго обязательным во всех официальных турнирах для
              игроков в возрасте до 19 лет, а также во всех парных матчах.
            </p>
          </div>
          <KeyTakeaway
            title='Проверяйте мяч на прочность'
            emoji='🔍'
            isDarkMode={isDarkMode}
          >
            Если вам показалось, что мяч стал отскакивать хуже, покажите его
            судье между розыгрышами. Если на нем есть даже микротрещина, судья
            заменит его на новый, а текущий розыгрыш (если он только что
            завершился) будет переигран.
          </KeyTakeaway>
        </section>

        {/* Раздел 12. Условия игры на корте */}
        <section id='sec-12' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              12
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Условия игры на корте (Conditions of Play)
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>12.1.</strong> Если корт становится небезопасным для
              продолжения игры (например, из-за влаги от пота на паркете,
              протечки потолка или повреждения стены), Рефери обязан немедленно
              остановить матч до полного устранения проблемы.
            </p>
            <p>
              <strong>12.2.</strong> Посторонние предметы на корте: если во
              время розыгрыша у игрока выпадает какой-либо личный предмет
              (резинка для волос, намотка, защитные очки) — розыгрыш
              останавливается:
            </p>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                Если предмет выпал у игрока самостоятельно — этот игрок
                проигрывает очко.
              </li>
              <li>
                Если выпадение предмета произошло из-за физического контакта с
                соперником — назначается Let.
              </li>
            </ul>
          </div>
          <KeyTakeaway
            title='Потеряли очки или бандану?'
            emoji='👓'
            isDarkMode={isDarkMode}
          >
            Следите за надежностью крепления очков и банданы. Если они упадут на
            пол посреди розыгрыша сами по себе, судья остановит игру и отдаст
            очко вашему сопернику, так как это создает опасность падения.
          </KeyTakeaway>
        </section>

        {/* Раздел 13. Травмы и кровотечения */}
        <section id='sec-13' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              13
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Травмы и кровотечения (Injury & Blood)
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>13.1. Кровотечение (Blood):</strong> При обнаружении
              любого видимого кровотечения у игрока Рефери обязан немедленно
              остановить матч. Игрок не имеет права находиться на корте с
              открытой раной. Ему предоставляется разумное время на остановку
              крови и перевязку. Если кровотечение возобновляется, игроку
              засчитывается поражение.
            </p>
            <p>
              <strong>13.2. Травмы (Injury):</strong> Решения принимаются исходя
              из виновника происшествия:
            </p>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                <strong>Вызвана соперником случайно:</strong> Пострадавшему
                дается 15 минут на восстановление. Если он не может продолжить —
                победа присуждается сопернику.
              </li>
              <li>
                <strong>Вызвана соперником умышленно:</strong> Нарушителю
                немедленно засчитывается поражение во всем матче.
              </li>
              <li>
                <strong>Собственная травма (судороги, растяжение):</strong>{' '}
                Игроку дается 3 минуты на восстановление. Если он не готов
                играть, он может сдать текущий гейм (проиграв его 0-11) и взять
                законные 2 минуты перерыва между геймами, либо признать
                поражение.
              </li>
            </ul>
          </div>
          <KeyTakeaway
            title='Правила судорог и спазмов'
            emoji='🩹'
            isDarkMode={isDarkMode}
          >
            Судорога приравнивается к собственной травме. У вас есть всего 3
            минуты. Если за это время массаж не помог, сдавайте гейм, берите еще
            2 минуты перерыва между геймами и пытайтесь восстановиться.
          </KeyTakeaway>
        </section>

        {/* Раздел 14. Поведение на корте */}
        <section id='sec-14' className='scroll-mt-24 mb-16'>
          <div
            className={`flex items-center gap-4 mb-6 pb-3 border-b ${
              isDarkMode ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
              14
            </span>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Поведение на корте (Conduct)
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
          >
            <p>
              <strong>14.1.</strong> Игроки обязаны вести себя спортивно и
              уважать соперников и официальных лиц. Нарушениями признаются:
              нецензурная лексика, швыряние ракетки, умышленный физический
              контакт, затягивание времени, препирательства с Рефери.
            </p>
            <p>
              <strong>14.2.</strong> Рефери имеет право применять к нарушителям
              шкалу дисциплинарных взысканий:
            </p>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                <strong>Conduct Warning:</strong> Предупреждение (за
                незначительное или первое нарушение).
              </li>
              <li>
                <strong>Conduct Stroke:</strong> Штрафное очко (присуждается
                сопернику нарушителя).
              </li>
              <li>
                <strong>Conduct Game:</strong> Штрафной гейм (присуждается
                сопернику нарушителя).
              </li>
              <li>
                <strong>Conduct Match:</strong> Дисквалификация игрока и
                присуждение победы в матче сопернику.
              </li>
            </ul>
          </div>
          <KeyTakeaway
            title='Эмоции под контролем'
            emoji='🤬'
            isDarkMode={isDarkMode}
          >
            За брошенную в стену ракетку или удар по стеклу корта судья имеет
            право сразу же дать вам Conduct Stroke (штрафное очко сопернику) без
            предварительного предупреждения. Держите эмоции при себе.
          </KeyTakeaway>
        </section>

        <Quiz
          isDarkMode={isDarkMode}
          onPerfectScore={handlePerfectQuizScore}
          isQuizPassed={isQuizPassed}
        />
      </main>
    </div>
  )
}
