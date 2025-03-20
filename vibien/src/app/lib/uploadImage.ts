import { supabase } from './supabaseClient';

const sanitizeFileName = (fileName: string): string => {
    return fileName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-_]/g, '_');
};

export const uploadImage = async (file: File, bookId: string): Promise<string> => {
    const sanitizedFileName = sanitizeFileName(file.name);
    const filePath = `book-images/${bookId}/pages/${sanitizedFileName}`;

    const { data, error } = await supabase
        .storage
        .from('book-images') 
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error.message);
        return '';
    }

    return data?.path || '';
};
