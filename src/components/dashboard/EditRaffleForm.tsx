'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Raffle } from '@/types';

interface EditRaffleFormProps {
    raffle: Raffle;
}

export default function EditRaffleForm({ raffle }: EditRaffleFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        // Adjust for timezone offset to show correct local time in input
        const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        return localIso;
    };

    const [formData, setFormData] = useState({
        title: raffle.title,
        description: raffle.description,
        image_url: raffle.image,
        price: raffle.price.toString(),
        currency: raffle.currency,
        end_date: formatDateForInput(raffle.endDate)
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/raffles/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: raffle.id,
                    ...formData,
                    // Convert back to ISO string for storage
                    end_date: new Date(formData.end_date).toISOString()
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.error || 'Error al actualizar la rifa');
                return;
            }

            alert('¡Rifa actualizada con éxito!');
            router.push(`/dashboard/raffle/${raffle.id}`);
            router.refresh();

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Ocurrió un error inesperado');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href={`/dashboard/raffle/${raffle.id}`} className="text-sm text-gold hover:underline mb-2 inline-block">
                    ← Volver al Detalle
                </Link>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Editar Rifa</h1>
                <p className="text-foreground/60">Modifica los detalles del sorteo</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface border border-white/10 rounded-2xl p-6 space-y-6">

                {/* Title */}
                <div>
                    <label className="block text-foreground/80 text-sm font-medium mb-2">Título del Producto</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-foreground/80 text-sm font-medium mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all resize-none"
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-foreground/80 text-sm font-medium mb-2">URL de la Imagen</label>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all"
                    />
                    {formData.image_url && (
                        <div className="mt-2 text-xs text-foreground/40">
                            Vista previa:
                            <img src={formData.image_url} alt="Preview" className="mt-1 h-20 w-auto rounded-lg border border-white/10" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                        <label className="block text-foreground/80 text-sm font-medium mb-2">Precio del Ticket</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">$</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="block text-foreground/80 text-sm font-medium mb-2">Moneda</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all appearance-none"
                        >
                            <option value="BCV">Bolívares (BCV)</option>
                            <option value="USD">Dólares (USD)</option>
                        </select>
                    </div>
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-foreground/80 text-sm font-medium mb-2">Fecha del Sorteo</label>
                    <input
                        type="datetime-local"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all [color-scheme:dark]"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-casino py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mt-4"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardar Cambios
                        </>
                    ) : (
                        'Guardar Cambios'
                    )}
                </button>
            </form>
        </div>
    );
}
