'use client'

import { useState } from 'react'
import RacquetCard from '@/components/RacquetCard'
import RacquetDetailModal from '@/components/RacquetDetailModal'
import RacquetComparison, {
  useRacquetComparison,
} from '@/components/RacquetComparison'

// Интерактивная сетка ракеток одного бренда: карточки + детальная модалка +
// сравнение (до 5 моделей, шарится через ?compare= так же, как в каталоге).
// Фильтров нет — на странице бренда только его модели.
export default function BrandRacquetsClient({ racquets }) {
  const [selectedRacquet, setSelectedRacquet] = useState(null)

  const {
    comparisonList,
    isModalOpen,
    openModal,
    closeModal,
    toggle: toggleComparison,
    clear,
    warningMessage,
  } = useRacquetComparison()

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
        isModalOpen={isModalOpen}
        onOpen={openModal}
        onClose={closeModal}
        onClear={clear}
      />
    </>
  )
}
