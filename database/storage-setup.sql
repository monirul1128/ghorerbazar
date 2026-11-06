-- ===========================================================================
-- Supabase Storage Setup for GhorerBazar
-- Run this in Supabase SQL Editor to create storage bucket and policies
-- ===========================================================================

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- Storage Policies (Drop existing and recreate)
-- ===========================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Allow anyone to view/download images (public access)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- ===========================================================================
-- Verification
-- ===========================================================================

-- Verify bucket was created
SELECT 
  id, 
  name, 
  public,
  created_at 
FROM storage.buckets 
WHERE id = 'product-images';

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname IN (
    'Public Access',
    'Authenticated users can upload',
    'Authenticated users can update', 
    'Authenticated users can delete'
  );

-- ===========================================================================
-- DONE!
-- You can now upload images through the admin panel
-- ===========================================================================
