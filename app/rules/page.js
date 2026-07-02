// app/rules/page.js (Серверный компонент)
import RulesClient from './RulesClient'
import { buildPageMetadata } from '@/constants/site'

export const metadata = buildPageMetadata({
  title: 'Правила сквоша — Интерактивный кодекс WSF 2026',
  description:
    'Все 14 официальных глав правил сквоша на русском языке с интерактивным глоссарием, квизом и судейским Let/Stroke калькулятором.',
  path: '/rules',
})

export default function RulesPage() {
  return <RulesClient />
}
