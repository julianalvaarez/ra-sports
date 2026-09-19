

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Administrador',
    description: 'Panel interno de gestión de jugadores de R.A Sports.',
    robots: { index: false, follow: false },
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-900 text-white">
            <header className="bg-gray-800 px-8 py-4 text-white">
                <h1 className="text-2xl font-bold">Administrador R.A Sports</h1>
            </header>
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
