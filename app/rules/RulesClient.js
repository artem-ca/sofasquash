'use client'

import { useState, useEffect } from 'react'
import GlossaryTerm from '@/components/GlossaryTerm'
import KeyTakeaway from '@/components/KeyTakeaway'
import Quiz from '@/components/Quiz'
import DecisionHelper from '@/components/DecisionHelper'
import ReServe from '@/components/ReServe'
import Link from 'next/link'
import { ruleChapters } from '@/data/rules'

export default function RulesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('sec-1')
  const [isQuizPassed, setIsQuizPassed] = useState(false)
  const [activeTab, setActiveTab] = useState('rules')

  const mainClasses = 'lg:ml-64 flex-1 px-6 py-12 lg:px-16 lg:py-20 max-w-4xl'

  useEffect(() => {
    try {
      const savedQuiz = localStorage.getItem('isQuizPassed')
      if (savedQuiz === 'true') {
        setIsQuizPassed(true)
      }
    } catch (e) {
      console.warn('Доступ заблокирован')
    }
  }, [])

  const handlePerfectQuizScore = () => {
    setIsQuizPassed(true)
    try {
      localStorage.setItem('isQuizPassed', 'true')
    } catch (e) {
      console.warn('Запись заблокирована')
    }
  }

  const handleMenuItemClick = (id) => {
    setIsSidebarOpen(false)
    if (activeTab !== 'rules') {
      setActiveTab('rules')
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '-15% 0px -75% 0px',
        threshold: 0,
      },
    )

    const sections = Array.from({ length: 14 }, (_, i) => `sec-${i + 1}`)
    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Пункты бокового меню и текст секций берём из единого источника
  // (data/rules.js) — он же используется поисковым индексом.
  const menuItems = ruleChapters.map(({ id, label }) => ({ id, label }))

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30'>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Закрыть содержание' : 'Открыть содержание'}
        aria-expanded={isSidebarOpen}
        className='lg:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg cursor-pointer'
      >
        {isSidebarOpen ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            className='w-5 h-5'
          >
            <path d='M6 6l12 12M18 6L6 18' />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='w-5 h-5'
          >
            <path d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' />
          </svg>
        )}
      </button>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className='lg:hidden fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-xs'
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 p-6 flex flex-col overflow-y-auto border-r transition-all duration-300 lg:translate-x-0 bg-white/95 dark:bg-neutral-900/95 border-slate-200/80 dark:border-neutral-800/80 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='text-xs uppercase tracking-widest text-slate-500 font-bold mb-4'>
          Содержание
        </div>
        <nav className='flex flex-col gap-1 pr-1'>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              onClick={() => handleMenuItemClick(item.id)}
              aria-current={activeSection === item.id ? 'location' : undefined}
              className={`flex items-center px-3 py-2 pl-2 border-l-4 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeSection === item.id
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className={mainClasses}>
        <header className='mb-12'>
          <div className='inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 mr-2 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'>
            Официальный кодекс WSF
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-slate-100'>
            Правила сквоша
          </h1>
          <p className='text-base leading-relaxed text-slate-600 dark:text-slate-400'>
            Официальный перевод правил Всемирной федерации сквоша (WSF).
            Выберите нужный раздел в меню слева для быстрого перехода.
          </p>
        </header>

        <div
          role='tablist'
          aria-label='Разделы страницы правил'
          className='flex gap-6 border-b mb-10 border-slate-200 dark:border-neutral-800'
        >
          <button
            id='tab-rules'
            role='tab'
            aria-selected={activeTab === 'rules'}
            aria-controls='panel-rules'
            onClick={() => setActiveTab('rules')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'border-amber-500 text-amber-500 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Текст правил
          </button>
          <button
            id='tab-calculator'
            role='tab'
            aria-selected={activeTab === 'calculator'}
            aria-controls='panel-calculator'
            onClick={() => setActiveTab('calculator')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-amber-500 text-amber-500 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Судейский калькулятор Let/Stroke
          </button>
        </div>

        {activeTab === 'rules' ? (
          <div id='panel-rules' role='tabpanel' aria-labelledby='tab-rules'>
            {ruleChapters.map((sec) => (
              <section key={sec.id} id={sec.id} className='scroll-mt-24 mb-16'>
                <div className='flex items-center gap-4 mb-6 pb-3 border-b border-slate-200 dark:border-neutral-800'>
                  <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
                    {sec.id.replace('sec-', '')}
                  </span>
                  <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    {sec.title}
                  </h2>
                </div>
                <div className='space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300'>
                  {sec.rules.map((rule, idx) => {
                    // Простая замена слов на интерактивные подсказки
                    const parts = rule.split(/(аута|аут|жестянки)/g)
                    return (
                      <p key={idx}>
                        {parts.map((part, pIdx) => {
                          if (
                            ['аут', 'аута', 'жестянки'].includes(
                              part.toLowerCase(),
                            )
                          ) {
                            return (
                              <GlossaryTerm
                                key={pIdx}
                                term={part}
                              />
                            )
                          }
                          return part
                        })}
                      </p>
                    )
                  })}
                </div>
                <KeyTakeaway
                  title={sec.takeaway.title}
                  emoji={sec.takeaway.emoji}
                >
                  {sec.takeaway.text}
                </KeyTakeaway>

                {/* Внедряем Sofa ReServe под разделом 2 */}
                {sec.id === 'sec-2' && (
                  <div className='my-12'>
                    <ReServe />
                  </div>
                )}
              </section>
            ))}

            <Quiz
              onPerfectScore={handlePerfectQuizScore}
              isQuizPassed={isQuizPassed}
            />
          </div>
        ) : (
          <div
            id='panel-calculator'
            role='tabpanel'
            aria-labelledby='tab-calculator'
          >
            <DecisionHelper />
          </div>
        )}
      </main>
    </div>
  )
}
