
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey
    });
}

const supabase = createClient(
    supabaseUrl || '',
    supabaseServiceKey || ''
);

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, image_url, price, currency, end_date } = body;

        if (!id || !title || !price || !end_date) {
            return NextResponse.json(
                { error: 'ID, Título, precio y fecha de sorteo son obligatorios' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('raffles')
            .update({
                title,
                description,
                image_url,
                price: Number(price),
                currency: currency || 'BCV',
                end_date
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating raffle:', error);
            return NextResponse.json(
                { error: 'Error al actualizar la rifa en base de datos' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, raffle: data });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
