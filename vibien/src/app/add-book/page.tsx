//outdated
'use client';

import { useState } from 'react';
import { uploadImage } from '../lib/uploadImage';
import { parseCSV } from '../lib/csvParser';

interface CsvPageEntry {
  page_number: string;
  index: number;
  main_text: string;
  commentary: string;
  image_url?: string;
}

export default function AddBook() {
  const [title, setTitle] = useState('');
  const [callNumber, setCallNumber] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls: string[] = [];
    const pages: CsvPageEntry[] = [];

    for (const file of coverImages) {
      try {
        const imageUrl = await uploadImage(file, 'covers');
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    if (csvFile) {
      try {
        const parsedPages = await parseCSV(csvFile);

        const mappedPages: CsvPageEntry[] = parsedPages.map((page, index) => ({
          page_number: page.page_number,
          index: index + 1,
          main_text: page.digitized_text, 
          commentary: '', 
          image_url: page.image_url || undefined,
        }));

        pages.push(...mappedPages);
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    }

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        call_number: callNumber,
        author,
        year: parseInt(year, 10),
        publisher,
        cover_images: imageUrls,
        pages,
      }),
    });

    const data = await res.json();
    console.log('Book added:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Call Number</label>
        <input
          type="text"
          placeholder="Call Number"
          value={callNumber}
          onChange={(e) => setCallNumber(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Author</label>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Year</label>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Publisher</label>
        <input
          type="text"
          placeholder="Publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Cover Images (PNG)</label>
        <input
          type="file"
          accept="image/png"
          onChange={(e) => {
            if (e.target.files) {
              setCoverImages(Array.from(e.target.files));
            }
          }}
          multiple
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">CSV Pages Data</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Add Book
      </button>
    </form>
  );
}