'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatChoices from '../../components/chat/ChatChoices';
import ChatTextInput from '../../components/chat/ChatTextInput';
import ChatPhotoUpload from '../../components/chat/ChatPhotoUpload';
import ChatVoiceInput from '../../components/chat/ChatVoiceInput';
import ChatRankedChoices from '../../components/chat/ChatRankedChoices';
import { CHAT_STEPS } from '../../components/chat/chatSteps';

interface DisplayMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

interface Snapshot {
  stepIndex: number;
  answers: Record<string, any>;
  messages: DisplayMessage[];
}

function interpolate(text: string, answers: Record<string, any>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => answers[key] || key);
}

export default function StartPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitRef = useRef(false);

  // Refs to always have latest values (avoid stale closures)
  const stepIndexRef = useRef(stepIndex);
  const answersRef = useRef(answers);
  stepIndexRef.current = stepIndex;
  answersRef.current = answers;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // AI 메시지를 순차적으로 추가
  const showAiMessages = useCallback(
    async (msgs: string[], currentAnswers: Record<string, any>, delay?: number) => {
      setIsTyping(true);
      setShowInput(false);

      for (let i = 0; i < msgs.length; i++) {
        const d = i === 0 ? 500 : (delay || 600);
        await new Promise((r) => setTimeout(r, d));
        const text = interpolate(msgs[i], currentAnswers);
        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}-${i}`, role: 'ai', text },
        ]);
        scrollToBottom();
      }

      setIsTyping(false);
      setShowInput(true);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  // 첫 스텝 시작
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    const step = CHAT_STEPS[0];
    showAiMessages(step.messages, {}, step.delay);
  }, [showAiMessages]);

  // 이전 스텝으로 돌아가기
  function handleUndo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setMessages(prev.messages);
    setStepIndex(prev.stepIndex);
    stepIndexRef.current = prev.stepIndex;
    setAnswers(prev.answers);
    answersRef.current = prev.answers;
    setHistory((h) => h.slice(0, -1));
    setShowInput(true);
  }

  // 유저 답변 처리
  async function handleAnswer(value: string) {
    // 현재 상태 스냅샷 저장 (되돌리기용)
    const currentMessages = [...messages];
    const currentStepIndex = stepIndexRef.current;
    const currentAnswers = { ...answersRef.current };
    setHistory((h) => [...h, { stepIndex: currentStepIndex, answers: currentAnswers, messages: currentMessages }]);

    // 유저 메시지 추가 (자동 진행은 표시 안 함)
    if (value !== '_auto') {
      const displayValue = value === '__skipped__' ? '나중에 할게' : value;
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: 'user', text: displayValue },
      ]);
    }
    setShowInput(false);
    scrollToBottom();

    const step = CHAT_STEPS[currentStepIndex];
    const newAnswers = { ...currentAnswers, [step.field]: value };
    setAnswers(newAnswers);
    answersRef.current = newAnswers;

    // 호응 멘트 표시
    if (step.reactions && value !== '_auto') {
      let reactionMsgs: string[] | undefined;
      if (Array.isArray(step.reactions)) {
        reactionMsgs = step.reactions;
      } else {
        reactionMsgs = step.reactions[value] || step.reactions['_default'];
      }
      if (reactionMsgs) {
        await showAiMessages(reactionMsgs, newAnswers, 400);
        setShowInput(false);
      }
    }

    const nextIndex = currentStepIndex + 1;

    // 마지막 스텝이면 저장하고 이동
    if (nextIndex >= CHAT_STEPS.length) {
      try {
        localStorage.setItem('sto_onboarding', JSON.stringify(newAnswers));
      } catch (e) {
        console.warn('localStorage 저장 실패 (용량 초과 가능):', e);
      }
      await new Promise((r) => setTimeout(r, 500));
      router.push('/my-card');
      return;
    }

    // 다음 스텝
    setStepIndex(nextIndex);
    stepIndexRef.current = nextIndex;
    const nextStep = CHAT_STEPS[nextIndex];

    // skipIf 체크
    if (nextStep.skipIf && nextStep.skipIf(newAnswers)) {
      const skipIndex = nextIndex + 1;
      setStepIndex(skipIndex);
      stepIndexRef.current = skipIndex;
      const skipToStep = CHAT_STEPS[skipIndex];
      if (skipToStep) {
        await showAiMessages(skipToStep.messages, newAnswers, skipToStep.delay);
        if (skipToStep.inputType === 'none') {
          await new Promise((r) => setTimeout(r, 500));
          await handleAnswer('_auto');
        }
      }
      return;
    }

    await showAiMessages(nextStep.messages, newAnswers, nextStep.delay);

    // inputType이 'none'이면 자동으로 다음 스텝으로
    if (nextStep.inputType === 'none') {
      await new Promise((r) => setTimeout(r, 500));
      await handleAnswer('_auto');
    }
  }

  const currentStep = CHAT_STEPS[stepIndex];
  const progress = ((stepIndex + 1) / CHAT_STEPS.length) * 100;
  const canUndo = history.length > 0 && showInput && !isTyping;

  return (
    <main className="min-h-screen flex flex-col bg-sto-bg">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-sto-surface">
        <div
          className="h-full bg-gradient-to-r from-sto-primary to-sto-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back button */}
      {canUndo && (
        <button
          onClick={handleUndo}
          className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sto-surface/80 backdrop-blur border border-sto-border text-sm text-sto-muted hover:text-white transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          이전
        </button>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto pt-8 pb-4 px-4">
        <div className="max-w-lg mx-auto space-y-3">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role}>
              {msg.text}
            </ChatBubble>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sto-primary to-sto-accent flex items-center justify-center text-xs font-bold mr-2">
                S
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-sto-surface">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-sto-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-sto-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-sto-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      {showInput && (
        <div className="sticky bottom-0 bg-gradient-to-t from-sto-bg via-sto-bg to-transparent pt-6 pb-6 px-4">
          <div className="max-w-lg mx-auto space-y-3">
            {/* Voice input */}
            {(currentStep.inputType === 'text' || currentStep.inputType === 'textarea') && (
              <div className="flex justify-end">
                <ChatVoiceInput onResult={handleAnswer} />
              </div>
            )}

            {/* Choice */}
            {currentStep.inputType === 'choice' && (
              <ChatChoices
                choices={(currentStep.choicesFn ? currentStep.choicesFn(answers) : currentStep.choices) || []}
                onSelect={handleAnswer}
              />
            )}

            {/* Ranked Choice */}
            {currentStep.inputType === 'ranked-choice' && (
              <ChatRankedChoices
                choices={(currentStep.choicesFn ? currentStep.choicesFn(answers) : currentStep.choices) || []}
                onSubmit={handleAnswer}
              />
            )}

            {/* Text */}
            {currentStep.inputType === 'text' && (
              <ChatTextInput
                placeholder={currentStep.placeholder}
                onSend={handleAnswer}
              />
            )}

            {/* Textarea */}
            {currentStep.inputType === 'textarea' && (
              <ChatTextInput
                placeholder={currentStep.placeholder}
                multiline
                onSend={handleAnswer}
              />
            )}

            {/* Date */}
            {currentStep.inputType === 'date' && (
              <ChatTextInput
                type="date"
                placeholder="생년월일"
                onSend={handleAnswer}
              />
            )}

            {/* Phone */}
            {currentStep.inputType === 'phone' && (
              <ChatTextInput
                type="tel"
                placeholder={currentStep.placeholder}
                onSend={handleAnswer}
              />
            )}

            {/* Photo */}
            {currentStep.inputType === 'photo' && (
              <ChatPhotoUpload
                onUpload={handleAnswer}
                onSkip={() => handleAnswer('__skipped__')}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
