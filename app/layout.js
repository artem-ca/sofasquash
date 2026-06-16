import { ThemeProvider } from '@/components/ThemeContext'
import Navbar from '@/components/Navbar'
import './globals.css'

import Script from 'next/script'

export const metadata = {
  title: 'Правила сквоша — Редакция 2026',
  description: 'Интерактивный свод официальных правил сквоша с поправками',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  const metricaId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || '109839456'

  return (
    <html lang='ru' suppressHydrationWarning>
      <body>
        <Script id='yandex-metrica' strategy='afterInteractive'>
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < e.length; j++) {if (e[j].className === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${metricaId}, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
          `}
        </Script>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
