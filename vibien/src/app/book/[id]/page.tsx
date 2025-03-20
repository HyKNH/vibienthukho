'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PageEntry {
  id: string;
  book_id: string;
  page_number: string;
  index: number;
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
  columns: Array<{
    index: number;
    main: string;
    comment: string;
  }>;
  images: string[];
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
        const bookRes = await fetch(`/api/book/${id}`);
        if (!bookRes.ok) throw new Error('Failed to fetch book');
        const bookData = await bookRes.json();
        if (bookData.error) throw new Error(bookData.error);
        setBook(bookData);

        const pagesRes = await fetch(`/api/book/${id}/pages`);
        if (!pagesRes.ok) throw new Error('Failed to fetch pages');
        const pagesData: PageEntry[] = await pagesRes.json();

        const imageMap = new Map<string, string[]>();
        pagesData.forEach(page => {
          if (page.image_url) {
            const filename = page.image_url.split('/').pop()?.split('.')[0] || '';
            const pageNumbers = filename.split('-');
            pageNumbers.forEach(num => {
              if (!imageMap.has(num)) imageMap.set(num, []);
              imageMap.get(num)?.push(page.image_url!);
            });
          }
        });

        const grouped = pagesData.reduce((acc: Record<string, PageGroup>, page) => {
          const pageNumber = page.page_number;
          
          if (!acc[pageNumber]) {
            acc[pageNumber] = {
              page_number: pageNumber,
              columns: [],
              images: imageMap.get(pageNumber) || []
            };
          }
          
          acc[pageNumber].columns.push({
            index: page.index,
            main: page.main_text,
            comment: page.commentary
          });

          return acc;
        }, {});

        const sortedGroups = Object.values(grouped)
          .sort((a, b) => a.page_number.localeCompare(b.page_number, undefined, { numeric: true }))
          .map(group => ({
            ...group,
            columns: group.columns.sort((a, b) => a.index - b.index)
          }));

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
        <h1 className="text-3xl font-bold mb-2 text-left">{book.title}</h1>
        <div className="grid grid-cols-2 gap-2 text-sm text-left">
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
          className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 hover:bg-neutral-400"
        >
          ← Previous
        </button>
        
        <span className="text-lg font-semibold">
          Page {currentPage?.page_number}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPageIndex === pageGroups.length - 1}
          className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 hover:bg-neutral-400"
        >
          Next →
        </button>
      </div>

      {/* Page Content */}
      {currentPage ? (
        <div className="bg-neutral-900 rounded-lg shadow-md p-4">
          <div className="flex gap-6">
            {/* Image Container (Left) */}
            <div className="w-1/3 flex flex-col gap-4">
              {currentPage.images?.length > 0 && (() => {
                const imageUrl = currentPage.images[0];
                const filename = imageUrl.split('/').pop()?.split('.')[0] || '';
                return (
                  <div className="bg-black p-2 rounded">
                    <img
                      src={imageUrl}
                      alt={`Page ${filename}`}
                      className="w-full h-auto object-contain cursor-pointer"
                      onClick={() => window.open(imageUrl, '_blank')}
                    />
                    <p className="text-center text-sm text-gray-400 mt-2">
                      Pages: {filename.replace(/-/g, ', ')}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Text Container (Right) */}
            <div className="flex-1 vertical-scroll-container">
              <div className="flex flex-row-reverse gap-4 overflow-x-auto" dir="ltr">
                {currentPage.columns.map((column) => (
                  <div key={column.index} className="vertical-column">
                    <div className="text-container">
                      <p className="vertical-main-text font-chinese">
                        {column.main}
                      </p>
                      <p className="vertical-comment-text font-chinese">
                        {column.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No pages available</div>
      )}
    </div>
  );
}