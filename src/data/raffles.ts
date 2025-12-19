import { Raffle } from '@/types';

// Simple seeded random number generator to ensure hydration consistency
const getSeededRandom = (seed: number) => {
    let value = seed;
    return () => {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
};

// Generate deterministic taken numbers based on raffle ID
const generateTakenNumbers = (count: number, seed: number): number[] => {
    const rng = getSeededRandom(seed);
    const taken = new Set<number>();
    while (taken.size < count) {
        taken.add(Math.floor(rng() * 1000));
    }
    return Array.from(taken);
};


export const raffles: Raffle[] = [
    {
        id: '1',
        title: 'iPhone 15 Pro Max',
        description: 'El último iPhone con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR de 6.7 pulgadas. Incluye 256GB de almacenamiento.',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
        price: 50,
        currency: 'MXN',
        endDate: '2024-12-31',
        totalNumbers: 1000,
        takenNumbers: generateTakenNumbers(347, 1),
    },
    {
        id: '2',
        title: 'PlayStation 5 + 3 Juegos',
        description: 'Consola PS5 edición estándar con Spider-Man 2, God of War Ragnarök y Horizon Forbidden West. Incluye control DualSense extra.',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop',
        price: 35,
        currency: 'MXN',
        endDate: '2024-12-25',
        totalNumbers: 1000,
        takenNumbers: generateTakenNumbers(512, 2),
    },
    {
        id: '3',
        title: 'MacBook Pro 14"',
        description: 'MacBook Pro con chip M3 Pro, 18GB RAM, 512GB SSD. Pantalla Liquid Retina XDR con ProMotion.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
        price: 100,
        currency: 'MXN',
        endDate: '2025-01-15',
        totalNumbers: 1000,
        takenNumbers: generateTakenNumbers(234, 3),
    },
    {
        id: '4',
        title: 'Smart TV Samsung 65"',
        description: 'Samsung Neo QLED 4K de 65 pulgadas con tecnología Quantum Matrix, Gaming Hub y Dolby Atmos.',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop',
        price: 40,
        currency: 'MXN',
        endDate: '2025-01-10',
        totalNumbers: 1000,
        takenNumbers: generateTakenNumbers(678, 4),
    },
    {
        id: '5',
        title: 'Xbox Series X + Game Pass',
        description: 'Consola Xbox Series X con 1 año de Game Pass Ultimate. Incluye control inalámbrico y headset.',
        image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=600&fit=crop',
        price: 30,
        currency: 'MXN',
        endDate: '2025-01-05',
        totalNumbers: 1000,
        takenNumbers: generateTakenNumbers(445, 5),
    },
    {
        id: '6',
        title: 'Rolex Submariner',
        description: 'Reloj Rolex Submariner Date en acero Oystersteel con bisel Cerachrom azul. Certificado de autenticidad incluido.',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop',
        price: 200,
        currency: 'MXN',
        endDate: '2025-02-01',
        totalNumbers: 1000,
        takenNumbers: generateTakenNumbers(156, 6),
    },
];

export const getRaffleById = (id: string): Raffle | undefined => {
    return raffles.find(raffle => raffle.id === id);
};
