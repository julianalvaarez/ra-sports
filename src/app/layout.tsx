import './globals.css';
import Image from 'next/image';
import { Inter, } from 'next/font/google'
import { Navbar } from './components/Navbar';

export const metadata = {
  title: 'R.A Sports - Agencia de representación de jugadores de fútbol',
  description: 'Gestión de jugadores de fútbol',
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="es">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <Navbar />
        {children}
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
              <span className="flex items-center gap-2 "><p>Contacto:</p><a className="transition-colors font-semibold hover:text-blue-200" href="mailto:ro-1312@hotmail.com">
                ro-1312@hotmail.com
              </a></span>
              <span className="text-blue-100">Instagram · Próximamente</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
