import { obtenerJugadoresResumen } from "@/lib/jugadores.service";
import { Jugador } from "@/types";
import { CarouselPlayers } from "./components/Carousel";
import { IoIosArrowRoundDown } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const jugadores: Jugador[] = await obtenerJugadoresResumen();
  console.log(jugadores)
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen text-white fondo bg-cover bg-center">
        <div className="flex flex-col items-center justify-center gap-7">
          <h1 className="text-5xl md:text-7xl font-serif font-extralight text-center ">Somos R.A Sport</h1>
          <a href="#profesionales" className="px-5 py-2 border flex gap-1 items-center transition-all duration-300 active:scale-95 active:opacity-80 hover:scale-105 hover:opacity-80">
            <span>Nuestros Jugadores</span><IoIosArrowRoundDown size={30} />
          </a>
        </div>
      </main>
      <section className="flex flex-col items-center justify-center gap-4 py-8 my-20">
        <span id="profesionales" className="flex items-center gap-6"><Image src="/azul.png" alt="RA.Sports Logo" width={40} height={40} /><Link href={'/profesionales'} className="text-3xl cursor-pointer md:text-4xl font-semibold">Profesionales</Link><Image src="/azul.png" alt="RA.Sports Logo" width={40} height={40} /></span>
        <CarouselPlayers players={jugadores.filter(jugador => jugador.categoria === "profesional")} />
        <hr className="m-10 w-full" />
        <span id="juveniles" className="flex items-center gap-6"><Image src="/azul.png" alt="RA.Sports Logo" width={40} height={40} /><Link href={'/juveniles'} className="text-3xl cursor-pointer md:text-4xl font-semibold">Juveniles</Link><Image src="/azul.png" alt="RA.Sports Logo" width={40} height={40} /></span>
        <CarouselPlayers players={jugadores.filter(jugador => jugador.categoria === "juvenil").sort((a, b) => b.nombre.localeCompare(a.nombre))} />

      </section>
    </>
  )
}
