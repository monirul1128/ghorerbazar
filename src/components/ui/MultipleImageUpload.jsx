import { useState } from 'react';
import { XMarkIcon, PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { uploadImage, deleteImage } from '../../lib/storage';
import { toast } from 'sonner';

/**
 * Multiple Image Upload Component - File Upload Only
 */
export default function MultipleImageUpload({
  images = [''],
  onChange,
  folder = 'products',
  label = 'Product Images',
  required = false,
  maxImages = 5
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleFileUpload = async (file, index) => {
    if (!file) return;

    setUploading(true);
    setUploadingIndex(index);

    try {
      const url = await uploadImage(file, folder);
      const newImages = [...images];
      newImages[index] = url;
      onChange(newImages);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadingIndex(null);
    }
  };

  const handleRemove = async (index) => {
    const url = images[index];
    
    // Delete from storage if it's uploaded
    if (url && url.includes('supabase.co/storage')) {
      try {
        await deleteImage(url);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages.length === 0 ? [''] : newImages);
  };

  const handleAdd = () => {
    if (images.length < maxImages) {
      onChange([...images, '']);
    } else {
      toast.error(`Maximum ${maxImages} images allowed`);
    }
  };

  return (
    <div>
      {/* Label */}
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        <span className="text-gray-400 font-normal ml-1">
          ({images.filter(Boolean).length}/{maxImages})
        </span>
      </label>

      {/* Images Grid */}
      <div className="space-y-3">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            {url ? (
              <div className="relative">
                <div className="flex gap-3 items-start p-3 border-2 border-gray-200 rounded-lg bg-white">
                  {/* Image Preview */}
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                  />

                  {/* Image Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-700">
                        Image {index + 1}
                        {index === 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-brand-orange/10 text-brand-orange text-[10px] font-semibold rounded-full">
                            Main
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-green-600">☁️ Uploaded</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{url}</p>
                    
                    {/* Replace Upload Button */}
                    <label
                      htmlFor={`file-${index}`}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-orange hover:bg-orange-50 rounded-md cursor-pointer transition-colors"
                    >
                      <ArrowUpTrayIcon className="h-3.5 w-3.5" />
                      Replace Image
                      <input
                        id={`file-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], index)}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* Remove Button */}
                  {(images.length > 1 || index > 0) && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Remove image"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Uploading Overlay */}
                {uploading && uploadingIndex === index && (
                  <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent mx-auto mb-2" />
                      <p className="text-xs text-gray-600 font-medium">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <label
                  htmlFor={`file-${index}`}
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center">
                    <ArrowUpTrayIcon className="h-6 w-6 text-gray-400 mb-1.5" />
                    <p className="text-xs text-gray-500 font-medium">
                      Upload Image {index + 1}
                      {index === 0 && <span className="text-brand-orange"> *</span>}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      PNG, JPG, WEBP (max 5MB)
                    </p>
                  </div>
                  <input
                    id={`file-${index}`}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], index)}
                    disabled={uploading}
                  />
                </label>

                {/* Remove Button for empty slots (except first) */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add More Button */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={handleAdd}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange hover:underline"
          disabled={uploading}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add another image ({images.length}/{maxImages})
        </button>
      )}

      {/* Help Text */}
      <p className="mt-2 text-xs text-gray-400">
        {images.filter(Boolean).length === 0 
          ? 'First image will be the main product image'
          : 'Upload images from your computer'}
      </p>
    </div>
  );
}
