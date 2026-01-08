
import Link from 'next/link';
import { getRaffleById, getTicketsByRaffleId } from '@/services/raffleService';
import TicketManagementTable from '@/components/dashboard/TicketManagementTable';
import RaffleMetrics from '@/components/dashboard/RaffleMetrics';

interface PageProps {
    params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function DashboardRafflePage({ params }: PageProps) {
    const { id } = await params;
    const raffle = await getRaffleById(id);
    const tickets = await getTicketsByRaffleId(id);

    if (!raffle) {
        return <div className="p-8 text-center text-red-500">Rifa no encontrada</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="text-sm text-gold hover:underline mb-2 inline-block">
                        ← Volver al Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-white">{raffle.title}</h1>
                        <Link
                            href={`/dashboard/raffle/${raffle.id}/edit`}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                            title="Editar Rifa"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </Link>
                    </div>
                    <p className="text-foreground/60 text-sm">
                        Sorteo: {new Date(raffle.endDate).toLocaleDateString('es-MX', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <RaffleMetrics raffle={raffle} tickets={tickets} />

            {/* Tickets Table */}
            <TicketManagementTable initialTickets={tickets} />
        </div>
    );
}
