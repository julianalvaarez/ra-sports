import { obtenerJugadoresResumen } from "@/lib/jugadores.service";
import { Jugador } from "@/types";
import { CarouselPlayers } from "./components/Carousel";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const jugadores: Jugador[] = await obtenerJugadoresResumen();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsOrganization',
            name: 'R.A Sports',
            url: siteUrl,
            logo: `${siteUrl}/azul.png`,
            description: 'Agencia de representación y desarrollo profesional de jugadores de fútbol.',
            sameAs: ['https://www.instagram.com/rodriealvarez/'],
          }),
        }}
      />
      <main className="flex flex-col items-center justify-center min-h-screen text-white fondo bg-cover bg-center">
        <div className="flex flex-col items-center justify-center gap-7">
          <h1 className="text-5xl md:text-7xl font-serif font-extralight text-center ">Somos R.A Sport</h1>
          <a href="#profesionales" className="px-5 py-2 border flex gap-1 items-center transition-all duration-300 active:scale-95 active:opacity-80 hover:scale-105 hover:opacity-80">
            <span>Nuestros Jugadores</span><ChevronDown size={30} aria-hidden="true" />
          </a>
        </div>
      </main>
      <section className="flex flex-col items-center justify-center gap-4 py-8 my-20">
        <div id="profesionales" className="flex items-center gap-6" aria-labelledby="titulo-profesionales"><Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" /><h2 id="titulo-profesionales" className="text-3xl md:text-4xl font-semibold"><Link href="/profesionales">Profesionales</Link></h2><Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" /></div>
        <CarouselPlayers players={jugadores.filter(jugador => jugador.categoria === "profesional")} />
        <hr className="m-10 w-full" />
        <div id="juveniles" className="flex items-center gap-6" aria-labelledby="titulo-juveniles"><Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" /><h2 id="titulo-juveniles" className="text-3xl md:text-4xl font-semibold"><Link href="/juveniles">Juveniles</Link></h2><Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" /></div>
        <CarouselPlayers players={jugadores.filter(jugador => jugador.categoria === "juvenil").sort((a, b) => b.nombre.localeCompare(a.nombre))} />

      </section>
    </>
  )
}
