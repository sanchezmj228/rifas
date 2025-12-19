
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { raffleId, fullName, email, phone, cedula, selectedNumbers, totalAmount } = body;

        // 1. Basic Validation
        if (!raffleId || !fullName || !email || !selectedNumbers || selectedNumbers.length === 0) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        // 2. Check availability
        // We need to ensure none of the selected numbers are already taken by a valid ticket
        const { data: takenCheck, error: checkError } = await supabase
            .from('tickets')
            .select(`
        ticket_numbers ( number )
      `)
            .eq('raffle_id', raffleId)
            .neq('status', 'rejected');

        if (checkError) throw checkError;

        const takenNumbers = new Set<string>();
        takenCheck.forEach(t => {
            (t.ticket_numbers as unknown as { number: string }[]).forEach(tn => takenNumbers.add(tn.number));
        });

        const conflictingNumbers = selectedNumbers.filter((num: string) => takenNumbers.has(num));

        if (conflictingNumbers.length > 0) {
            return NextResponse.json({
                error: 'Algunos números ya no están disponibles.',
                takenNumbers: conflictingNumbers
            }, { status: 409 });
        }

        // 3. Create Ticket (Pending status)
        const { data: ticket, error: ticketError } = await supabase
            .from('tickets')
            .insert({
                raffle_id: raffleId,
                full_name: fullName,
                email,
                phone,
                cedula,
                total_amount: totalAmount,
                status: 'pending' // Default compliant with requirements
            })
            .select()
            .single();

        if (ticketError) throw ticketError;

        // 4. Create Ticket Numbers
        const ticketNumbersData = selectedNumbers.map((num: string) => ({
            ticket_id: ticket.id,
            number: num
        }));

        const { error: numbersError } = await supabase
            .from('ticket_numbers')
            .insert(ticketNumbersData);

        if (numbersError) {
            // Rollback ticket if number insertion fails (cleanup)
            await supabase.from('tickets').delete().eq('id', ticket.id);
            throw numbersError;
        }

        return NextResponse.json({ success: true, ticketId: ticket.id });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
