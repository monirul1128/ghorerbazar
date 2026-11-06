-- ===========================================================================
-- Supabase Storage Setup for GhorerBazar
-- Run this in Supabase SQL Editor to create storage bucket and policies
-- ===========================================================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- Storage Policies
-- ===========================================================================

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
SELECT * FROM storage.buckets WHERE id = 'product-images';

-- Verify policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%product-images%' OR policyname LIKE '%Public Access%' OR policyname LIKE '%Authenticated%';

-- ===========================================================================
-- DONE!
-- You can now upload images through the admin panel
-- ===========================================================================
