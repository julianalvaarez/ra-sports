'use client';

import { useEffect } from 'react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Mantener el error fuera de la interfaz y permitir diagnóstico en producción.
        console.error('Error inesperado en la aplicación');
    }, []);

    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center" role="alert" aria-live="assertive">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Error temporal</p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">No pudimos cargar esta página</h1>
            <p className="mt-3 max-w-md text-slate-600">Inténtalo de nuevo. Si el problema continúa, vuelve más tarde.</p>
            <button
                type="button"
                onClick={() => reset()}
                className="mt-8 inline-flex min-h-11 items-center justify-center bg-[#0d1d34] px-6 py-3 font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
                Reintentar
            </button>
        </main>
    );
}
