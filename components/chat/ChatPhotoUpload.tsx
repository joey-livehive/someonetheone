'use client';

import { useRef, useState } from 'react';

interface Props {
  onUpload: (dataUrl: string) => void;
  onSkip?: () => void;
}

export default function ChatPhotoUpload({ onUpload, onSkip }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="animate-fade-in space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {!preview ? (
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 py-3 rounded-xl border border-sto-border bg-sto-surface text-sm font-medium hover:border-sto-primary transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            사진 올리기
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-4 py-3 rounded-xl text-sm text-sto-muted hover:text-white transition-colors"
            >
              나중에
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-sto-border">
            <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onUpload(preview)}
              className="flex-1 py-3 rounded-xl bg-sto-primary hover:bg-sto-primary-light text-white text-sm font-semibold transition-colors"
            >
              이 사진으로 할게
            </button>
            <button
              onClick={() => { setPreview(null); }}
              className="px-4 py-3 rounded-xl text-sm text-sto-muted hover:text-white transition-colors"
            >
              다시
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
