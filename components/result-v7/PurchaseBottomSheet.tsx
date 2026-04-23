'use client';

import { useEffect, useState } from 'react';
import { PricingPlan } from '@/lib/report/types';

interface Plan extends PricingPlan {
  desc: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: '스타터',
    originalPrice: 44900,
    discountedPrice: 39900,
    discountPercent: 11,
    cardCount: 5,
    desc: '엄선된 5명 프로필 카드 전달',
  },
  {
    id: 'regular',
    name: '레귤러',
    originalPrice: 89900,
    discountedPrice: 69900,
    discountPercent: 22,
    cardCount: 10,
    recommended: true,
    desc: '엄선된 10명 프로필 카드 전달',
  },
  {
    id: 'premium',
    name: '프리미엄',
    originalPrice: 149900,
    discountedPrice: 99900,
    discountPercent: 33,
    cardCount: 20,
    desc: '엄선된 20명 프로필 카드 전달',
  },
];

function perPerson(plan: Plan) {
  return Math.round(plan.discountedPrice / plan.cardCount).toLocaleString();
}

interface Props {
  open: boolean;
  onClose: () => void;
  reportId: string;
}

export function PurchaseBottomSheet({ open, onClose, reportId }: Props) {
  const [selectedId, setSelectedId] = useState<Plan['id']>('regular');
  const selected = plans.find((p) => p.id === selectedId)!;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const handlePay = () => {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (fbq) {
      fbq('track', 'InitiateCheckout', {
        value: selected.discountedPrice,
        currency: 'KRW',
        content_ids: ['someonetheone'],
        content_name: `report_${reportId}_${selected.id}`,
      });
    }
    alert(
      `[테스트] ${selected.name} 플랜 · ${selected.discountedPrice.toLocaleString()}원\n실제 결제는 PG 연동 후에 동작합니다.`,
    );
  };

  return (
    <>
      <div
        className={`v7-sheet-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={`v7-sheet${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="플랜 선택"
      >
        <div className="sheet-grab" />
        <div className="sheet-head">
          <span className="sh-kicker">SELECT A PLAN</span>
          <button type="button" className="sh-close" onClick={onClose} aria-label="닫기">
            닫기
          </button>
        </div>
        <div className="sh-title">플랜을 선택해 주세요.</div>

        <div className="sheet-plans">
          {plans.map((p) => {
            const isSelected = selectedId === p.id;
            const cls = ['plan'];
            if (isSelected) cls.push('selected');
            if (p.recommended) cls.push('recommend');
            return (
              <div
                key={p.id}
                className={cls.join(' ')}
                onClick={() => setSelectedId(p.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(p.id);
                  }
                }}
              >
                <div className="plan-top">
                  <span className="plan-name">{p.name}</span>
                  <div className="price-stack">
                    <div>
                      <span className="price-badge">-{p.discountPercent}%</span>
                      <span className="price-original">{p.originalPrice.toLocaleString()}원</span>
                    </div>
                    <div className="price-current">
                      {p.discountedPrice.toLocaleString()}
                      <span className="won">원</span>
                    </div>
                  </div>
                </div>
                <p className="plan-desc">{p.desc}</p>
                <p className="plan-per">1인당 약 {perPerson(p)}원</p>
              </div>
            );
          })}
        </div>

        <div className="sheet-terms">
          결제 정보를 확인했으며{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>
            개인정보 처리방침
          </a>
          과{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>
            서비스 이용약관
          </a>
          에 동의합니다.
        </div>

        <div className="sheet-pay">
          <button type="button" onClick={handlePay}>
            <span>결제 진행</span>
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 7H13M13 7L8 2M13 7L8 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
