import { Ticket, Raffle } from '@/types';

interface RaffleMetricsProps {
    raffle: Raffle;
    tickets: Ticket[];
}

export default function RaffleMetrics({ raffle, tickets }: RaffleMetricsProps) {
    // Calculate metrics
    const paidTickets = tickets.filter(t => t.status === 'paid');
    const pendingTickets = tickets.filter(t => t.status === 'pending');
    const rejectedTickets = tickets.filter(t => t.status === 'rejected');

    const confirmedRevenue = paidTickets.reduce((sum, t) => sum + t.totalAmount, 0);
    const pendingRevenue = pendingTickets.reduce((sum, t) => sum + t.totalAmount, 0);

    const numbersSold = raffle.takenNumbers.length;
    const numbersAvailable = raffle.totalNumbers - numbersSold;
    const progressPercent = Math.round((numbersSold / raffle.totalNumbers) * 100);

    // Days until draw
    const now = new Date();
    const endDate = new Date(raffle.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const isExpired = endDate < now;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {/* Numbers Sold / Total */}
            <div className="bg-surface border border-white/10 rounded-xl p-4 hover:border-gold/30 transition-all">
                <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Números Vendidos</p>
                <p className="text-2xl font-bold text-gold">{numbersSold}</p>
                <p className="text-xs text-foreground/40 mt-1">de {raffle.totalNumbers} ({progressPercent}%)</p>
                <div className="h-1.5 bg-background rounded-full mt-2 overflow-hidden">
                    <div
                        className="h-full bg-gold transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Paid Tickets */}
            <div className="bg-surface border border-white/10 rounded-xl p-4 hover:border-emerald/30 transition-all">
                <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Pagados</p>
                <p className="text-2xl font-bold text-emerald">{paidTickets.length}</p>
                <p className="text-xs text-foreground/40 mt-1">tickets confirmados</p>
            </div>

            {/* Pending Tickets */}
            <div className="bg-surface border border-white/10 rounded-xl p-4 hover:border-orange-500/30 transition-all relative">
                <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Pendientes</p>
                <p className={`text-2xl font-bold ${pendingTickets.length > 0 ? 'text-orange-400' : 'text-white'}`}>
                    {pendingTickets.length}
                </p>
                <p className="text-xs text-foreground/40 mt-1">por verificar</p>
                {pendingTickets.length > 0 && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                )}
            </div>

            {/* Rejected Tickets */}
            <div className="bg-surface border border-white/10 rounded-xl p-4 hover:border-crimson/30 transition-all">
                <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Rechazados</p>
                <p className="text-2xl font-bold text-crimson">{rejectedTickets.length}</p>
                <p className="text-xs text-foreground/40 mt-1">no validados</p>
            </div>

            {/* Confirmed Revenue */}
            <div className="bg-surface border border-white/10 rounded-xl p-4 hover:border-emerald/30 transition-all">
                <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Ingresos Confirmados</p>
                <p className="text-2xl font-bold text-emerald">${confirmedRevenue.toLocaleString()}</p>
                <p className="text-xs text-foreground/40 mt-1">{raffle.currency}</p>
                {pendingRevenue > 0 && (
                    <p className="text-xs text-orange-400 mt-1">+ ${pendingRevenue.toLocaleString()} pendiente</p>
                )}
            </div>

            {/* Days Remaining */}
            <div className="bg-surface border border-white/10 rounded-xl p-4 hover:border-gold/30 transition-all">
                <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">
                    {isExpired ? 'Estado' : 'Días Restantes'}
                </p>
                {isExpired ? (
                    <>
                        <p className="text-2xl font-bold text-crimson">Finalizado</p>
                        <p className="text-xs text-foreground/40 mt-1">Sorteo cerrado</p>
                    </>
                ) : (
                    <>
                        <p className="text-2xl font-bold text-white">{daysRemaining}</p>
                        <p className="text-xs text-foreground/40 mt-1">
                            {daysRemaining === 0 ? '¡Sorteo hoy!' : daysRemaining === 1 ? 'día' : 'días'}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
