'use client'

import { useState } from 'react'

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

export default function Quiz({ onPerfectScore }) {
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
      className='p-8 rounded-2xl border transition-all duration-300 mt-20 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/20 shadow-sm'
    >
      <div className='flex items-center gap-3 mb-6'>
        <span className='text-lg'>🧠</span>
        <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100'>
          Мини-квиз по правилам сквоша
        </h2>
      </div>

      {!showResults ? (
        <div>
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
            <p className='text-base font-bold mt-2 text-slate-800 dark:text-slate-200'>
              {questions[currentQ].q}
            </p>
          </div>

          <div className='flex flex-col gap-3 mb-6'>
            {questions[currentQ].options.map((option, idx) => {
              let btnClass =
                'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/40 text-slate-700 dark:text-slate-300 hover:border-amber-500/50 dark:hover:border-amber-500/30'

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
            <div className='p-4 rounded-xl mb-6 text-xs leading-relaxed animate-fade-in bg-slate-100 dark:bg-neutral-900/60 text-slate-600 dark:text-slate-400'>
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
          <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
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
              Хорошая попытка! Чтобы разблокировать секретную награду «Профессор
              Сквоша 🎓», вам нужно ответить правильно на все 5 вопросов.
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
