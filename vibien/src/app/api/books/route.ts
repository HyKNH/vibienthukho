import { supabase } from '../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { title, call_number, author, year, publisher } = await req.json();

    const { data, error } = await supabase
        .from('books')
        .insert([{ title, call_number, author, year, publisher }])
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
}

export async function GET() {
    const { data, error } = await supabase.from('books').select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 200 });
}
