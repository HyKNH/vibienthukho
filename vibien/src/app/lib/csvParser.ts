//outdated
import Papa from 'papaparse';

interface ParsedPage {
  page_number: string;
  image_url: string;
  digitized_text: string;
}

export const parseCSV = (file: File): Promise<ParsedPage[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<ParsedPage>(file, {
      complete: (result) => {
        const parsedPages: ParsedPage[] = result.data.map((row) => ({
          page_number: row.page_number as string,
          image_url: row.image_url as string,
          digitized_text: row.digitized_text as string,
        }));
        resolve(parsedPages);
      },
      error: (error) => reject(error),
      header: true, 
    });
  });
};
