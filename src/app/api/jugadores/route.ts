import { NextRequest, NextResponse } from 'next/server';
import { obtenerJugadoresResumen, crearJugador } from '@/lib/jugadores.service';
import type { CrearJugadorPayload, JugadorResumen, JugadorCompleto, ApiErrorResponse } from '@/types';

// GET /api/jugadores -> listado resumido de todos los jugadores
export async function GET(): Promise<NextResponse<JugadorResumen[] | ApiErrorResponse>> {
    try {
        const jugadores = await obtenerJugadoresResumen();
        return NextResponse.json(jugadores);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error interno del servidor';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// POST /api/jugadores -> crear jugador nuevo (completo)
export async function POST(request: NextRequest): Promise<NextResponse<JugadorCompleto | ApiErrorResponse>> {
    try {
        const body: CrearJugadorPayload = await request.json();
        const jugador = await crearJugador(body);
        if (!jugador) {
            return NextResponse.json({ error: 'No se pudo crear el jugador' }, { status: 400 });
        }
        return NextResponse.json(jugador, { status: 201 });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al procesar la solicitud';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
