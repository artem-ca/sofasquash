export function formatDate(isoString) {
  // Надежный конвертер дат из YYYY-MM-DD в DD.MM.YYYY без риска hydration mismatch
  if (!isoString) return ''
  const parts = isoString.split('-')
  if (parts.length !== 3) return isoString
  const [year, month, day] = parts
  return `${day}.${month}.${year}`
}
