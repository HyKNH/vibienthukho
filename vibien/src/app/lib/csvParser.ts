import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (result) => {
        // Assuming your CSV has columns: page_number, image_url, digitized_text
        const parsedPages = result.data.map((row: any) => ({
          page_number: row.page_number,
          image_url: row.image_url,
          digitized_text: row.digitized_text,
        }));
        resolve(parsedPages);
      },
      error: (error) => reject(error),
      header: true,  // Assumes the first row is headers
    });
  });
};
