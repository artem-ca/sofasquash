// app/players/page.js (Серверный компонент)
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import PlayersClient from './PlayersClient'

export const metadata = {
  title: 'Игроки в сквош — База профилей PSA World Tour и легенд',
  description:
    'Интерактивная база игроков в сквош: профессионалы PSA World Tour, легенды спорта, завершившие карьеру, и клубные игроки. Рейтинги, статистика, инвентарь и биографии.',
}

export default function PlayersPage() {
  const playersDirectory = path.join(process.cwd(), 'players')
  let playersList = []

  if (fs.existsSync(playersDirectory)) {
    const filenames = fs.readdirSync(playersDirectory)
    playersList = filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => {
        const slug = filename.replace('.md', '')
        const filePath = path.join(playersDirectory, filename)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(fileContent)

        return {
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
          bio: content || '', // Биография теперь берется из тела markdown-файла
        }
      })
  }

  return <PlayersClient initialPlayers={playersList} />
}
