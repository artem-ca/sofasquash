'use client'

import { useState, useEffect } from 'react'
import RacquetCard from '@/components/RacquetCard'
import RacquetDetailModal from '@/components/RacquetDetailModal'
import RacquetComparison from '@/components/RacquetComparison'

// Интерактивная сетка ракеток одного бренда: карточки + детальная модалка +
// сравнение (до 5 моделей). Фильтров нет — на странице бренда только его модели.
export default function BrandRacquetsClient({ racquets }) {
  const [comparisonList, setComparisonList] = useState([])
  const [warningMessage, setWarningMessage] = useState('')
  const [selectedRacquet, setSelectedRacquet] = useState(null)

  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => setWarningMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [warningMessage])

  const toggleComparison = (racquet) => {
    const exists = comparisonList.find((item) => item.id === racquet.id)
    if (exists) {
      setComparisonList(comparisonList.filter((item) => item.id !== racquet.id))
      setWarningMessage('')
    } else {
      if (comparisonList.length >= 5) {
        setWarningMessage('Максимум 5 ракеток для сравнения!')
        return
      }
      setComparisonList([...comparisonList, racquet])
    }
  }

  return (
    <>
      {warningMessage && (
        <div className='p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-bold mb-6 text-center animate-bounce'>
          {warningMessage}
        </div>
      )}

      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 w-full'>
        {racquets.map((racquet) => (
          <RacquetCard
            key={racquet.id}
            racquet={racquet}
            isCompared={!!comparisonList.find((item) => item.id === racquet.id)}
            onClick={() => setSelectedRacquet(racquet)}
          />
        ))}
      </div>

      {selectedRacquet && (
        <RacquetDetailModal
          racquet={selectedRacquet}
          isCompared={
            !!comparisonList.find((item) => item.id === selectedRacquet.id)
          }
          onToggleComparison={toggleComparison}
          onClose={() => setSelectedRacquet(null)}
        />
      )}

      <RacquetComparison
        comparisonList={comparisonList}
        onClear={() => setComparisonList([])}
      />
    </>
  )
}
