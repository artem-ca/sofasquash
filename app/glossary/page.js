// app/glossary/page.js (Серверный компонент)
import GlossaryClient from './GlossaryClient'

export const metadata = {
  title: 'Словарь сквош-сленга и терминов — Squash Wiki',
  description:
    'Полная энциклопедия сквош-терминов, сленга и названий ударов в сквоше с алфавитным указателем и тактическими советами тренера.',
}

export default function GlossaryPage() {
  return <GlossaryClient />
}
