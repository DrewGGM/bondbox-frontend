import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';

interface VerificationCodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length = 6,
  onComplete,
  disabled = false,
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newValues.every((v) => v !== '')) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);

    // Only allow numeric paste
    if (!/^\d+$/.test(pastedData)) return;

    const newValues = [...values];
    pastedData.split('').forEach((char, i) => {
      if (i < length) {
        newValues[i] = char;
      }
    });
    setValues(newValues);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();

    // Check if complete
    if (newValues.every((v) => v !== '')) {
      onComplete(newValues.join(''));
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};
