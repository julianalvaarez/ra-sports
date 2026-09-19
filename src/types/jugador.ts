export type PieHabil = 'izquierdo' | 'derecho' | 'ambidiestro';

export type CategoriaJugador = 'juvenil' | 'profesional';

// ---------------------------------------------------------
// Tablas de Base de Datos
// ---------------------------------------------------------
export interface Pais {
    id: number;
    nombre: string;
    codigo_iso?: string | null;
    created_at?: string;
}

export interface Posicion {
    id: number;
    nombre: string;
    created_at?: string;
}

export interface Club {
    id: number;
    nombre: string;
    escudo_url?: string | null;
    pais_id?: number | null;
    created_at?: string;
}

export interface Trofeo {
    id: number;
    nombre: string;
    created_at?: string;
}

export interface Jugador {
    id: string;
    nombre: string;
    fecha_nacimiento: string;
    posicion_principal_id: number;
    posicion_secundaria_id?: number | null;
    altura_cm: number;
    pasaporte_pais_id?: number | null;
    pie: PieHabil;
    categoria: CategoriaJugador;
    link_transfermarkt?: string | null;
    link_video_resumen?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface TrayectoriaItem {
    id?: number;
    jugador_id?: string;
    club_id: number;
    anio_desde: number;
    anio_hasta?: number | null;
    es_actual: boolean;
}

export interface JugadorTrofeo {
    id?: number;
    jugador_id?: string;
    trofeo_id: number;
    club_id?: number | null;
    anio: number;
}

export interface ImagenJugador {
    id?: number;
    jugador_id?: string;
    url: string;
    orden?: number;
}

// ---------------------------------------------------------
// Vistas de Supabase
// ---------------------------------------------------------
export interface JugadorResumen {
    id: string;
    nombre: string;
    posicion: string;
    club_actual: string | null;
    club_actual_escudo: string | null;
}

export interface Jugador {
    altura_cm: number;
    categoria: CategoriaJugador;
    club_actual: string;
    club_actual_escudo: string;
    club_actual_pais: string;
    fecha_nacimiento: string; // O Date, dependiendo de cómo manejes el parseo
    id: string;
    foto_principal: string;
    nombre: string;
    pasaporte: string;
    pie: PieHabil;
    posicion: string;
    posicion_principal: string;
    posicion_secundaria: string | null;
}

export interface TrayectoriaItemCompleto {
    club: string;
    club_pais: string;
    club_escudo: string | null;
    anio_desde: number;
    anio_hasta: number | null;
    es_actual: boolean;
}

export interface TrofeoItemCompleto {
    trofeo: string;
    club: string | null;
    anio: number;
}

export interface JugadorCompleto {
    id: string;
    nombre: string;
    fecha_nacimiento: string;
    posicion_principal: string;
    posicion_secundaria: string | null;
    altura_cm: number;
    pasaporte: string | null;
    pie: PieHabil;
    categoria: CategoriaJugador;
    link_transfermarkt: string | null;
    link_video_resumen: string;
    trayectoria: TrayectoriaItemCompleto[];
    trofeos: TrofeoItemCompleto[];
    imagenes: string[];
}

// ---------------------------------------------------------
// Payloads para Creación / Actualización (Servicio y API)
// ---------------------------------------------------------
export interface TrayectoriaInput {
    club: string;
    escudo_url?: string | null;
    pais: string;
    anio_desde: number;
    anio_hasta?: number | null;
    es_actual: boolean;
}

export interface TrofeoInput {
    nombre: string;
    anio: number;
    club?: string | null;
    escudo_url?: string | null;
    pais?: string | null;
}

export interface ImagenInput {
    url: string;
    orden?: number;
}

export interface CrearJugadorPayload {
    nombre: string;
    fecha_nacimiento: string;
    posicion_principal: string;
    posicion_secundaria?: string | null;
    altura_cm: number;
    pasaporte?: string | null;
    pie: PieHabil;
    categoria: CategoriaJugador;
    link_transfermarkt?: string | null;
    link_video_resumen?: string | null;
    trayectoria: TrayectoriaInput[];
    trofeos?: TrofeoInput[];
    imagenes: (string | ImagenInput)[];
}

export type ActualizarJugadorPayload = Partial<CrearJugadorPayload>;

// ---------------------------------------------------------
// Tipos de respuesta API
// ---------------------------------------------------------
export interface ApiErrorResponse {
    error: string;
}

export interface ApiSuccessMessageResponse {
    mensaje: string;
}
