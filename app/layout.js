import './globals.css'

export const metadata = {
  title: 'Правила сквоша — Редакция 2026',
  description: 'Интерактивный свод официальных правил сквоша с поправками',
}

export default function RootLayout({ children }) {
  return (
    <html lang='ru'>
      <body>{children}</body>
    </html>
  )
}
