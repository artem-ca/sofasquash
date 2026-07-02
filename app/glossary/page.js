// app/glossary/page.js (Серверный компонент)
import GlossaryClient from './GlossaryClient'
import { buildPageMetadata } from '@/constants/site'

export const metadata = buildPageMetadata({
  title: 'Словарь сквош-сленга и терминов — Squash Wiki',
  description:
    'Полная энциклопедия сквош-терминов, сленга и названий ударов в сквоше с алфавитным указателем и тактическими советами тренера.',
  path: '/glossary',
})

export default function GlossaryPage() {
  return <GlossaryClient />
}
