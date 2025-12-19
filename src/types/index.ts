export interface Raffle {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    endDate: string;
    totalNumbers: number;
    takenNumbers: number[];
}

export interface NumberSelection {
    number: string;
    status: 'available' | 'taken' | 'selected';
}

export interface Ticket {
    id: string;
    raffleId: string;
    fullName: string;
    email: string;
    phone: string;
    cedula: string;
    numbers: string[];
    status: 'pending' | 'paid' | 'rejected';
    totalAmount: number;
    createdAt: string;
    raffleTitle?: string;
}
