'use client'

import { useState } from 'react'

export default function CourtVisualizer({ isDarkMode }) {
  const [activeId, setActiveId] = useState(null)

  const courtData = {
    out: {
      title: 'Линия аута (Out Line)',
      dims: 'Высота: передняя стена — 4.57 м, боковые скосы — до 2.13 м на задней стене',
      desc: 'Верхняя сплошная линия на всех четырех стенах. Касание мячом этой линии или пространства выше нее считается аутом. Обратите внимание: боковые линии наклонные — они плавно опускаются к заднему стеклу.',
    },
    service: {
      title: 'Линия подачи (Service Line)',
      dims: 'Высота: 1.78 м',
      desc: 'Средняя горизонтальная линия на передней стене. Она используется исключительно во время подачи. Подающий должен направить мяч так, чтобы тот ударился строго выше этой линии и ниже линии аута.',
    },
    tin: {
      title: 'Звуковая панель (Тин / Tin)',
      dims: 'Высота: 43 см (9.4% от высоты передней стены корта)',
      desc: 'Нижняя металлическая панель передней стены («жестянка»). Попадание мяча в тин или его верхнюю рейку — это мгновенный аут. Панель издает громкий металлический звон при ударе.',
    },
    box: {
      title: 'Зоны подачи (Service Boxes)',
      dims: 'Размеры: 1.6 x 1.6 м (ровно 25% от ширины корта)',
      desc: 'Специальные зоны на полу. Во время подачи подающий обязан держать хотя бы одну ногу полностью внутри выбранного квадрата, не наступая на его ограничительные линии.',
    },
    floor: {
      title: 'Игровой паркет корта (The Floor)',
      dims: 'Длина корта: 9.75 м, Ширина: 6.40 м',
      desc: 'Деревянный пол корта. Мяч может коснуться пола только один раз перед вашим ударом. Если мяч бьется о пол дважды — розыгрыш проигран. Удар в пол напрямую (до касания передней стены) — также ошибка.',
    },
    leftWall: {
      title: 'Левая боковая стена корта',
      dims: 'Длина: 9.75 м, Высота: скос от 4.57 м до 2.13 м',
      desc: 'Используется для рикошетов и обманных ударов (боустов). Мяч может коснуться левой стены любое количество раз как по пути к передней стене, так и после отскока от нее, если он не вышел в аут.',
    },
    rightWall: {
      title: 'Правая боковая стена корта',
      dims: 'Длина: 9.75 м, Высота: скос от 4.57 м до 2.13 м',
      desc: 'Правая боковая панель игрового пространства. Служит для тактического зажатия соперника по правой стороне. Касание стены ниже линии аута полностью легитимно во время розыгрыша.',
    },
    frontWall: {
      title: 'Передняя стена (Front Wall)',
      dims: 'Ширина: 6.40 м, Высота: 4.57 м',
      desc: 'Главная стена корта. Каждый ответный удар игрока обязан коснуться передней стены напрямую или через рикошеты боковых стен до соприкосновения с паркетом.',
    },
    tZone: {
      title: 'Центральные линии разметки и Т-зона',
      dims: 'Ширина разметки: 50 мм',
      desc: 'Линии, формирующие Т-зону. Поперечная линия (Short Line) делит корт на переднюю и заднюю половины, продольная делит заднюю часть на левую и правую зоны приема, а точка пересечения является важнейшей тактической позицией на корте.',
    },
  }

  const activeInfo = activeId
    ? courtData[activeId]
    : {
        title: 'Интерактивный 3D-корт',
        dims: 'Справочник описаний и размеров',
        desc: 'Наведите курсор мыши на любую линию или зону 3D-корта выше, чтобы изучить правила, размеры и особенности разметки корта.',
      }

  // Единый цвет заливки активных элементов
  const goldHighlightFill = 'rgba(245, 158, 11, 0.12)'

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
          <defs>
            <clipPath id='court-clip'>
              <rect x='21' y='20' width='558' height='360' />
            </clipPath>
            {/* Маска для паркета пола (в 3D-перспективе) */}
            <clipPath id='floor-clip'>
              <polygon points='150,260 450,260 580,380 20,380' />
            </clipPath>
          </defs>

          {/* Фон корта (Задняя стена/Пустота вокруг) */}
          <rect x='0' y='0' width='600' height='400' fill='transparent' />

          {/* 1. БАЗОВЫЕ ПЛОСКОСТИ (cursor-default) */}

          {/* Левая стена */}
          <polygon
            points='20,20 150,80 150,260 20,380'
            fill={
              activeId === 'leftWall'
                ? goldHighlightFill
                : isDarkMode
                  ? '#111113'
                  : '#f8fafc'
            }
            stroke={isDarkMode ? '#222227' : '#e2e8f0'}
            strokeWidth='2'
            strokeLinejoin='round'
            className='cursor-default transition-colors duration-200'
            onMouseEnter={() => setActiveId('leftWall')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('leftWall')}
          />
          {/* Правая стена */}
          <polygon
            points='580,20 450,80 450,260 580,380'
            fill={
              activeId === 'rightWall'
                ? goldHighlightFill
                : isDarkMode
                  ? '#111113'
                  : '#f8fafc'
            }
            stroke={isDarkMode ? '#222227' : '#e2e8f0'}
            strokeWidth='2'
            strokeLinejoin='round'
            className='cursor-default transition-colors duration-200'
            onMouseEnter={() => setActiveId('rightWall')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('rightWall')}
          />
          {/* Передняя стена корта */}
          <rect
            x='150'
            y='80'
            width='300'
            height='180'
            fill={
              activeId === 'frontWall'
                ? goldHighlightFill
                : isDarkMode
                  ? '#16161a'
                  : '#f1f5f9'
            }
            stroke={isDarkMode ? '#2d2d35' : '#cbd5e1'}
            strokeWidth='2'
            className='cursor-default transition-colors duration-200'
            onMouseEnter={() => setActiveId('frontWall')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('frontWall')}
          />
          {/* Пол корта */}
          <polygon
            points='150,260 450,260 580,380 20,380'
            fill={
              activeId === 'floor'
                ? goldHighlightFill
                : isDarkMode
                  ? '#0a0a0c'
                  : '#f1f5f9'
            }
            stroke={isDarkMode ? '#222227' : '#e2e8f0'}
            strokeWidth='2'
            strokeLinejoin='round'
            className='cursor-default transition-colors duration-200'
            onMouseEnter={() => setActiveId('floor')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('floor')}
          />

          {/* ИГРОВОЕ ПОЛЕ (Зона пола для наведения на пол) */}
          <polygon
            points='150,260 450,260 525,330 75,330'
            fill={activeId === 'floor' ? goldHighlightFill : 'transparent'}
            className='cursor-pointer transition-colors duration-200'
            onMouseEnter={() => setActiveId('floor')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('floor')}
          />

          {/* 2. КВАДРАТЫ ПОДАЧИ (Отрендерены ДО линий разметки, чтобы лежать под ними) */}

          {/* ЛЕВЫЙ КВАДРАТ ПОДАЧИ */}
          {/* Зона заливки (продлена за стену и обрезана маской пола) */}
          <polygon
            points='60,330 187,330 180,355 30,355'
            fill={activeId === 'box' ? goldHighlightFill : 'transparent'}
            clipPath='url(#floor-clip)' // Обрезаем по контуру пола
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('box')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('box')}
          />
          {/* Контурные линии (3 стороны, продлены за стену и обрезаны маской пола) */}
          <polyline
            points='60,330 187,330 180,355 30,355'
            fill='none'
            stroke={activeId === 'box' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
            strokeLinejoin='round'
            strokeLinecap='round'
            clipPath='url(#floor-clip)' // Обрезаем по контуру пола
            className='pointer-events-none transition-all duration-200'
          />

          {/* ПРАВЫЙ КВАДРАТ ПОДАЧИ */}
          {/* Зона заливки (продлена за стену и обрезана маской пола) */}
          <polygon
            points='540,330 413,330 420,355 570,355'
            fill={activeId === 'box' ? goldHighlightFill : 'transparent'}
            clipPath='url(#floor-clip)'
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('box')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('box')}
          />
          {/* Контурные линии (3 стороны, продлены за стену и обрезаны маской пола) */}
          <polyline
            points='540,330 413,330 420,355 570,355'
            fill='none'
            stroke={activeId === 'box' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
            strokeLinejoin='round'
            strokeLinecap='round'
            clipPath='url(#floor-clip)'
            className='pointer-events-none transition-all duration-200'
          />

          {/* 3. РАЗМЕТКА ПОЛА (Отрендерена поверх пола и квадратов подачи) */}
          {/* Short Line (Поперечная, продлена за стены и обрезана маской пола) */}
          <line
            x1='60'
            y1='330'
            x2='540'
            y2='330'
            stroke={activeId === 'tZone' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'tZone' ? '4' : '2'}
            clipPath='url(#floor-clip)'
            className='transition-all duration-200'
          />
          {/* Half-Court Line (Продольная, обрезана маской пола) */}
          <line
            x1='300'
            y1='330'
            x2='300'
            y2='379'
            stroke={activeId === 'tZone' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'tZone' ? '4' : '2'}
            clipPath='url(#floor-clip)'
            className='transition-all duration-200'
          />

          {/* 4. ЛИНИИ ПЕРЕДНЕЙ СТЕНЫ (Визуальные линии) */}
          {/* Тин */}
          <rect
            x='151'
            y='243'
            width='298'
            height='17'
            fill={
              activeId === 'tin'
                ? goldHighlightFill
                : isDarkMode
                  ? '#25252b'
                  : '#e2e8f0'
            }
          />
          {/* Нижняя линия аута на фронтальной стене */}
          <line
            x1='151'
            y1='243'
            x2='449'
            y2='243'
            stroke={activeId === 'tin' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
          />
          {/* Линия подачи */}
          <line
            x1='151'
            y1='190'
            x2='449'
            y2='190'
            stroke={activeId === 'service' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
          />
          {/* Единая цельная линия аута со сглаженными стыками на углах и вертикальным срезом на краях */}
          <polyline
            points='20,220 150,80 450,80 580,220' // Удлинили линию за пределы корта
            fill='none'
            stroke={activeId === 'out' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'out' ? '4' : '2'}
            strokeLinejoin='round'
            strokeLinecap='round'
            clipPath='url(#court-clip)' // Применяем маску обрезки
            className='transition-all duration-200'
          />

          {/* 5. ВЕРХНИЙ СТЕК: Невидимые широкие хитбоксы для легкого наведения (cursor-pointer) */}

          {/* Хитбокс Т-зоны (продлен за стены и обрезан маской пола) */}
          <path
            d='M 60,330 L 540,330 M 300,330 L 300,380'
            fill='none'
            stroke='transparent'
            strokeWidth='16'
            className='cursor-pointer'
            clipPath='url(#floor-clip)'
            onMouseEnter={() => setActiveId('tZone')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('tZone')}
          />
          {/* Хитбокс тина */}
          <rect
            x='150'
            y='243'
            width='300'
            height='17'
            fill='transparent'
            className='cursor-pointer'
            onMouseEnter={() => setActiveId('tin')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('tin')}
          />
          {/* Хитбокс линии подачи */}
          <line
            x1='150'
            y1='190'
            x2='450'
            y2='190'
            stroke='transparent'
            strokeWidth='16'
            className='cursor-pointer'
            onMouseEnter={() => setActiveId('service')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('service')}
          />
          {/* Единый широкий хитбокс линии аута (с вертикальным срезом на краях) */}
          <polyline
            points='10,220 150,80 450,80 590,220' // Удлинили линию за пределы корта
            fill='none'
            stroke='transparent'
            strokeWidth='16'
            className='cursor-pointer'
            strokeLinejoin='round'
            strokeLinecap='round'
            clipPath='url(#court-clip)' // Применяем маску обрезки
            onMouseEnter={() => setActiveId('out')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('out')}
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
          className={`min-h-10 text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {activeInfo.desc}
        </p>
      </div>
    </div>
  )
}
