import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { PERSONAS, PersonaId } from './Sidebar';
import VoiceInput from './VoiceInput';
import FileUpload from './FileUpload';

interface InputBarProps {
  onSend: (message: string) => void;
  selectedPersona: PersonaId;
  setSelectedPersona: (persona: PersonaId) => void;
  disabled: boolean;
  onFileContent?: (content: string, fileName: string) => void;
  onVoiceTranscript?: (text: string) => void;
}

const PLACEHOLDER_TEXTS: Record<PersonaId, { en: string; hi: string }> = {
  dana: { en: 'Ask Dana about accounts, reconciliations...', hi: 'Dana se accounts, reconciliation ke baare mein puchein...' },
  morgan: { en: 'Ask Morgan about valuation, DCF, scenarios...', hi: 'Morgan se valuation, DCF, scenarios ke baare mein puchein...' },
  riley: { en: 'Ask Riley about budget, forecasts, variance...', hi: 'Riley se budget, forecasts, variance ke baare mein puchein...' },
  quinn: { en: 'Ask Quinn about investments, portfolio, risk...', hi: 'Quinn se investments, portfolio, risk ke baare mein puchein...' },
  cassandra: { en: 'Ask Cassandra about tax, deductions, compliance...', hi: 'Cassandra se tax, deductions, compliance ke baare mein puchein...' },
};

function detectLanguage(text: string): 'hi' | 'en' {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
}

export default function InputBar({
  onSend,
  selectedPersona,
  setSelectedPersona,
  disabled,
  onFileContent,
  onVoiceTranscript,
}: InputBarProps) {
  const [value, setValue] = useState('');
  const [personaOpen, setPersonaOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const personaMenuRef = useRef<HTMLDivElement>(null);
  const [detectedLang, setDetectedLang] = useState<'en' | 'hi'>('en');

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

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

  // Close persona dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setPersonaOpen(false);
      }
    };
    if (personaOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [personaOpen]);

  // Detect language as user types
  useEffect(() => {
    if (value.trim()) {
      setDetectedLang(detectLanguage(value));
    }
  }, [value]);

  const placeholder = PLACEHOLDER_TEXTS[selectedPersona]?.[detectedLang] || 'Ask about your financials...';
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div
      className="w-full border-t p-3 md:p-4 transition-opacity duration-150"
      style={{
        backgroundColor: 'var(--bg-base)',
        borderColor: 'var(--border-subtle)',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div className="max-w-4xl mx-auto flex items-end gap-2 rounded-xl p-2 px-3" style={{ backgroundColor: 'var(--bg-input)', border: '0.5px solid var(--border-primary)' }}>
        <svg className="w-5 h-5 mb-2 flex-shrink-0 hidden sm:block" style={{ color: 'var(--text-faint)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 text-sm focus:outline-none resize-none min-h-[36px] max-h-[160px] py-2 px-1 align-bottom rounded-lg"
          style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}
        />

        {/* File Upload */}
        {onFileContent && (
          <FileUpload onFileContent={onFileContent} disabled={disabled} />
        )}

        {/* Voice Input */}
        {onVoiceTranscript && (
          <VoiceInput onTranscript={onVoiceTranscript} disabled={disabled} />
        )}

        {/* Persona Selector */}
        <div className="relative flex-shrink-0" ref={personaMenuRef}>
          <button
            onClick={() => setPersonaOpen(!personaOpen)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap disabled:opacity-50 transition-colors"
            style={{ border: '0.5px solid var(--border-primary)', color: 'var(--accent)' }}
            title="Switch agent"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span className="hidden sm:inline">{currentPersona.role}</span>
            <span className="sm:hidden">{currentPersona.role.split(' ')[0]}</span>
            <svg className={`w-3 h-3 transition-transform ${personaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {personaOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-52 rounded-xl shadow-xl overflow-hidden z-50" style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-primary)' }}>
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Select Agent</span>
              </div>
              {PERSONAS.map((persona) => {
                const isActive = selectedPersona === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      setSelectedPersona(persona.id);
                      setPersonaOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2.5 text-left transition-colors"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    <span className="text-xs font-semibold" style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {persona.role}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
          style={{ backgroundColor: 'var(--accent)', color: '#000000' }}
          aria-label="Send message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
