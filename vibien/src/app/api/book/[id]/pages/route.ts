import { UUID } from 'crypto';
import { supabase } from '../../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: UUID } }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Missing book ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('book_id', id)
      .order('page_number', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
