import { getTicketById } from '@/services/raffleService';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function TicketStatusPage({ params }: PageProps) {
    const { id } = await params;
    const ticket = await getTicketById(id);

    if (!ticket) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-crimson mb-4">Ticket No Encontrado</h1>
                    <p className="text-foreground/60 mb-6">El ID de ticket que proporcionaste no existe o es inválido.</p>
                    <Link href="/" className="btn-casino px-6 py-3 rounded-lg inline-block">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = {
        pending: {
            label: 'Pendiente de Pago',
            color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            icon: '⏳',
            description: 'Tu ticket está reservado pero aún no hemos confirmado el pago. Una vez validado, recibirás una confirmación.'
        },
        paid: {
            label: '¡Pago Confirmado!',
            color: 'bg-emerald/20 text-emerald border-emerald/30',
            icon: '✅',
            description: '¡Excelente! Tu pago ha sido verificado. Ya estás participando en la rifa. ¡Buena suerte!'
        },
        rejected: {
            label: 'Pago Rechazado',
            color: 'bg-crimson/20 text-crimson border-crimson/30',
            icon: '🚫',
            description: 'Lamentablemente tu pago no pudo ser verificado. Los números han sido liberados para otros participantes.'
        }
    };

    const config = statusConfig[ticket.status];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-gold hover:underline text-sm mb-4 inline-block">
                        ← Volver al Inicio
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-white">Estado de tu Ticket</h1>
                </div>

                {/* Status Card */}
                <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Status Banner */}
                    <div className={`p-6 border-b ${config.color} text-center`}>
                        <div className="text-4xl mb-2">{config.icon}</div>
                        <h2 className="text-2xl font-bold">{config.label}</h2>
                        <p className="text-sm opacity-80 mt-2">{config.description}</p>
                    </div>

                    {/* Ticket Details */}
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-foreground/60 block mb-1">Rifa</label>
                                <div className="font-semibold text-gold">{ticket.raffleTitle}</div>
                            </div>
                            <div>
                                <label className="text-xs text-foreground/60 block mb-1">Fecha</label>
                                <div className="text-white">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <label className="text-xs text-foreground/60 block mb-1">Nombre</label>
                                <div className="text-white">{ticket.fullName}</div>
                            </div>
                            <div>
                                <label className="text-xs text-foreground/60 block mb-1">Total</label>
                                <div className="font-bold text-emerald">${ticket.totalAmount}</div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-foreground/60 block mb-2">Tus Números</label>
                            <div className="flex flex-wrap gap-2">
                                {ticket.numbers.map(num => (
                                    <span
                                        key={num}
                                        className="bg-gold/10 border border-gold/30 text-gold px-3 py-1 rounded-lg font-mono font-bold"
                                    >
                                        {num}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 text-center">
                            <p className="text-xs text-foreground/40">
                                ID del Ticket: <span className="font-mono">{ticket.id}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
