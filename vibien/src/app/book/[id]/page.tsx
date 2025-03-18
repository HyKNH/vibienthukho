'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PageEntry {
  id: string;
  book_id: string;
  page_number: string;
  main_text: string;
  commentary: string;
  image_url?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  call_number: string;
}

interface PageGroup {
  page_number: string;
  entries: Array<{
    main: string;
    comment: string;
  }>;
}

export default function BookDetail() {
  const params = useParams();
  const id = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [pageGroups, setPageGroups] = useState<PageGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return;

      try {
        // Fetch book details
        const bookRes = await fetch(`/api/book/${id}`);
        if (!bookRes.ok) throw new Error('Failed to fetch book');
        const bookData = await bookRes.json();
        if (bookData.error) throw new Error(bookData.error);
        setBook(bookData);

        // Fetch pages and process
        const pagesRes = await fetch(`/api/book/${id}/pages`);
        if (!pagesRes.ok) throw new Error('Failed to fetch pages');
        const pagesData: PageEntry[] = await pagesRes.json();
        
        // Group entries by page_number
        const grouped = pagesData.reduce((acc: Record<string, PageGroup>, page) => {
          if (!acc[page.page_number]) {
            acc[page.page_number] = {
              page_number: page.page_number,
              entries: []
            };
          }
          acc[page.page_number].entries.push({
            main: page.main_text,
            comment: page.commentary
          });
          return acc;
        }, {});

        // Sort pages naturally (1a, 1b, 2, 2a, etc.)
        const sortedGroups = Object.values(grouped).sort((a, b) => 
          a.page_number.localeCompare(b.page_number, undefined, { numeric: true })
        );

        setPageGroups(sortedGroups);
      } catch (error) {
        console.error('Error:', error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handlePrevious = () => {
    setCurrentPageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPageIndex(prev => Math.min(pageGroups.length - 1, prev + 1));
  };

  if (loading) return <div className="p-4 text-center">Loading book details...</div>;
  if (!book) return <div className="p-4 text-red-500 text-center">Book not found</div>;

  const currentPage = pageGroups[currentPageIndex];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Book Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold mb-2 text-right">{book.title}</h1>
        <div className="grid grid-cols-2 gap-2 text-sm text-right">
          <p><span className="font-semibold">Author:</span> {book.author}</p>
          <p><span className="font-semibold">Year:</span> {book.year}</p>
          <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>
          <p><span className="font-semibold">Call Number:</span> {book.call_number}</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentPageIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          ← Previous
        </button>
        
        <span className="text-lg font-semibold">
          Page {currentPage?.page_number}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPageIndex === pageGroups.length - 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Next →
        </button>
      </div>

      {/* Page Content */}
      {currentPage ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="vertical-scroll-container">
            <div className="vertical-text-column">
              {currentPage.entries.map((entry, index) => (
                <div key={index} className="vertical-entry-group">
                  <p className="vertical-main-text font-chinese">
                    {entry.main}
                  </p>
                  <p className="vertical-comment-text font-chinese">
                    {entry.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No pages available</div>
      )}
    </div>
  );
}