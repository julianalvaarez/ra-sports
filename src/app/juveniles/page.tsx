import { obtenerJugadoresResumen } from '@/lib/jugadores.service';
import { Jugador } from '@/types';
import { ListaJugadoresCatalog } from '@/app/components/ListaJugadoresCatalog';
import Image from 'next/image';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rasports.agency';

export const metadata: Metadata = {
    title: 'Jugadores Juveniles | R.A Sports - Promesas del Fútbol',
    description: 'Catálogo de futbolistas juveniles y promesas en desarrollo representados por R.A Sports. Conoce a los futuros talentos.',
    alternates: { canonical: `${siteUrl}/juveniles` },
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        siteName: 'R.A Sports',
        title: 'Jugadores Juveniles | R.A Sports',
        description: 'Catálogo de futbolistas juveniles y promesas representados por R.A Sports.',
        url: `${siteUrl}/juveniles`,
        images: [{ url: `${siteUrl}/rasports.jpg`, width: 1200, height: 630, alt: 'Jugadores Juveniles R.A Sports' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jugadores Juveniles | R.A Sports',
        description: 'Catálogo de futbolistas juveniles y promesas representados por R.A Sports.',
        images: [`${siteUrl}/rasports.jpg`],
    },
};

export default async function JuvenilesPage() {
    const jugadores: Jugador[] = await obtenerJugadoresResumen();

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Encabezado */}
                <header className="flex flex-col items-center justify-center text-center space-y-4 pt-6 pb-2 border-b border-slate-800">
                    <div className="flex items-center mb-5 gap-4">
                        <Image src="/azul.png" alt="R.A Sports Logo" width={40} height={40} priority />
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Juveniles</h1>
                        <Image src="/azul.png" alt="R.A Sports Logo" width={40} height={40} priority />
                    </div>
                </header>

                {/* Catálogo con filtros y Lazy Loading */}
                <ListaJugadoresCatalog jugadores={jugadores} categoria="juvenil" />
            </div>
        </main>
    );
}
