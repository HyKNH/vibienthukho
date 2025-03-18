import { supabase } from './supabaseClient';

// Function to sanitize the file name to avoid problematic characters
const sanitizeFileName = (fileName: string): string => {
    return fileName
        .normalize('NFD')  // Normalize unicode characters (removes accents, etc.)
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
        .replace(/[^a-zA-Z0-9.-_]/g, '_'); // Replace non-ASCII characters with underscores
};

export const uploadImage = async (file: File, bookId: string): Promise<string> => {
    const sanitizedFileName = sanitizeFileName(file.name); // Sanitize the file name
    const filePath = `book-images/${bookId}/pages/${sanitizedFileName}`;

    // Upload image
    const { data, error } = await supabase
        .storage
        .from('book-images')  // Your bucket name
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error.message);
        return ''; // Return an empty string in case of error
    }

    return data?.path || ''; // Return the path if available
};
