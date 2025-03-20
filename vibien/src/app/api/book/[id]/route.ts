import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const segments = request.nextUrl.pathname.split('/');
    const id = segments[segments.length - 2]; 

    if (!id) {
      return NextResponse.json({ error: 'Missing book ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error occurred:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch book' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
