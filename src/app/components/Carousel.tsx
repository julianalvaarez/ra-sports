'use client'
import { Jugador } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay"

export function CarouselPlayers({ players }: { players: Jugador[] }) {
    return (
        <Carousel className="w-full max-w-7xl p-5 " aria-label="Jugadores representados" plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]} opts={{
            align: "start",
            loop: true,
        }}>
            <CarouselContent>
                {players.map((j: Jugador) => (
                    <CarouselItem key={j.id} className="md:basis-1/3 sm:basis-1/2 lg:basis-1/4">
                        <Link href={`/jugadores/${j.id}`} className="flex h-full flex-col items-center justify-center gap-2 border p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                            <div className="w-full  ">
                                {j.foto_principal ? (
                                    <Image
                                        src={j.foto_principal}
                                        alt={`Foto de ${j.nombre}`}
                                        className="w-full h-full object-cover"
                                        width={150}
                                        height={150}
                                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
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
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white cursor-pointer text-black hover:bg-gray-200" />
            <CarouselNext className="bg-white cursor-pointer text-black hover:bg-gray-200" />
        </Carousel>
    )
}