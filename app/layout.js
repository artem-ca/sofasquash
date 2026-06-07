import { ThemeProvider } from '@/components/ThemeContext'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata = {
  title: 'Правила сквоша — Редакция 2026',
  description: 'Интерактивный свод официальных правил сквоша с поправками',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang='ru'>
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
