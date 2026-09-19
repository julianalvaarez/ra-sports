import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerJugadorCompleto } from '@/lib/jugadores.service';
import JugadorForm from '@/components/jugador-form';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Editar jugador' };

interface EditarJugadorPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarJugadorPage({ params }: EditarJugadorPageProps) {
    const { id } = await params;
    const jugador = await obtenerJugadorCompleto(id);

    if (!jugador) {
        notFound();
    }

    return (
        <div className="container py-10 max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Editar jugador</h1>
                    <p className="text-muted-foreground">Modificá los datos o subí nuevas imágenes para {jugador.nombre}.</p>
                </div>
                <Button variant="outline" size="sm">
                    <Link href={`/admin/${id}`}>&larr; Cancelar</Link>
                </Button>
            </div>

            <JugadorForm jugadorInicial={jugador} />
        </div>
    );
}
