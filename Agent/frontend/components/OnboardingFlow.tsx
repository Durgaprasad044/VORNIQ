'use client';

import React, { useState } from 'react';
import { PERSONAS, PersonaId } from './Sidebar';

interface OnboardingFlowProps {
  onComplete: (answers: Record<string, string>) => void;
  onSkip: () => void;
}

const STEPS = [
  {
    id: 'income',
    title: 'What is your approximate monthly income?',
    placeholder: 'e.g. ₹1,20,000 per month',
    persona: 'dana' as PersonaId,
  },
  {
    id: 'investments',
    title: 'Do you have any investments? (stocks, mutual funds, FDs, etc.)',
    placeholder: 'e.g. ₹5L in mutual funds, ₹2L in stocks',
    persona: 'quinn' as PersonaId,
  },
  {
    id: 'debts',
    title: 'Do you have any outstanding debts or loans?',
    placeholder: 'e.g. Home loan ₹30L, Car loan ₹5L',
    persona: 'cassandra' as PersonaId,
  },
  {
    id: 'goals',
    title: 'What are your top financial goals?',
    placeholder: 'e.g. Build emergency fund, Save for retirement, Buy a house',
    persona: 'morgan' as PersonaId,
  },
  {
    id: 'budget',
    title: 'What is your approximate monthly expense budget?',
    placeholder: 'e.g. ₹60,000 (rent, food, transport, etc.)',
    persona: 'riley' as PersonaId,
  },
];

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentValue, setCurrentValue] = useState('');

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    const updated = { ...answers, [step.id]: currentValue };
    setAnswers(updated);
    setCurrentValue('');

    if (isLast) {
      onComplete(updated);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const personaInfo = PERSONAS.find((p) => p.id === step.persona);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-wide" style={{ color: 'var(--text-primary)' }}>VORNIQ</span>
          </div>
          <button
            onClick={onSkip}
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            Skip for now
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          className="rounded-2xl border p-6 mb-6"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              {personaInfo?.role?.charAt(0) || 'V'}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              {personaInfo?.role || 'VORNIQ'} asks:
            </span>
          </div>

          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {step.title}
          </h2>

          <textarea
            autoFocus
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={step.placeholder}
            rows={3}
            className="w-full rounded-xl border p-3 text-sm focus:outline-none resize-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep > 0) {
                setCurrentStep((prev) => prev - 1);
                setCurrentValue(answers[STEPS[currentStep - 1].id] || '');
              }
            }}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#000000',
            }}
          >
            {isLast ? 'Complete Setup' : 'Continue'}
            {!isLast && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i <= currentStep ? 'var(--accent)' : 'var(--border-primary)',
                transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
