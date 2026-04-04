'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  onResult: (text: string) => void;
}

export default function ChatVoiceInput({ onResult }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      if (transcript.trim()) {
        onResult(transcript.trim());
        setTranscript('');
      }
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  if (!supported) return null;

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <button
        onClick={toggleListening}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isListening
            ? 'bg-red-500 animate-pulse scale-110'
            : 'bg-sto-surface border border-sto-border hover:border-sto-primary'
        }`}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </button>
      {isListening && (
        <span className="text-sm text-sto-muted animate-pulse">
          {transcript || '말해봐...'}
        </span>
      )}
      {!isListening && transcript && (
        <button
          onClick={() => { onResult(transcript.trim()); setTranscript(''); }}
          className="text-sm text-sto-primary"
        >
          전송
        </button>
      )}
    </div>
  );
}
