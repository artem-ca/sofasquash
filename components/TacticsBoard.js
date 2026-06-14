'use client'

import { useState } from 'react'

export default function TacticsBoard({ isDarkMode }) {
  const [activeShot, setActiveShot] = useState('drive')

  // Состояние плавающего хинта у курсора
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' })

  const shotsData = {
    drive: {
      title: 'Драйв (Drive / Rail)',
      path: 'M 100,380 L 100,30 L 60,430',
      desc: 'Основной удар сквоша. Мяч летит строго параллельно боковой стене в самый конец корта.',
      when: 'Используется в 70% розыгрышей для удержания соперника сзади и контроля Т-зоны.',
      mistake:
        'Удар летит слишком близко к центру корта (легкий перехват соперником воллеем) или бьется о боковую стену по пути вперед.',
      tooltip: 'Драйв слева параллельно стене', // <-- Наш текст для хинта
    },
    boast: {
      title: 'Боуст (Boast)',
      path: 'M 310,380 L 360,240 L 180,30 L 60,110',
      desc: 'Обманный удар через стену. Мяч бьется в боковую стену, затем летит в переднюю и отскакивает в противоположный передний угол.',
      when: 'Чтобы резко заставить соперника бежать вперед, когда он застрял глубоко сзади на Т-зоне.',
      mistake:
        'Слишком сильный или высокий удар. Мяч высоко отскочит в центр корта, подставив вас под атаку соперника.',
      tooltip: 'Двухстенный боуст справа',
    },
    crosscourt: {
      title: 'Кросс (Crosscourt)',
      path: 'M 90,380 L 250,30 L 340,410',
      desc: 'Диагональный удар через весь корт. Мяч летит из одного бокового угла в противоположный задний угол.',
      when: 'Для смены направления атаки и перевода мяча на более слабую сторону соперника.',
      mistake:
        'Удар летит слишком близко к центру Т-зоны. Соперник легко перехватит этот кросс с лёта (воллеем).',
      tooltip: 'Диагональный кросс слева направо',
    },
    lob: {
      title: 'Лоб (Lob / Свеча)',
      path: 'M 310,100 L 120,30 Q 250,180 180,300 Q 80,410 50,430',
      desc: 'Защитный навесной удар с высокой траекторией полета мяча под самый потолок корта.',
      when: 'Когда вы зажаты в переднем углу и вам нужно выиграть время, чтобы вернуться в Т-зону.',
      mistake:
        'Слишком низкий навес. Мяч не перелетит соперника, и он расстреляет вас мощным ударом с лёта.',
      tooltip: 'Высокий защитный лоб справа налево',
    },
    drop: {
      title: 'Дроп (Drop / Укороченный)',
      path: 'M 280,220 L 310,30 L 320,60 L 325,90',
      desc: 'Филигранный атакующий удар. Мяч мягко направляется в самый низ передней стены прямо над тином.',
      when: 'Когда вы находитесь впереди соперника (на Т-зоне или ближе к передней стене) и хотите завершить розыгрыш.',
      mistake:
        'Попытка укоротить из глубокой задней части корта. Мяч будет лететь долго, и соперник легко его догонит.',
      tooltip: 'Мягкий укороченный дроп справа',
    },
  }

  const activeInfo = shotsData[activeShot]

  // Обработчики слежения за курсором
  const handleMouseMove = (e) => {
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
    }))
  }

  const handleMouseEnter = () => {
    setTooltip((prev) => ({
      ...prev,
      show: true,
      text: activeInfo.tooltip,
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
      className={`p-6 rounded-2xl border transition-all duration-300 relative ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20'
          : 'border-slate-200 bg-white shadow-xs'
      }`}
    >
      {/* 🔮 ПЛАВАЮЩИЙ ХИНТ У КУРСОРA */}
      {tooltip.show && (
        <div
          className='fixed pointer-events-none z-50 px-3 py-2 rounded-xl text-[10px] font-bold shadow-xl border backdrop-blur-md transition-all duration-75'
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
              fill={isDarkMode ? '#0f0f12' : '#f8fafc'}
              stroke={isDarkMode ? '#26262c' : '#cbd5e1'}
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

            <rect
              x='40'
              y='290'
              width='60'
              height='60'
              fill='transparent'
              stroke='#ef4444'
              strokeWidth='2'
            />
            <rect
              x='300'
              y='290'
              width='60'
              height='60'
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

            <circle cx='200' cy='290' r='5' fill='#f59e0b' />

            {/* ТРАЕКТОРИЯ ПОЛЕТА МЯЧА (считывает события наведения для хинта) */}
            {/* ТРАЕКТОРИЯ ПОЛЕТА МЯЧА (Визуальная тонкая линия) */}
            <path
              id='ball-trajectory'
              d={activeInfo.path}
              fill='none'
              stroke='#f59e0b'
              strokeWidth='3'
              strokeDasharray='6,6'
              className='transition-all duration-300'
            />

            {/* Скрытый широкий хитбокс для легкого наведения (ширина 16px) */}
            <path
              d={activeInfo.path}
              fill='none'
              stroke='transparent'
              strokeWidth='16'
              className='cursor-help'
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />

            {/* Сквош-желток (тоже считывает наведение для хинта) */}
            <circle
              r='7'
              fill='#fbbf24'
              stroke='#000000'
              strokeWidth='1.5'
              className='cursor-help'
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <animateMotion
                dur='2.2s'
                repeatCount='indefinite'
                path={activeInfo.path}
                key={activeShot}
              />
            </circle>
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
                    setTooltip((prev) => ({ ...prev, show: false })) // Сброс хинта при смене вкладки
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
                          : 'Дроп'}
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
