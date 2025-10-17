import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 md:p-5 bg-white border-t border-gray-200 flex gap-2 md:gap-3 items-end">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Escribe tu mensaje..."
        disabled={disabled}
        rows={1}
        className="flex-1 px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-3xl text-xs sm:text-sm outline-none resize-none max-h-32 focus:border-primary transition-colors disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="w-10 h-10 md:w-11 md:h-11 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        <Send size={18} className="md:w-5 md:h-5" />
      </button>
    </div>
  );
};