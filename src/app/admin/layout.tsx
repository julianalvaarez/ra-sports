

import Image from 'next/image';

export const metadata = {
    title: 'Administrador R.A Sports',
    description: 'Gestión de jugadores de fútbol',
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body className="flex min-h-screen flex-col bg-gray-900 text-white">
                <header className="bg-gray-800 py-4 px-8 text-white flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Administrador R.A Sports</h1>
                </header>
                <main className="flex-1 p-8">
                    {children}
                </main>

            </body>
        </html>
    );
}
