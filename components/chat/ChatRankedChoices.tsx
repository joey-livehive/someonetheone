'use client';

import { useState } from 'react';

interface Props {
  choices: string[];
  onSubmit: (ranked: string) => void;
}

export default function ChatRankedChoices({ choices, onSubmit }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(choice: string) {
    setSelected((prev) => {
      if (prev.includes(choice)) {
        return prev.filter((c) => c !== choice);
      }
      return [...prev, choice];
    });
  }

  function handleSubmit() {
    if (selected.length === 0) return;
    onSubmit(selected.join(' > '));
  }

  return (
    <div className="animate-fade-in space-y-3">
      <p className="text-xs text-sto-muted">
        누르는 순서가 우선순위! ({selected.length}/{choices.length}개 선택)
      </p>
      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => {
          const idx = selected.indexOf(choice);
          const isSelected = idx !== -1;
          return (
            <button
              key={choice}
              onClick={() => toggle(choice)}
              className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'border-sto-primary bg-sto-primary/20 text-sto-text'
                  : 'border-sto-border bg-sto-surface text-sto-text hover:border-sto-primary hover:bg-sto-primary/10'
              }`}
            >
              {isSelected && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sto-primary text-xs font-bold mr-1.5">
                  {idx + 1}
                </span>
              )}
              {choice}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-sto-primary hover:bg-sto-primary-light text-white text-sm font-semibold transition-colors"
        >
          선택 완료
        </button>
      )}
    </div>
  );
}
