'use client';

import { useState, use, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRaffleById } from '@/services/raffleService'; // Modified import
import NumberGrid from '@/components/NumberGrid';
import { Raffle } from '@/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function RaffleDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [raffle, setRaffle] = useState<Raffle | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
    const [conflictingNumbers, setConflictingNumbers] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        cedula: ''
    });
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        phone: '',
        cedula: ''
    });

    useEffect(() => {
        const fetchRaffle = async () => {
            try {
                const data = await getRaffleById(id);
                setRaffle(data);
            } catch (error) {
                console.error('Failed to fetch raffle', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRaffle();
    }, [id]);

    useEffect(() => {
        // Clear conflicting numbers if selection changes
        setConflictingNumbers([]);
    }, [selectedNumbers]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validation logic for specific fields
        if (name === 'cedula') {
            // Only allow numbers and max 8 digits
            const numericValue = value.replace(/\D/g, '').slice(0, 8);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else if (name === 'phone') {
            // Only allow numbers
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            fullName: '',
            email: '',
            phone: '',
            cedula: ''
        };
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre es obligatorio';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo es obligatorio';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo inválido';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es obligatorio';
            isValid = false;
        }

        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula es obligatoria';
            isValid = false;
        } else if (formData.cedula.length > 8) {
            newErrors.cedula = 'La cédula no debe tener más de 8 dígitos';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (!raffle) return;

        setIsSubmitting(true);
        try {
            const totalPrice = selectedNumbers.length * raffle.price;

            const response = await fetch('/api/tickets/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raffleId: raffle.id,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    cedula: formData.cedula,
                    selectedNumbers,
                    totalAmount: totalPrice
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 409 && result.takenNumbers) {
                    setConflictingNumbers(result.takenNumbers);
                    alert('Algunos de los números seleccionados ya han sido reservados por otro usuario. Por favor revisa la lista resaltada en rojo.');
                } else {
                    alert(result.error || 'Error al procesar la solicitud');
                }
                return;
            }

            alert(`¡Ticket creado con éxito! ID: ${result.ticketId}\n\nPor favor procede a realizar el pago para validar tu participación.`);
            setShowModal(false);
            setSelectedNumbers([]);
            setConflictingNumbers([]);
            setFormData({ fullName: '', email: '', phone: '', cedula: '' });

            // Refresh raffle data to update taken numbers
            const updatedRaffle = await getRaffleById(id);
            setRaffle(updatedRaffle);

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Ocurrió un error inesperado. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Memoize available numbers for random selection
    const availableNumbersList = useMemo(() => {
        if (!raffle) return [];
        const takenSet = new Set(raffle.takenNumbers);
        const available: number[] = [];
        for (let i = 0; i < 1000; i++) {
            if (!takenSet.has(i)) {
                available.push(i);
            }
        }
        return available;
    }, [raffle]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gold animate-pulse text-xl font-bold">Cargando Rifa...</div>
            </div>
        );
    }

    if (!raffle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-display text-4xl font-bold text-crimson mb-4">Rifa No Encontrada</h1>
                    <p className="text-foreground/60 mb-8">La rifa que buscas no existe o ha sido eliminada.</p>
                    <Link href="/" className="btn-casino px-8 py-3 rounded-lg inline-block">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    const handleToggleNumber = (number: string) => {
        setSelectedNumbers(prev => {
            if (prev.includes(number)) {
                return prev.filter(n => n !== number);
            }
            return [...prev, number];
        });
    };

    const handleRemoveNumber = (number: string) => {
        setSelectedNumbers(prev => prev.filter(n => n !== number));
    };

    const handleSelectRandom = () => {
        // Filter out already selected numbers
        const availableForSelection = availableNumbersList.filter(
            num => !selectedNumbers.includes(num.toString().padStart(3, '0'))
        );

        if (availableForSelection.length === 0) {
            alert('No hay más números disponibles para seleccionar.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableForSelection.length);
        const randomNumber = availableForSelection[randomIndex].toString().padStart(3, '0');
        setSelectedNumbers(prev => [...prev, randomNumber]);
    };

    const handleClearAll = () => {
        setSelectedNumbers([]);
    };

    const handleConfirm = () => {
        if (selectedNumbers.length === 0) return;
        setShowModal(true);
    };

    const availableNumbers = raffle.totalNumbers - raffle.takenNumbers.length;
    const percentageTaken = Math.round((raffle.takenNumbers.length / raffle.totalNumbers) * 100);
    const totalPrice = selectedNumbers.length * raffle.price;

    return (
        <div className="min-h-screen pb-16">
            {/* Back Button */}
            <div className="container mx-auto px-4 py-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Volver a Rifas</span>
                </Link>
            </div>

            {/* Product Hero */}
            <section className="container mx-auto px-4 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image */}
                    <div className="relative aspect-square lg:aspect-4/3 rounded-2xl overflow-hidden border-2 border-gold/30 group">
                        <Image
                            src={raffle.image}
                            alt={raffle.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-6 left-6 bg-emerald/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full">
                            ✅ Rifa Activa
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            {raffle.title}
                        </h1>

                        <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                            {raffle.description}
                        </p>

                        {/* Price Card */}
                        <div className="bg-surface rounded-2xl p-6 border border-gold/30 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-foreground/60">Precio por número</span>
                                <div className="text-right">
                                    <span className="text-4xl font-bold text-neon-gold">${raffle.price}</span>
                                    <span className="text-gold/60 text-lg ml-1">{raffle.currency}</span>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-emerald font-medium">{availableNumbers} disponibles</span>
                                    <span className="text-crimson font-medium">{raffle.takenNumbers.length} vendidos</span>
                                </div>
                                <div className="h-3 bg-background rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-emerald via-gold to-crimson transition-all duration-500"
                                        style={{ width: `${percentageTaken}%` }}
                                    />
                                </div>
                            </div>

                            {/* Draw Date - Prominent Display */}
                            <div className="bg-linear-to-r from-gold/20 via-gold/10 to-transparent rounded-xl p-4 border border-gold/40">
                                <div className="flex items-center gap-4">
                                    {/* Calendar Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {/* Date Info */}
                                    <div>
                                        <p className="text-gold/70 text-xs uppercase tracking-wider font-medium mb-1">
                                            📅 Fecha del Sorteo
                                        </p>
                                        <p className="text-white text-lg md:text-xl font-bold capitalize">
                                            {new Date(raffle.endDate).toLocaleDateString('es-MX', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Numbers Display */}
                        {selectedNumbers.length > 0 && (
                            <div className="bg-surface rounded-2xl p-6 border-2 border-gold animate-pulse-glow mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-foreground/60 text-sm mb-1">Números seleccionados</p>
                                        <p className="text-display text-2xl font-bold text-neon-gold">{selectedNumbers.length} número{selectedNumbers.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-foreground/60 text-sm mb-1">Total a pagar</p>
                                        <p className="text-display text-2xl font-bold text-emerald">${totalPrice} {raffle.currency}</p>
                                    </div>
                                </div>

                                {/* Selected Numbers Grid with Remove Button */}
                                <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
                                    {selectedNumbers.map(num => {
                                        const isConflict = conflictingNumbers.includes(num);
                                        return (
                                            <div
                                                key={num}
                                                className={`group relative border rounded-lg px-3 py-2 flex items-center gap-2 transition-all ${isConflict
                                                    ? 'bg-crimson/20 border-crimson animate-pulse'
                                                    : 'bg-gold/20 border-gold'
                                                    }`}
                                            >
                                                <span className={`font-mono font-bold ${isConflict ? 'text-crimson' : 'text-gold'}`}>{num}</span>
                                                <button
                                                    onClick={() => handleRemoveNumber(num)}
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isConflict
                                                        ? 'bg-crimson text-white hover:bg-white hover:text-crimson'
                                                        : 'bg-crimson/20 hover:bg-crimson text-crimson hover:text-white'
                                                        }`}
                                                    aria-label={`Eliminar número ${num}`}
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                {isConflict && (
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-crimson text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                        ¡Ya ocupado!
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    className="w-full btn-casino py-4 rounded-xl font-bold text-lg"
                                >
                                    ¡CONFIRMAR COMPRA!
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Number Selection */}
            <section className="container mx-auto px-4">
                <div className="bg-surface-elevated rounded-2xl p-6 md:p-8 border border-border">
                    <h2 className="text-display text-2xl md:text-3xl font-bold text-center mb-2">
                        <span className="text-foreground">Elige tus </span>
                        <span className="text-neon-gold">Números</span>
                    </h2>
                    <p className="text-foreground/60 text-center mb-8">
                        Selecciona uno o más números del 000 al 999. Haz clic en un número para agregarlo o quitarlo.
                    </p>

                    <NumberGrid
                        takenNumbers={raffle.takenNumbers}
                        selectedNumbers={selectedNumbers}
                        conflictingNumbers={conflictingNumbers}
                        onToggleNumber={handleToggleNumber}
                        onSelectRandom={handleSelectRandom}
                        onClearAll={handleClearAll}
                    />
                </div>
            </section>

            {/* Confirmation Modal */}
            {showModal && selectedNumbers.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
                    <div className="bg-surface rounded-2xl p-8 max-w-lg w-full border-2 border-gold animate-pulse-glow max-h-[90vh] overflow-y-auto">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-display text-2xl font-bold text-gold mb-2">¡Excelente Elección!</h3>
                            <p className="text-foreground/70 mb-4">
                                Has seleccionado <span className="text-neon-gold font-bold">{selectedNumbers.length} número{selectedNumbers.length !== 1 ? 's' : ''}</span> para la rifa:
                            </p>
                            <p className="text-foreground font-semibold mb-4">{raffle.title}</p>

                            {/* Selected Numbers in Modal */}
                            <div className="bg-background rounded-xl p-4 mb-4">
                                <p className="text-foreground/60 text-sm mb-2">Tus números:</p>
                                <div className="flex flex-wrap gap-2 justify-center max-h-24 overflow-y-auto">
                                    {selectedNumbers.sort().map(num => {
                                        const isConflict = conflictingNumbers.includes(num);
                                        return (
                                            <span
                                                key={num}
                                                className={`font-mono font-bold px-3 py-1 rounded-lg border transition-all ${isConflict
                                                    ? 'bg-crimson text-white border-white animate-pulse'
                                                    : 'bg-gold/20 text-gold border-gold'
                                                    }`}
                                            >
                                                {num}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Checkout Form */}
                            <div className="bg-background rounded-xl p-4 mb-6 text-left">
                                <h4 className="text-gold font-bold mb-4 text-center border-b border-border pb-2">Ingresa tus datos</h4>
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-foreground/60 text-sm mb-1">Nombre y Apellido</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`w-full bg-surface border ${errors.fullName ? 'border-crimson' : 'border-border'} rounded-lg px-4 py-2 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all disabled:opacity-50`}
                                            placeholder="Juan Pérez"
                                        />
                                        {errors.fullName && <p className="text-crimson text-xs mt-1">{errors.fullName}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-foreground/60 text-sm mb-1">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`w-full bg-surface border ${errors.email ? 'border-crimson' : 'border-border'} rounded-lg px-4 py-2 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all disabled:opacity-50`}
                                            placeholder="juan@ejemplo.com"
                                        />
                                        {errors.email && <p className="text-crimson text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Phone and ID Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-foreground/60 text-sm mb-1">Teléfono</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full bg-surface border ${errors.phone ? 'border-crimson' : 'border-border'} rounded-lg px-4 py-2 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all disabled:opacity-50`}
                                                placeholder="04141234567"
                                            />
                                            {errors.phone && <p className="text-crimson text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-foreground/60 text-sm mb-1">Cédula</label>
                                            <input
                                                type="text"
                                                name="cedula"
                                                value={formData.cedula}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full bg-surface border ${errors.cedula ? 'border-crimson' : 'border-border'} rounded-lg px-4 py-2 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all disabled:opacity-50`}
                                                placeholder="12345678"
                                                maxLength={8}
                                            />
                                            {errors.cedula && <p className="text-crimson text-xs mt-1">{errors.cedula}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-background rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-foreground/60">{selectedNumbers.length} número{selectedNumbers.length !== 1 ? 's' : ''} × ${raffle.price}</span>
                                    <span className="text-foreground/80">${totalPrice} {raffle.currency}</span>
                                </div>
                                <div className="border-t border-border pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-foreground font-semibold">Total a pagar</span>
                                        <span className="text-2xl font-bold text-gold">${totalPrice} {raffle.currency}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 border border-gold/50 text-gold hover:bg-gold/10 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || isSubmitting}
                                    className="flex-1 btn-casino py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </>
                                    ) : (
                                        'Pagar Ahora'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

