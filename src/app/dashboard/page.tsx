
import Link from 'next/link';
import Image from 'next/image';
import { getRaffles, getPendingTicketCount } from '@/services/raffleService';

export const revalidate = 0; // Always fresh data for admin

export default async function DashboardPage() {
    const raffles = await getRaffles();

    // Fetch pending counts for all raffles
    const rafflesWithStats = await Promise.all(raffles.map(async (raffle) => {
        const pendingCount = await getPendingTicketCount(raffle.id);
        return { ...raffle, pendingCount };
    }));

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Panel de Control</h1>
                    <p className="text-foreground/60">Gestiona tus rifas y tickets desde aquí</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rafflesWithStats.map((raffle) => {
                    const percentageSold = Math.round((raffle.takenNumbers.length / raffle.totalNumbers) * 100);

                    return (
                        <Link
                            key={raffle.id}
                            href={`/dashboard/raffle/${raffle.id}`}
                            className="block bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-gold/50 transition-all group"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={raffle.image}
                                    alt={raffle.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{raffle.title}</h3>
                                    <p className="text-gold font-bold">${raffle.price} {raffle.currency}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between text-sm mb-2 text-foreground/60">
                                    <span>Progreso</span>
                                    <span>{percentageSold}%</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden mb-4">
                                    <div
                                        className="h-full bg-gold transition-all"
                                        style={{ width: `${percentageSold}%` }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-background/50 p-2 rounded-lg text-center">
                                        <div className="text-emerald font-bold">{raffle.takenNumbers.length}</div>
                                        <div className="text-foreground/40 text-xs">Vendidos</div>
                                    </div>
                                    <div className="bg-background/50 p-2 rounded-lg text-center">
                                        <div className="text-white font-bold">{raffle.totalNumbers - raffle.takenNumbers.length}</div>
                                        <div className="text-foreground/40 text-xs">Disponibles</div>
                                    </div>
                                    {raffle.pendingCount > 0 && (
                                        <div className="bg-orange-500/10 p-2 rounded-lg text-center col-span-2 border border-orange-500/20">
                                            <div className="text-orange-500 font-bold">{raffle.pendingCount}</div>
                                            <div className="text-orange-500/60 text-xs">Tickets Pendientes</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {raffles.length === 0 && (
                <div className="text-center py-20 text-foreground/40">
                    No hay rifas activas en este momento.
                </div>
            )}
        </div>
    );
}
