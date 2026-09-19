'use client';
import { Jugador } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface JugadorCardProps {
    jugador: Jugador;
}

export function JugadorCard({ jugador: j }: JugadorCardProps) {
    return (
        <Link href={`/jugadores/${j.id}`} className="block h-full cursor-pointer group">
            <div className="flex flex-col justify-between h-full p-4 border bg-card hover:border-primary transition-colors">
                <div className="w-full aspect-4/5 relative overflow-hidden bg-muted">
                    {j.foto_principal ? (
                        <Image
                            src={j.foto_principal}
                            alt={j.nombre}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover  group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                            Sin Foto
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-end w-full mt-3 gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="font-light text-2xl md:text-xl truncate">{j.nombre.split(' ')[0]}</p>
                        <p className="font-semibold text-3xl md:text-2xl mb-1 truncate">
                            {j.nombre.split(' ').slice(1).join(' ') || j.nombre.split(' ')[0]}
                        </p>
                        <p className="text-base font-light text-muted-foreground truncate">{j.posicion}</p>
                        {j.pasaporte && (
                            <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                                🌐 Pasaporte: {j.pasaporte}
                            </span>
                        )}
                    </div>
                    {j.club_actual_escudo && (
                        <div className="shrink-0 relative w-15 h-15">
                            <Image
                                src={j.club_actual_escudo}
                                alt={j.club_actual || 'Club actual'}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
