'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NextRaffle {
    id: string;
    title: string;
    endDate: string;
    price: number;
    currency: string;
    image: string;
}

interface Props {
    nextRaffle: NextRaffle | null;
}

export default function CountdownHero({ nextRaffle }: Props) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (!nextRaffle) return;

        const calculateTimeLeft = () => {
            const difference = new Date(nextRaffle.endDate).getTime() - new Date().getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [nextRaffle]);

    if (!nextRaffle) return null;

    return (
        <div className="relative">
            {/* Glow Effect Behind Card */}
            <div className="absolute -inset-4 bg-gold/20 blur-3xl rounded-full opacity-50" />

            <div className="relative bg-surface/90 backdrop-blur-xl border border-gold/40 rounded-3xl overflow-hidden shadow-2xl">
                {/* Product Image Section */}
                <div className="relative h-56 md:h-72 overflow-hidden">
                    <Image
                        src={nextRaffle.image}
                        alt={nextRaffle.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/50 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-crimson/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 animate-pulse">
                        <span className="text-lg">🔥</span>
                        <span>PRÓXIMO SORTEO</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 -mt-12 relative z-10">
                    {/* Title & Price */}
                    <div className="text-center mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{nextRaffle.title}</h3>
                        <p className="text-emerald font-bold text-xl">
                            ${nextRaffle.price} {nextRaffle.currency} por número
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 text-center border border-gold/30">
                            <div className="text-2xl md:text-3xl font-bold text-gold font-mono">
                                {String(timeLeft.days).padStart(2, '0')}
                            </div>
                            <div className="text-foreground/50 text-xs mt-1">Días</div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                            <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </div>
                            <div className="text-foreground/50 text-xs mt-1">Horas</div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                            <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </div>
                            <div className="text-foreground/50 text-xs mt-1">Min</div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 text-center border border-crimson/50">
                            <div className="text-2xl md:text-3xl font-bold text-crimson font-mono animate-pulse">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <div className="text-foreground/50 text-xs mt-1">Seg</div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/raffle/${nextRaffle.id}`}
                        className="btn-casino w-full text-center py-4 rounded-xl font-bold text-lg block group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <span>¡Participar Ahora!</span>
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
