import { supabase } from '@/lib/supabase';
import { Raffle, Ticket } from '@/types';

interface DBRaffle {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    price: number | string;
    currency: string | null;
    end_date: string;
    total_numbers: number;
}

// Map database raffle to app Raffle type
const mapRaffle = (data: DBRaffle): Raffle => ({
    id: data.id,
    title: data.title,
    description: data.description || '',
    image: data.image_url || '',
    price: Number(data.price),
    currency: data.currency || 'BCV',
    endDate: data.end_date,
    totalNumbers: data.total_numbers,
    takenNumbers: [], // Populated separately
});

export const getRaffles = async (): Promise<Raffle[]> => {
    const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching raffles:', error);
        return [];
    }

    // Determine taken numbers for each raffle
    const rafflesWithTaken = await Promise.all(data.map(async (raffle) => {
        const taken = await getTakenNumbers(raffle.id);
        return {
            ...mapRaffle(raffle),
            takenNumbers: taken
        };
    }));

    return rafflesWithTaken;
};

export const getRaffleById = async (id: string): Promise<Raffle | null> => {
    const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching raffle:', error);
        return null;
    }

    const takenNumbers = await getTakenNumbers(id);

    return {
        ...mapRaffle(data),
        takenNumbers
    };
};


export const getTicketsByRaffleId = async (raffleId: string): Promise<Ticket[]> => {
    const { data, error } = await supabase
        .from('tickets')
        .select(`
            *,
            ticket_numbers ( number )
        `)
        .eq('raffle_id', raffleId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }

    return data.map((ticket: any) => ({
        id: ticket.id,
        raffleId: ticket.raffle_id,
        fullName: ticket.full_name,
        email: ticket.email,
        phone: ticket.phone,
        cedula: ticket.cedula,
        status: ticket.status,
        totalAmount: ticket.total_amount,
        createdAt: ticket.created_at,
        numbers: ticket.ticket_numbers.map((tn: any) => tn.number),
    }));
};

export const getPendingTicketCount = async (raffleId: string): Promise<number> => {
    const { count, error } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('raffle_id', raffleId)
        .eq('status', 'pending');

    if (error) {
        console.error('Error counting pending tickets:', error);
        return 0;
    }

    return count || 0;
};

export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
    const { data, error } = await supabase
        .from('tickets')
        .select(`
            *,
            ticket_numbers ( number ),
            raffles ( title )
        `)
        .eq('id', ticketId)
        .single();

    if (error || !data) {
        console.error('Error fetching ticket:', error);
        return null;
    }

    return {
        id: data.id,
        raffleId: data.raffle_id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        cedula: data.cedula,
        status: data.status,
        totalAmount: data.total_amount,
        createdAt: data.created_at,
        numbers: (data.ticket_numbers as { number: string }[]).map(tn => tn.number),
        raffleTitle: (data.raffles as { title: string } | null)?.title || 'Rifa',
    };
};

const getTakenNumbers = async (raffleId: string): Promise<number[]> => {
    // Get all numbers from tickets that are NOT rejected 
    // (i.e. 'paid' or 'pending' reserve the number)
    const { data, error } = await supabase
        .from('tickets')
        .select(`
      id,
      status,
      ticket_numbers ( number )
    `)
        .eq('raffle_id', raffleId)
        .neq('status', 'rejected');

    if (error) {
        console.error('Error fetching taken numbers:', error);
        return [];
    }

    const takenSet = new Set<number>();

    data.forEach(ticket => {
        (ticket.ticket_numbers as unknown as { number: string }[]).forEach(tn => {
            takenSet.add(parseInt(tn.number));
        });
    });

    return Array.from(takenSet);
};

export const getDashboardMetrics = async () => {
    // 1. Active Raffles
    const now = new Date().toISOString();
    const { count: activeRafflesCount, error: activeRafflesError } = await supabase
        .from('raffles')
        .select('*', { count: 'exact', head: true })
        .gt('end_date', now);

    if (activeRafflesError) console.error('Error fetching active raffles count:', activeRafflesError);

    // 2. Pending Tickets (Global)
    const { count: pendingTicketsCount, error: pendingTicketsError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    if (pendingTicketsError) console.error('Error fetching pending tickets count:', pendingTicketsError);

    // 3. Today's Sales (Count and Amount)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const { data: todaysTickets, error: todaysSalesError } = await supabase
        .from('tickets')
        .select('total_amount')
        .eq('status', 'paid')
        .gte('created_at', todayISO);

    if (todaysSalesError) console.error('Error fetching today sales:', todaysSalesError);

    const todaysSalesCount = todaysTickets?.length || 0;
    const todaysSalesAmount = todaysTickets?.reduce((sum, ticket) => sum + ticket.total_amount, 0) || 0;

    // 4. Daily Revenue (BCV Only)
    // Reusing the date filter from Today's Sales
    const { data: dailyRevenueData, error: revenueError } = await supabase
        .from('tickets')
        .select('total_amount')
        .eq('status', 'paid')
        .gte('created_at', todayISO);

    if (revenueError) console.error('Error fetching daily revenue:', revenueError);

    const dailyRevenueAmount = dailyRevenueData?.reduce((sum, ticket) => sum + ticket.total_amount, 0) || 0;

    return {
        activeRaffles: activeRafflesCount || 0,
        pendingTickets: pendingTicketsCount || 0,
        todaysSalesCount,
        todaysSalesAmount,
        totalRevenue: { 'BCV': dailyRevenueAmount } // Kept object structure for compatibility but only returns BCV day total
    };
};
