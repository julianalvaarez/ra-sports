import { z } from 'zod';

const urlOpcional = z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^https?:\/\/.+|^\/uploads\/.+/.test(val), {
        message: 'Debe ser una URL válida (http://, https:// o /uploads/)',
    });

const trayectoriaItemSchema = z
    .object({
        club: z.string().trim().min(2, 'El nombre del club es obligatorio'),
        escudo_url: urlOpcional,
        pais: z.string().trim().min(2, 'El país del club es obligatorio'),
        anio_desde: z.coerce
            .number({ message: 'Ingresá un año' })
            .int()
            .min(1950, 'Año inválido')
            .max(new Date().getFullYear(), 'El año no puede ser futuro'),
        anio_hasta: z.union([z.coerce.number().int(), z.literal('')]).optional(),
        es_actual: z.boolean().default(false),
    })
    .refine(
        (data) => data.es_actual || (data.anio_hasta !== '' && data.anio_hasta !== undefined && data.anio_hasta !== null),
        { message: 'Si no es el club actual, indicá el año hasta', path: ['anio_hasta'] }
    )
    .refine(
        (data) =>
            data.es_actual ||
            data.anio_hasta === '' ||
            data.anio_hasta === undefined ||
            data.anio_hasta === null ||
            Number(data.anio_hasta) >= data.anio_desde,
        { message: 'El año hasta no puede ser anterior al año desde', path: ['anio_hasta'] }
    );

const trofeoItemSchema = z.object({
    nombre: z.string().trim().min(2, 'Nombre del trofeo obligatorio'),
    anio: z.coerce
        .number({ message: 'Ingresá un año' })
        .int()
        .min(1950)
        .max(new Date().getFullYear()),
    club: z.string().trim().optional().or(z.literal('')),
});

const imagenItemSchema = z.object({
    url: z
        .string()
        .trim()
        .optional()
        .or(z.literal(''))
        .refine((val) => !val || /^https?:\/\/.+|^\/uploads\/.+/.test(val), {
            message: 'Debe ser una URL válida',
        }),
});

export const jugadorSchema = z
    .object({
        nombre: z.string().trim().min(2, 'El nombre es obligatorio'),
        fecha_nacimiento: z
            .string()
            .min(1, 'La fecha de nacimiento es obligatoria')
            .refine((val) => new Date(val) < new Date(), { message: 'La fecha debe ser en el pasado' }),
        posicion_principal: z.string().trim().min(2, 'La posición principal es obligatoria'),
        posicion_secundaria: z.string().trim().optional().or(z.literal('')),
        altura_cm: z.coerce
            .number({ message: 'Ingresá la altura en cm' })
            .int()
            .min(140, 'Altura mínima 140 cm')
            .max(230, 'Altura máxima 230 cm'),
        pasaporte: z.string().trim().optional().or(z.literal('')),
        pie: z.enum(['izquierdo', 'derecho', 'ambidiestro'], {
            message: 'Seleccioná el pie hábil',
        }),
        categoria: z.enum(['juvenil', 'profesional'], {
            message: 'Seleccioná la categoría',
        }),
        link_transfermarkt: urlOpcional,
        link_video_resumen: urlOpcional,
        trayectoria: z.array(trayectoriaItemSchema).min(1, 'Cargá al menos un club en la trayectoria'),
        trofeos: z.array(trofeoItemSchema).optional().default([]),
        imagenes: z.array(imagenItemSchema).optional().default([]),
    })
    .refine(
        (data) => data.trayectoria.filter((t) => t.es_actual).length === 1,
        { message: 'Debe haber exactamente un club marcado como actual', path: ['trayectoria'] }
    );

export type JugadorFormData = z.infer<typeof jugadorSchema>;
