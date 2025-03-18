'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Books() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            const res = await fetch('/api/books');
            const data = await res.json();
            setBooks(data);
        }
        fetchBooks();
    }, []);

    return (
        <div>
            <h1>Books</h1>
            <ul>
                {books.map((book: any) => (
                    <li key={book.id}>
                        <Link href={`/book/${book.id}`}>{book.call_number} - {book.title} by {book.author}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
