"use client";

import React, { forwardRef } from "react";
import { JugadorCompleto } from "@/types";
import { Calendar, User, Footprints, Shield, ExternalLink, Globe, Award, Play } from "lucide-react";

function calcularEdad(fechaNacimiento: string): number | null {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento);
    if (isNaN(nacimiento.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

interface JugadorPdfTemplateProps {
    jugador: JugadorCompleto;
}

export const JugadorPdfTemplate = forwardRef<HTMLDivElement, JugadorPdfTemplateProps>(
    ({ jugador }, ref) => {
        const edad = jugador.fecha_nacimiento ? calcularEdad(jugador.fecha_nacimiento) : null;

        const trayectoriaOrdenada = jugador.trayectoria
            ? [...jugador.trayectoria].sort((a, b) => a.anio_desde - b.anio_desde)
            : [];

        const clubActual = jugador.trayectoria?.find((t) => t.es_actual) || jugador.trayectoria?.[jugador.trayectoria.length - 1];

        // Obtener URL absoluta para imágenes
        const getFullUrl = (url: string | null | undefined) => {
            if (!url) return undefined;
            if (url.startsWith("http://") || url.startsWith("https://")) return url;
            if (typeof window !== "undefined") {
                return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
            }
            return url;
        };

        const primerNombre = jugador.nombre.split(" ")[0] || "";
        const segundoNombre = jugador.nombre.split(" ").slice(1).join(" ") || "";

        return (
            <div
                ref={ref}
                className="w-212.5 bg-slate-50 text-slate-900 font-sans p-6 space-y-6 box-border text-left"
                style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
                {/* CABECERA BRANDING RA SPORTS */}
                <div className="bg-[#0d1d34] text-white p-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <img
                            src={getFullUrl("/blanco.png")}
                            alt="R.A Sports"
                            className="w-12 h-12 object-contain"
                            crossOrigin="anonymous"
                        />
                        <div>
                            <h2 className="text-xl font-bold tracking-wide text-white leading-none">R.A SPORTS</h2>
                            <p className="text-xs text-blue-200 mt-1">Agencia de Representación de Jugadores de Fútbol</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-block text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 bg-blue-600 text-white">
                            Ficha Oficial
                        </span>
                    </div>
                </div>

                {/* 1. SECCIÓN PRINCIPAL: IZQUIERDA FICHA / DERECHA BOTÓN VIDEO */}
                <div className="grid grid-cols-12 gap-6 items-stretch">
                    {/* COLUMNA IZQUIERDA: FICHA TÉCNICA DEL JUGADOR */}
                    <div className="col-span-6 bg-white border border-slate-200 p-5 shadow-xs space-y-5 flex flex-col justify-between">
                        <div>
                            {/* FOTOS Y CABECERA DEL PERFIL */}
                            <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
                                <div className="relative w-28 h-36 shrink-0 bg-slate-100 border border-slate-200 overflow-hidden shadow-inner">
                                    {jugador.imagenes && jugador.imagenes[0] ? (
                                        <img
                                            src={getFullUrl(jugador.imagenes[0])}
                                            alt={jugador.nombre}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sin Foto</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div>
                                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 mb-1">
                                            {jugador.categoria}
                                        </span>
                                        <h1 className="text-2xl flex flex-col text-slate-900 leading-tight">
                                            <span className="font-light text-lg">{primerNombre}</span>
                                            <span className="font-bold">{segundoNombre}</span>
                                        </h1>
                                    </div>

                                    {clubActual && (
                                        <div className="flex items-center gap-2 pt-1">
                                            {clubActual.club_escudo ? (
                                                <div className="w-7 h-7 shrink-0">
                                                    <img
                                                        src={getFullUrl(clubActual.club_escudo)}
                                                        alt={clubActual.club}
                                                        className="w-full h-full object-contain"
                                                        crossOrigin="anonymous"
                                                    />
                                                </div>
                                            ) : (
                                                <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-slate-500 font-medium">Club Actual</p>
                                                <p className="text-xs font-semibold text-slate-800">{clubActual.club}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DATOS PRINCIPALES CON ÍCONOS */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="p-2.5 bg-slate-50 col-span-2 border border-slate-100 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-amber-100 text-amber-700 shrink-0">
                                        <Globe className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-slate-500 font-medium">Pasaporte</p>
                                        <p className="text-xs font-bold text-slate-800 ">
                                            {jugador.pasaporte ? `Argentina / ${jugador.pasaporte}` : "No posee"}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-2.5 bg-slate-50 col-span-2 border border-slate-100 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-blue-100 text-blue-600 shrink-0">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-slate-500 font-medium">Posición Principal</p>
                                        <p className="text-xs font-bold text-slate-800">{jugador.posicion_principal}</p>
                                    </div>
                                </div>

                                {jugador.posicion_secundaria && (
                                    <div className="p-2.5 bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                                        <div className="p-1.5 bg-slate-200 text-slate-600 shrink-0">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-500 font-medium">Pos. Secundaria</p>
                                            <p className="text-xs font-semibold text-slate-800">{jugador.posicion_secundaria}</p>
                                        </div>
                                    </div>
                                )}

                                <div className={`p-2.5 bg-slate-50 border border-slate-100 flex items-start gap-2.5 ${jugador.posicion_secundaria ? '' : 'col-span-2'}`}>
                                    <div className="p-1.5 bg-blue-100 text-blue-600 shrink-0">
                                        <Calendar className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-slate-500 font-medium">Edad / Nacimiento</p>
                                        <p className="text-xs font-bold text-slate-800">
                                            {edad !== null ? `${edad} años` : "-"}
                                        </p>
                                        {jugador.fecha_nacimiento && (
                                            <p className="text-[10px] text-slate-500">{jugador.fecha_nacimiento}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-2.5 bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-blue-100 text-blue-600 shrink-0">
                                        <Footprints className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-slate-500 font-medium">Altura</p>
                                        <p className="text-xs font-bold text-slate-800">{jugador.altura_cm} cm</p>
                                    </div>
                                </div>

                                <div className="p-2.5 bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-blue-100 text-blue-600 shrink-0">
                                        <Footprints className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-slate-500 font-medium">Pie Hábil</p>
                                        <p className="text-xs font-bold text-slate-800 capitalize">{jugador.pie}</p>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* BOTÓN INTERACTIVO TRANSFERMARKT */}
                        {jugador.link_transfermarkt && (
                            <div className="pt-3">
                                <a
                                    href={jugador.link_transfermarkt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-slate-900 text-white font-medium text-xs shadow-xs text-center border border-slate-900"
                                >
                                    <span>Ver perfil en Transfermarkt</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        )}
                        {/* BOTÓN INTERACTIVO PARA IR AL VIDEO DE YOUTUBE / VIMEO */}
                        {jugador.link_video_resumen ? (
                            <div>
                                <a
                                    href={jugador.link_video_resumen}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-red-600 text-white font-bold text-xs shadow-sm text-center border border-red-600"
                                >
                                    <Play className="w-4 h-4 fill-white" />
                                    <span>Ver Video Resumen</span>
                                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                                </a>
                            </div>
                        ) : (
                            <div className="p-3 bg-slate-100 text-slate-500 text-xs text-center font-medium">
                                No hay video de resumen disponible.
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: SECCIÓN VIDEO (REMPLAZANDO REPRODUCTOR CON BOTÓN INTERACTIVO) */}
                    <div className="col-span-6 bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">

                        {jugador.trofeos && jugador.trofeos.length > 0 && (
                            <div className="bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                    <div className="p-1.5 bg-amber-100 text-amber-700">
                                        <Award className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-base font-bold text-slate-900">Logros</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {jugador.trofeos.map((t, idx) => (
                                        <div key={idx} className="p-3 border border-slate-100 bg-slate-50 flex items-center gap-2.5">
                                            <div className="p-1.5 bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900">{t.trofeo}</p>
                                                <p className="text-[10px] text-slate-500">
                                                    {t.club ? `${t.club} (${t.anio})` : `Año ${t.anio}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* 2. LOGROS / PALMARÉS */}


                {/* 3. TRAYECTORIA DEPORTIVA */}
                {trayectoriaOrdenada.length > 0 && (
                    <div className="bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <div className="p-1.5 bg-blue-100 text-blue-600">
                                <Footprints className="w-4 h-4" />
                            </div>
                            <h2 className="text-base font-bold text-slate-900">Trayectoria Deportiva</h2>
                        </div>

                        <div className="flex items-center flex-wrap gap-3">
                            {trayectoriaOrdenada.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-2.5 p-2.5 border text-xs ${item.es_actual
                                        ? "bg-blue-50/70 border-blue-200 font-semibold"
                                        : "bg-slate-50 border-slate-200"
                                        }`}
                                >
                                    {item.club_escudo ? (
                                        <img
                                            src={getFullUrl(item.club_escudo)}
                                            alt={item.club}
                                            className="w-6 h-6 object-contain shrink-0"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-bold text-slate-800 leading-tight">{item.club}</p>
                                        <p className="text-[10px] text-slate-500">
                                            {item.anio_desde} {item.es_actual ? "- Actualidad" : item.anio_hasta ? `- ${item.anio_hasta}` : ""}
                                            {item.club_pais ? ` (${item.club_pais})` : ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                {/* PIE DE PÁGINA BRANDING */}
                <div className="bg-[#0d1d34] text-white p-4 text-center text-xs flex items-center justify-between border-t border-blue-400/20">
                    <div className="flex items-center gap-2">
                        <img
                            src={getFullUrl("/blanco.png")}
                            alt="Logo"
                            className="w-6 h-6 object-contain"
                            crossOrigin="anonymous"
                        />
                        <span className="font-semibold text-white">R.A Sports</span>
                    </div>
                    <p className="text-blue-100 text-[11px]">Contacto: ro-1312@hotmail.com</p>
                </div>
            </div>
        );
    }
);

JugadorPdfTemplate.displayName = "JugadorPdfTemplate";
