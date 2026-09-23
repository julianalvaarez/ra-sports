"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { YouTubeEmbed } from '@next/third-parties/google';
import { Calendar, User, Footprints, Shield, ExternalLink, Globe, Award, ArrowLeft, Download } from "lucide-react";
import { TrayectoriaTimeline, GaleriaJugador } from "@/app/components/JugadorDetalleComponents";
import { JugadorPdfTemplate } from "@/app/components/JugadorPdfTemplate";
import { exportarFichaJugadorPdf } from "@/lib/pdf.service";
import { getIdYoutube } from "@/lib/getIdsVideos";
import { JugadorCompleto } from "@/types";
import { FadeIn, StaggerContainer, StaggerItem } from "@/app/components/motion";

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

export function JugadorPageClient({ jugador }: { jugador: JugadorCompleto }) {
    const router = useRouter();
    const [generandoPdf, setGenerandoPdf] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);
    const photoContainerRef = useRef<HTMLDivElement>(null);

    // Parallax suave en la imagen del jugador al scrollear
    const { scrollYProgress: photoScrollProgress } = useScroll({
        target: photoContainerRef,
        offset: ["start start", "end start"],
    });
    const photoY = useTransform(photoScrollProgress, [0, 1], ["0%", "15%"]);

    const handleDescargarFicha = async () => {
        if (!pdfRef.current || !jugador) return;
        setGenerandoPdf(true);
        try {
            await exportarFichaJugadorPdf(pdfRef.current, jugador.nombre);
        } catch (error) {
            console.error("Error al generar PDF:", error);
        } finally {
            setGenerandoPdf(false);
        }
    };

    const videoConfig = (() => {
        if (!jugador?.link_video_resumen) return null;
        const url = jugador.link_video_resumen;
        const ytId = getIdYoutube(url);
        if (ytId) {
            return { type: 'youtube', id: ytId };
        }
        return { type: 'direct', url };
    })();

    const edad = jugador?.fecha_nacimiento ? calcularEdad(jugador.fecha_nacimiento) : null;

    const trayectoriaOrdenada = jugador?.trayectoria
        ? [...jugador.trayectoria].sort((a, b) => a.anio_desde - b.anio_desde)
        : [];

    const clubActual = jugador?.trayectoria?.find((t) => t.es_actual) || jugador?.trayectoria?.[jugador.trayectoria.length - 1];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Botones de Navegación y Acción */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex items-center justify-between pt-2"
                >
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2.5 px-4 py-2 text-sm font-bold border-2 transition-all cursor-pointer bg-white hover:bg-slate-100 active:scale-95"
                        aria-label="Volver a la página anterior"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleDescargarFicha}
                        disabled={generandoPdf}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold hover:bg-slate-800 bg-slate-900 text-white border border-slate-900 transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-95"
                    >
                        {generandoPdf ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Generando Ficha...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                <span>Descargar Ficha</span>
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Grid Principal: Info Perfil + Highlights Video */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Tarjeta Perfil del Jugador */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="lg:col-span-6 xl:col-span-5 bg-white border border-slate-200 rounded-none p-6 shadow-sm space-y-6"
                    >
                        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                            <div
                                ref={photoContainerRef}
                                className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 bg-slate-100 rounded-none overflow-hidden shadow-inner border border-slate-200"
                            >
                                {jugador.imagenes && jugador.imagenes[0] ? (
                                    <motion.div style={{ y: photoY }} className="w-full h-full relative">
                                        <Image
                                            src={jugador.imagenes[0]}
                                            alt={jugador.nombre}
                                            fill
                                            sizes="(max-width: 640px) 112px, 128px"
                                            className="object-cover"
                                            priority
                                        />
                                    </motion.div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sin Foto</div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                                <div>
                                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-none bg-blue-50 text-blue-700 border border-blue-100 mb-1">
                                        {jugador.categoria}
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl flex flex-col text-slate-900 leading-tight truncate">
                                        <span className="font-light text-xl sm:text-2xl">{jugador.nombre.split(' ')[0]}</span>
                                        <span className="font-bold">{jugador.nombre.split(' ').slice(1).join(' ')}</span>
                                    </h1>
                                </div>

                                {clubActual && (
                                    <div className="flex items-center gap-2 pt-1">
                                        {clubActual.club_escudo ? (
                                            <div className="relative w-8 h-8 shrink-0">
                                                <Image
                                                    src={clubActual.club_escudo}
                                                    alt={clubActual.club}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500 font-medium">Club Actual</p>
                                            <p className="text-sm font-semibold text-slate-800 truncate">{clubActual.club}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Grid de Atributos con Animación Staggered */}
                        <StaggerContainer className="grid grid-cols-2 gap-4">
                            <StaggerItem className="p-3 rounded-none bg-slate-50 border col-span-2 border-slate-100 flex items-start gap-3">
                                <div className="p-2 rounded-none bg-blue-100 text-blue-600 shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 font-medium">Posición Principal</p>
                                    <p className="text-sm font-bold text-slate-800 truncate">{jugador.posicion_principal}</p>
                                </div>
                            </StaggerItem>

                            {jugador.posicion_secundaria && (
                                <StaggerItem className="p-3 rounded-none bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <div className="p-2 rounded-none bg-slate-200 text-slate-600 shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500 font-medium">Pos. Secundaria</p>
                                        <p className="text-sm font-semibold text-slate-800 truncate">{jugador.posicion_secundaria}</p>
                                    </div>
                                </StaggerItem>
                            )}

                            <StaggerItem className="p-3 rounded-none bg-slate-50 border border-slate-100 flex items-start gap-3">
                                <div className="p-2 rounded-none bg-blue-100 text-blue-600 shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 font-medium">Edad</p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {edad !== null ? `${edad} años` : '-'}
                                    </p>
                                    {jugador.fecha_nacimiento && (
                                        <p className="text-[11px] text-slate-500 truncate">{jugador.fecha_nacimiento}</p>
                                    )}
                                </div>
                            </StaggerItem>

                            <StaggerItem className="p-3 rounded-none bg-slate-50 border border-slate-100 flex items-start gap-3">
                                <div className="p-2 rounded-none bg-blue-100 text-blue-600 shrink-0">
                                    <Footprints className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 font-medium">Altura</p>
                                    <p className="text-sm font-bold text-slate-800">{jugador.altura_cm} cm</p>
                                </div>
                            </StaggerItem>

                            <StaggerItem className="p-3 rounded-none bg-slate-50 border border-slate-100 flex items-start gap-3">
                                <div className="p-2 rounded-none bg-blue-100 text-blue-600 shrink-0">
                                    <Footprints className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 font-medium">Pie Hábil</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{jugador.pie}</p>
                                </div>
                            </StaggerItem>

                            <StaggerItem className="p-3 rounded-none bg-slate-50 border border-slate-100 flex items-start gap-3">
                                <div className="p-2 rounded-none bg-amber-100 text-amber-700 shrink-0">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 font-medium">Pasaporte</p>
                                    <p className="text-sm font-bold text-slate-800 truncate">
                                        {jugador.pasaporte ? `Argentino/${jugador.pasaporte}` : 'Argentino'}
                                    </p>
                                </div>
                            </StaggerItem>
                        </StaggerContainer>

                        {jugador.link_transfermarkt && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="pt-2"
                            >
                                <a
                                    href={jugador.link_transfermarkt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-none bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-sm active:scale-98"
                                >
                                    <span>Ver perfil en Transfermarkt</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Sección Video Highlights */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                        className="lg:col-span-6 xl:col-span-7 bg-white border border-slate-200 rounded-none p-4 sm:p-6 shadow-sm space-y-4"
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Video Resumen / Highlights</h2>
                        </div>

                        {videoConfig ? (
                            <div className="w-full aspect-video bg-black rounded-none overflow-hidden relative shadow-md">
                                {videoConfig.type === 'youtube' && videoConfig.id && (
                                    <YouTubeEmbed videoid={videoConfig.id} params="controls=1&autoplay=0" />
                                )}
                                {videoConfig.type === 'direct' && (
                                    <video controls className="w-full h-full object-contain">
                                        <source src={videoConfig.url} />
                                        Tu navegador no soporta el reproductor de video.
                                    </video>
                                )}
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-slate-100 rounded-none flex flex-col items-center justify-center gap-2 text-slate-400 p-6 text-center">
                                <p className="text-sm font-medium text-slate-600">No hay video de resumen disponible para este jugador.</p>
                            </div>
                        )}
                    </motion.div>
                </section>

                {/* Sección Logros */}
                {jugador.trofeos && jugador.trofeos.length > 0 && (
                    <FadeIn direction="up" className="w-full">
                        <section className="bg-white border border-slate-200 rounded-none p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="p-2 bg-amber-100 text-amber-700 rounded-none">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Logros</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {jugador.trofeos.map((t, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.35, delay: idx * 0.08 }}
                                        className="p-4 rounded-none border border-slate-100 bg-slate-50 flex items-center gap-3"
                                    >
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100 shrink-0">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{t.trofeo}</p>
                                            <p className="text-xs text-slate-500">
                                                {t.club ? `${t.club} (${t.anio})` : `Año ${t.anio}`}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </FadeIn>
                )}

                {/* Sección Trayectoria Deportiva */}
                <FadeIn direction="up" className="w-full">
                    <section className="bg-white border border-slate-200 rounded-none p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-none">
                                <Footprints className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Trayectoria Deportiva</h2>
                        </div>

                        <TrayectoriaTimeline trayectoria={trayectoriaOrdenada} />
                    </section>
                </FadeIn>

                {/* Sección Galería */}
                {jugador.imagenes && jugador.imagenes.length > 0 && (
                    <FadeIn direction="up" className="w-full">
                        <GaleriaJugador imagenes={jugador.imagenes} nombreJugador={jugador.nombre} />
                    </FadeIn>
                )}
            </div>

            <div className="fixed top-0 left-[-9999px] -z-50 opacity-0 pointer-events-none">
                {jugador && <JugadorPdfTemplate ref={pdfRef} jugador={jugador} />}
            </div>
        </main>
    );
}
