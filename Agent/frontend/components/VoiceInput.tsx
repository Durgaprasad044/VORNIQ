'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setError(event.error === 'not-allowed' ? 'Microphone access denied' : 'Voice input failed');
        setIsListening(false);
        setTimeout(() => setError(''), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setError('Could not start voice input');
        setTimeout(() => setError(''), 3000);
      }
    }
  }, [isListening]);

  if (!isSupported) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isListening ? 'var(--accent)' : 'var(--bg-elevated)',
          color: isListening ? '#000000' : 'var(--text-muted)',
          border: `0.5px solid ${isListening ? 'var(--accent)' : 'var(--border-primary)'}`,
        }}
        title={isListening ? 'Stop listening' : 'Voice input'}
      >
        {isListening ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {isListening && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
      )}

      {error && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap shadow-lg"
          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--accent)', border: `0.5px solid var(--accent-border)` }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
