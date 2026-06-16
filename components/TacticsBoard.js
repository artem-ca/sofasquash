'use client'

import { useState } from 'react'

export default function TacticsBoard({ isDarkMode }) {
  const [activeShot, setActiveShot] = useState('drive')

  // Состояние плавающего хинта у курсора
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' })

  const shotsData = {
    drive: {
      title: 'Драйв (Drive)', // Драйв
      paths: [
        'M 100,380 L 80,33 L 50,430', // Слева
        'M 300,380 L 320,33 L 350,430', // Справа
      ],
      desc: 'Наиболее популярный и основной удар в сквоше. Мяч летит почти параллельно боковой стене (мини-кросс от себя) в заднюю часть корта.',
      when: 'Используется в большинстве розыгрышей для уведения соперника назад и контроля Т-зоны.',
      mistake:
        'Мяч вылетает слишком близко к центру корта (перехват соперником воллеем) или бьётся о боковую стену.',
      tooltips: ['Драйв слева', 'Драйв справа'],
    },
    boast: {
      title: 'Боуст (Boast)',
      paths: [
        'M 310,380 L 356,280 L 180,34 L 80,100', // Боуст справа
      ],
      desc: 'Обманный/Защитный удар через боковую или заднюю стену. Мяч бьется в боковую стену, затем летит в переднюю и отскакивает в противоположный передний угол.',
      when: 'Чтобы резко заставить соперника бежать вперед, когда он застрял глубоко сзади на Т-зоне.',
      mistake:
        'Слишком сильный или высокий удар. Мяч отскочит глубоко в центр корта, подставив вас под атаку соперника.',
      tooltips: ['Двухстенный боуст справа'],
    },
    crosscourt: {
      title: 'Кросс (Crosscourt)',
      paths: [
        'M 80,420 L 250,35 L 340,420', // Кросс из левого заднего угла за квадрат в правый задний
      ],
      desc: 'Диагональный удар через корт "наискосок". Удар подразумевает перевод соперника с одной стороны на другую.',
      when: 'Для смены направления атаки и перевода мяча на более выгодную для вас сторону в конкретной ситуации.',
      mistake:
        'Удар летит слишком близко к центру Т-зоны. Соперник легко перехватит этот кросс с лёта (воллеем).',
      tooltips: ['Диагональный кросс из левого заднего угла'],
    },
    lob: {
      title: 'Лоб (Lob / Свеча)',
      paths: [
        'M 280,100 L 220,35 Q 40,260 50,430', // Кросс-лоб (Удар правее центра 220,30 и вершина у левой стены 40,260)
        'M 300,100 L 310,34 Q 360,260 350,430', // Лоб-драйв (Удар по правой линии 310,30 и вершина у правой стены 360,260)
      ],
      desc: 'Защитный навесной удар "свечкой" с высокой траекторией полета мяча под самый потолок корта.',
      when: 'Когда вас резко вывели в передний угол и вам нужно выиграть время, чтобы вернуться в Т-зону и стабилизироваться.',
      mistake:
        'Слишком низкий навес. Мяч не перелетит соперника, и он захлопнет мяч мощным ударом с лёта.',
      tooltips: [
        'Лоб-кросс справа в задний левый угол',
        'Лоб-драйв справа вдоль правой стены в задний правый угол',
      ],
    },
    drop: {
      title: 'Дроп (Drop / Укороченный)',
      paths: [
        'M 120,220 L 90,32 L 80,60 L 75,90', // Слева
        'M 280,220 L 310,32 L 320,60 L 325,90', // Справа
      ],
      desc: 'Филигранный атакующий удар. Мяч мягко направляется в самый низ передней стены прямо над тином.',
      when: 'Когда вы находитесь впереди соперника (на Т-зоне или ближе к передней стене) и хотите вывеси соперника вперед, либо завершить розыгрыш.',
      mistake:
        'Слишком высокий или быстрый удар, который дает сопернику больше времени и места',
      tooltips: ['Укороченный дроп слева', 'Укороченный дроп справа'],
    },
    killshot: {
      title: 'Киллшот (Killshot)',
      // Симметричные траектории прямого киллшота (предельно низкий удар о переднюю стену y=32 и два быстрых отскока у самой стены!)
      paths: [
        'M 150,250 L 100,35 L 50,140', // Слева
        'M 250,250 L 300,35 L 350,140', // Справа
      ],
      desc: 'Быстрый, резкий и низкий атакующий удар. Мяч летит во фронтальную стену предельно низко с большой скоростью.',
      when: 'Используется для завершения розыгрыша, когда соперник находится глубоко сзади или смещен на противоположный край.',
      mistake:
        'Удар попадает слишком высоко (у соперника больше времени) или летит прямо в тин (даун).',
      tooltips: ['Киллшот в ник слева', 'Киллшот в ник справа'],
    },
  }

  const activeInfo = shotsData[activeShot]

  const handleMouseMove = (e) => {
    // Находим родительский контейнер нашего планшета
    const container = e.currentTarget.closest('.tactics-wrapper')
    if (!container) return
    const rect = container.getBoundingClientRect()

    setTooltip((prev) => ({
      ...prev,
      x: e.clientX - rect.left, // Вычисляем координату X относительно левой границы планшета
      y: e.clientY - rect.top, // Вычисляем координату Y относительно верхней границы планшета
    }))
  }

  const handleMouseEnter = (text) => {
    setTooltip((prev) => ({
      ...prev,
      show: true,
      text: text,
    }))
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({
      ...prev,
      show: false,
    }))
  }

  return (
    <div
      // 1. Добавили класс tactics-wrapper для расчетов координат
      className={`p-6 rounded-2xl border transition-all duration-300 relative tactics-wrapper ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20'
          : 'border-slate-200 bg-white shadow-xs'
      }`}
    >
      {/* ПЛАВАЮЩИЙ ХИНТ У КУРСОРA (теперь позиционируется абсолютно!) */}
      {tooltip.show && (
        <div
          className='absolute pointer-events-none z-50 px-3 py-2 rounded-xl text-[10px] font-bold shadow-xl border backdrop-blur-md transition-all duration-75'
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            backgroundColor: isDarkMode
              ? 'rgba(10, 10, 12, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode
              ? 'rgba(245, 158, 11, 0.3)'
              : 'rgba(217, 119, 6, 0.4)',
            color: isDarkMode ? '#fbbf24' : '#d97706',
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-8 items-center'>
        {/* Левая колонка: Интерактивный SVG-планшет */}
        <div className='flex flex-col items-center justify-center'>
          <svg
            viewBox='0 0 400 480'
            className='w-full max-w-[340px] h-auto select-none'
          >
            <rect
              x='40'
              y='30'
              width='320'
              height='420'
              fill={'#f8fafc'}
              stroke={'#cbd5e1'}
              strokeWidth='3'
            />

            <line
              x1='40'
              y1='290'
              x2='360'
              y2='290'
              stroke='#ef4444'
              strokeWidth='2'
            />
            <line
              x1='200'
              y1='290'
              x2='200'
              y2='450'
              stroke='#ef4444'
              strokeWidth='2'
            />

            {/* Левая зона подачи (3 стороны, без боковой стены) */}
            <path
              d='M 40,290 L 100,290 L 100,350 L 40,350'
              fill='transparent'
              stroke='#ef4444'
              strokeWidth='2'
            />
            {/* Правая зона подачи (3 стороны, без боковой стены) */}
            <path
              d='M 360,290 L 300,290 L 300,350 L 360,350'
              fill='transparent'
              stroke='#ef4444'
              strokeWidth='2'
            />

            <line
              x1='40'
              y1='30'
              x2='360'
              y2='30'
              stroke='#ef4444'
              strokeWidth='6'
            />
            <text
              x='200'
              y='20'
              textAnchor='middle'
              className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
            >
              Передняя стена
            </text>

            <text
              x='200'
              y='472'
              textAnchor='middle'
              className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
            >
              Задняя стена (Стекло)
            </text>

            {/* РЕНДЕРИНГ СИММЕТРИЧНЫХ ТРАЕКТОРИЙ И ХИТБОКСОВ */}
            {activeInfo.paths.map((path, idx) => (
              <g key={idx}>
                {/* Тонкая визуальная линия траектории */}
                <path
                  d={path}
                  fill='none'
                  stroke='#f59e0b'
                  strokeWidth='3'
                  strokeDasharray='6,6'
                  className='transition-all duration-300'
                />

                {/* Широкий прозрачный хитбокс для легкого наведения (16px) */}
                <path
                  d={path}
                  fill='none'
                  stroke='transparent'
                  strokeWidth='16'
                  className='cursor-help'
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() =>
                    handleMouseEnter(activeInfo.tooltips[idx])
                  }
                  onMouseLeave={handleMouseLeave}
                />

                {/* Анимированная группа: Двухточечный мяч (Белый для темной темы, Черный для светлой!) */}
                <g className='cursor-help'>
                  <animateMotion
                    dur='2.2s'
                    repeatCount='indefinite'
                    path={path}
                    key={`${activeShot}-${idx}`}
                  />
                  {/* Черный или белый матовый мяч в зависимости от темы */}
                  <circle
                    r='7.5'
                    fill={'#1c1917'}
                    stroke={'#cbd5e1'}
                    strokeWidth='0.8'
                  />
                  {/* Две маленькие желтые точки */}
                  <circle cx='-2' cy='-1.5' r='1.2' fill='#fbbf24' />
                  <circle cx='2.5' cy='1.5' r='1.2' fill='#fbbf24' />
                </g>
              </g>
            ))}
          </svg>
        </div>

        {/* Правая колонка: Выбор удара и разбор */}
        <div className='flex flex-col justify-between h-full'>
          <div>
            <span className='text-xs font-bold text-amber-500 uppercase tracking-widest block mb-4'>
              Выберите тип удара:
            </span>

            {/* Кнопки выбора удара */}
            <div className='flex flex-wrap gap-2 mb-6'>
              {Object.keys(shotsData).map((shotKey) => (
                <button
                  key={shotKey}
                  onClick={() => {
                    setActiveShot(shotKey)
                    setTooltip((prev) => ({ ...prev, show: false })) // Сброс хинта
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    activeShot === shotKey
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold'
                      : isDarkMode
                        ? 'border-neutral-800 bg-neutral-900/30 text-slate-400 hover:border-neutral-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  {shotKey === 'drive'
                    ? 'Драйв'
                    : shotKey === 'boast'
                      ? 'Боуст'
                      : shotKey === 'crosscourt'
                        ? 'Кросс'
                        : shotKey === 'lob'
                          ? 'Лоб'
                          : shotKey === 'drop'
                            ? 'Дроп'
                            : 'Киллшот'}
                </button>
              ))}
            </div>

            {/* Карточка разбора */}
            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-neutral-950/40 border-neutral-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h3
                className={`font-extrabold text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
              >
                {activeInfo.title}
              </h3>
              <p
                className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {activeInfo.desc}
              </p>

              {/* Тактическое применение */}
              <div className='mt-4 pt-3 border-t border-neutral-800/10'>
                <span className='text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1'>
                  Когда применять:
                </span>
                <p
                  className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  {activeInfo.when}
                </p>
              </div>

              {/* Частые ошибки */}
              <div className='mt-4 pt-3 border-t border-neutral-800/10'>
                <span className='text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1'>
                  Частая ошибка новичков:
                </span>
                <p
                  className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  {activeInfo.mistake}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
