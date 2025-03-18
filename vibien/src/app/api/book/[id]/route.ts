import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Handle "not found" case explicitly
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Book not found' }, 
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch book' },
      { status: error.status || 500 }
    );
  }
}