import JugadorForm from '@/components/jugador-form';

export const metadata = { title: 'Nuevo jugador' };

export default function NuevoJugadorPage() {
  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Nuevo jugador</h1>
      <p className="text-muted-foreground mb-6">Completá toda la información del jugador.</p>
      <JugadorForm />
    </div>
  );
}
