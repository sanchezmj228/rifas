'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center animate-pulse-glow">
                            <span className="text-black font-bold text-xl">🎰</span>
                        </div>
                        <span className="text-display text-xl md:text-2xl font-bold text-neon-gold">
                            RIFAS<span className="text-gold-dark">DORADAS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-foreground/80 hover:text-gold transition-colors font-medium"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/#rifas"
                            className="text-foreground/80 hover:text-gold transition-colors font-medium"
                        >
                            Rifas Activas
                        </Link>
                        <Link
                            href="/#ganadores"
                            className="text-foreground/80 hover:text-gold transition-colors font-medium"
                        >
                            Ganadores
                        </Link>
                        <Link
                            href="/#contacto"
                            className="text-foreground/80 hover:text-gold transition-colors font-medium"
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
                    <nav className="md:hidden py-4 border-t border-border">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-foreground/80 hover:text-gold transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/#rifas"
                                className="text-foreground/80 hover:text-gold transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Rifas Activas
                            </Link>
                            <Link
                                href="/#ganadores"
                                className="text-foreground/80 hover:text-gold transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Ganadores
                            </Link>
                            <Link
                                href="/#contacto"
                                className="text-foreground/80 hover:text-gold transition-colors font-medium py-2"
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
