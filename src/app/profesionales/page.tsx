import { obtenerJugadoresResumen } from '@/lib/jugadores.service';
import { Jugador } from '@/types';
import { ListaJugadoresCatalog } from '@/app/components/ListaJugadoresCatalog';
import Image from 'next/image';

export const metadata = {
    title: 'Jugadores Profesionales - R.A. Sports',
    description: 'Catálogo de nuestros futbolistas profesionales representados.',
};


export default async function ProfesionalesPage() {
    const jugadores: Jugador[] = await obtenerJugadoresResumen();

    return (
        <main className="min-h-screen   py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Encabezado */}
                <div className="flex flex-col items-center justify-center text-center space-y-4 pt-6 pb-2 border-b border-slate-800">
                    <div className="flex items-center mb-5 gap-4">
                        <Image src="/azul.png" alt="RA.Sports Logo" width={40} height={40} />
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Profesionales</h1>
                        <Image src="/azul.png" alt="RA.Sports Logo" width={40} height={40} />
                    </div>

                </div>

                {/* Catálogo con filtros y Lazy Loading */}
                <ListaJugadoresCatalog jugadores={jugadores} categoria="profesional" />
            </div>
        </main>
    );
}
