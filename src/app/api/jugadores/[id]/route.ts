import { NextRequest, NextResponse } from 'next/server';
import {
    obtenerJugadorCompleto,
    actualizarJugador,
    eliminarJugador,
} from '@/lib/jugadores.service';
import type {
    JugadorCompleto,
    ActualizarJugadorPayload,
    ApiErrorResponse,
    ApiSuccessMessageResponse,
} from '@/types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/jugadores/:id -> ficha completa de un jugador
export async function GET(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<JugadorCompleto | ApiErrorResponse>> {
    try {
        const { id } = await params;
        const jugador = await obtenerJugadorCompleto(id);
        if (!jugador) {
            return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
        }
        return NextResponse.json(jugador);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al obtener el jugador';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// PUT /api/jugadores/:id -> actualizar jugador existente
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<JugadorCompleto | ApiErrorResponse>> {
    try {
        const { id } = await params;
        const body: ActualizarJugadorPayload = await request.json();
        const jugador = await actualizarJugador(id, body);
        if (!jugador) {
            return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
        }
        return NextResponse.json(jugador);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el jugador';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

// DELETE /api/jugadores/:id -> eliminar jugador
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiSuccessMessageResponse | ApiErrorResponse>> {
    try {
        const { id } = await params;
        const eliminado = await eliminarJugador(id);
        if (!eliminado) {
            return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ mensaje: `Jugador ${id} eliminado correctamente` });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el jugador';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
