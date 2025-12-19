'use client';

import { useState, useMemo } from 'react';

interface NumberGridProps {
    takenNumbers: number[];
    selectedNumbers: string[];
    conflictingNumbers?: string[];
    onToggleNumber: (number: string) => void;
    onSelectRandom: () => void;
    onClearAll: () => void;
}

export default function NumberGrid({
    takenNumbers,
    selectedNumbers,
    conflictingNumbers = [],
    onToggleNumber,
    onSelectRandom,
    onClearAll
}: NumberGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const numbersPerPage = 100;
    const totalNumbers = 1000;
    const totalPages = Math.ceil(totalNumbers / numbersPerPage);

    // Create Sets for O(1) lookup
    const takenSet = useMemo(() => new Set(takenNumbers), [takenNumbers]);
    const selectedSet = useMemo(() => new Set(selectedNumbers), [selectedNumbers]);
    const conflictSet = useMemo(() => new Set(conflictingNumbers), [conflictingNumbers]);

    // Generate numbers for current page
    const pageNumbers = useMemo(() => {
        const start = currentPage * numbersPerPage;
        const end = Math.min(start + numbersPerPage, totalNumbers);
        const numbers = [];
        for (let i = start; i < end; i++) {
            numbers.push(i);
        }
        return numbers;
    }, [currentPage]);

    // Filter numbers based on search
    const filteredNumbers = useMemo(() => {
        if (!searchQuery) return pageNumbers;
        return pageNumbers.filter(num =>
            num.toString().padStart(3, '0').includes(searchQuery)
        );
    }, [pageNumbers, searchQuery]);

    const formatNumber = (num: number): string => {
        return num.toString().padStart(3, '0');
    };

    const getNumberStatus = (num: number): 'available' | 'taken' | 'selected' | 'conflict' => {
        const formattedNum = formatNumber(num);
        if (conflictSet.has(formattedNum)) return 'conflict';
        if (selectedSet.has(formattedNum)) return 'selected';
        if (takenSet.has(num)) return 'taken';
        return 'available';
    };

    const handleNumberClick = (num: number) => {
        if (takenSet.has(num) && !conflictSet.has(formatNumber(num))) return;
        onToggleNumber(formatNumber(num));
    };

    const availableCount = totalNumbers - takenNumbers.length;
    const takenCount = takenNumbers.length;

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-lg p-4 border border-border text-center">
                    <div className="text-3xl font-bold text-gold">{totalNumbers}</div>
                    <div className="text-foreground/60 text-sm">Total</div>
                </div>
                <div className="bg-surface rounded-lg p-4 border border-emerald/30 text-center">
                    <div className="text-3xl font-bold text-emerald">{availableCount}</div>
                    <div className="text-foreground/60 text-sm">Disponibles</div>
                </div>
                <div className="bg-surface rounded-lg p-4 border border-crimson/30 text-center">
                    <div className="text-3xl font-bold text-crimson">{takenCount}</div>
                    <div className="text-foreground/60 text-sm">Vendidos</div>
                </div>
                <div className="bg-surface rounded-lg p-4 border border-gold/30 text-center">
                    <div className="text-3xl font-bold text-gold">
                        {selectedNumbers.length}
                    </div>
                    <div className="text-foreground/60 text-sm">Seleccionados</div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onSelectRandom}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald/20 border border-emerald text-emerald hover:bg-emerald hover:text-black font-semibold py-3 px-6 rounded-xl transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Número al Azar</span>
                </button>
                <button
                    onClick={onClearAll}
                    disabled={selectedNumbers.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-crimson/20 border border-crimson text-crimson hover:bg-crimson hover:text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Eliminar Todos ({selectedNumbers.length})</span>
                </button>
            </div>

            {/* Search and Legend */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar número..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full md:w-64 bg-surface border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 number-available rounded flex items-center justify-center text-xs">✓</div>
                        <span className="text-foreground/60">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 number-taken rounded flex items-center justify-center text-xs">✗</div>
                        <span className="text-foreground/60">Vendido</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 number-selected rounded flex items-center justify-center text-xs">★</div>
                        <span className="text-foreground/60">Seleccionado</span>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0}
                    className="px-3 py-2 rounded bg-surface border border-border text-foreground/60 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                    «
                </button>
                <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-2 rounded bg-surface border border-border text-foreground/60 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                    ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 rounded text-sm transition-all ${currentPage === i
                            ? 'bg-gold text-black font-bold'
                            : 'bg-surface border border-border text-foreground/60 hover:text-gold hover:border-gold'
                            }`}
                    >
                        {i * numbersPerPage}-{Math.min((i + 1) * numbersPerPage - 1, totalNumbers - 1)}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-2 rounded bg-surface border border-border text-foreground/60 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                    ›
                </button>
                <button
                    onClick={() => setCurrentPage(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-2 rounded bg-surface border border-border text-foreground/60 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                    »
                </button>
            </div>

            {/* Number Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {filteredNumbers.map(num => {
                    const status = getNumberStatus(num);
                    return (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            disabled={status === 'taken'}
                            className={`
                aspect-square rounded-lg flex items-center justify-center font-mono text-sm md:text-base font-semibold
                transition-all duration-200
                ${status === 'available' ? 'number-available' : ''}
                ${status === 'taken' ? 'number-taken' : ''}
                ${status === 'selected' ? 'number-selected' : ''}
                ${status === 'conflict' ? 'bg-crimson text-white animate-pulse' : ''}
              `}
                        >
                            {formatNumber(num)}
                        </button>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredNumbers.length === 0 && (
                <div className="text-center py-12 text-foreground/40">
                    No se encontraron números con &quot;{searchQuery}&quot;
                </div>
            )}
        </div>
    );
}
