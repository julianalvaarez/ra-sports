import { obtenerJugadoresResumen } from "@/lib/jugadores.service";
import { Jugador } from "@/types";
import { HomePageClient } from "./components/HomePageClient";

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
      <HomePageClient jugadores={jugadores} />
    </>
  )
}

