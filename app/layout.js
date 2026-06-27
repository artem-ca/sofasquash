import { ThemeProvider } from '@/components/ThemeContext'
import Navbar from '@/components/Navbar'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import './globals.css'

import Script from 'next/script'

const SITE_URL = 'https://sofasquash.ru'

export const metadata = {
  title: 'SQUASH PORTAL — интерактивная база знаний о сквоше',
  description:
    'Интерактивный свод официальных правил сквоша, тактический планшет, энциклопедия на 250+ ракеток и тренерский блог.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'SQUASH PORTAL — Все о сквоше',
    description:
      'Правила, термины, тактика, ракетки 3D-корт и тренерский блог.',
    url: SITE_URL,
    siteName: 'Squash Portal',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: 'Squash Portal — интерактивная база знаний о сквоше',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SQUASH PORTAL — Все о сквоше',
    description:
      'Интерактивный портал о сквоше: правила, тактики, база ракеток.',
    images: [`${SITE_URL}/og.png`],
  },
}

export default function RootLayout({ children }) {
  const metricaIdRaw = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || '109839456'

  // # Защита от DOM XSS: разрешаем только строго цифры в ID метрики
  const metricaId = /^\d+$/.test(metricaIdRaw) ? metricaIdRaw : '109839456'

  return (
    <html lang='ru' suppressHydrationWarning>
      <head>
        <script
          id='theme-initializer'
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
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
                 webvisor:true,
                 defer:true
            });
          `}
        </Script>
        <ThemeProvider>
          <Navbar />
          <ServiceWorkerRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
