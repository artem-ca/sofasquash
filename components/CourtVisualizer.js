'use client'

import { useState } from 'react'

export default function CourtVisualizer({ isDarkMode }) {
  const [activeId, setActiveId] = useState(null)

  const courtData = {
    out: {
      title: 'Линия аута (Out Line) 🟥',
      dims: 'Высота: передняя стена — 4.57 м, боковые скосы — до 2.13 м на задней стене',
      desc: 'Верхняя сплошная линия на всех четырех стенах. Касание мячом этой линии или пространства выше нее считается аутом. Обратите внимание: боковые линии наклонные — они плавно опускаются к заднему стеклу.',
    },
    service: {
      title: 'Линия подачи (Service Line) 🎯',
      dims: 'Высота: 1.78 м',
      desc: 'Средняя горизонтальная линия на передней стене. Она используется исключительно во время подачи. Подающий должен направить мяч так, чтобы тот ударился строго выше этой линии и ниже линии аута.',
    },
    tin: {
      title: 'Звуковая панель (Тин / Tin) 🥎',
      dims: 'Высота: 43 см (9.4% от высоты передней стены корта)',
      desc: 'Нижняя металлическая панель передней стены («жестянка»). Попадание мяча в тин или его верхнюю рейку — это мгновенный аут. Панель издает громкий металлический звон при ударе.',
    },
    box: {
      title: 'Зоны подачи (Service Boxes) 👣',
      dims: 'Размеры: 1.6 x 1.6 м (ровно 25% от ширины корта)',
      desc: 'Специальные зоны на полу. Во время подачи подающий обязан держать хотя бы одну ногу полностью внутри выбранного квадрата, не наступая на его ограничительные линии.',
    },
    floor: {
      title: 'Игровой паркет корта (The Floor) 🛹',
      dims: 'Длина корта: 9.75 м, Ширина: 6.40 м',
      desc: 'Деревянный пол корта. Мяч может коснуться пола только один раз перед вашим ударом. Если мяч бьется о пол дважды — розыгрыш проигран. Удар в пол напрямую (до касания передней стены) — также ошибка.',
    },
  }

  const activeInfo = activeId
    ? courtData[activeId]
    : {
        title: 'Интерактивный 3D-корт',
        dims: 'Справочник описаний и размеров',
        desc: 'Наведите курсор мыши на любую линию или зону 3D-корта выше, чтобы изучить правила, размеры и особенности разметки корта.',
      }
  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 my-8 ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20'
          : 'border-slate-200 bg-white shadow-xs'
      }`}
    >
      <div className='text-center mb-4'>
        <span className='text-xs font-bold text-amber-500 uppercase tracking-widest'>
          Масштабированная 3D-схема корта
        </span>
        <p
          className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
        >
          Наведите на линии или зоны 3D-корта для изучения правил и размеров
          разметки
        </p>
      </div>

      {/* Векторный 3D-корт в перспективе */}
      <div className='max-w-xl mx-auto mb-6'>
        <svg viewBox='0 0 600 400' className='w-full h-auto select-none'>
          {/* Фон корта (Задняя стена/Пустота вокруг) */}
          <rect x='0' y='0' width='600' height='400' fill='transparent' />

          {/* Боковые стены (Левая и Правая) */}
          {/* Левая стена */}
          <polygon
            points='20,20 150,80 150,260 20,380'
            fill={isDarkMode ? '#111113' : '#f8fafc'}
            stroke={isDarkMode ? '#222227' : '#e2e8f0'}
            strokeWidth='2'
          />
          {/* Правая стена */}
          <polygon
            points='580,20 450,80 450,260 580,380'
            fill={isDarkMode ? '#111113' : '#f8fafc'}
            stroke={isDarkMode ? '#222227' : '#e2e8f0'}
            strokeWidth='2'
          />

          {/* Передняя стена корта */}
          <rect
            x='150'
            y='80'
            width='300'
            height='180'
            fill={isDarkMode ? '#16161a' : '#f1f5f9'}
            stroke={isDarkMode ? '#2d2d35' : '#cbd5e1'}
            strokeWidth='2'
          />

          {/* Деревянный пол корта */}
          <polygon
            points='150,260 450,260 580,380 20,380'
            fill={isDarkMode ? '#0a0a0c' : '#f1f5f9'}
            stroke={isDarkMode ? '#222227' : '#e2e8f0'}
            strokeWidth='2'
          />

          {/* Эстетика досок паркета (перспективные линии) */}
          {/* <line
            x1='200'
            y1='260'
            x2='113'
            y2='380'
            stroke={isDarkMode ? '#16161c' : '#e2e8f0'}
            strokeWidth='1'
          />
          <line
            x1='250'
            y1='260'
            x2='206'
            y2='380'
            stroke={isDarkMode ? '#16161c' : '#e2e8f0'}
            strokeWidth='1'
          />
          <line
            x1='300'
            y1='260'
            x2='300'
            y2='380'
            stroke={isDarkMode ? '#16161c' : '#e2e8f0'}
            strokeWidth='1'
          />
          <line
            x1='350'
            y1='260'
            x2='394'
            y2='380'
            stroke={isDarkMode ? '#16161c' : '#e2e8f0'}
            strokeWidth='1'
          />
          <line
            x1='400'
            y1='260'
            x2='487'
            y2='380'
            stroke={isDarkMode ? '#16161c' : '#e2e8f0'}
            strokeWidth='1'
          /> */}

          {/* ИГРОВОЕ ПОЛЕ (Зона пола для наведения на пол) */}
          <polygon
            points='150,260 450,260 525,330 75,330'
            fill={
              activeId === 'floor' ? 'rgba(245, 158, 11, 0.08)' : 'transparent'
            }
            className='cursor-pointer transition-colors duration-200'
            onMouseEnter={() => setActiveId('floor')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('floor')}
          />

          {/* ЗВУКОВАЯ ПАНЕЛЬ (ТИН) — МАСШТАБИРОВАНА ДО 17px (43 см) */}
          <rect
            x='150'
            y='243'
            width='300'
            height='17'
            fill={
              activeId === 'tin'
                ? 'rgba(245, 158, 11, 0.15)'
                : isDarkMode
                  ? '#25252b'
                  : '#e2e8f0'
            }
            className='cursor-pointer transition-all duration-200'
            onMouseEnter={() => setActiveId('tin')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('tin')}
          />
          {/* Верхний металлический бортик тина */}
          <line
            x1='150'
            y1='243'
            x2='450'
            y2='243'
            stroke={activeId === 'tin' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'tin' ? '3' : '1.5'}
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('tin')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('tin')}
          />

          {/* ЛИНИЯ ПОДАЧИ (1.78 м от пола) */}
          <line
            x1='150'
            y1='190'
            x2='450'
            y2='190'
            stroke={activeId === 'service' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'service' ? '5' : '2'}
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('service')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('service')}
          />

          {/* ЛИНИИ АУТА (Красные, переходящие в золото при наведении) */}
          {/* Передняя стена аут (4.57 м от пола) */}
          <line
            x1='150'
            y1='80'
            x2='450'
            y2='80'
            stroke={activeId === 'out' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'out' ? '5' : '2'}
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('out')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('out')}
          />
          {/* Левая стена аут (наклонная линия от 150,80 до 20,210) */}
          <line
            x1='150'
            y1='80'
            x2='21'
            y2='210'
            stroke={activeId === 'out' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'out' ? '5' : '2'}
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('out')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('out')}
          />
          {/* Правая стена аут (наклонная линия от 450,80 до 580,210) */}
          <line
            x1='450'
            y1='80'
            x2='580'
            y2='210'
            stroke={activeId === 'out' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'out' ? '5' : '2'}
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('out')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('out')}
          />

          {/* РАЗМЕТКА ПОЛА В ПЕРСПЕКТИВЕ */}
          {/* Short Line (Поперечная линия разметки, утолщенная) */}
          <line
            x1='74'
            y1='330'
            x2='525'
            y2='330'
            stroke='#ef4444'
            strokeWidth='2'
          />
          {/* Half-Court Line (Продольная осевая линия) */}
          <line
            x1='300'
            y1='330'
            x2='300'
            y2='380'
            stroke='#ef4444'
            strokeWidth='2'
          />

          {/* ЛЕВЫЙ КВАДРАТ ПОДАЧИ (Правильная 3D-трапеция, направленная к точке схода) */}
          <polygon
            points='75,330 187,330 180,355 47,355'
            fill={
              activeId === 'box' ? 'rgba(245, 158, 11, 0.2)' : 'transparent'
            }
            stroke={activeId === 'box' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('box')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('box')}
          />

          {/* ПРАВЫЙ КВАДРАТ ПОДАЧИ (Правильная 3D-трапеция, направленная к точке схода) */}
          <polygon
            points='525,330 413,330 420,355 553,355'
            fill={
              activeId === 'box' ? 'rgba(245, 158, 11, 0.2)' : 'transparent'
            }
            stroke={activeId === 'box' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('box')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('box')}
          />
        </svg>
      </div>

      {/* Информационная карточка под схемой */}
      <div
        className={`p-4 rounded-xl border transition-all duration-300 ${
          isDarkMode
            ? 'bg-neutral-950/40 border-neutral-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div
          className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
        >
          {activeInfo.title}
        </div>
        <div className='text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1'>
          {activeInfo.dims}
        </div>
        <p
          className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {activeInfo.desc}
        </p>
      </div>
    </div>
  )
}
