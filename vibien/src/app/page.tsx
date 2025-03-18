'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
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
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">Book Collection</h1>
            <Link href="/add-book">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Add a Book</button>
            </Link>
            <ul className="mt-4 space-y-2">
                {books.map((book: any) => (
                    <li key={book.id} className="border p-2 rounded shadow">
                        <Link href={`/book/${book.id}`} className="text-blue-600">
                            {book.call_number} - {book.title} by {book.author}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
