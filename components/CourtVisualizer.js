'use client'

import { useState } from 'react'
import { useTheme } from './ThemeContext'
import { courtData } from '@/data/court'

export default function CourtVisualizer() {
  const { isDarkMode } = useTheme() // Глобальная тема сайта
  const [activeId, setActiveId] = useState(null)

  // Определение активного описания с защитой от undefined
  const activeInfo =
    activeId && courtData[activeId]
      ? courtData[activeId]
      : {
          title: 'Интерактивный 3D-корт',
          dims: 'Справочник описаний и размеров',
          desc: 'Наведите курсор мыши на любую линию или зону 3D-корта выше, чтобы изучить правила, размеры и особенности разметки корта.',
        }

  // Мягкое благородное золото для темного корта и оригинальное светлое золото для светлого корта
  const goldHighlightFill = isDarkMode ? '#352418' : 'rgba(245, 158, 11, 0.12)'

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 my-8 ${
        isDarkMode
          ? 'border-neutral-800 bg-neutral-900/20 text-slate-100'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      {/* ШАПКА КОРТА (Центрированный аккуратный заголовок без локальной кнопки) */}
      <div className='text-center mb-6 w-full'>
        <span className='text-xs font-bold text-amber-500 uppercase tracking-widest block'>
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

          <rect x='0' y='0' width='600' height='400' fill='transparent' />

          {/* 1. БАЗОВЫЕ ПЛОСКОСТИ */}

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

          {/* ИГРОВОЕ ПОЛЕ (Зона пола для наведения на пол — строго прозрачная) */}
          <polygon
            points='150,260 450,260 525,330 75,330'
            fill='transparent'
            className='cursor-pointer transition-colors duration-200'
            onMouseEnter={() => setActiveId('floor')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('floor')}
          />

          {/* 2. КВАДРАТЫ ПОДАЧИ */}

          {/* ЛЕВЫЙ КВАДРАТ ПОДАЧИ */}
          <polygon
            points='60,330 187,330 180,355 30,355'
            fill={activeId === 'box' ? goldHighlightFill : 'transparent'}
            clipPath='url(#floor-clip)'
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('box')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('box')}
          />
          <polyline
            points='60,330 187,330 180,355 30,355'
            fill='none'
            stroke={activeId === 'box' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
            strokeLinejoin='round'
            strokeLinecap='round'
            clipPath='url(#floor-clip)'
            className='pointer-events-none transition-all duration-200'
          />

          {/* ПРАВЫЙ КВАДРАТ ПОДАЧИ */}
          <polygon
            points='540,330 413,330 420,355 570,355'
            fill={activeId === 'box' ? goldHighlightFill : 'transparent'}
            clipPath='url(#floor-clip)'
            className='cursor-pointer transition-all'
            onMouseEnter={() => setActiveId('box')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('box')}
          />
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

          {/* 3. РАЗМЕТКА ПОЛА */}
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

          {/* 4. ЛИНИИ ПЕРЕДНЕЙ СТЕНЫ */}
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
          <line
            x1='151'
            y1='243'
            x2='449'
            y2='243'
            stroke={activeId === 'tin' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
          />
          <line
            x1='151'
            y1='190'
            x2='449'
            y2='190'
            stroke={activeId === 'service' ? '#f59e0b' : '#ef4444'}
            strokeWidth='2'
          />
          <polyline
            points='20,220 150,80 450,80 580,220'
            fill='none'
            stroke={activeId === 'out' ? '#f59e0b' : '#ef4444'}
            strokeWidth={activeId === 'out' ? '4' : '2'}
            strokeLinejoin='round'
            strokeLinecap='round'
            clipPath='url(#court-clip)'
            className='transition-all duration-200'
          />

          {/* ХИТБОКСЫ ДЛЯ НАВЕДЕНИЯ */}
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
          <polyline
            points='10,220 150,80 450,80 590,220'
            fill='none'
            stroke='transparent'
            strokeWidth='16'
            className='cursor-pointer'
            strokeLinejoin='round'
            strokeLinecap='round'
            clipPath='url(#court-clip)'
            onMouseEnter={() => setActiveId('out')}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setActiveId('out')}
          />
        </svg>
      </div>

      {/* Информационная карточка */}
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
