'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateRafflePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        price: '',
        currency: 'BCV',
        end_date: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/raffles/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.error || 'Error al crear la rifa');
                return;
            }

            alert('¡Rifa creada con éxito!');
            router.push('/dashboard');
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
                <Link href="/dashboard" className="text-sm text-gold hover:underline mb-2 inline-block">
                    ← Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Crear Nueva Rifa</h1>
                <p className="text-foreground/60">Configura los detalles del nuevo sorteo</p>
            </div>

            {/* Form */}
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
                        placeholder="Ej. iPhone 15 Pro Max"
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
                        placeholder="Detalles del premio, color, capacidad..."
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
                        placeholder="https://ejemplo.com/imagen.jpg"
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
                                placeholder="0.00"
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

                {/* Info Note */}
                <div className="bg-surface-elevated rounded-xl p-4 flex gap-3 items-start border border-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-foreground/70">
                        Esta rifa se creará automáticamente con <strong>1000 números</strong> disponibles (000-999).
                    </p>
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
                            Creando Sorteo...
                        </>
                    ) : (
                        'Publicar Sorteo'
                    )}
                </button>
            </form>
        </div>
    );
}
