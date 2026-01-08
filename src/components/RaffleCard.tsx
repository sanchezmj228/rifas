import Image from 'next/image';
import Link from 'next/link';
import { Raffle } from '@/types';

interface RaffleCardProps {
    raffle: Raffle;
}

export default function RaffleCard({ raffle }: RaffleCardProps) {
    const availableNumbers = raffle.totalNumbers - raffle.takenNumbers.length;
    const percentageTaken = Math.round((raffle.takenNumbers.length / raffle.totalNumbers) * 100);

    return (
        <Link href={`/raffle/${raffle.id}`}>
            <div className="card-casino overflow-hidden cursor-pointer group">
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                        src={raffle.image}
                        alt={raffle.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm border border-gold rounded-full px-4 py-2 animate-pulse-glow">
                        <span className="text-gold font-bold text-lg">{raffle.price}</span>
                        <span className="text-gold/70 text-sm ml-1">{raffle.currency}</span>
                    </div>

                    {/* Hot Badge - if more than 50% taken */}
                    {percentageTaken >= 50 && (
                        <div className="absolute top-4 left-4 bg-crimson text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            🔥 HOT
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-display text-xl font-bold text-foreground group-hover:text-gold transition-colors mb-2 line-clamp-1">
                        {raffle.title}
                    </h3>

                    {/* Description */}
                    <p className="text-foreground/60 text-sm mb-3 line-clamp-2">
                        {raffle.description}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm mb-4 text-gold/80">
                        <span>📅</span>
                        <span><strong>Sorteo:</strong> {new Date(raffle.endDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-emerald">{availableNumbers} disponibles</span>
                            <span className="text-crimson">{raffle.takenNumbers.length} vendidos</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-emerald to-gold transition-all duration-500"
                                style={{ width: `${percentageTaken}%` }}
                            />
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full btn-casino text-center font-semibold py-3 rounded-lg group-hover:animate-pulse">
                        ¡PARTICIPAR AHORA!
                    </button>
                </div>
            </div>
        </Link>
    );
}
