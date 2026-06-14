// app/rules/page.js (Серверный компонент)
import RulesClient from './RulesClient'

export const metadata = {
  title: 'Правила сквоша — Интерактивный кодекс WSF 2026',
  description:
    'Все 14 официальных глав правил сквоша на русском языке с интерактивным глоссарием, квизом и судейским Let/Stroke калькулятором.',
}

export default function RulesPage() {
  return <RulesClient />
}
