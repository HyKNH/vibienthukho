'use client';  // Ensures this component runs on the client-side

import { useState } from 'react';
import { uploadImage } from '../lib/uploadImage'; // Assuming this handles uploading individual images
import { parseCSV } from '../lib/csvParser'; // Function to parse CSV

export default function AddBook() {
  const [title, setTitle] = useState('');
  const [callNumber, setCallNumber] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [coverImages, setCoverImages] = useState<File[]>([]); // Array to store multiple files
  const [csvFile, setCsvFile] = useState<File | null>(null); // For storing the uploaded CSV

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls: string[] = [];
    const pages: any[] = [];

    // Upload all selected cover images
    for (const file of coverImages) {
      try {
        const imageUrl = await uploadImage(file, 'covers');
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    // Parse the CSV file if it exists
    if (csvFile) {
      try {
        const parsedPages = await parseCSV(csvFile);  // Parse the CSV to get page data
        pages.push(...parsedPages); // Add pages to the list
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    }

    // Send book details and page data to the API
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type
      },
      body: JSON.stringify({
        title,
        call_number: callNumber,
        author,
        year,
        publisher,
        cover_images: imageUrls, // Send an array of URLs if multiple images
        pages,  // Send the parsed pages from CSV
      }),
    });

    const data = await res.json();
    console.log('Book added:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Call Number"
        value={callNumber}
        onChange={(e) => setCallNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Publisher"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
        required
      />

      {/* Multiple file upload */}
      <input
        type="file"
        accept="image/png"
        onChange={(e) => {
          if (e.target.files) {
            setCoverImages(Array.from(e.target.files)); // Store multiple files
          }
        }}
        multiple
      />

      {/* CSV file input */}
      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
      />

      <button type="submit">Add Book</button>
    </form>
  );
}
