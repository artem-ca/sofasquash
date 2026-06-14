// app/racquets/page.js (Серверный компонент)
import RacquetsClient from './RacquetsClient'

export const metadata = {
  title: 'Энциклопедия сквош-ракеток — Сравнение и подбор ракеток',
  description:
    'Детальный технический разбор профессиональных ракеток для сквоша от Tecnifibre, Dunlop, Harrow, Head. Интерактивная таблица сравнения.',
}

export default function RacquetsPage() {
  return <RacquetsClient />
}
