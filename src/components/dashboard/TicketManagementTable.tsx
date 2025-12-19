
'use client';

import { useState } from 'react';
import { Ticket } from '@/types';
import { useRouter } from 'next/navigation';

interface Props {
    initialTickets: Ticket[];
}

export default function TicketManagementTable({ initialTickets }: Props) {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenModal = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedTicket(null);
        setIsModalOpen(false);
    };

    const handleUpdateStatus = async (status: 'paid' | 'pending' | 'rejected') => {
        if (!selectedTicket) return;

        setLoading(true);
        try {
            const response = await fetch('/api/tickets/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketId: selectedTicket.id,
                    status,
                }),
            });

            if (!response.ok) throw new Error('Error al actualizar');

            // Optimistic update or refresh
            setTickets(current =>
                current.map(t =>
                    t.id === selectedTicket.id ? { ...t, status } : t
                )
            );

            router.refresh(); // Refresh server components to ensure data consistency if needed
            handleCloseModal();
        } catch (error) {
            console.error(error);
            alert('Hubo un error al actualizar el estado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Participantes</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-foreground/80">
                            <tr>
                                <th className="p-4 text-sm font-semibold">Fecha</th>
                                <th className="p-4 text-sm font-semibold">Cliente</th>
                                <th className="p-4 text-sm font-semibold">Contacto</th>
                                <th className="p-4 text-sm font-semibold">Números</th>
                                <th className="p-4 text-sm font-semibold">Total</th>
                                <th className="p-4 text-sm font-semibold">Estado</th>
                                <th className="p-4 text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-sm text-foreground/60 whitespace-nowrap">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-white">{ticket.fullName}</div>
                                        <div className="text-sm text-foreground/60">C.I: {ticket.cedula}</div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="text-white">{ticket.email}</div>
                                        <div className="text-foreground/60">{ticket.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {ticket.numbers.map(num => (
                                                <span key={num} className="bg-gold/10 text-gold text-xs px-2 py-1 rounded font-mono">
                                                    {num}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-white">
                                        ${ticket.totalAmount}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${ticket.status === 'paid' ? 'bg-emerald/20 text-emerald' :
                                                ticket.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-crimson/20 text-crimson'}`}>
                                            {ticket.status === 'paid' ? 'Pagado' :
                                                ticket.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleOpenModal(ticket)}
                                            className="text-sm text-gold hover:text-white transition-colors underline"
                                        >
                                            Gestionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Gestionar Ticket</h3>
                            <button onClick={handleCloseModal} className="text-foreground/60 hover:text-white">✕</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-foreground/60 block mb-1">Cliente</label>
                                    <div className="font-semibold text-white">{selectedTicket.fullName}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-foreground/60 block mb-1">Cédula</label>
                                    <div className="text-white">{selectedTicket.cedula}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-foreground/60 block mb-1">Total</label>
                                    <div className="font-semibold text-emerald text-lg">${selectedTicket.totalAmount}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-foreground/60 block mb-1">Estado Actual</label>
                                    <div className="capitalize text-white">{selectedTicket.status}</div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-foreground/60 block mb-2">Números Jugados</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTicket.numbers.map(num => (
                                        <span key={num} className="bg-background border border-white/10 px-3 py-1 rounded font-mono text-gold font-bold">
                                            {num}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex flex-col gap-3">
                            <p className="text-sm text-center text-foreground/60 mb-2">
                                Confirma el cambio de estado para este ticket.
                            </p>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => handleUpdateStatus('paid')}
                                    disabled={loading || selectedTicket.status === 'paid'}
                                    className="bg-emerald text-white py-2 rounded-lg font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ✅ Aprobar
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('pending')}
                                    disabled={loading || selectedTicket.status === 'pending'}
                                    className="bg-orange-500 text-white py-2 rounded-lg font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ⏳ Pendiente
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    disabled={loading || selectedTicket.status === 'rejected'}
                                    className="bg-crimson text-white py-2 rounded-lg font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    🚫 Rechazar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
