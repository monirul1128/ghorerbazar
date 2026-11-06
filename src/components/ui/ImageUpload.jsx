import { useState } from 'react';
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { uploadImage, deleteImage } from '../../lib/storage';
import { toast } from 'sonner';

/**
 * Image Upload Component
 * Supports both file upload and URL input
 */
export default function ImageUpload({ 
  value, 
  onChange, 
  folder = 'products',
  label = 'Image',
  required = false,
  showUrlInput = true,
  className = ''
}) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [mode, setMode] = useState(value && value.startsWith('http') ? 'url' : 'upload');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      setUrlInput(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      // Only delete if it's from our storage
      if (value.includes('supabase.co/storage')) {
        try {
          await deleteImage(value);
        } catch (error) {
          console.error('Delete error:', error);
        }
      }
    }
    onChange('');
    setUrlInput('');
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      toast.success('Image URL saved');
    }
  };

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Mode Toggle */}
      {showUrlInput && (
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'upload'
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📁 Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'url'
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔗 Use URL
          </button>
        </div>
      )}

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
            {value.includes('supabase.co') ? '☁️ Uploaded' : '🔗 External URL'}
          </div>
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-2">
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
                    Click to upload or drag and drop
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
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onBlur={handleUrlSubmit}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-500 transition-colors"
          >
            Save
          </button>
        </div>
      )}

      {/* Help Text */}
      <p className="mt-2 text-xs text-gray-400">
        {mode === 'upload'
          ? 'Upload from your computer or switch to URL mode'
          : 'Paste an image URL from the internet'}
      </p>
    </div>
  );
}
