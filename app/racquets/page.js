// app/racquets/page.js (Серверный компонент)
import RacquetsClient from './RacquetsClient'
import { buildPageMetadata } from '@/constants/site'

export const metadata = buildPageMetadata({
  title: 'Энциклопедия сквош-ракеток — Сравнение и подбор ракеток',
  description:
    'Детальный технический разбор профессиональных ракеток для сквоша от Tecnifibre, Dunlop, Harrow, Head. Интерактивная таблица сравнения.',
  path: '/racquets',
})

export default function RacquetsPage() {
  return <RacquetsClient />
}
