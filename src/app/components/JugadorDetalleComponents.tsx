"use client";

import Image from "next/image";
import { Shield, ChevronRight, X, ZoomIn } from "lucide-react";
import { TrayectoriaItemCompleto } from "@/types";
import { useState } from "react";

interface TrayectoriaTimelineProps {
    trayectoria: TrayectoriaItemCompleto[];
}

export function TrayectoriaTimeline({ trayectoria }: TrayectoriaTimelineProps) {
    if (!trayectoria || trayectoria.length === 0) {
        return <p className="text-sm text-slate-500">No se registran datos de trayectoria para este jugador.</p>;
    }

    return (
        <div>
            {/* TIMELINE HORIZONTAL (COMPUTADORAS) */}
            <div className="hidden md:block overflow-x-auto pb-6">
                <div className="flex items-center min-w-max px-4 pt-8">
                    {trayectoria.map((item, idx) => {
                        const esUltimo = idx === trayectoria.length - 1;
                        return (
                            <div key={idx} className="flex items-center">
                                {/* ITEM CLUB */}
                                <div className="flex flex-col items-center text-center w-48 relative group">
                                    {/* Insignia Año */}
                                    <span
                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-3 shadow-sm border ${item.es_actual
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}
                                    >
                                        {item.anio_desde} {item.es_actual ? '- Actualidad' : item.anio_hasta ? `- ${item.anio_hasta}` : ''}
                                    </span>

                                    {/* Punto con Escudo Redondo */}
                                    <div
                                        className={`w-14 h-14 rounded-full border-2 bg-white flex items-center justify-center p-2 shadow-md z-10 transition-transform group-hover:scale-110 overflow-hidden ${item.es_actual ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-300'
                                            }`}
                                    >
                                        {item.club_escudo ? (
                                            <div className="relative w-full h-full">
                                                <Image src={item.club_escudo} alt={item.club} fill className="object-contain" />
                                            </div>
                                        ) : (
                                            <Shield className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>

                                    {/* Nombre del Club y País */}
                                    <div className="mt-3 space-y-0.5">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.club}</p>
                                        {item.club_pais && <p className="text-xs text-slate-500">{item.club_pais}</p>}
                                    </div>
                                </div>

                                {/* Línea conectora */}
                                {!esUltimo && (
                                    <div className="w-20 h-0.5 bg-slate-200 relative -mt-8">
                                        <ChevronRight className="w-4 h-4 text-slate-300 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TIMELINE VERTICAL (MÓVILES) */}
            <div className="md:hidden relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {trayectoria.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                        {/* Punto indicador Redondo */}
                        <div
                            className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center shadow-sm z-10 ${item.es_actual ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-300'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${item.es_actual ? 'bg-blue-600' : 'bg-slate-400'}`} />
                        </div>

                        {/* Contenido del Club */}
                        <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-none flex items-center justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                                <span
                                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.es_actual ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    {item.anio_desde} {item.es_actual ? '- Actualidad' : item.anio_hasta ? `- ${item.anio_hasta}` : ''}
                                </span>
                                <p className="text-base font-bold text-slate-900 truncate">{item.club}</p>
                                {item.club_pais && <p className="text-xs text-slate-500">{item.club_pais}</p>}
                            </div>

                            {item.club_escudo && (
                                <div className="relative w-12 h-12 shrink-0 rounded-full border border-slate-200 bg-white p-1 overflow-hidden shadow-xs">
                                    <Image src={item.club_escudo} alt={item.club} fill className="object-contain" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface GaleriaJugadorProps {
    imagenes: string[];
    nombreJugador: string;
}

export function GaleriaJugador({ imagenes, nombreJugador }: GaleriaJugadorProps) {
    const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);

    if (!imagenes || imagenes.length === 0) return null;

    return (
        <section className="bg-white border border-slate-200 rounded-none p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Galería de Fotos</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagenes.map((img, idx) => (
                    <button
                        type="button"
                        key={idx}
                        onClick={() => setImagenSeleccionada(img)}
                        className="relative aspect-4/3 w-full bg-slate-100 border border-slate-200 overflow-hidden group cursor-pointer rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        aria-label={`Ampliar foto ${idx + 1} de ${nombreJugador}`}
                    >
                        <Image
                            src={img}
                            alt={`${nombreJugador} foto ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <ZoomIn className="w-6 h-6" />
                        </div>
                    </button>
                ))}
            </div>

            {/* MODAL / LIGHTBOX PARA VER FOTO COMPLETA */}
            {imagenSeleccionada && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto ampliada de ${nombreJugador}`}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setImagenSeleccionada(null)}
                >
                    <button
                        onClick={() => setImagenSeleccionada(null)}
                        className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 bg-slate-800/80 rounded-full transition-colors cursor-pointer"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div
                        className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={imagenSeleccionada}
                            alt={`${nombreJugador} foto ampliada`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
