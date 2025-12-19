
import Link from 'next/link';
import { getRaffleById, getTicketsByRaffleId } from '@/services/raffleService';
import TicketManagementTable from '@/components/dashboard/TicketManagementTable';

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

    const totalRevenue = tickets
        .filter(t => t.status === 'paid' || t.status === 'pending') // Assuming pending counts towards potential revenue or change logic as needed
        .reduce((sum, t) => sum + t.totalAmount, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="text-sm text-gold hover:underline mb-2 inline-block">
                        ← Volver al Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white">{raffle.title}</h1>
                    <p className="text-foreground/60">{raffle.id}</p>
                </div>
                <div className="bg-surface border border-gold/30 rounded-xl p-4 flex gap-8">
                    <div>
                        <div className="text-foreground/60 text-sm">Total Tickets</div>
                        <div className="text-2xl font-bold text-white">{tickets.length}</div>
                    </div>
                    <div>
                        <div className="text-foreground/60 text-sm">Ingresos (Est.)</div>
                        <div className="text-2xl font-bold text-emerald">${totalRevenue.toLocaleString()} {raffle.currency}</div>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <TicketManagementTable initialTickets={tickets} />
        </div>
    );
}
