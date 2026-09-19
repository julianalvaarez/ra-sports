import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerJugadorCompleto } from "@/lib/jugadores.service";
import { JugadorPageClient } from "@/app/components/JugadorPageClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const jugador = await obtenerJugadorCompleto(id);

    if (!jugador) {
        return {
            title: 'Jugador no encontrado - RA Sports - Representacion de Futbolistas',
            description: 'Perfil no disponible en R.A Sports',
        };
    }

    const imageUrl = jugador.imagenes?.[0] || '/rasports.jpg';
    const title = `${jugador.nombre} - RA Sports - Representacion de Futbolistas`;
    const description = `Perfil de ${jugador.nombre}, ${jugador.posicion_principal}${jugador.categoria ? ` · ${jugador.categoria}` : ''}.`;

    return {
        title,
        description,
        alternates: { canonical: `/jugadores/${id}` },
        openGraph: {
            type: 'website',
            locale: 'es_ES',
            siteName: 'R.A Sports',
            title,
            description,
            url: `/jugadores/${id}`,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: `${jugador.nombre} - RA Sports` }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function JugadorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const jugador = await obtenerJugadorCompleto(id);

    if (!jugador) {
        notFound();
    }

    return <JugadorPageClient jugador={jugador} />;
}
