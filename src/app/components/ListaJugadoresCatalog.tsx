'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Jugador } from '@/types';
import { JugadorCard } from './JugadorCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListaJugadoresCatalogProps {
    jugadores: Jugador[];
    categoria: 'profesional' | 'juvenil';
}

const ITEMS_POR_PAGINA = 8;

export function ListaJugadoresCatalog({ jugadores, categoria }: ListaJugadoresCatalogProps) {
    const [busqueda, setBusqueda] = useState('');
    const [posicionFiltro, setPosicionFiltro] = useState<string>('todas');
    const [pasaporteFiltro, setPasaporteFiltro] = useState<string>('todos');
    const [limiteCarga, setLimiteCarga] = useState(ITEMS_POR_PAGINA);

    const observerTarget = useRef<HTMLDivElement>(null);

    // Obtener posiciones únicas (de posicion_principal y posicion_secundaria)
    const opcionesPosiciones = useMemo(() => {
        const setPos = new Set<string>();
        jugadores.forEach((j) => {
            if (j.posicion_principal) setPos.add(j.posicion_principal.trim());
            if (j.posicion_secundaria) setPos.add(j.posicion_secundaria.trim());
            if (j.posicion) setPos.add(j.posicion.trim());
        });
        return Array.from(setPos).sort();
    }, [jugadores]);

    // Filtrar jugadores
    const jugadoresFiltrados = useMemo(() => {
        return jugadores.filter((j) => {
            // Filtro por Categoría
            if (j.categoria !== categoria) return false;

            // Filtro por Búsqueda de Nombre
            if (busqueda.trim() !== '') {
                const query = busqueda.toLowerCase().trim();
                const coincideNombre = j.nombre.toLowerCase().includes(query);
                const coincideClub = j.club_actual?.toLowerCase().includes(query);
                if (!coincideNombre && !coincideClub) return false;
            }

            // Filtro por Posición (principal o secundaria)
            if (posicionFiltro !== 'todas') {
                const pFiltro = posicionFiltro.toLowerCase();
                const posPrin = j.posicion_principal?.toLowerCase() || '';
                const posSec = j.posicion_secundaria?.toLowerCase() || '';
                const posGen = j.posicion?.toLowerCase() || '';

                const coincidePosicion =
                    posPrin.includes(pFiltro) ||
                    posSec.includes(pFiltro) ||
                    posGen.includes(pFiltro);

                if (!coincidePosicion) return false;
            }

            // Filtro por Pasaporte / Otra nacionalidad
            if (pasaporteFiltro !== 'todos') {
                const pasaporteNormalizado = j.pasaporte?.toLowerCase().trim() || '';

                if (pasaporteFiltro === 'con_pasaporte') {
                    const esComunitario =
                        pasaporteNormalizado.includes('Europa') ||
                        pasaporteNormalizado.includes('Europeo') ||
                        pasaporteNormalizado.includes('Italia') ||
                        pasaporteNormalizado.includes('Italiano') ||
                        pasaporteNormalizado.includes('España') ||
                        pasaporteNormalizado.includes('Español') ||
                        pasaporteNormalizado.includes('Espanol') ||
                        pasaporteNormalizado.includes('Comunitario') ||
                        pasaporteNormalizado.length > 0;

                    if (!esComunitario) return false;
                } else if (pasaporteFiltro === 'sin_pasaporte') {
                    if (pasaporteNormalizado !== '') return false;
                } else {
                    if (pasaporteNormalizado !== pasaporteFiltro.toLowerCase().trim()) return false;
                }
            }

            return true;
        });
    }, [jugadores, categoria, busqueda, posicionFiltro, pasaporteFiltro]);

    // Lazy loading mediante IntersectionObserver (Infinite Scroll)
    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setLimiteCarga((prev) => Math.min(prev + ITEMS_POR_PAGINA, jugadoresFiltrados.length));
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(element);
        return () => {
            if (element) observer.unobserve(element);
        };
    }, [jugadoresFiltrados.length]);

    const tieneFiltrosActivos = busqueda !== '' || posicionFiltro !== 'todas' || pasaporteFiltro !== 'todos';

    const limpiarFiltros = () => {
        setBusqueda('');
        setPosicionFiltro('todas');
        setPasaporteFiltro('todos');
    };

    const jugadoresVisibles = jugadoresFiltrados.slice(0, limiteCarga);

    return (
        <div className="space-y-8">
            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-4 md:p-6 space-y-4 bg-white/5 backdrop-blur-sm border border-slate-800 rounded-none shadow-sm"
            >
                <div className="grid grid-cols-1 md:flex gap-4">
                    {/* Búsqueda por Nombre */}
                    <div className="relative md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nombre o club..."
                            value={busqueda}
                            onChange={(e) => { setBusqueda(e.target.value); setLimiteCarga(ITEMS_POR_PAGINA); }}
                            className="pl-9 border-slate-700 placeholder:text-slate-400 focus:border-blue-500"
                        />
                    </div>

                    {/* Filtro por Posición (Principal o Secundaria) */}
                    <div>
                        <Select value={posicionFiltro} onValueChange={(value) => { setPosicionFiltro(value); setLimiteCarga(ITEMS_POR_PAGINA); }}>
                            <SelectTrigger className="border-slate-700">
                                <SelectValue placeholder="Filtrar por Posición" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-700">
                                <SelectItem value="todas">Todas las posiciones</SelectItem>
                                {opcionesPosiciones.map((pos) => (
                                    <SelectItem key={pos} value={pos}>
                                        {pos}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Resumen de resultados y reset de filtros */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm  pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                        <span>
                            Mostrando <strong >{jugadoresFiltrados.length}</strong> jugador{jugadoresFiltrados.length !== 1 ? 'es' : ''}
                        </span>
                    </div>

                    {tieneFiltrosActivos && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={limpiarFiltros}
                            className="border border-slate-700   cursor-pointer h-8 px-2"
                        >
                            <X className="h-3.5 w-3.5 mr-1" /> Limpiar filtros
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* CATÁLOGO DE CARDS CON ANIMACIÓN */}
            {jugadoresFiltrados.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 border border-dashed rounded-none bg-slate-900/40 text-slate-400 space-y-3"
                >
                    <p className="text-lg font-medium text-slate-300">No se encontraron jugadores que coincidan con la búsqueda.</p>
                    <p className="text-sm">Probá cambiando los filtros o el término ingresado.</p>
                    {tieneFiltrosActivos && (
                        <Button variant="outline" size="sm" onClick={limpiarFiltros} className="mt-2 border-slate-700">
                            Restablecer filtros
                        </Button>
                    )}
                </motion.div>
            ) : (
                <>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {jugadoresVisibles.map((jugador, index) => (
                                <motion.div
                                    key={jugador.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
                                >
                                    <JugadorCard jugador={jugador} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Target para Lazy Loading / Infinite Scroll */}
                    {limiteCarga < jugadoresFiltrados.length && (
                        <div ref={observerTarget} className="py-8 text-center">
                            <div className="inline-flex items-center gap-2 text-sm text-slate-400 animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                Cargando más jugadores...
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
