import './globals.css';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Navbar } from './components/Navbar';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rasports.agency';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'R.A Sports | Representación de futbolistas',
    template: '%s | R.A Sports',
  },
  description: 'Agencia de representación y desarrollo profesional de jugadores de fútbol.',
  applicationName: 'R.A Sports',
  keywords: ['representación futbolistas', 'agencia fútbol', 'scouting fútbol', 'jugadores de fútbol', 'desarrollo profesional fútbol', 'agencia de representación deportiva', 'fútbol profesional', 'jugadores profesionales', 'fútbol juvenil', 'talento futbolístico'],
  alternates: { canonical: '/' },
  icons: { icon: '/rasports.jpg', apple: '/rasports.jpg' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'R.A Sports',
    title: 'R.A Sports | Representación de futbolistas',
    description: 'Agencia de representación y desarrollo profesional de jugadores de fútbol.',
    url: siteUrl,
    images: [{ url: '/rasports.jpg', width: 1200, height: 630, alt: 'R.A Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'R.A Sports | Representación de futbolistas',
    description: 'Agencia de representación y desarrollo profesional de jugadores de fútbol.',
    images: ['/rasports.jpg'],
  },
  other: {
    google: 'notranslate',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0d1d34',
  colorScheme: 'light',
};

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="es" dir="ltr" translate="no">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <a href="#contenido-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black">
          Saltar al contenido principal
        </a>
        <Navbar />
        <div id="contenido-principal" className="flex min-h-screen flex-col">{children}</div>
        <footer className="mt-auto border-t border-blue-400/20 bg-[#0d1d34] px-8 py-10 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <Image
                src="/blanco.png"
                alt="Logo de R.A Sports"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div>
                <p className="font-semibold">R.A Sport</p>
                <p className="text-sm text-blue-100">Agencia de Representación de jugadores</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 ">
              <div className="flex items-center gap-2 "><span>Contacto:</span><a className="transition-colors font-semibold hover:text-blue-200" href="mailto:ro-1312@hotmail.com">
                ro-1312@hotmail.com
              </a></div>
              <span className="text-blue-100">Instagram · Próximamente</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
