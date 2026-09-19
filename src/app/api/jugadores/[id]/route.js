import { NextResponse } from 'next/server';
import {
  obtenerJugadorCompleto,
  actualizarJugador,
  eliminarJugador,
} from '../../../../lib/jugadores.service';

// GET /api/jugadores/:id -> ficha completa de un jugador
export async function GET(request, { params }) {
  try {
    const jugador = await obtenerJugadorCompleto(params.id);
    if (!jugador) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
    }
    return NextResponse.json(jugador);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/jugadores/:id -> actualizar jugador existente
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const jugador = await actualizarJugador(params.id, body);
    if (!jugador) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
    }
    return NextResponse.json(jugador);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/jugadores/:id -> eliminar jugador
export async function DELETE(request, { params }) {
  try {
    const eliminado = await eliminarJugador(params.id);
    if (!eliminado) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ mensaje: `Jugador ${params.id} eliminado correctamente` });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
