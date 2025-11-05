import React from 'react';
import { X } from 'lucide-react';

export interface ImagePreviewData {
  file: File;
  preview: string;
}

interface ImagePreviewProps {
  images: ImagePreviewData[];
  onRemove: (index: number) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap px-3 md:px-5 py-2">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image.preview}
            alt={`Preview ${index + 1}`}
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-b-lg truncate">
            {image.file.name}
          </div>
        </div>
      ))}
    </div>
  );
};
