
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, image_url, price, currency, end_date } = body;

        // Basic validation
        if (!title || !price || !end_date) {
            return NextResponse.json(
                { error: 'Título, precio y fecha de sorteo son obligatorios' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('raffles')
            .insert([
                {
                    title,
                    description,
                    image_url,
                    price: Number(price),
                    currency: currency || 'BCV',
                    end_date,
                    total_numbers: 1000, // Fixed to 1000 as requested
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating raffle:', error);
            return NextResponse.json(
                { error: 'Error al crear la rifa en base de datos' },
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
