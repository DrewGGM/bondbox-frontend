import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { ImagePreview, type ImagePreviewData } from './ImagePreview';

interface ChatInputProps {
  onSendMessage: (message: string, images?: File[]) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<ImagePreviewData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((message.trim() || images.length > 0) && !disabled) {
      const imageFiles = images.map(img => img.file);
      onSendMessage(message, imageFiles.length > 0 ? imageFiles : undefined);
      setMessage('');
      setImages([]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxImages = 5;

    const newImages: ImagePreviewData[] = [];

    for (let i = 0; i < files.length && images.length + newImages.length < maxImages; i++) {
      const file = files[i];

      if (!validTypes.includes(file.type)) {
        alert(`Tipo de archivo no soportado: ${file.name}. Solo se permiten JPEG, PNG, GIF y WebP.`);
        continue;
      }

      if (file.size > maxSize) {
        alert(`Archivo muy grande: ${file.name}. Tamaño máximo: 5MB.`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({ file, preview });
    }

    setImages([...images, ...newImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <ImagePreview images={images} onRemove={handleRemoveImage} />

      <div className="p-3 md:p-5 flex gap-2 md:gap-3 items-end">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || images.length >= 5}
          className="w-10 h-10 md:w-11 md:h-11 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          type="button"
        >
          <ImageIcon size={18} className="md:w-5 md:h-5" />
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje o adjunta imágenes..."
          disabled={disabled}
          rows={1}
          className="flex-1 px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-3xl text-xs sm:text-sm outline-none resize-none max-h-32 focus:border-primary transition-colors disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={(!message.trim() && images.length === 0) || disabled}
          className="w-10 h-10 md:w-11 md:h-11 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};