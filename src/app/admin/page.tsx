import Link from 'next/link';
import Image from 'next/image';
import { obtenerJugadoresResumen } from '@/lib/jugadores.service';
import type { JugadorResumen } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Jugadores' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const jugadores: JugadorResumen[] = await obtenerJugadoresResumen();

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Jugadores</h1>
          <p className="text-muted-foreground">{jugadores.length} jugadores cargados</p>
        </div>
        <Button>
          <Link href="/admin/nuevo">+ Nuevo jugador</Link>
        </Button>
      </div>

      {jugadores.length === 0 ? (
        <p className="text-muted-foreground">Todavía no hay jugadores cargados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jugadores.map((j: JugadorResumen) => (
            <Link key={j.id} href={`/admin/${j.id}`}>
              <Card className="h-full transition-colors hover:border-primary cursor-pointer">
                <CardContent className="p-5 flex items-center gap-4">
                  {j.club_actual_escudo ? (
                    <Image
                      src={j.club_actual_escudo}
                      alt={j.club_actual || 'Club actual'}
                      width={48}
                      height={48}
                      className="rounded-full object-contain bg-white border"
                      unoptimized
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-muted" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{j.nombre}</p>
                    <Badge variant="secondary" className="mt-1">{j.posicion}</Badge>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {j.club_actual || 'Sin club actual'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
