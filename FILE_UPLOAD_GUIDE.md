# 📸 File Upload System - Setup Guide

The admin panel now supports **file upload** in addition to image URLs!

## ✨ Features

- ✅ **File Upload**: Upload images directly from your computer
- ✅ **URL Support**: Still can use image URLs if you prefer
- ✅ **Multiple Images**: Upload multiple product images
- ✅ **Preview**: See images before saving
- ✅ **Drag & Drop**: Drag files directly into upload area
- ✅ **Cloud Storage**: All uploads stored in Supabase Storage
- ✅ **Auto Delete**: Old images automatically deleted when replaced

---

## 🔧 Setup (One-Time Only)

### Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard/project/edqndixwndwcttmrznad

2. Click **SQL Editor** (left sidebar)

3. Click **New query**

4. Open the file: `database/storage-setup.sql`

5. Copy all contents and paste into SQL Editor

6. Click **Run** (or press Ctrl+Enter)

7. Wait for "Success" message

**This creates:**
- ✅ Storage bucket named `product-images`
- ✅ Public access policies (anyone can view)
- ✅ Upload/delete policies (admin only)

---

### Step 2: Verify Storage is Set Up

1. In Supabase dashboard, click **Storage** (left sidebar)

2. You should see a bucket named **product-images**

3. Click on it - it should be empty (that's okay!)

**If you don't see the bucket:**
- Make sure you ran the SQL file
- Check SQL Editor for any error messages
- Make sure you're in the correct Supabase project

---

## 🎨 Using File Upload in Admin Panel

### Upload Product Images

1. **Login to admin panel**: https://your-vercel-url.vercel.app/admin

2. **Go to Products** → Click **Add Product** or **Edit** existing product

3. **In Images section**, you'll see two modes:

#### 📁 Upload File Mode (Recommended)
- Click the upload area or drag files
- Select image from your computer
- Wait for upload (shows progress)
- Image URL automatically filled

#### 🔗 URL Mode (Alternative)
- Click "Use URL" button
- Paste image URL
- Click "Save"

### Upload Category Images

1. Go to **Categories** tab
2. Click **Add Category** or **Edit**
3. Choose **Upload File** or **Use URL**
4. Upload image or paste URL

### Upload Brand Logos

1. Go to **Brands** tab
2. Click **Add Brand** or **Edit**
3. Choose **Upload File** or **Use URL**
4. Upload logo or paste URL

### Upload Hero Banners

1. Go to **Banners** page
2. Click **Add Banner** or **Edit**
3. Upload banner image
4. Add title, subtitle, link
5. Save

---

## 📋 File Requirements

| Property | Requirement |
|----------|-------------|
| **File Types** | JPG, PNG, WEBP, GIF |
| **Max Size** | 5 MB per file |
| **Dimensions** | Any (auto-resized for display) |
| **Products** | Up to 5 images per product |
| **Categories** | 1 image per category |
| **Brands** | 1 logo per brand |

---

## 🎯 How It Works

### Upload Process:

```
1. Select File
   ↓
2. Validate (type, size)
   ↓
3. Upload to Supabase Storage
   ↓
4. Generate unique filename
   ↓
5. Get public URL
   ↓
6. Save URL to database
   ↓
7. Display in admin panel ✅
```

### File Storage Structure:

```
product-images/
├── products/
│   ├── 1793958000-abc123.jpg
│   ├── 1793958100-def456.png
│   └── ...
├── categories/
│   ├── 1793958200-ghi789.jpg
│   └── ...
├── brands/
│   ├── 1793958300-jkl012.png
│   └── ...
└── banners/
    ├── 1793958400-mno345.webp
    └── ...
```

---

## 🔒 Security

### What's Secure:
- ✅ Only authenticated admins can upload
- ✅ File type validation (only images)
- ✅ File size limits (max 5MB)
- ✅ Unique filenames (prevents conflicts)
- ✅ Images stored in Supabase (not your server)

### What's Public:
- ✅ Uploaded images are publicly accessible (needed for website)
- ✅ Anyone can view images via URL (this is normal for e-commerce)

---

## 💡 Tips & Best Practices

### Image Optimization:
- ✅ Use compressed images (smaller file size = faster loading)
- ✅ Recommended dimensions:
  - Product images: 800x800px
  - Category images: 400x300px
  - Brand logos: 200x200px
  - Hero banners: 1920x600px

### File Naming:
- ✅ Files auto-renamed with timestamp
- ✅ No need to rename before upload
- ✅ Spaces and special characters handled automatically

### Best Format:
- **Photos**: Use JPG (smaller size)
- **Graphics/Logos**: Use PNG (transparency support)
- **Modern browsers**: Use WEBP (best compression)

---

## 🐛 Troubleshooting

### "Upload failed" Error

**Solutions:**
1. Check file size (must be under 5MB)
2. Check file type (only JPG, PNG, WEBP, GIF)
3. Check internet connection
4. Make sure storage bucket exists (run storage-setup.sql)
5. Check Supabase service_role key in environment variables

### "Cannot read bucket" Error

**Solutions:**
1. Run `database/storage-setup.sql` in Supabase SQL Editor
2. Check Storage bucket exists in Supabase dashboard
3. Check bucket name is `product-images` (exactly)

### Images Not Showing After Upload

**Solutions:**
1. Hard refresh page (Ctrl+Shift+R)
2. Check browser console for errors
3. Check image URL in database (should start with supabase.co)
4. Verify bucket is set to public in Supabase

### Slow Upload Speed

**Solutions:**
1. Compress images before upload
2. Use smaller image dimensions
3. Check your internet speed
4. Try uploading one image at a time

---

## 🔄 Migration from URL-Only System

If you have existing products with external URLs:

### Keep Existing URLs:
- ✅ Old URLs still work
- ✅ No need to re-upload
- ✅ Mix of uploaded + URL images is fine

### Migrate to Uploaded Images:
1. Edit product in admin panel
2. Upload new image file
3. Old URL automatically replaced
4. Save product

---

## 🎨 Features Comparison

| Feature | Image URL | File Upload |
|---------|-----------|-------------|
| **Ease of Use** | Need to host elsewhere | Direct upload ✅ |
| **Speed** | Fast (already hosted) | Slower upload |
| **Control** | External hosting | Full control ✅ |
| **Cost** | Free (use external) | Free (Supabase) ✅ |
| **Reliability** | Depends on source | Reliable ✅ |
| **Privacy** | Public URLs | Supabase CDN ✅ |

---

## 📞 Need Help?

### Common Questions:

**Q: Can I still use image URLs?**  
A: Yes! Click "Use URL" button and paste any image URL.

**Q: Where are uploaded files stored?**  
A: In your Supabase Storage bucket (cloud storage).

**Q: Are old URLs still working?**  
A: Yes, existing URLs continue to work.

**Q: Can customers upload images?**  
A: No, only admins can upload through admin panel.

**Q: How do I delete old images?**  
A: Replace or remove in admin panel. Storage auto-cleanup happens.

**Q: Is there a storage limit?**  
A: Supabase free tier: 1GB storage. Plenty for product images!

---

## ✅ Setup Checklist

- [ ] Ran `storage-setup.sql` in Supabase SQL Editor
- [ ] Verified bucket exists in Storage section
- [ ] Tested uploading one image
- [ ] Tested multiple images upload
- [ ] Tested replacing an image
- [ ] Tested deleting an image
- [ ] Deployed updated code to Vercel

**Once all checked, you're ready to use file uploads!** 🎉

---

## 🚀 What's Next?

Optional enhancements you can add later:

- 📦 Image compression before upload
- 🖼️ Image cropping/editing tool
- 📁 Bulk upload multiple files
- 🗂️ Image gallery/library
- 🔍 Image search
- 📊 Storage usage statistics

Need any of these? Let me know! 💪
