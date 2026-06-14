'use client'

import { useReducer } from 'react'

// 1. Описываем начальное состояние автомата
const initialState = {
  step: 0,
  history: [],
}

// 2. Чистая функция-редьюсер: управляет переходами между шагами
function decisionReducer(state, action) {
  switch (action.type) {
    case 'ANSWER':
      return {
        step: action.payload,
        history: [...state.history, state.step], // Безопасно сохраняем историю без мутаций
      }
    case 'BACK':
      if (state.history.length === 0) return state
      const prevStep = state.history[state.history.length - 1]
      return {
        step: prevStep,
        history: state.history.slice(0, -1), // Удаляем последний шаг из истории
      }
    case 'RESTART':
      return initialState
    default:
      return state
  }
}

export default function DecisionHelper({ isDarkMode }) {
  // 3. Подключаем редьюсер вместо нескольких useState
  const [state, dispatch] = useReducer(decisionReducer, initialState)
  const { step, history } = state

  const handleAnswer = (nextStep) => {
    dispatch({ type: 'ANSWER', payload: nextStep })
  }

  const handleBack = () => {
    dispatch({ type: 'BACK' })
  }

  const handleRestart = () => {
    dispatch({ type: 'RESTART' })
  }

  const resultCardClass = `p-6 rounded-2xl border text-center transition-all ${
    isDarkMode
      ? 'bg-neutral-950/40 border-neutral-800'
      : 'bg-slate-50 border-slate-200'
  }`

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 min-h-[320px] flex flex-col justify-between ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20'
          : 'border-slate-200 bg-white shadow-xs'
      }`}
    >
      {/* Шаг 0: Приветственный экран */}
      {step === 0 && (
        <div className='text-center py-4'>
          <span className='text-4xl mb-4 block'>⚖️</span>
          <h3
            className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
          >
            Интерактивный судейский арбитр WSF
          </h3>
          <p
            className={`text-sm leading-relaxed max-w-md mx-auto mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Этот калькулятор поможет быстро и объективно разрешить спор на
            корте. Ответьте на несколько простых вопросов о произошедшей помехе,
            чтобы получить официальное решение.
          </p>
          <button
            onClick={() => handleAnswer(1)}
            className='px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer active:scale-95 transition-all'
          >
            Начать разбор ситуации 🚀
          </button>
        </div>
      )}

      {/* Шаг 1: Шанс сыграть мяч */}
      {step === 1 && (
        <div className='flex flex-col justify-between flex-1'>
          <div>
            <span className='text-xs font-bold text-amber-500 uppercase tracking-wider block mb-2'>
              Шаг 1 из 3
            </span>
            <h3
              className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Был ли у пострадавшего игрока реальный физический шанс добежать и
              сделать правильный удар по мячу?
            </h3>
          </div>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <button
              onClick={() => handleAnswer(2)}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Да 👍
            </button>
            <button
              onClick={() => handleAnswer('no-let')}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Нет 👎
            </button>
          </div>
        </div>
      )}

      {/* Шаг 2: Усилия соперника */}
      {step === 2 && (
        <div className='flex flex-col justify-between flex-1'>
          <div>
            <span className='text-xs font-bold text-amber-500 uppercase tracking-wider block mb-2'>
              Шаг 2 из 3
            </span>
            <h3
              className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Сделал ли соперник максимум усилий, чтобы уйти с пути и
              предоставить свободу замаха и видимости?
            </h3>
          </div>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <button
              onClick={() => handleAnswer(4)}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Да, он старался уйти 🏃‍♂️
            </button>
            <button
              onClick={() => handleAnswer(3)}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Нет, он заблокировал 🛑
            </button>
          </div>
        </div>
      )}

      {/* Шаг 3: Серьезность блокировки при отсутствии усилий */}
      {step === 3 && (
        <div className='flex flex-col justify-between flex-1'>
          <div>
            <span className='text-xs font-bold text-amber-500 uppercase tracking-wider block mb-2'>
              Шаг 3 из 3
            </span>
            <h3
              className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Помешал ли соперник выполнить замах ракетки или перекрыл ли он
              траекторию удара прямо в переднюю стену?
            </h3>
          </div>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <button
              onClick={() => handleAnswer('stroke')}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Да, закрыл замах/стену
            </button>
            <button
              onClick={() => handleAnswer('let')}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Нет, помеха умеренная
            </button>
          </div>
        </div>
      )}

      {/* Шаг 4: Существенность помехи при максимальных усилиях */}
      {step === 4 && (
        <div className='flex flex-col justify-between flex-1'>
          <div>
            <span className='text-xs font-bold text-amber-500 uppercase tracking-wider block mb-2'>
              Шаг 3 из 3
            </span>
            <h3
              className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
            >
              Была ли помеха минимальной (незначительный контакт) или она
              действительно помешала завершить замах?
            </h3>
          </div>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <button
              onClick={() => handleAnswer('let')}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Существенная помеха
            </button>
            <button
              onClick={() => handleAnswer('no-let')}
              className={`p-4 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-neutral-800 hover:border-amber-500/30'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              Минимальный контакт
            </button>
          </div>
        </div>
      )}

      {/* РЕЗУЛЬТАТ: NO LET */}
      {step === 'no-let' && (
        <div className={resultCardClass}>
          <span className='text-4xl mb-4 block'>❌</span>
          <h3 className='text-lg font-extrabold text-red-500 mb-2'>
            Вердикт: NO LET (Нет переигровки)
          </h3>
          <p className='text-xs text-slate-400 leading-relaxed mb-6'>
            Очко присуждается сопернику. Помеха признается незначительной, либо
            пострадавший игрок физически не имел шансов добежать до мяча в этой
            ситуации (Правило 8.3).
          </p>
          <button
            onClick={handleRestart}
            className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md'
          >
            Новый разбор 🔄
          </button>
        </div>
      )}

      {/* РЕЗУЛЬТАТ: LET */}
      {step === 'let' && (
        <div className={resultCardClass}>
          <span className='text-4xl mb-4 block'>🔄</span>
          <h3 className='text-lg font-extrabold text-amber-500 mb-2'>
            Вердикт: LET (Переиграть розыгрыш)
          </h3>
          <p className='text-xs text-slate-400 leading-relaxed mb-6'>
            Назначается переигровка розыгрыша с той же подачи. Помеха была
            случайной или непредотвратимой, но при этом соперник сделал всё
            возможное, чтобы уйти с вашего пути (Правило 8.3).
          </p>
          <button
            onClick={handleRestart}
            className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md'
          >
            Новый разбор 🔄
          </button>
        </div>
      )}

      {/* РЕЗУЛЬТАТ: STROKE */}
      {step === 'stroke' && (
        <div className={resultCardClass}>
          <span className='text-4xl mb-4 block'>🔴</span>
          <h3 className='text-lg font-extrabold text-emerald-500 mb-2'>
            Вердикт: STROKE (Очко пострадавшему)
          </h3>
          <p className='text-xs text-slate-400 leading-relaxed mb-6'>
            Очко присуждается вам. Соперник не сделал должных усилий, чтобы
            уступить дорогу, преградил прямой коридор удара в переднюю стену или
            заблокировал замах вашей ракетки (Правило 8.3).
          </p>
          <button
            onClick={handleRestart}
            className='px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md'
          >
            Новый разбор 🔄
          </button>
        </div>
      )}

      {/* Нижня панель навигации */}
      {step !== 0 && typeof step === 'number' && (
        <div className='flex justify-between border-t border-neutral-800/10 pt-4 mt-2'>
          <button
            onClick={handleBack}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode
                ? 'border-neutral-800 text-slate-400 hover:bg-neutral-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⬅️ Назад
          </button>
          <button
            onClick={handleRestart}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode
                ? 'border-neutral-800 text-slate-400 hover:bg-neutral-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Сбросить 🔄
          </button>
        </div>
      )}
    </div>
  )
}
