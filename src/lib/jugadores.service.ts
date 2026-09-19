import { supabase } from './supabaseClient';
import type { Jugador, JugadorCompleto, CrearJugadorPayload, ActualizarJugadorPayload, TrayectoriaInput, TrofeoInput, ImagenInput, TrayectoriaItemCompleto, TrofeoItemCompleto, } from '@/types';

// ---------------------------------------------------------
// HELPERS SUPABASE
// ---------------------------------------------------------

async function getOrCreatePais(nombre: string | null | undefined): Promise<number | null> {
    if (!nombre) return null;

    const { data: existente } = await supabase.from('paises').select('id').eq('nombre', nombre).maybeSingle();

    if (existente) return existente.id;

    const codigo_iso = nombre.slice(0, 3).toUpperCase();
    const { data: nuevo, error } = await supabase.from('paises').insert({ nombre, codigo_iso }).select('id').single();

    if (error) throw error;
    return nuevo.id;
}

async function getOrCreatePosicion(nombre: string | null | undefined): Promise<number | null> {
    if (!nombre) return null;

    const { data: existente } = await supabase.from('posiciones').select('id').eq('nombre', nombre).maybeSingle();

    if (existente) return existente.id;

    const { data: nuevo, error } = await supabase.from('posiciones').insert({ nombre }).select('id').single();

    if (error) throw error;
    return nuevo.id;
}

async function getOrCreateClub(nombre: string, escudo_url?: string | null, paisNombre?: string | null): Promise<number> {
    const paisFinal = paisNombre && paisNombre.trim() !== '' ? paisNombre.trim() : 'Desconocido';
    const pais_id = await getOrCreatePais(paisFinal);

    const { data: existente } = await supabase.from('clubes').select('id').eq('nombre', nombre).eq('pais_id', pais_id).maybeSingle();

    if (existente) {
        if (escudo_url) {
            await supabase.from('clubes').update({ escudo_url }).eq('id', existente.id);
        }
        return existente.id;
    }

    const { data: nuevo, error } = await supabase.from('clubes').insert({ nombre, escudo_url, pais_id }).select('id').single();

    if (error) throw error;
    return nuevo.id;
}

async function getOrCreateTrofeo(nombre: string): Promise<number> {
    const { data: existente } = await supabase.from('trofeos').select('id').eq('nombre', nombre).maybeSingle();

    if (existente) return existente.id;

    const { data: nuevo, error } = await supabase.from('trofeos').insert({ nombre }).select('id').single();

    if (error) throw error;
    return nuevo.id;
}

interface RelacionadosParams { trayectoria?: TrayectoriaInput[]; trofeos?: TrofeoInput[]; imagenes?: (string | ImagenInput)[]; }

async function insertarDatosRelacionados(jugadorId: string, { trayectoria, trofeos, imagenes }: RelacionadosParams): Promise<void> {
    if (Array.isArray(trayectoria) && trayectoria.length > 0) {
        for (const t of trayectoria) {
            const club_id = await getOrCreateClub(t.club, t.escudo_url, t.pais);
            const { error } = await supabase.from('trayectoria').insert({ jugador_id: jugadorId, club_id, anio_desde: t.anio_desde, anio_hasta: t.anio_hasta ?? null, es_actual: !!t.es_actual, });
            if (error) throw error;
        }
    }

    if (Array.isArray(trofeos) && trofeos.length > 0) {
        for (const tr of trofeos) {
            const trofeo_id = await getOrCreateTrofeo(tr.nombre);
            const club_id = tr.club && tr.club.trim() !== '' ? await getOrCreateClub(tr.club, tr.escudo_url, tr.pais) : null;
            const { error } = await supabase.from('jugador_trofeos').insert({ jugador_id: jugadorId, trofeo_id, club_id, anio: tr.anio, });
            if (error) throw error;
        }
    }

    if (Array.isArray(imagenes) && imagenes.length > 0) {
        const filas = imagenes.map((url, i) => ({
            jugador_id: jugadorId,
            url: typeof url === 'string' ? url : url.url,
            orden: typeof url === 'string' ? i : (url.orden ?? i),
        }));
        const { error } = await supabase.from('imagenes_jugador').insert(filas);
        if (error) throw error;
    }
}

// ---------------------------------------------------------
// Ficha completa de un jugador
// ---------------------------------------------------------
export async function obtenerJugadorCompleto(id: string): Promise<JugadorCompleto | null> {
    try {
        const { data, error } = await supabase.from('vista_jugador_completo').select('*').eq('id', id).maybeSingle();

        if (!error && data) return data as JugadorCompleto;
    } catch {
        // Silenciar error en fallos de red/Supabase
        console.error('Error al obtener jugador completo:');
    }

    return null;
}

// ---------------------------------------------------------
// Listado resumido de todos los jugadores
// ---------------------------------------------------------
export async function obtenerJugadoresResumen(): Promise<Jugador[]> {
    try {
        const { data, error } = await supabase.from('vista_jugadores_resumen').select('*');
        if (!error && data) {
            const ordenPrioridad: Record<string, number> = {
                'Matias Perez': 1,
                'José Devecchi': 2,
                'Elias Torres': 3,
                'Benjamin Gonzalez': 6,
                'Santiago Meloni': 7,
                'Gabriel Ramirez': 4,
                'Tomas Canteros': 5,
            };

            const jugadores = (data as Jugador[]).sort((a, b) => {
                const prioridadA = ordenPrioridad[a.nombre] ?? 999;
                const prioridadB = ordenPrioridad[b.nombre] ?? 999;

                if (prioridadA !== prioridadB) {
                    return prioridadA - prioridadB;
                }

                return a.nombre.localeCompare(b.nombre);
            });

            return jugadores;
        }
    } catch (err) {
        console.error('Error al obtener jugadores resumen:', err);
    }

    return [];
}

// ---------------------------------------------------------
// Crear jugador completo
// ---------------------------------------------------------
export async function crearJugador(body: CrearJugadorPayload): Promise<JugadorCompleto | null> {
    try {
        const posicion_principal_id = await getOrCreatePosicion(body.posicion_principal);
        const posicion_secundaria_id = body.posicion_secundaria ? await getOrCreatePosicion(body.posicion_secundaria) : null;
        const pasaporte_pais_id = body.pasaporte ? await getOrCreatePais(body.pasaporte) : null;

        const { data: jugador, error } = await supabase
            .from('jugadores')
            .insert({
                nombre: body.nombre,
                fecha_nacimiento: body.fecha_nacimiento,
                posicion_principal_id,
                posicion_secundaria_id,
                altura_cm: body.altura_cm,
                pasaporte_pais_id,
                pie: body.pie,
                categoria: body.categoria,
                link_transfermarkt: body.link_transfermarkt,
                link_video_resumen: body.link_video_resumen,
            })
            .select('id')
            .single();

        if (!error && jugador) {
            await insertarDatosRelacionados(jugador.id, {
                trayectoria: body.trayectoria,
                trofeos: body.trofeos,
                imagenes: body.imagenes,
            });

            return await obtenerJugadorCompleto(jugador.id);
        }
    } catch (error) {
        console.error('Error al crear jugador:', error);
    }

    return null;
}

// ---------------------------------------------------------
// Actualizar jugador
// ---------------------------------------------------------
export async function actualizarJugador(id: string, body: ActualizarJugadorPayload): Promise<JugadorCompleto | null> {
    try {
        const camposActualizables: Record<string, unknown> = {};
        if (body.nombre !== undefined) camposActualizables.nombre = body.nombre;
        if (body.fecha_nacimiento !== undefined) camposActualizables.fecha_nacimiento = body.fecha_nacimiento;
        if (body.altura_cm !== undefined) camposActualizables.altura_cm = body.altura_cm;
        if (body.pie !== undefined) camposActualizables.pie = body.pie;
        if (body.categoria !== undefined) camposActualizables.categoria = body.categoria;
        if (body.link_transfermarkt !== undefined) camposActualizables.link_transfermarkt = body.link_transfermarkt;
        if (body.link_video_resumen !== undefined) camposActualizables.link_video_resumen = body.link_video_resumen;
        if (body.posicion_principal !== undefined) {
            camposActualizables.posicion_principal_id = await getOrCreatePosicion(body.posicion_principal);
        }
        if (body.posicion_secundaria !== undefined) {
            camposActualizables.posicion_secundaria_id = body.posicion_secundaria
                ? await getOrCreatePosicion(body.posicion_secundaria)
                : null;
        }
        if (body.pasaporte !== undefined) {
            camposActualizables.pasaporte_pais_id = body.pasaporte
                ? await getOrCreatePais(body.pasaporte)
                : null;
        }

        if (Object.keys(camposActualizables).length > 0) {
            await supabase.from('jugadores').update(camposActualizables).eq('id', id);
        }

        if (body.trayectoria !== undefined) {
            await supabase.from('trayectoria').delete().eq('jugador_id', id);
        }
        if (body.trofeos !== undefined) {
            await supabase.from('jugador_trofeos').delete().eq('jugador_id', id);
        }
        if (body.imagenes !== undefined) {
            await supabase.from('imagenes_jugador').delete().eq('jugador_id', id);
        }

        await insertarDatosRelacionados(id, {
            trayectoria: body.trayectoria,
            trofeos: body.trofeos,
            imagenes: body.imagenes,
        });

        return await obtenerJugadorCompleto(id);
    } catch (error) {
        console.error('Error al actualizar jugador:', error);
    }

    return null;
}

// ---------------------------------------------------------
// Eliminar jugador
// ---------------------------------------------------------
export async function eliminarJugador(id: string): Promise<{ id: string } | null> {
    try {
        const { error } = await supabase.from('jugadores').delete().eq('id', id);
        if (!error) return { id };
    } catch (error) {
        console.error('Error al eliminar jugador:', error);
    }

    return null;
}

