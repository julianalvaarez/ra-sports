'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

import { jugadorSchema, type JugadorFormData } from '@/lib/validations/jugador';
import type { CrearJugadorPayload, JugadorCompleto } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

interface JugadorFormProps {
    jugadorInicial?: JugadorCompleto;
}

interface CampoErrorProps {
    mensaje?: string;
}

function CampoError({ mensaje }: CampoErrorProps) {
    if (!mensaje) return null;
    return <p className="text-sm text-destructive mt-1">{mensaje}</p>;
}

export default function JugadorForm({ jugadorInicial }: JugadorFormProps) {
    const router = useRouter();
    const esEdicion = Boolean(jugadorInicial);

    const [enviando, setEnviando] = useState<boolean>(false);
    const [estadoSubida, setEstadoSubida] = useState<string | null>(null);
    const [errorServidor, setErrorServidor] = useState<string | null>(null);

    // Estado para archivos locales de escudos (un archivo por club)
    const [archivosEscudos, setArchivosEscudos] = useState<Record<number, { file: File; preview: string }>>({});

    // Estado para imágenes locales múltiples de fotos de jugador
    const [fotosLocales, setFotosLocales] = useState<Array<{ id: string; file: File; preview: string }>>([]);

    const inputFotosRef = useRef<HTMLInputElement>(null);

    const valoresPorDefecto = jugadorInicial
        ? {
            nombre: jugadorInicial.nombre,
            fecha_nacimiento: jugadorInicial.fecha_nacimiento ? jugadorInicial.fecha_nacimiento.split('T')[0] : '',
            posicion_principal: jugadorInicial.posicion_principal,
            posicion_secundaria: jugadorInicial.posicion_secundaria || '',
            altura_cm: jugadorInicial.altura_cm,
            pasaporte: jugadorInicial.pasaporte || '',
            pie: jugadorInicial.pie,
            categoria: jugadorInicial.categoria,
            link_transfermarkt: jugadorInicial.link_transfermarkt || '',
            link_video_resumen: jugadorInicial.link_video_resumen || '',
            trayectoria: jugadorInicial.trayectoria?.length
                ? jugadorInicial.trayectoria.map((t) => ({
                    club: t.club,
                    escudo_url: t.club_escudo || '',
                    pais: t.club_pais || '',
                    anio_desde: t.anio_desde,
                    anio_hasta: t.es_actual ? '' : (t.anio_hasta ?? ''),
                    es_actual: t.es_actual,
                }))
                : [{ club: '', escudo_url: '', pais: '', anio_desde: new Date().getFullYear(), anio_hasta: '' as number | '', es_actual: true }],
            trofeos: jugadorInicial.trofeos?.length
                ? jugadorInicial.trofeos.map((tr) => ({
                    nombre: tr.trofeo,
                    anio: tr.anio,
                    club: tr.club || '',
                }))
                : [],
            imagenes: jugadorInicial.imagenes?.length
                ? jugadorInicial.imagenes.map((url) => ({ url }))
                : [],
        }
        : {
            nombre: '',
            fecha_nacimiento: '',
            posicion_principal: '',
            posicion_secundaria: '',
            altura_cm: 180,
            pasaporte: '',
            pie: 'derecho' as const,
            categoria: 'profesional' as const,
            link_transfermarkt: '',
            link_video_resumen: '',
            trayectoria: [{ club: '', escudo_url: '', pais: '', anio_desde: new Date().getFullYear(), anio_hasta: '' as number | '', es_actual: true }],
            trofeos: [] as Array<{ nombre: string; anio: number; club: string }>,
            imagenes: [] as Array<{ url?: string }>,
        };

    const {
        register,
        control,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(jugadorSchema),
        defaultValues: valoresPorDefecto,
    });

    const trayectoria = useFieldArray({ control, name: 'trayectoria' });
    const trofeos = useFieldArray({ control, name: 'trofeos' });
    const imagenes = useFieldArray({ control, name: 'imagenes' });

    const manejarEscudoLocal = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setArchivosEscudos((prev) => ({
            ...prev,
            [index]: { file, preview },
        }));
        e.target.value = '';
    };

    const quitarEscudoLocal = (index: number) => {
        setArchivosEscudos((prev) => {
            const nuevo = { ...prev };
            delete nuevo[index];
            return nuevo;
        });
    };

    const manejarFotosLocales = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const nuevasFotos = Array.from(files).map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            preview: URL.createObjectURL(file),
        }));

        setFotosLocales((prev) => [...prev, ...nuevasFotos]);
        e.target.value = '';
    };

    const quitarFotoLocal = (id: string) => {
        setFotosLocales((prev) => prev.filter((f) => f.id !== id));
    };

    const subirArchivosServidor = async (files: File[], folder: string): Promise<string[]> => {
        if (!files.length) return [];
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));
        formData.append('folder', folder);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error subiendo imágenes al servidor');
        }

        const data = await res.json();
        return data.urls as string[];
    };

    async function onSubmit(valores: JugadorFormData) {
        setErrorServidor(null);
        setEnviando(true);
        setEstadoSubida('Subiendo imágenes...');

        try {
            // 1. Subir escudos locales si los hay
            const listaTrayectoria = [...valores.trayectoria];
            for (const idxStr of Object.keys(archivosEscudos)) {
                const idx = Number(idxStr);
                const itemEscudo = archivosEscudos[idx];
                if (itemEscudo && listaTrayectoria[idx]) {
                    const [urlSubida] = await subirArchivosServidor([itemEscudo.file], 'escudos');
                    if (urlSubida) {
                        listaTrayectoria[idx].escudo_url = urlSubida;
                    }
                }
            }

            // 2. Subir fotos de jugador locales si las hay
            let listaImagenes = (valores.imagenes || [])
                .map((i) => i.url)
                .filter((u): u is string => Boolean(u && u.trim() !== ''));

            if (fotosLocales.length > 0) {
                const archivos = fotosLocales.map((f) => f.file);
                const urlsFotosSubidas = await subirArchivosServidor(archivos, 'jugadores');
                listaImagenes = [...listaImagenes, ...urlsFotosSubidas];
            }

            if (listaImagenes.length === 0) {
                throw new Error('Cargá al menos una foto del jugador (vía archivo local o URL)');
            }

            setEstadoSubida('Guardando datos del jugador...');

            // 3. Crear Payload final
            const payload: CrearJugadorPayload = {
                ...valores,
                posicion_secundaria: valores.posicion_secundaria || undefined,
                pasaporte: valores.pasaporte || undefined,
                link_transfermarkt: valores.link_transfermarkt || undefined,
                link_video_resumen: valores.link_video_resumen || undefined,
                trayectoria: listaTrayectoria.map((t) => ({
                    ...t,
                    anio_hasta: t.es_actual ? null : Number(t.anio_hasta),
                    anio_desde: Number(t.anio_desde),
                })),
                trofeos: (valores.trofeos || []).map((t) => ({ ...t, anio: Number(t.anio), club: t.club || undefined })),
                imagenes: listaImagenes,
            };

            const urlTarget = esEdicion ? `/api/jugadores/${jugadorInicial!.id}` : '/api/jugadores';
            const metodo = esEdicion ? 'PUT' : 'POST';

            const res = await fetch(urlTarget, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                const errorData = data as { error?: string };
                throw new Error(errorData.error || `No se pudo ${esEdicion ? 'actualizar' : 'crear'} el jugador`);
            }

            const jugadorResultado = data as JugadorCompleto;
            router.push(`/admin/${jugadorResultado.id}`);
            router.refresh();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar el jugador';
            setErrorServidor(errorMessage);
        } finally {
            setEnviando(false);
            setEstadoSubida(null);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* DATOS PERSONALES */}
            <Card>
                <CardHeader>
                    <CardTitle>Datos personales</CardTitle>
                    <CardDescription>Información básica del jugador.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="nombre">Nombre completo</Label>
                        <Input id="nombre" placeholder="Juan Pérez" {...register('nombre')} />
                        <CampoError mensaje={errors.nombre?.message} />
                    </div>

                    <div>
                        <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                        <Input id="fecha_nacimiento" type="date" {...register('fecha_nacimiento')} />
                        <CampoError mensaje={errors.fecha_nacimiento?.message} />
                    </div>

                    <div>
                        <Label htmlFor="posicion_principal">Posición principal</Label>
                        <Input id="posicion_principal" placeholder="Delantero Centro" {...register('posicion_principal')} />
                        <CampoError mensaje={errors.posicion_principal?.message} />
                    </div>

                    <div>
                        <Label htmlFor="posicion_secundaria">Posición secundaria (opcional)</Label>
                        <Input id="posicion_secundaria" placeholder="Extremo Izquierdo" {...register('posicion_secundaria')} />
                        <CampoError mensaje={errors.posicion_secundaria?.message} />
                    </div>

                    <div>
                        <Label htmlFor="altura_cm">Altura (cm)</Label>
                        <Input id="altura_cm" type="number" placeholder="181" {...register('altura_cm')} />
                        <CampoError mensaje={errors.altura_cm?.message} />
                    </div>

                    <div>
                        <Label htmlFor="pasaporte">Pasaporte de otro país (opcional)</Label>
                        <Input id="pasaporte" placeholder="España" {...register('pasaporte')} />
                        <CampoError mensaje={errors.pasaporte?.message} />
                    </div>

                    <div>
                        <Label>Pie hábil</Label>
                        <Controller
                            control={control}
                            name="pie"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="izquierdo">Izquierdo</SelectItem>
                                        <SelectItem value="derecho">Derecho</SelectItem>
                                        <SelectItem value="ambidiestro">Ambidiestro</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <CampoError mensaje={errors.pie?.message} />
                    </div>

                    <div>
                        <Label>Categoría</Label>
                        <Controller
                            control={control}
                            name="categoria"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="juvenil">Juvenil</SelectItem>
                                        <SelectItem value="profesional">Profesional</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <CampoError mensaje={errors.categoria?.message} />
                    </div>

                    <div>
                        <Label htmlFor="link_transfermarkt">Link de Transfermarkt (opcional)</Label>
                        <Input id="link_transfermarkt" placeholder="https://transfermarkt.com/..." {...register('link_transfermarkt')} />
                        <CampoError mensaje={errors.link_transfermarkt?.message} />
                    </div>

                    <div>
                        <Label htmlFor="link_video_resumen">Link del video resumen (opcional)</Label>
                        <Input id="link_video_resumen" placeholder="https://youtube.com/..." {...register('link_video_resumen')} />
                        <CampoError mensaje={errors.link_video_resumen?.message} />
                    </div>
                </CardContent>
            </Card>

            {/* TRAYECTORIA */}
            <Card>
                <CardHeader>
                    <CardTitle>Trayectoria</CardTitle>
                    <CardDescription>
                        Club actual y clubes anteriores. Podés subir el escudo de cada club (máximo 1 imagen por club).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {trayectoria.fields.map((field, index) => {
                        const escudoUrlInput = watch(`trayectoria.${index}.escudo_url`);
                        const esActualVal = watch(`trayectoria.${index}.es_actual`);
                        const escudoLocal = archivosEscudos[index];

                        return (
                            <div key={field.id} className="rounded-md border p-4 space-y-3 bg-card">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label>Club</Label>
                                        <Input placeholder="River Plate" {...register(`trayectoria.${index}.club`)} />
                                        <CampoError mensaje={errors.trayectoria?.[index]?.club?.message} />
                                    </div>
                                    <div>
                                        <Label>País del club</Label>
                                        <Input placeholder="Argentina" {...register(`trayectoria.${index}.pais`)} />
                                        <CampoError mensaje={errors.trayectoria?.[index]?.pais?.message} />
                                    </div>

                                    {/* SECCIÓN ESCUDO DEL CLUB (MAX 1 IMAGEN PER CLUB) */}
                                    <div className="md:col-span-2 rounded-lg border border-dashed p-3 space-y-2 bg-muted/30">
                                        <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block">
                                            Escudo del Club (Opcional - Máximo 1 imagen)
                                        </Label>

                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Previsualización del escudo */}
                                            {escudoLocal ? (
                                                <div className="relative group w-16 h-16 rounded-full border bg-white overflow-hidden shadow-sm flex items-center justify-center">
                                                    <Image src={escudoLocal.preview} alt="Escudo local" fill className="object-contain p-1" unoptimized />
                                                    <button
                                                        type="button"
                                                        onClick={() => quitarEscudoLocal(index)}
                                                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        title="Quitar imagen local"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            ) : escudoUrlInput ? (
                                                <div className="relative w-16 h-16 rounded-full border bg-white overflow-hidden shadow-sm flex items-center justify-center">
                                                    <Image src={escudoUrlInput} alt="Escudo URL" fill className="object-contain p-1" unoptimized />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-full border border-dashed flex flex-col items-center justify-center bg-muted text-muted-foreground text-xs">
                                                    <ImageIcon className="h-6 w-6 opacity-40 mb-0.5" />
                                                    <span>Sin escudo</span>
                                                </div>
                                            )}

                                            <div className="flex-1 space-y-2 min-w-[200px]">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => document.getElementById(`escudo-file-${index}`)?.click()}
                                                    >
                                                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                                                        {escudoLocal ? 'Cambiar archivo local' : 'Subir escudo desde tu equipo'}
                                                    </Button>
                                                    <input
                                                        id={`escudo-file-${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => manejarEscudoLocal(index, e)}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">o URL opcional:</span>
                                                    <Input
                                                        placeholder="https://.../escudo.png"
                                                        className="h-8 text-xs"
                                                        {...register(`trayectoria.${index}.escudo_url`)}
                                                        disabled={Boolean(escudoLocal)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <CampoError mensaje={errors.trayectoria?.[index]?.escudo_url?.message} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:col-span-2">
                                        <div>
                                            <Label>Año desde</Label>
                                            <Input type="number" placeholder="2023" {...register(`trayectoria.${index}.anio_desde`)} />
                                            <CampoError mensaje={errors.trayectoria?.[index]?.anio_desde?.message} />
                                        </div>
                                        <div>
                                            <Label>Año hasta</Label>
                                            <Input
                                                type="number"
                                                placeholder={esActualVal ? 'Actualidad' : '2024'}
                                                disabled={esActualVal}
                                                {...register(`trayectoria.${index}.anio_hasta`)}
                                            />
                                            {!esActualVal && <CampoError mensaje={errors.trayectoria?.[index]?.anio_hasta?.message} />}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <Controller
                                            control={control}
                                            name={`trayectoria.${index}.es_actual`}
                                            render={({ field }) => (
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        if (checked) {
                                                            setValue(`trayectoria.${index}.anio_hasta`, '');
                                                            clearErrors(`trayectoria.${index}.anio_hasta`);
                                                        }
                                                    }}
                                                    id={`actual-${index}`}
                                                />
                                            )}
                                        />
                                        <Label htmlFor={`actual-${index}`} className="cursor-pointer font-medium">
                                            Es el club actual
                                        </Label>
                                    </div>

                                    {trayectoria.fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                quitarEscudoLocal(index);
                                                trayectoria.remove(index);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1 text-destructive" /> Quitar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <CampoError mensaje={errors.trayectoria?.root?.message || (errors.trayectoria as any)?.message} />

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            trayectoria.append({ club: '', escudo_url: '', pais: '', anio_desde: new Date().getFullYear(), anio_hasta: '', es_actual: false })
                        }
                    >
                        <Plus className="h-4 w-4 mr-1" /> Agregar club
                    </Button>
                </CardContent>
            </Card>

            {/* TROFEOS */}
            <Card>
                <CardHeader>
                    <CardTitle>Trofeos</CardTitle>
                    <CardDescription>Opcional. Agregá los títulos ganados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {trofeos.fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end rounded-md border p-4">
                            <div>
                                <Label>Trofeo</Label>
                                <Input placeholder="Copa Libertadores" {...register(`trofeos.${index}.nombre`)} />
                                <CampoError mensaje={errors.trofeos?.[index]?.nombre?.message} />
                            </div>
                            <div>
                                <Label>Año</Label>
                                <Input type="number" placeholder="2024" {...register(`trofeos.${index}.anio`)} />
                                <CampoError mensaje={errors.trofeos?.[index]?.anio?.message} />
                            </div>
                            <div>
                                <Label>Club (opcional)</Label>
                                <Input placeholder="River Plate" {...register(`trofeos.${index}.club`)} />
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => trofeos.remove(index)}>
                                <Trash2 className="h-4 w-4 mr-1" /> Quitar
                            </Button>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={() => trofeos.append({ nombre: '', anio: new Date().getFullYear(), club: '' })}>
                        <Plus className="h-4 w-4 mr-1" /> Agregar trofeo
                    </Button>
                </CardContent>
            </Card>

            {/* IMAGENES DEL JUGADOR (MÚLTIPLES IMÁGENES LOCALES Y/O URLS OPCIONALES) */}
            <Card>
                <CardHeader>
                    <CardTitle>Imágenes del jugador</CardTitle>
                    <CardDescription>
                        Podés seleccionar múltiples archivos de imagen locales desde tu equipo y/o ingresar URLs opcionales.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* BOTÓN PARA SUBIR MÚLTIPLES ARCHIVOS LOCALES */}
                    <div className="p-4 border-2 border-dashed rounded-lg bg-muted/20 text-center space-y-3">
                        <div className="flex justify-center text-muted-foreground">
                            <Upload className="h-8 w-8 opacity-60" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Subir imágenes desde tu equipo</p>
                            <p className="text-xs text-muted-foreground">Podés seleccionar múltiples fotos a la vez (PNG, JPG, WEBP)</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => inputFotosRef.current?.click()}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Seleccionar archivos locales
                        </Button>
                        <input
                            ref={inputFotosRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={manejarFotosLocales}
                        />
                    </div>

                    {/* GRID DE PREVISUALIZACIÓN DE FOTOS LOCALES SELECCIONADAS */}
                    {fotosLocales.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Fotos locales preparadas para subir ({fotosLocales.length})
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {fotosLocales.map((foto) => (
                                    <div key={foto.id} className="relative group h-28 rounded-md border overflow-hidden bg-white shadow-sm">
                                        <Image src={foto.preview} alt={foto.file.name} fill className="object-cover" unoptimized />
                                        <button
                                            type="button"
                                            onClick={() => quitarFotoLocal(foto.id)}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                                            title="Eliminar foto"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate">
                                            {foto.file.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* GRID DE PREVISUALIZACIÓN DE IMÁGENES GUARDADAS */}
                    {imagenes.fields.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Fotos actuales / cargadas por URL ({imagenes.fields.length})
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {imagenes.fields.map((field, index) => {
                                    const urlVal = watch(`imagenes.${index}.url`);
                                    return (
                                        <div key={field.id} className="relative group h-28 rounded-md border overflow-hidden bg-white shadow-sm flex flex-col">
                                            {urlVal ? (
                                                <Image src={urlVal} alt={`Foto ${index + 1}`} fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">Sin URL</div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => imagenes.remove(index)}
                                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity z-10"
                                                title="Eliminar foto"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* LISTADO OPCIONAL DE INPUTS DE URL DE IMÁGENES */}
                    <div className="space-y-3 pt-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => imagenes.append({ url: '' })}>
                            <Plus className="h-4 w-4 mr-1" /> Agregar campo de URL web opcional
                        </Button>
                        <CampoError mensaje={errors.imagenes?.root?.message || (errors.imagenes as any)?.message} />
                    </div>
                </CardContent>

                <Separator />

                <CardFooter className="flex flex-col items-stretch gap-3 pt-6">
                    <CampoError mensaje={errorServidor || undefined} />
                    {estadoSubida && (
                        <p className="text-sm text-center text-primary font-medium animate-pulse">{estadoSubida}</p>
                    )}
                    <Button type="submit" disabled={enviando} size="lg">
                        {enviando ? (estadoSubida || 'Guardando...') : esEdicion ? 'Guardar cambios' : 'Crear jugador'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
