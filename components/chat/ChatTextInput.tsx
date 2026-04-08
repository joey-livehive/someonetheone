'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  placeholder?: string;
  multiline?: boolean;
  type?: 'text' | 'tel' | 'date';
  onSend: (value: string) => void;
}

export default function ChatTextInput({ placeholder, multiline, type = 'text', onSend }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const sharedClass =
    'w-full bg-sto-surface border border-sto-border rounded-xl px-4 py-3 text-white placeholder-sto-muted/50 focus:outline-none focus:border-sto-primary text-[15px] transition-colors';

  return (
    <div className="flex items-end gap-2 animate-fade-in">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={sharedClass}
        />
      )}
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="flex-shrink-0 w-11 h-11 rounded-xl bg-sto-primary hover:bg-sto-primary-light disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
