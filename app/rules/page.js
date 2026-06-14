'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ThemeContext'
import GlossaryTerm from '@/components/GlossaryTerm'
import KeyTakeaway from '@/components/KeyTakeaway'
import Quiz from '@/components/Quiz'
import DecisionHelper from '@/components/DecisionHelper'
import Link from 'next/link'

export const metadata = {
  title: 'Правила сквоша — Интерактивный кодекс WSF',
  description:
    'Все 14 официальных глав правил сквоша на русском языке с интерактивным глоссарием, квизом и судейским Let/Stroke калькулятором.',
}

export default function RulesPage() {
  const { isDarkMode } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('sec-1')
  const [isQuizPassed, setIsQuizPassed] = useState(false)

  const [activeTab, setActiveTab] = useState('rules')

  //  Спрятать сайдбар ?
  // const mainClasses =
  //   activeTab === 'rules'
  //     ? 'lg:ml-64 flex-1 px-6 py-12 lg:px-16 lg:py-20 max-w-4xl'
  //     : 'flex-1 px-6 py-12 lg:px-16 lg:py-20 max-w-3xl mx-auto w-full'

  const mainClasses = 'lg:ml-64 flex-1 px-6 py-12 lg:px-16 lg:py-20 max-w-4xl' // Сайдбар всегда

  useEffect(() => {
    const savedQuiz = localStorage.getItem('isQuizPassed')
    if (savedQuiz === 'true') {
      setIsQuizPassed(true)
    }
  }, [])

  const handlePerfectQuizScore = () => {
    setIsQuizPassed(true)
    localStorage.setItem('isQuizPassed', 'true')
  }

  // Ультра-производительный Scrollspy на базе IntersectionObserver
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
        rootMargin: '0px 0px -75% 0px', // Срабатывает, когда секция пересекает верхнюю треть экрана
        threshold: 0,
      },
    )

    const sections = [
      'sec-1',
      'sec-2',
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

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const menuItems = [
    { id: 'sec-1', label: '1. Игра' },
    { id: 'sec-2', label: '2. Очки' },
    { id: 'sec-3', label: '3. Судьи' },
    { id: 'sec-4', label: '4. Разминка' },
    { id: 'sec-5', label: '5. Подача' },
    { id: 'sec-6', label: '6. Розыгрыш' },
    { id: 'sec-7', label: '7. Интервалы' },
    { id: 'sec-8', label: '8. Помехи' },
    { id: 'sec-9', label: '9. Мяч в игрока' },
    { id: 'sec-10', label: '10. Апелляции' },
    { id: 'sec-11', label: '11. Мяч и экип' },
    { id: 'sec-12', label: '12. Состояние корта' },
    { id: 'sec-13', label: '13. Травмы' },
    { id: 'sec-14', label: '14. Поведение' },
  ]

  return (
    <div className='flex min-h-[calc(100vh-4rem)] font-sans antialiased selection:bg-amber-500/30'>
      {/* Мобильная кнопка локального содержания */}
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

      {/* Локальное оглавление (Sidebar) */}
      {/* Спрятать сайдбар ? */}

      {/* {activeTab === 'rules' && ( */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 p-6 flex flex-col overflow-y-auto border-r transition-all duration-300 lg:translate-x-0 ${
          isDarkMode
            ? 'bg-neutral-900/95 border-neutral-800/80'
            : 'bg-white/95 border-slate-200/80'
        } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='text-xs uppercase tracking-widest text-slate-500 font-bold mb-4'>
          Содержание
        </div>
        <nav className='flex flex-col gap-1 pr-1'>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeSection === item.id
                  ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500 pl-2'
                  : isDarkMode
                    ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* )} */}

      {/* Основной текст правил */}
      <main className={mainClasses}>
        <header className='mb-12'>
          <div
            className={`inline-block border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 mr-2 ${
              isDarkMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            Официальный кодекс WSF
          </div>
          <h1
            className={`text-4xl font-extrabold tracking-tight mb-4 ${
              isDarkMode
                ? 'bg-linear-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}
          >
            Правила сквоша
          </h1>
          <p
            className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Официальный перевод правил Всемирной федерации сквоша (WSF).
            Выберите нужный раздел в меню слева для быстрого перехода.
          </p>
        </header>

        <div
          className={`flex gap-6 border-b mb-10 ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
        >
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
            {/* Раздел 1. Игра */}
            <section id='sec-1' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>1.1.</strong> Одиночный сквош играется на закрытом
                  корте установленных размеров двумя игроками. Каждый из игроков
                  использует ракетку, соответствующую стандартам Всемирной
                  федерации сквоша (WSF), для ударов по официальному сквош-мячу.
                </p>
                <p>
                  <strong>1.2.</strong> Каждый розыгрыш начинается с подачи.
                  После этого игроки поочередно совершают удары по мячу до тех
                  пор, пока розыгрыш не будет завершен.
                </p>
                <p>
                  <strong>1.3.</strong> Процесс игры должен оставаться
                  непрерывным во всех случаях, когда это возможно.
                </p>
              </div>
              <KeyTakeaway
                title='Главная философия корта'
                emoji='💡'
                isDarkMode={isDarkMode}
              >
                Сквош — бесконтактный спорт. Вы обязаны уступать дорогу
                сопернику и останавливать замах, если есть малейший риск нанести
                травму ракеткой или мячом.
              </KeyTakeaway>
            </section>

            {/* Раздел 2. Начисление очков */}
            <section id='sec-2' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>2.1.</strong> В сквоше используется система PAR
                  (Point-A-Rally). Победитель каждого розыгрыша получает ровно
                  одно очко.
                </p>
                <p>
                  <strong>2.2.</strong> Гейм выигрывает игрок, первым набравший
                  11 очков, кроме ситуации «10-10». При равном счете 10-10 игра
                  продолжается до преимущества в 2 очка.
                </p>
                <p>
                  <strong>2.3.</strong> Стандартный соревновательный матч
                  ведется до победы в 3 геймах.
                </p>
              </div>
              <KeyTakeaway
                title='Что значит PAR 11?'
                emoji='📊'
                isDarkMode={isDarkMode}
              >
                Очко дается за каждый выигранный мяч. Подавать повторно после
                выигрыша очка на чужой подаче не нужно — вы просто забираете
                очко и право подачи.
              </KeyTakeaway>
            </section>

            {/* Раздел 3. Официальные лица */}
            <section id='sec-3' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>3.1.</strong> В состав судейской коллегии входят
                  Рефери и Маркер. Оба обязаны вести счет встречи и
                  контролировать правильность игры.
                </p>
                <p>
                  <strong>3.2.</strong> При отсутствии возможности назначить
                  двух судей, один арбитр совмещает обязанности.
                </p>
                <p>
                  <strong>3.3.</strong> Маркер ведет счет вслух и объявляет
                  результаты ударов ("Out", "Down").
                </p>
                <p>
                  <strong>3.4.</strong> Рефери принимает окончательные решения
                  по спорным моментам (Let, Stroke, поведение). Решение Рефери
                  является финальным.
                </p>
              </div>
              <KeyTakeaway
                title='Кто главный на корте?'
                emoji='📢'
                isDarkMode={isDarkMode}
              >
                Маркер ведет счет и объявляет факты. Рефери решает спорные
                моменты. Если вы не согласны со счетом Маркера — вы имеете право
                остановить игру и подать апелляцию Рефери.
              </KeyTakeaway>
            </section>

            {/* Раздел 4. Разминка */}
            <section id='sec-4' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>4.1.</strong> Непосредственно перед началом матча
                  игрокам предоставляется совместная разминка на корте
                  продолжительностью ровно 5 минут.
                </p>
                <p>
                  <strong>4.2.</strong> Время разминки делится поровну: каждый
                  проводит по 2.5 минуты на правой и левой сторонах корта.
                </p>
                <p>
                  <strong>4.3.</strong> В процессе разминки игроки должны
                  обеспечивать сопернику равную возможность ударить по мячу.
                </p>
              </div>
              <KeyTakeaway
                title='Зачем греть мяч?'
                emoji='🥎'
                isDarkMode={isDarkMode}
              >
                Профессиональный мяч практически не прыгает в холодном
                состоянии. 5 минут разминки нужны не только вашим мышцам, но и
                молекулам резины внутри мяча.
              </KeyTakeaway>
            </section>

            {/* Раздел 5. Подача */}
            <section id='sec-5' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>5.1.</strong> Право первой подачи определяется
                  жеребьевкой. В начале каждого гейма первым подает победитель
                  предыдущего.
                </p>
                <p>
                  <strong>5.2.</strong> При переходе подачи подающий выбирает
                  любой квадрат (левый или правый). При выигрыше очков он обязан
                  каждый раз менять квадрат.
                </p>
                <p>
                  <strong>5.3.</strong> В момент удара хотя бы одна нога
                  подающего должна полностью находиться внутри квадрата подачи
                  (не наступая на его линии).
                </p>
                <p>
                  <strong>5.4.</strong> Подача правильная, если мяч направлен
                  прямо в переднюю стену выше средней линии подачи и ниже линии{' '}
                  <GlossaryTerm term='аута' isDarkMode={isDarkMode} />, а после
                  отскока приземлился в противоположной задней четверти корта.
                </p>
              </div>
              <KeyTakeaway
                title='Опасные ошибки на подаче (Foot Fault)'
                emoji='👟'
                isDarkMode={isDarkMode}
              >
                Нарушение правил постановки ног (наступление на линию квадрата
                во время подачи) карается мгновенным переходом подачи сопернику.
                В сквоше нет второй подачи.
              </KeyTakeaway>
            </section>

            {/* Раздел 6. Розыгрыш */}
            <section id='sec-6' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>6.1.</strong> После подачи игроки совершают удары
                  поочередно. Розыгрыш длится до первой ошибки одного из
                  игроков.
                </p>
                <p>
                  <strong>6.2.</strong> Удар правильный, если мяч встречен
                  ракеткой до второго касания пола, летит напрямую или через
                  боковые/заднюю стены в переднюю стену выше звуковой панели (
                  <GlossaryTerm term='жестянки' isDarkMode={isDarkMode} /> /
                  tin) и ниже линии аута.
                </p>
                <p>
                  <strong>6.3.</strong> Мяч считается вышедшим из игры при
                  касании любой линии{' '}
                  <GlossaryTerm term='аута' isDarkMode={isDarkMode} />, потолка,
                  звуковой панели (
                  <GlossaryTerm term='жестянки' isDarkMode={isDarkMode} />) или
                  пола до касания передней стены.
                </p>
              </div>
              <KeyTakeaway
                title='Линия — это аут!'
                emoji='🟥'
                isDarkMode={isDarkMode}
              >
                Все линии разметки на стенах корта (включая верхнюю планку
                жестянки) считаются зоной аута. Задевание линии мячом означает
                проигрыш очка.
              </KeyTakeaway>
            </section>

            {/* Раздел 7. Интервалы */}
            <section id='sec-7' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>7.1.</strong> Время между окончанием пятиминутной
                  разминки и началом первого розыгрыша матча составляет строго
                  60 секунд.
                </p>
                <p>
                  <strong>7.2.</strong> Между всеми геймами игрокам
                  предоставляется перерыв ровно 2 минуты (120 секунд).
                </p>
                <p>
                  <strong>7.3.</strong> В случае повреждения экипировки (включая
                  защитные очки) игроку предоставляется перерыв до 2 минут на
                  устранение неисправности.
                </p>
              </div>
              <KeyTakeaway
                title='Тайминг 2025/2026'
                emoji='⏱️'
                isDarkMode={isDarkMode}
              >
                Помните об изменениях правил: перерыв перед первым геймом
                сократился до 60 секунд, но отдых между геймами увеличился до
                полноценных 2 минут.
              </KeyTakeaway>
            </section>

            {/* Раздел 8. Помехи */}
            <section id='sec-8' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  <strong>8.1.</strong> Игрок, совершивший удар, обязан
                  предоставить сопернику: свободную видимость мяча (fair view),
                  беспрепятственный доступ (access), пространство для замаха и
                  удара (reasonable swing), а также свободный коридор для полета
                  мяча к передней стене.
                </p>
                <p>
                  <strong>8.2.</strong> При возникновении помехи игрок должен
                  остановиться и сказать "Let, please" (Лет).
                </p>
                <p>
                  <strong>8.3.</strong> Судья выносит одно из трех решений:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>No Let (Нет лета):</strong> Помеха была
                    незначительной, или игрок симулировал её, или мяч было
                    невозможно догнать. Выигрыш очка соперником.
                  </li>
                  <li>
                    <strong>
                      <GlossaryTerm term='Let' isDarkMode={isDarkMode} /> (Лет):
                    </strong>{' '}
                    Случайная помеха. Игрок мог нанести удар, но остановился
                    ради безопасности. Переигровка розыгрыша.
                  </li>
                  <li>
                    <strong>
                      <GlossaryTerm term='Stroke' isDarkMode={isDarkMode} />{' '}
                      (Строук):
                    </strong>{' '}
                    Серьезная помеха. Соперник заблокировал замах ракетки или
                    перекрыл траекторию удара. Пострадавшему дают очко.
                  </li>
                </ul>
              </div>
              <KeyTakeaway
                title='Золотое правило безопасности'
                emoji='🛡️'
                isDarkMode={isDarkMode}
              >
                Никогда не бейте по мячу, если соперник стоит перед вами или на
                линии вашего замаха. Просто остановитесь и попросите Let. Судья
                наградит вас очком (Stroke).
              </KeyTakeaway>
            </section>

            {/* Раздел 9. Попадание мяча в игрока */}
            <section id='sec-9' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
              >
                <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
                  9
                </span>
                <h2
                  className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
                >
                  Попадание мяча в игрока
                </h2>
              </div>
              <div
                className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
              >
                <p>
                  <strong>9.1.</strong> Если мяч после удара летит к передней
                  стене и касается соперника, его экипировки или одежды:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    Если удар летел напрямую в переднюю стену — ударившему
                    игроку присуждается <strong>Stroke</strong> (очко).
                  </li>
                  <li>
                    Если удар летел по диагонали (сначала в боковую стену) —
                    назначается <strong>Let</strong> (переигровка).
                  </li>
                </ul>
                <p>
                  <strong>9.2.</strong> Если мяч касается самого игрока, который
                  совершил удар, или его собственной экипировки — этот игрок
                  проигрывает очко.
                </p>
              </div>
              <KeyTakeaway
                title='Мяч попал в соперника?'
                emoji='🎯'
                isDarkMode={isDarkMode}
              >
                Если вы нанесли удар, и мяч попал в соперника, стоящего у
                передней стены, очко ваше. Но если вы сами задели себя мячом —
                очко присуждается сопернику.
              </KeyTakeaway>
            </section>

            {/* Раздел 10. Апелляции */}
            <section id='sec-10' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
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
                  обратиться к Рефери с апелляцией на любое решение Маркера
                  (например, если Маркер не заметил аут или двойной отскок).
                </p>
                <p>
                  <strong>10.2.</strong> Апелляция должна быть подана немедленно
                  после спорного эпизода и до выполнения следующей подачи.
                </p>
                <p>
                  <strong>10.3.</strong> Если Рефери удовлетворяет апелляцию,
                  розыгрыш переигрывается (Let) или очко присуждается
                  апеллирующему игроку.
                </p>
              </div>
              <KeyTakeaway
                title='Как подать апелляцию?'
                emoji='📢'
                isDarkMode={isDarkMode}
              >
                Голосом скажите: «Let, please» или «Appeal». Сделать это нужно
                сразу после спорного удара. Если вы продолжили розыгрыш и
                ударили по мячу, апелляция больше не принимается.
              </KeyTakeaway>
            </section>

            {/* Раздел 11. Мяч и экипировка */}
            <section id='sec-11' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
              >
                <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
                  11
                </span>
                <h2
                  className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
                >
                  Мяч и экипировка
                </h2>
              </div>
              <div
                className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
              >
                <p>
                  <strong>11.1.</strong> Игровой мяч и ракетки должны строго
                  соответствовать стандартам WSF. Замена мяча во время игры
                  допускается только с разрешения Рефери, если мяч пришел в
                  негодность (лопнул).
                </p>
                <p>
                  <strong>11.2.</strong> Если в процессе розыгрыша мяч лопнул,
                  этот розыгрыш аннулируется, и назначается переигрывание (Let).
                </p>
                <p>
                  <strong>11.3.</strong> Использование защитных очков является
                  строго обязательным во всех официальных юниорских и парных
                  турнирах.
                </p>
              </div>
              <KeyTakeaway
                title='Проверяйте мяч на прочность'
                emoji='🔍'
                isDarkMode={isDarkMode}
              >
                Если вам показалось, что мяч стал отскакивать хуже, покажите его
                судье между розыгрышами. Если на нем есть даже микротрещина, его
                заменят, а текущий розыгрыш переиграют.
              </KeyTakeaway>
            </section>

            {/* Раздел 12. Состояние корта */}
            <section id='sec-12' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
              >
                <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
                  12
                </span>
                <h2
                  className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
                >
                  Состояние корта
                </h2>
              </div>
              <div
                className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
              >
                <p>
                  <strong>12.1.</strong> Если корт становится небезопасным
                  (например, влага на паркете или протечка потолка), Рефери
                  обязан немедленно остановить матч до устранения проблемы.
                </p>
                <p>
                  <strong>12.2.</strong> Если во время розыгрыша у игрока
                  выпадает личный предмет (резинка для волос, защитные очки) —
                  игра останавливается:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    Если предмет выпал у игрока самостоятельно — этот игрок
                    проигрывает очко.
                  </li>
                  <li>
                    Если выпадение произошло из-за контакта с соперником —
                    назначается Let.
                  </li>
                </ul>
              </div>
              <KeyTakeaway
                title='Потеряли очки или бандану?'
                emoji='👓'
                isDarkMode={isDarkMode}
              >
                Следите за надежностью крепления очков и банданы. Если они
                упадут на пол посреди розыгрыша сами по себе, судья остановит
                игру и отдаст очко вашему сопернику.
              </KeyTakeaway>
            </section>

            {/* Раздел 13. Травмы */}
            <section id='sec-13' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
              >
                <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
                  13
                </span>
                <h2
                  className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
                >
                  Травмы
                </h2>
              </div>
              <div
                className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
              >
                <p>
                  <strong>13.1. Кровотечение (Blood):</strong> При обнаружении
                  кровотечения Рефери обязан немедленно остановить матч. Игрок
                  не имеет права находиться на корте с открытой раной. Ему
                  предоставляется разумное время на перевязку.
                </p>
                <p>
                  <strong>13.2. Травмы (Injury):</strong> Решения принимаются
                  исходя из виновника:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>Вызвана соперником случайно:</strong> Пострадавшему
                    дается 15 минут на восстановление. Если не может продолжить
                    — победа сопернику.
                  </li>
                  <li>
                    <strong>Вызвана соперником умышленно:</strong> Нарушителю
                    немедленно засчитывается поражение во всем матче.
                  </li>
                  <li>
                    <strong>Собственная травма (судорога):</strong> Игроку
                    дается 3 минуты. Если не готов играть, он может сдать гейм
                    (0-11) и взять 2 минуты перерыва, либо признать поражение.
                  </li>
                </ul>
              </div>
              <KeyTakeaway
                title='Правила судорог и спазмов'
                emoji='🩹'
                isDarkMode={isDarkMode}
              >
                Судорога приравнивается к собственной травме. У вас есть всего 3
                минуты. Если не помогло — сдавайте гейм, берите еще 2 минуты
                перерыва и пытайтесь восстановиться.
              </KeyTakeaway>
            </section>

            {/* Раздел 14. Поведение */}
            <section id='sec-14' className='scroll-mt-24 mb-16'>
              <div
                className={`flex items-center gap-4 mb-6 pb-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}
              >
                <span className='text-base font-bold bg-amber-500/10 text-amber-400 w-10 h-10 flex items-center justify-center rounded-lg'>
                  14
                </span>
                <h2
                  className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
                >
                  Поведение
                </h2>
              </div>
              <div
                className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}
              >
                <p>
                  <strong>14.1.</strong> Игроки обязаны вести себя спортивно.
                  Нарушениями признаются: нецензурная лексика, швыряние ракетки,
                  умышленный физический контакт, затягивание времени, споры с
                  Рефери.
                </p>
                <p>
                  <strong>14.2.</strong> Рефери имеет право применять к
                  нарушителям шкалу дисциплинарных взысканий:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>Conduct Warning:</strong> Предупреждение.
                  </li>
                  <li>
                    <strong>Conduct Stroke:</strong> Штрафное очко (присуждается
                    сопернику).
                  </li>
                  <li>
                    <strong>Conduct Game:</strong> Штрафной гейм (присуждается
                    сопернику).
                  </li>
                  <li>
                    <strong>Conduct Match:</strong> Дисквалификация игрока с
                    присуждением победы в матче сопернику.
                  </li>
                </ul>
              </div>
              <KeyTakeaway
                title='Эмоции под контролем'
                emoji='🤬'
                isDarkMode={isDarkMode}
              >
                За брошенную в стену ракетку судья имеет право сразу же дать вам
                Conduct Stroke (штрафное очко сопернику) без предварительного
                предупреждения.
              </KeyTakeaway>
            </section>

            {/* Квиз */}
            <Quiz
              isDarkMode={isDarkMode}
              onPerfectScore={handlePerfectQuizScore}
              isQuizPassed={isQuizPassed}
            />
          </>
        ) : (
          /* 7. Если выбрана вкладка калькулятора — рендерим только его */
          <DecisionHelper isDarkMode={isDarkMode} />
        )}
      </main>
    </div>
  )
}
