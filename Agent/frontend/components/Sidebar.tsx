import React, { useState } from 'react';
import { endSession } from '../lib/api';

export type PersonaId = 'dana' | 'morgan' | 'riley' | 'quinn' | 'cassandra';

export const PERSONAS = [
  { id: 'dana', name: 'Dana', role: 'Controller', emoji: '📒' },
  { id: 'morgan', name: 'Morgan', role: 'Financial Analyst', emoji: '📊' },
  { id: 'riley', name: 'Riley', role: 'FP&A Analyst', emoji: '📈' },
  { id: 'quinn', name: 'Quinn', role: 'Investment Researcher', emoji: '🔍' },
  { id: 'cassandra', name: 'Cassandra', role: 'Tax Strategist', emoji: '🏛️' },
] as const;

interface SidebarProps {
  selectedPersona: PersonaId;
  setSelectedPersona: (persona: PersonaId) => void;
  onNewChat: () => void;
  bankId: string;
}

export default function Sidebar({
  selectedPersona,
  setSelectedPersona,
  onNewChat,
  bankId,
}: SidebarProps) {
  const [isEnding, setIsEnding] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      await endSession(bankId);
      setSessionSaved(true);
      setTimeout(() => {
        setSessionSaved(false);
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnding(false);
    }
  };

  const shortBankId = bankId ? `${bankId.slice(0, 4)}...${bankId.slice(-4)}` : '';

  return (
    <div className="w-[220px] min-w-[220px] h-full bg-[#111111] border-r-[0.5px] border-[#222222] flex flex-col justify-between select-none">
      {/* Top section */}
      <div className="flex flex-col p-4 gap-6 overflow-y-auto">
        {/* App Logo */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-wide text-white">VORNIQ</span>
          </div>
          <span className="text-[9px] text-[#666666] uppercase tracking-[0.18em] font-semibold leading-none">EVERY NUMBER TELLS A STORY</span>
        </div>

        {/* Personas Section */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold text-[#666666] tracking-[0.15em] uppercase">PERSONAS</span>
          <div className="flex flex-col gap-2">
            {PERSONAS.map((persona) => {
              const isActive = selectedPersona === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-left border-[0.5px] transition-all duration-150 ${
                    isActive
                      ? 'bg-[#162312] border-[#22c55e33] text-[#22c55e]'
                      : 'bg-[#111111] border-[#222222] hover:bg-[#1a1a1a] text-[#cccccc]'
                  }`}
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#1a1a1a] border-[0.5px] border-[#222222] rounded-xl text-base select-none">
                    {persona.emoji}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-semibold leading-tight ${isActive ? 'text-[#22c55e]' : 'text-white'}`}>
                      {persona.name}
                    </span>
                    <span className="text-[10px] text-[#666666] truncate mt-0.5 font-medium">
                      {persona.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t-[0.5px] border-[#222222] flex flex-col gap-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-start gap-2 py-2.5 px-4 bg-transparent hover:bg-[#1a1a1a] border-[0.5px] border-[#222222] rounded-xl text-xs font-semibold text-white transition-colors"
        >
          <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Chat
        </button>
        <button
          onClick={handleEndSession}
          disabled={isEnding}
          className="w-full flex items-center justify-start gap-2 py-2.5 px-4 bg-transparent hover:bg-[#1a1a1a] border-[0.5px] border-[#222222] rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x={4} y={4} width={16} height={16} rx={2} />
          </svg>
          End Session
        </button>

        {sessionSaved && (
          <div className="text-center text-[11px] text-[#22c55e] font-semibold mt-1">
            Session saved.
          </div>
        )}

        <div className="text-center text-[10px] text-[#666666] mt-1 font-medium select-text">
          Session: <span className="font-mono">{shortBankId}</span>
        </div>
      </div>
    </div>
  );
}
