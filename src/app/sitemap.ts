import type { MetadataRoute } from 'next';
import { obtenerJugadoresResumen } from '@/lib/jugadores.service';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const jugadores = await obtenerJugadoresResumen();
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
        { url: `${siteUrl}/profesionales`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${siteUrl}/juveniles`, changeFrequency: 'weekly', priority: 0.8 },
    ];

    return [
        ...staticRoutes,
        ...jugadores.map((jugador) => ({
            url: `${siteUrl}/jugadores/${jugador.id}`,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
            lastModified: jugador.updated_at ? new Date(jugador.updated_at) : undefined,
        })),
    ];
}
