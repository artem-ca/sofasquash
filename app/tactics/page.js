// app/tactics/page.js (Серверный компонент)
import TacticsClient from './TacticsClient'
import { buildPageMetadata } from '@/constants/site'

export const metadata = buildPageMetadata({
  title: 'Тактический сквош-планшет — Траектории и геометрия ударов',
  description:
    'Интерактивный разбор физики полета мяча в сквоше. Изучайте траектории ударов Boast, Drive, Drop, Lob, Crosscourt на 2D-схеме.',
  path: '/tactics',
})

export default function TacticsPage() {
  return <TacticsClient />
}
