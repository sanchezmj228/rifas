'use client';

import { useState, useEffect } from 'react';

export default function ContactFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Replace these with actual numbers/usernames if provided, or leave as placeholders
    const whatsappUrl = "https://wa.me/1234567890";
    const telegramUrl = "https://t.me/username";

    // Show hint message after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    // Hide hint when user interacts with the button
    const handleButtonClick = () => {
        setShowHint(false);
        setIsOpen(!isOpen);
    };

    // Dismiss hint when clicking the X
    const dismissHint = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowHint(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Options Menu */}
            <div className={`flex absolute -top-8 right-1 flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
                }`}>
                {/* Telegram Button */}
                <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-white/10 shadow-2xl hover:border-sky-400/50 hover:shadow-sky-400/20 transition-all duration-300"
                    title="Contáctanos por Telegram"
                >
                    <svg className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.24-3.54 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .38.03.55.17.14.12.18.28.2.45.02.08.02.16.01.24z" />
                    </svg>
                    {/* Tooltip Label */}
                    <span className="absolute right-14 px-3 py-1 rounded bg-surface border border-white/10 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Telegram
                    </span>
                </a>

                {/* WhatsApp Button */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-white/10 shadow-2xl hover:border-emerald/50 hover:shadow-emerald/20 transition-all duration-300"
                    title="Contáctanos por WhatsApp"
                >
                    <svg className="w-6 h-6 text-emerald group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.481 1.33 4.992L2 22l5.12-1.344c1.464.798 3.111 1.218 4.785 1.218l.004-.001c5.517 0 9.993-4.476 9.993-9.993 0-2.67-1.036-5.18-2.922-7.066A9.923 9.923 0 0012.031 2zM17.47 15.39c-.27.424-1.332.81-1.838.863-.482.05-1.127.17-2.91-.568-2.081-.861-3.414-2.96-3.518-3.1s-.83-1.104-.83-2.108c0-1.004.52-1.498.706-1.706.188-.208.41-.26.547-.26s.273.003.39.01c.123.006.29-.046.452.342.165.396.568 1.385.617 1.485.05.1.082.217.017.348-.065.13-.098.217-.197.33-.1.111-.21.248-.3.333-.1.087-.204.183-.088.382.116.2.516.85 1.106 1.375.76.677 1.4 1.14 1.6 1.23.2.09.317.075.434-.06s.503-.586.637-.788c.133-.203.267-.17.45-.104.182.067 1.155.545 1.353.644.198.1.33.15.378.232.048.083.048.48-.223.904z" />
                    </svg>
                    {/* Tooltip Label */}
                    <span className="absolute right-14 px-3 py-1 rounded bg-surface border border-white/10 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        WhatsApp
                    </span>
                </a>
            </div>

            {/* Hint Message Bubble */}
            <div className={`flex items-center gap-2 transition-all duration-500 ${showHint && !isOpen
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 pointer-events-none'
                }`}>
                <div className="relative bg-surface border border-gold/30 rounded-xl px-4 py-3 shadow-2xl max-w-[200px]">
                    {/* Close button */}
                    <button
                        onClick={dismissHint}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-surface border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                        aria-label="Cerrar mensaje"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <p className="text-white text-sm font-medium">
                        👋 ¿Tienes dudas?
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                        ¡Contáctanos por WhatsApp o Telegram!
                    </p>

                    {/* Arrow pointing to button */}
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-surface" />
                </div>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={handleButtonClick}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'rotate-90 bg-white/10' : 'bg-linear-to-br from-gold via-gold-light to-gold-dark hover:scale-110 active:scale-95'
                    }`}
                aria-label="Abrir opciones de contacto"
            >
                <div className="absolute inset-x-0 inset-y-0 rounded-full animate-pulse-glow opacity-50 pointer-events-none" />

                {isOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
