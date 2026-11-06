import { supabaseAdmin } from './supabaseAdmin';
import { toast } from 'sonner';

const BUCKET_NAME = 'product-images';

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (e.g., 'products', 'categories', 'brands', 'banners')
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export async function uploadImage(file, folder = 'products') {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Upload failed');
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload multiple files
 * @param {FileList|File[]} files - Files to upload
 * @param {string} folder - Folder path
 * @returns {Promise<string[]>} - Array of public URLs
 */
export async function uploadMultipleImages(files, folder = 'products') {
  const filesArray = Array.from(files);
  const uploadPromises = filesArray.map(file => uploadImage(file, folder));
  
  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} url - Public URL of the file
 * @returns {Promise<void>}
 */
export async function deleteImage(url) {
  try {
    if (!url) return;

    // Extract file path from URL
    const urlParts = url.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) {
      console.warn('Invalid URL format');
      return;
    }
    
    const filePath = urlParts[1];

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(error.message || 'Delete failed');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for delete failures - log and continue
  }
}

/**
 * Create storage bucket if it doesn't exist
 * This should be called once during setup
 */
export async function initializeStorage() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
      // Create bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return;
      }

      console.log('Storage bucket created successfully');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}
