import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { obtenerJugadorCompleto } from '@/lib/jugadores.service';
import type { JugadorCompleto, TrayectoriaItemCompleto, TrofeoItemCompleto } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumplio =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumplio) edad--;
  return edad;
}

interface JugadorDetallePageProps {
  params: Promise<{ id: string }>;
}

export default async function JugadorDetallePage({ params }: JugadorDetallePageProps) {
  const { id } = await params;
  const jugador: JugadorCompleto | null = await obtenerJugadorCompleto(id);
  if (!jugador) notFound();

  const clubActual = jugador.trayectoria?.find((t: TrayectoriaItemCompleto) => t.es_actual);

  return (
    <div className="container py-10 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm">
          <Link href="/admin">&larr; Volver al listado</Link>
        </Button>
        <Button variant="outline" size="sm">
          <Link href={`/admin/${id}/editar`}>
            <Pencil className="h-4 w-4 mr-1.5" /> Editar jugador
          </Link>
        </Button>
      </div>

      {/* Encabezado */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
          {jugador.imagenes?.[0] && (
            <Image
              src={jugador.imagenes[0]}
              alt={jugador.nombre}
              width={140}
              height={140}
              className="rounded-lg object-cover border"
              unoptimized
            />
          )}
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold">{jugador.nombre}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge>{jugador.posicion_principal}</Badge>
              {jugador.posicion_secundaria && <Badge variant="secondary">{jugador.posicion_secundaria}</Badge>}
              <Badge variant="outline">{jugador.categoria}</Badge>
            </div>
            <p className="text-muted-foreground">
              {calcularEdad(jugador.fecha_nacimiento)} años · {jugador.altura_cm} cm · pie {jugador.pie}
            </p>
            {jugador.pasaporte && (
              <p className="text-sm text-muted-foreground">Pasaporte: {jugador.pasaporte}</p>
            )}
            {clubActual && (
              <p className="text-sm">
                Juega actualmente en <span className="font-medium">{clubActual.club}</span> desde{' '}
                {clubActual.anio_desde}
              </p>
            )}
            <div className="flex gap-4 pt-2">
              {jugador.link_transfermarkt && (
                <a
                  href={jugador.link_transfermarkt}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline text-primary"
                >
                  Ver en Transfermarkt
                </a>
              )}
              {jugador.link_video_resumen && (
                <a
                  href={jugador.link_video_resumen}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline text-primary"
                >
                  Ver video resumen
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trayectoria */}
      {jugador.trayectoria && jugador.trayectoria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trayectoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {jugador.trayectoria.map((t: TrayectoriaItemCompleto, i: number) => (
              <div key={i} className="flex items-center gap-4">
                {t.club_escudo ? (
                  <Image src={t.club_escudo} alt={t.club} width={40} height={40} className="rounded-full border bg-white object-contain" unoptimized />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {t.club} <span className="text-muted-foreground font-normal">({t.club_pais})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.anio_desde} – {t.es_actual ? 'actualidad' : t.anio_hasta}
                  </p>
                </div>
                {t.es_actual && <Badge>Actual</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trofeos */}
      {jugador.trofeos && jugador.trofeos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trofeos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {jugador.trofeos.map((tr: TrofeoItemCompleto, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span>{tr.trofeo}{tr.club ? ` — ${tr.club}` : ''}</span>
                <Badge variant="secondary">{tr.anio}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Imágenes */}
      {jugador.imagenes && jugador.imagenes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {jugador.imagenes.map((url: string, i: number) => (
              <Image
                key={i}
                src={url}
                alt={`${jugador.nombre} foto ${i + 1}`}
                width={200}
                height={200}
                className="rounded-md object-cover w-full h-32 border"
                unoptimized
              />
            ))}
          </CardContent>
        </Card>
      )}

      <Separator />
    </div>
  );
}
