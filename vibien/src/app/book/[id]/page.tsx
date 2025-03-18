'use client';  // Ensures this component runs on the client-side

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';  // Use useSearchParams for app directory

export default function BookDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');  // Retrieve the dynamic 'id' from the URL

  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;  // Exit if id is not available

      try {
        const res = await fetch(`/api/books/${id}`);  // API endpoint
        const data = await res.json();

        if (data.error) {
          console.error('Error fetching book:', data.error);
          setBook(null);
        } else {
          setBook(data);
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);  // Run the effect again when id changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Year: {book.year}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Call Number: {book.call_number}</p>

      {/* Render other book details if needed */}
    </div>
  );
}
