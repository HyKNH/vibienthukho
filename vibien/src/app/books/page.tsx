'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  call_number: string;
  author: string;
}

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        async function fetchBooks() {
            const res = await fetch('/api/books');
            const data: Book[] = await res.json();
            setBooks(data);
        }
        fetchBooks();
    }, []);

    return (
        <div>
            <h1>Books</h1>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <Link href={`/book/${book.id}`}>{book.call_number} - {book.title} by {book.author}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
