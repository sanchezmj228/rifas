'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqData: FAQItem[] = [
    // Participación
    {
        category: 'Participación',
        question: '¿Cómo participo en un sorteo?',
        answer: 'Es muy sencillo: elige el sorteo de tu preferencia, selecciona tus números de la suerte, completa el formulario con tus datos y realiza el pago. Una vez confirmado, recibirás tu ticket de participación.'
    },
    {
        category: 'Participación',
        question: '¿Puedo elegir más de un número?',
        answer: '¡Por supuesto! Puedes seleccionar tantos números como desees para aumentar tus probabilidades de ganar. Cada número adicional se suma a tu carrito de compra.'
    },
    {
        category: 'Participación',
        question: '¿Qué pasa si mi número ya está ocupado?',
        answer: 'Los números no disponibles aparecen marcados y bloqueados en la grilla. Simplemente elige otro número de los cientos disponibles.'
    },
    // Pagos
    {
        category: 'Pagos',
        question: '¿Cuáles son los métodos de pago aceptados?',
        answer: 'Aceptamos transferencias bancarias, Pago Móvil, Zelle, Binance (USDT) y otras criptomonedas. Los detalles de pago se muestran al finalizar tu compra.'
    },
    {
        category: 'Pagos',
        question: '¿Cuánto tiempo tengo para pagar después de reservar?',
        answer: 'Tienes un máximo de 24 horas para confirmar tu pago. Si no se recibe el comprobante en ese tiempo, los números se liberarán automáticamente para otros participantes.'
    },
    {
        category: 'Pagos',
        question: '¿Cómo confirmo mi pago?',
        answer: 'Después de realizar la transferencia, envía el comprobante de pago por WhatsApp o Telegram junto con tu número de ticket. Nuestro equipo verificará y confirmará tu participación.'
    },
    // Sorteos
    {
        category: 'Sorteos',
        question: '¿Cómo se realiza el sorteo?',
        answer: 'Todos nuestros sorteos se realizan EN VIVO a través de Instagram y YouTube, utilizando los resultados oficiales de la Lotería Nacional o aplicaciones certificadas de números aleatorios para garantizar total transparencia.'
    },
    {
        category: 'Sorteos',
        question: '¿Dónde puedo ver la fecha del sorteo?',
        answer: 'La fecha y hora del sorteo se muestra claramente en cada tarjeta de rifa. También enviamos recordatorios por nuestras redes sociales antes del evento.'
    },
    {
        category: 'Sorteos',
        question: '¿Cómo sé si gané?',
        answer: 'Te contactaremos directamente por teléfono y correo electrónico si resultas ganador. Además, publicamos los resultados en nuestras redes sociales y en la sección de Ganadores de este sitio.'
    },
    // Premios
    {
        category: 'Premios',
        question: '¿Cómo recibo mi premio?',
        answer: 'Coordinamos la entrega según tu ubicación: puede ser envío a domicilio con tracking, retiro en un punto de entrega acordado, o entrega personal para ganadores locales.'
    },
    {
        category: 'Premios',
        question: '¿Los productos tienen garantía?',
        answer: 'Absolutamente. Todos los premios son productos nuevos, sellados y con garantía oficial del fabricante. Entregamos con factura original.'
    },
    // Seguridad
    {
        category: 'Seguridad',
        question: '¿Mis datos están protegidos?',
        answer: 'Tu información personal se mantiene estrictamente confidencial y solo se utiliza para contactarte en caso de ganar. No compartimos tus datos con terceros.'
    },
    {
        category: 'Seguridad',
        question: '¿Cómo verifico el estado de mi ticket?',
        answer: 'Ingresa a la sección "Verificar Ticket" en el menú principal e introduce tu número de ticket. Podrás ver si tu pago fue confirmado y el estado actual de tu participación.'
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('Todos');

    const categories = ['Todos', ...Array.from(new Set(faqData.map(item => item.category)))];

    const filteredFAQ = activeCategory === 'Todos'
        ? faqData
        : faqData.filter(item => item.category === activeCategory);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4 italic">
                        <span className="text-foreground">Preguntas </span>
                        <span className="text-gold">Frecuentes</span>
                    </h2>
                    <p className="text-foreground/60 text-lg max-w-xl mx-auto">
                        Todo lo que necesitas saber antes de participar en nuestros sorteos premium
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveCategory(category);
                                setOpenIndex(null);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                    ? 'bg-gold text-background'
                                    : 'bg-surface border border-white/10 text-white/70 hover:border-gold/50 hover:text-gold'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {filteredFAQ.map((item, index) => (
                        <div
                            key={index}
                            className="bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
                        >
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left group"
                            >
                                <span className="text-white font-medium pr-4 group-hover:text-gold transition-colors">
                                    {item.question}
                                </span>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'rotate-180 bg-gold/20' : ''
                                    }`}>
                                    <svg
                                        className={`w-4 h-4 transition-colors ${openIndex === index ? 'text-gold' : 'text-white/50'}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}>
                                <div className="px-6 pb-5 text-foreground/60 leading-relaxed border-t border-white/5 pt-4">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <p className="text-foreground/50 mb-4">
                        ¿No encontraste lo que buscabas?
                    </p>
                    <a
                        href="#contacto"
                        className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-medium"
                    >
                        <span>Contáctanos directamente</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
