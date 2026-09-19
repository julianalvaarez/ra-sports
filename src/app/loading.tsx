export default function Loading() {
    return (
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-20" aria-busy="true" aria-live="polite">
            <div className="w-full max-w-5xl space-y-6" role="status">
                <span className="sr-only">Cargando contenido</span>
                <div className="mx-auto h-10 w-64 animate-pulse bg-slate-200" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[4/5] animate-pulse bg-slate-100" />)}
                </div>
            </div>
        </main>
    );
}
