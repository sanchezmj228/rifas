
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { ticketId, status } = body;

        if (!ticketId || !status) {
            return NextResponse.json(
                { error: 'Datos incompletos' },
                { status: 400 }
            );
        }

        const allowedStatuses = ['pending', 'paid', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Estado inválido' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('tickets')
            .update({ status })
            .eq('id', ticketId)
            .select()
            .single();

        if (error) {
            console.error('Error updating ticket:', error);
            return NextResponse.json(
                { error: 'Error al actualizar el ticket' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, ticket: data });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
