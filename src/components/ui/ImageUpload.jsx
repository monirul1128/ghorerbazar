import { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { uploadImage, deleteImage } from '../../lib/storage';
import { toast } from 'sonner';

/**
 * Image Upload Component - File Upload Only
 */
export default function ImageUpload({ 
  value, 
  onChange, 
  folder = 'products',
  label = 'Image',
  required = false,
  className = ''
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value && value.includes('supabase.co/storage')) {
      try {
        await deleteImage(value);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    onChange('');
  };

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative mb-3 group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-sm">
            ☁️ Uploaded
          </div>
        </div>
      )}

      {/* Upload Box */}
      <label
        htmlFor={`file-upload-${label}`}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          uploading
            ? 'border-brand-orange bg-orange-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent mb-2" />
              <p className="text-xs text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500 font-medium">
                {value ? 'Click to replace image' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP, GIF (max 5MB)
              </p>
            </>
          )}
        </div>
        <input
          id={`file-upload-${label}`}
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
