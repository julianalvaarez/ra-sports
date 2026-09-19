'use client'
import { Jugador } from "@/types";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { redirect } from "next/navigation";

export function CarouselPlayers({ players }: { players: Jugador[] }) {
    console.log(players)
    return (
        <Carousel plugins={[Autoplay({ delay: 2000, })]} className="w-full max-w-7xl p-5">
            <CarouselContent>
                {players.map((j: Jugador) => (
                    <CarouselItem key={j.id} className="md:basis-1/3 sm:basis-1/2 lg:basis-1/4 cursor-pointer " onClick={() => redirect(`/jugadores/${j.id}`)}>
                        <div className="flex flex-col items-center justify-center gap-2 p-4 border ">
                            <div className="w-full  ">
                                {j.foto_principal ? (
                                    <Image
                                        src={j.foto_principal}
                                        alt={j.club_actual || 'Club actual'}
                                        className="w-full h-full object-cover"
                                        width={150}
                                        height={150}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted" />
                                )}
                            </div>
                            <div className="flex justify-between w-full mt-3">
                                <div>
                                    <p className="font-light text-2xl md:text-xl">{j.nombre.split(' ')[0]}</p>
                                    <p className="font-semibold text-4xl md:text-3xl mb-1 ">{j.nombre.split(' ')[1]}</p>
                                    <p className="text-lg md:text-base font-light text-muted-foreground">{j.posicion}</p>
                                </div>
                                {j.club_actual_escudo && (
                                    <div >
                                        <Image
                                            src={j.club_actual_escudo}
                                            alt={j.club_actual || 'Club actual'}
                                            width={70}
                                            height={70}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext />
        </Carousel>
    )
}