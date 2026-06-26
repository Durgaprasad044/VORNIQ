import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface InputBarProps {
  onSend: (message: string) => void;
  personaName: string;
  disabled: boolean;
}

export default function InputBar({
  onSend,
  personaName,
  disabled,
}: InputBarProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
    }
  };

  // Adjust height of textarea dynamically based on input length
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div 
      className={`w-full bg-[#0a0a0a] border-t-[0.5px] border-[#1a1a1a] p-4 transition-opacity duration-150 ${
        disabled ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-end gap-3 bg-[#1a1a1a] border-[0.5px] border-[#222222] rounded-xl p-2 px-3">
        <svg className="w-5 h-5 text-[#666666] mb-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={`Ask ${personaName} about your financials...`}
          rows={1}
          className="flex-1 bg-[#1a1a1a] text-white placeholder-[#666666] text-sm focus:outline-none resize-none min-h-[36px] max-h-[160px] py-2 px-1 align-bottom rounded-lg"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-9 h-9 min-w-[36px] bg-[#22c55e] hover:bg-[#22c55e]/90 text-black flex items-center justify-center rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
          aria-label="Send message"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
