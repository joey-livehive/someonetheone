'use client';

interface Props {
  choices: string[];
  onSelect: (choice: string) => void;
}

export default function ChatChoices({ choices, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      {choices.map((choice) => (
        <button
          key={choice}
          onClick={() => onSelect(choice)}
          className="px-4 py-2.5 rounded-full border border-sto-border bg-sto-surface text-sm font-medium text-white hover:border-sto-primary hover:bg-sto-primary/10 active:scale-95 transition-all duration-200"
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
