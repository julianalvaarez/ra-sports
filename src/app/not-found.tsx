import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">R.A Sports</p>
            <h1 className="mt-4 text-5xl font-bold text-slate-900">404</h1>
            <p className="mt-4 max-w-md text-lg text-slate-600">
                La página o el jugador que buscas no existe o ya no está disponible.
            </p>
            <Link
                href="/"
                className="mt-8 inline-flex min-h-11 items-center justify-center bg-[#0d1d34] px-6 py-3 font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
                Volver al inicio
            </Link>
        </main>
    );
}
