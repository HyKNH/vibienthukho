import { supabase } from '../../../../lib/supabaseClient';  // Adjust path as needed
import { NextResponse } from 'next/server';

// Fetch book details by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;  // Get book ID from route parameter

  try {
    // Fetch data from the books table
    const { data, error } = await supabase
      .from('books')  // Make sure this table exists and contains your books data
      .select('*')  // Fetch all columns
      .eq('id', id)  // Match the ID to the parameter
      .single();  // Fetch a single book based on ID

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });  // Return book data as JSON
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching the book' }, { status: 500 });
  }
}
