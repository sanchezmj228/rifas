'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-gold/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo - Royal Jackpot Style */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* Crown Icon Box */}
                        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-gold via-gold-light to-gold border border-gold/50 flex items-center justify-center shadow-lg group-hover:shadow-gold/30 transition-shadow">
                            <svg
                                className="w-6 h-6 text-background"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                            </svg>
                        </div>
                        {/* Brand Text */}
                        <div className="flex flex-col">
                            <span className="font-display text-xl md:text-2xl font-bold text-gold tracking-wide leading-tight">
                                Royal Jackpot
                            </span>
                            <span className="text-[10px] md:text-xs text-gold/60 tracking-[0.25em] uppercase font-medium">
                                Sorteos de Lujo
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-foreground/70 hover:text-gold transition-colors font-medium text-sm tracking-wide"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/#rifas"
                            className="text-foreground/70 hover:text-gold transition-colors font-medium text-sm tracking-wide"
                        >
                            Rifas Activas
                        </Link>
                        <Link
                            href="/#ganadores"
                            className="text-foreground/70 hover:text-gold transition-colors font-medium text-sm tracking-wide"
                        >
                            Ganadores
                        </Link>
                        <Link
                            href="/#contacto"
                            className="text-foreground/70 hover:text-gold transition-colors font-medium text-sm tracking-wide"
                        >
                            Contacto
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-gold"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-gold/10">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-foreground/70 hover:text-gold transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/#rifas"
                                className="text-foreground/70 hover:text-gold transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Rifas Activas
                            </Link>
                            <Link
                                href="/#ganadores"
                                className="text-foreground/70 hover:text-gold transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Ganadores
                            </Link>
                            <Link
                                href="/#contacto"
                                className="text-foreground/70 hover:text-gold transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contacto
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
