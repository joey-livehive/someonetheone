'use client';

import { useEffect, useState } from 'react';

interface Props {
  role: 'ai' | 'user';
  children: React.ReactNode;
  animate?: boolean;
}

export default function ChatBubble({ role, children, animate = true }: Props) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [animate]);

  const isAi = role === 'ai';

  return (
    <div
      className={`flex ${isAi ? 'justify-start' : 'justify-end'} transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {isAi && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sto-primary to-sto-accent flex items-center justify-center text-xs font-bold mr-2 mt-1">
          S
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl text-[15px] leading-relaxed overflow-hidden ${
          isAi
            ? 'bg-sto-surface text-sto-text rounded-tl-md'
            : 'bg-sto-primary text-white rounded-tr-md'
        }`}
      >
        {typeof children === 'string' && children.startsWith('data:image') ? (
          <img src={children} alt="사진" className="w-48 h-48 object-cover" />
        ) : (
          <div className="px-4 py-3">{children}</div>
        )}
      </div>
    </div>
  );
}
