import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerJugadorCompleto } from "@/lib/jugadores.service";
import { JugadorPageClient } from "@/app/components/JugadorPageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rasports.agency';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const jugador = await obtenerJugadorCompleto(id);

    if (!jugador) {
        return {
            title: 'Jugador no encontrado - RA Sports - Representación de Futbolistas',
            description: 'Perfil de futbolista no disponible en R.A Sports.',
        };
    }

    const imageUrl = jugador.imagenes?.[0] || `${siteUrl}/rasports.jpg`;
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;
    const pageUrl = `${siteUrl}/jugadores/${id}`;
    const title = `${jugador.nombre} - ${jugador.posicion_principal} | R.A Sports`;
    const description = `Perfil deportivo y trayectorias de ${jugador.nombre}, ${jugador.posicion_principal}${jugador.categoria ? ` (${jugador.categoria})` : ''}. Agencia de representación R.A Sports.`;

    return {
        title,
        description,
        alternates: { canonical: pageUrl },
        openGraph: {
            type: 'profile',
            locale: 'es_ES',
            siteName: 'R.A Sports',
            title,
            description,
            url: pageUrl,
            images: [{ url: fullImageUrl, width: 1200, height: 630, alt: `${jugador.nombre} - R.A Sports` }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [fullImageUrl],
        },
    };
}

export default async function JugadorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const jugador = await obtenerJugadorCompleto(id);

    if (!jugador) {
        notFound();
    }

    const pageUrl = `${siteUrl}/jugadores/${id}`;
    const imageUrl = jugador.imagenes?.[0] ? (jugador.imagenes[0].startsWith('http') ? jugador.imagenes[0] : `${siteUrl}${jugador.imagenes[0]}`) : `${siteUrl}/rasports.jpg`;

    // Schema.org Structured Data (Person / Athlete) para SEO enriquecido en Google
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: jugador.nombre,
        url: pageUrl,
        image: imageUrl,
        jobTitle: `Futbolista (${jugador.posicion_principal})`,
        description: `Perfil profesional de ${jugador.nombre}, futbolista ${jugador.categoria || 'profesional'} representado por R.A Sports.`,
        knowsAbout: ['Fútbol Profesional', 'Deporte de Alto Rendimiento', jugador.posicion_principal],
        worksFor: jugador.trayectoria?.[0]?.club ? {
            '@type': 'SportsTeam',
            name: jugador.trayectoria[0].club,
        } : undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <JugadorPageClient jugador={jugador} />
        </>
    );
}
