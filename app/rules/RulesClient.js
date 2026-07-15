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

  // Пункты бокового меню берём из единого оглавления (data/rules.js);
  // keywords там нужны только для поиска и в меню не используются.
  const menuItems = ruleChapters.map(({ id, label }) => ({ id, label }))

  const sectionsContent = [
    {
      id: 'sec-1',
      title: 'Игра',
      rules: [
        '1.1. Одиночный сквош играется на закрытом корте установленных размеров двумя игроками. Каждый из игроков использует ракетку, соответствующую стандартам Всемирной федерации сквоша (WSF), для ударов по официальному сквош-мячу.',
        '1.2. Каждый розыгрыш начинается с подачи. После этого игроки поочередно совершают удары по мячу до тех пор, пока розыгрыш не будет завершен.',
        '1.3. Процесс игры должен оставаться непрерывным во всех случаях, когда это возможно.',
      ],
      takeaway: {
        title: 'Главная философия корта',
        emoji: '💡',
        text: 'Сквош — бесконтактный спорт. Вы обязаны уступать дорогу сопернику и останавливать замах, если есть малейший риск нанести травму ракеткой или мячом.',
      },
    },
    {
      id: 'sec-2',
      title: 'Начисление очков',
      rules: [
        '2.1. В сквоше используется система PAR (Point-A-Rally). Победитель каждого розыгрыша получает ровно одно очко.',
        '2.2. Гейм выигрывает игрок, первым набравший 11 очков, кроме ситуации «10-10». При равном счете 10-10 игра продолжается до преимущества в 2 очка.',
        '2.3. Стандартный соревновательный матч ведется до победы в 3 геймах.',
      ],
      takeaway: {
        title: 'Что значит PAR 11?',
        emoji: '📊',
        text: 'Очко дается за каждый выигранный мяч. Подавать повторно после выигрыша очка на чужой подаче не нужно — вы просто забираете очко и право подачи.',
      },
    },
    {
      id: 'sec-3',
      title: 'Официальные лица',
      rules: [
        '3.1. В состав судейской коллегии входят Рефери и Маркер. Оба обязаны вести счет встречи и контролировать правильность игры.',
        '3.2. При отсутствии возможности назначить двух судей, один арбитр совмещает обязанности.',
        '3.3. Маркер ведет счет вслух и объявляет результаты ударов ("Out", "Down").',
        '3.4. Рефери принимает окончательные решения по спорным моментам (Let, Stroke, поведение). Решение Рефери является финальным.',
      ],
      takeaway: {
        title: 'Кто главный на корте?',
        emoji: '📢',
        text: 'Маркер ведет счет и объявляет факты. Рефери решает спорные моменты. Если вы не согласны со счетом Маркера — вы имеете право остановить игру и подать апелляцию Рефери.',
      },
    },
    {
      id: 'sec-4',
      title: 'Разминка',
      rules: [
        '4.1. Непосредственно перед началом матча игрокам предоставляется совместная разминка на корте продолжительностью ровно 5 минут.',
        '4.2. Время разминки делится поровну: каждый проводит по 2.5 минуты на правой и левой сторонах корта.',
        '4.3. В процессе разминки игроки должны обеспечивать сопернику равную возможность ударить по мячу.',
      ],
      takeaway: {
        title: 'Зачем греть мяч?',
        emoji: '🥎',
        text: 'Профессиональный мяч практически не прыгает в холодном состоянии. 5 минут разминки нужны не только вашим мышцам, но и молекулам резины внутри мяча.',
      },
    },
    {
      id: 'sec-5',
      title: 'Подача',
      rules: [
        '5.1. Право первой подачи определяется жеребьевкой. В начале каждого гейма первым подает победитель предыдущего.',
        '5.2. При переходе подачи подающий выбирает любой квадрат (левый или правый). При выигрыше очков он обязан каждый раз менять квадрат.',
        '5.3. В момент удара хотя бы одна нога подающего должна полностью находиться внутри квадрата подачи (не наступая на его линии).',
        '5.4. Подача правильная, если мяч направлен прямо в переднюю стену выше средней линии подачи и ниже линии аута, а после отскока приземлился в противоположной задней четверти корта.',
      ],
      takeaway: {
        title: 'Опасные ошибки на подаче (Foot Fault)',
        emoji: '👟',
        text: 'Нарушение правил постановки ног (наступление на линию квадрата во время подачи) карается мгновенным переходом подачи сопернику. В сквоше нет второй подачи.',
      },
    },
    {
      id: 'sec-6',
      title: 'Розыгрыш',
      rules: [
        '6.1. После подачи игроки совершают удары поочередно. Розыгрыш длится до первой ошибки одного из игроков.',
        '6.2. Удар правильный, если мяч встречен ракеткой до второго касания пола, летит напрямую или через боковые/заднюю стены в переднюю стену выше звуковой панели (жестянки / tin) и ниже линии аута.',
        '6.3. Мяч считается вышедшим из игры при касании любой линии аута, потолка, звуковой панели (жестянки) или пола до касания передней стены.',
      ],
      takeaway: {
        title: 'Линия — это аут!',
        emoji: '🟥',
        text: 'Все линии разметки на стенах корта (включая верхнюю планку жестянки) считаются зоной аута. Задевание линии мячом означает проигрыш очка.',
      },
    },
    {
      id: 'sec-7',
      title: 'Интервалы',
      rules: [
        '7.1. Время между окончанием пятиминутной разминки и началом первого розыгрыша матча составляет строго 60 секунд.',
        '7.2. Между всеми геймами игрокам предоставляется перерыв ровно 2 минуты (120 секунд).',
        '7.3. В случае повреждения экипировки (включая защитные очки) игроку предоставляется перерыв до 2 минут на устранение неисправности.',
      ],
      takeaway: {
        title: 'Тайминг 2025/2026',
        emoji: '⏱️',
        text: 'Помните об изменениях правил: перерыв перед первым геймом сократился до 60 секунд, но отдых между геймами увеличился до полноценных 2 минут.',
      },
    },
    {
      id: 'sec-8',
      title: 'Помехи',
      rules: [
        '8.1. Игрок, совершивший удар, обязан предоставить сопернику: свободную видимость мяча (fair view), беспрепятственный доступ (access), пространство для замаха и удара (reasonable swing), а также свободный коридор для полета мяча к передней стене.',
        '8.2. При возникновении помехи игрок должен остановиться и сказать "Let, please" (Лет).',
        '8.3. Судья выносит одно из трех решений: No Let (Нет лета), Let (Переиграть розыгрыш), Stroke (Очко пострадавшему).',
      ],
      takeaway: {
        title: 'Золотое правило безопасности',
        emoji: '🛡️',
        text: 'Никогда не бейте по мячу, если соперник стоит перед вами или на линии вашего замаха. Просто остановитесь и попросите Let. Судья наградит вас очком (Stroke).',
      },
    },
    {
      id: 'sec-9',
      title: 'Попадание мяча в игрока',
      rules: [
        '9.1. Если мяч после удара летит к передней стене и касается соперника, его экипировки или одежды: если напрямую — Stroke, если по диагонали — Let.',
        '9.2. Если мяч касается самого игрока, который совершил удар, или его собственной экипировки — этот игрок проигрывает очко.',
      ],
      takeaway: {
        title: 'Мяч попал в соперника?',
        emoji: '🎯',
        text: 'Если вы нанесли удар, и мяч попал в соперника, стоящего у передней стены, очко ваше. Но если вы сами задели себя мячом — очко присуждается сопернику.',
      },
    },
    {
      id: 'sec-10',
      title: 'Апелляции',
      rules: [
        '10.1. Игрок имеет право остановить розыгрыш и обратиться к Рефери с апелляцией на любое решение Маркера.',
        '10.2. Апелляция должна быть подана немедленно после спорного эпизода и до выполнения следующей подачи.',
        '10.3. Если Рефери удовлетворяет апелляцию, розыгрыш переигрывается (Let) или очко присуждается апеллирующему игроку.',
      ],
      takeaway: {
        title: 'Как подать апелляцию?',
        emoji: '📢',
        text: 'Голосом скажите: «Let, please» или «Appeal». Сделать это нужно сразу после спорного удара. Если вы начали следующий розыгрыш, апелляция не принимается.',
      },
    },
    {
      id: 'sec-11',
      title: 'Мяч и экипировка',
      rules: [
        '11.1. Игровой мяч и ракетки должны строго соответствовать стандартам WSF. Замена мяча во время игры допускается только с разрешения Рефери.',
        '11.2. Если в процессе розыгрыша мяч лопнул, этот розыгрыш аннулируется, и назначается переигрывание (Let).',
        '11.3. Использование защитных очков является строго обязательным во всех официальных юниорских и парных турнирах.',
      ],
      takeaway: {
        title: 'Проверяйте мяч на прочность',
        emoji: '🔍',
        text: 'Если вам показалось, что мяч стал отскакивать хуже, покажите его судье между розыгрышами. Если на нем есть трещина, его заменят, а текущий розыгрыш переиграют.',
      },
    },
    {
      id: 'sec-12',
      title: 'Состояние корта',
      rules: [
        '12.1. Если корт становится небезопасным, Рефери обязан немедленно остановить матч до устранения проблемы.',
        '12.2. Если во время розыгрыша у игрока выпадает личный предмет (резинка для волос, защитные очки) — игра останавливается: если выпал сам — потеря очка, если из-за контакта — Let.',
      ],
      takeaway: {
        title: 'Потеряли очки или бандану?',
        emoji: '👓',
        text: 'Следите за надежностью крепления очков и банданы. Если они упадут на пол посреди розыгрыша сами по себе, судья остановит игру и отдаст очко вашему сопернику.',
      },
    },
    {
      id: 'sec-13',
      title: 'Травмы',
      rules: [
        '13.1. Кровотечение (Blood): При обнаружении кровотечения Рефери обязан немедленно остановить матч. Игрок не имеет права находиться на корте с открытой раной.',
        '13.2. Травмы (Injury): Решения принимаются исходя из виновника: вызвана случайно соперником — 15 минут, умышленно — дисквалификация, собственная травма/судорога — 3 минуты.',
      ],
      takeaway: {
        title: 'Правила судорог и спазмов',
        emoji: '🩹',
        text: 'Судорога приравнивается к собственной травме. У вас есть всего 3 минуты. Если не помогло — сдавайте гейм, берите еще 2 минуты перерыва и пытайтесь восстановиться.',
      },
    },
    {
      id: 'sec-14',
      title: 'Поведение',
      rules: [
        '14.1. Игроки обязаны вести себя спортивно. Нарушениями признаются: нецензурная лексика, швыряние ракетки, умышленный физический контакт.',
        '14.2. Рефери имеет право применять к нарушителям шкалу дисциплинарных взысканий: Conduct Warning, Conduct Stroke, Conduct Game, Conduct Match.',
      ],
      takeaway: {
        title: 'Эмоции под контролем',
        emoji: '🤬',
        text: 'За брошенную в стену ракетку судья имеет право сразу же дать вам Conduct Stroke (штрафное очко сопернику) без предварительного предупреждения.',
      },
    },
  ]

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30'>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='lg:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg cursor-pointer'
        title='Открыть содержание'
      >
        {isSidebarOpen ? '✕' : '📖'}
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
              className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeSection === item.id
                  ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500 pl-2'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
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

        <div className='flex gap-6 border-b mb-10 border-slate-200 dark:border-neutral-800'>
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'border-amber-500 text-amber-500 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Текст правил 📖
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-amber-500 text-amber-500 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Судейский калькулятор Let/Stroke ⚖️
          </button>
        </div>

        {activeTab === 'rules' ? (
          <>
            {sectionsContent.map((sec) => (
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
          </>
        ) : (
          <DecisionHelper />
        )}
      </main>
    </div>
  )
}
