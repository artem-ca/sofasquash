// app/players/page.js (Серверный компонент)
import PlayersClient from './PlayersClient'
import { getContentEntries } from '@/lib/content'
import { buildPageMetadata } from '@/constants/site'

export const metadata = buildPageMetadata({
  title: 'Игроки в сквош — База профилей PSA World Tour и легенд',
  description:
    'Интерактивная база игроков в сквош: профессионалы PSA World Tour, легенды спорта, завершившие карьеру, и клубные игроки. Рейтинги, статистика, инвентарь и биографии.',
  path: '/players',
})

export default function PlayersPage() {
  const playersList = getContentEntries('players').map(({ slug, data }) => ({
    id: slug,
    name: data.name || 'Без названия',
    nameEn: data.nameEn || '',
    gender: data.gender || 'male',
    status: data.status || 'active',
    rank: data.rank !== undefined ? data.rank : null,
    highestRank: data.highestRank || null,
    country: data.country || '',
    countryCode: data.countryCode || '',
    age: data.age || 0,
    dob: data.dob || '',
    birthplace: data.birthplace || '',
    experience: data.experience || '',
    racket: data.racket || '',
    height: data.height || '',
    weight: data.weight || '',
    plays: data.plays || '',
    titles: data.titles || 0,
    photo: data.photo || null,
    custom: !!data.custom,
  }))

  return <PlayersClient initialPlayers={playersList} />
}
