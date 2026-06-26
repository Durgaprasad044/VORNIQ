import React, { useState } from 'react';
import { endSession } from '../lib/api';
import type { ChatSession } from '../lib/api';

export type PersonaId = 'dana' | 'morgan' | 'riley' | 'quinn' | 'cassandra';

export const PERSONAS = [
  { id: 'dana', role: 'Controller' },
  { id: 'morgan', role: 'Financial Analyst' },
  { id: 'riley', role: 'FP&A Analyst' },
  { id: 'quinn', role: 'Investment Researcher' },
  { id: 'cassandra', role: 'Tax Strategist' },
] as const;

interface SidebarProps {
  onNewChat: () => void;
  bankId: string;
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onLoadSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitial(title: string): string {
  return title.charAt(0).toUpperCase() || 'N';
}

export default function Sidebar({
  onNewChat,
  bankId,
  isOpen,
  onClose,
  collapsed,
  onToggle,
  sessions,
  activeSessionId,
  onLoadSession,
  onDeleteSession,
}: SidebarProps) {
  const [isEnding, setIsEnding] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      await endSession(bankId);
      setSessionSaved(true);
      setTimeout(() => setSessionSaved(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnding(false);
    }
  };

  // Mobile: show full sidebar when isOpen
  // Desktop collapsed: show compact sidebar
  // Desktop expanded: show full sidebar
  const showMobileOverlay = isOpen;
  const showCollapsed = !isOpen && collapsed;
  const showFull = !collapsed || isOpen;

  return (
    <>
      {/* Mobile backdrop */}
      {showMobileOverlay && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'var(--shadow-overlay)' }}
          onClick={onClose}
        />
      )}

      {/* ===== COLLAPSED SIDEBAR (desktop only) ===== */}
      {showCollapsed && (
        <div className="hidden md:flex flex-col items-center w-[60px] min-w-[60px] h-full select-none" style={{ backgroundColor: 'var(--bg-surface)', borderRight: '0.5px solid var(--border-primary)' }}>
          {/* Toggle + New Chat */}
          <div className="flex flex-col items-center gap-2 pt-4 pb-3 w-full px-2">
            <button
              onClick={onToggle}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#1a1a1a] transition-colors"
              aria-label="Expand sidebar"
            >
              <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <button
              onClick={onNewChat}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
              style={{ border: '0.5px solid var(--border-primary)', color: 'var(--text-muted)' }}
              aria-label="New chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          <div className="w-6 h-[1px] mb-2" style={{ backgroundColor: 'var(--border-primary)' }} />

          {/* Session list */}
          <div className="flex-1 overflow-y-auto px-2 flex flex-col items-center gap-1.5 w-full">
            {sessions.slice(0, 12).map((session) => {
              const isActive = activeSessionId === session.id;
              return (
                <button
                  key={session.id}
                  onClick={() => onLoadSession(session.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-all text-xs font-bold"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                    border: isActive ? '0.5px solid var(--accent-border)' : '0.5px solid transparent',
                  }}
                  title={session.title}
                >
                  {getInitial(session.title)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== FULL SIDEBAR ===== */}
      {(showFull || showMobileOverlay) && (
        <div
          className={`
            fixed top-0 left-0 h-full z-50
            w-[260px] min-w-[260px] flex flex-col select-none
            transition-transform duration-200 ease-in-out
            md:static md:translate-x-0
            ${showMobileOverlay ? 'translate-x-0' : collapsed ? '-translate-x-full md:hidden' : ''}
          `}
          style={{ backgroundColor: 'var(--bg-surface)', borderRight: '0.5px solid var(--border-primary)' }}
        >
          {/* Header */}
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-bold text-lg tracking-wide" style={{ color: 'var(--text-primary)' }}>VORNIQ</span>
              </div>
              <div className="flex items-center gap-1">
                {/* New chat (compact) */}
                <button
                  onClick={onNewChat}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-faint)' }}
                  aria-label="New chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                {/* Collapse/Close */}
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg transition-colors hidden md:flex"
                  style={{ color: 'var(--text-faint)' }}
                  aria-label="Collapse sidebar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
                {/* Mobile close */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors md:hidden"
                  style={{ color: 'var(--text-faint)' }}
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4 text-[#666666]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-[0.15em] font-semibold" style={{ color: 'var(--text-dim)' }}>EVERY NUMBER TELLS A STORY</span>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto px-3 min-h-0">
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-1 mb-2 block" style={{ color: 'var(--text-dim)' }}>History</span>
            <div className="flex flex-col gap-0.5">
              {sessions.length === 0 ? (
                <span className="text-[10px] px-1 py-2" style={{ color: 'var(--text-darkest)' }}>No conversations yet</span>
              ) : (
                sessions.map((session) => {
                  const isActive = activeSessionId === session.id;
                  return (
                    <div
                      key={session.id}
                      className="group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                      }}
                      onClick={() => onLoadSession(session.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-xs block truncate" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 500 : 400 }}>
                          {session.title}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-ghost)' }}>
                          {formatDate(session.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                        style={{ color: 'var(--text-dim)' }}
                        aria-label="Delete"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="p-3 flex flex-col gap-1.5" style={{ borderTop: '0.5px solid var(--border-subtle)' }}>
            <button
              onClick={handleEndSession}
              disabled={isEnding}
              className="w-full flex items-center justify-start gap-2.5 py-2 px-3 rounded-lg text-xs transition-colors disabled:opacity-50"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              End Session
            </button>
            {sessionSaved && (
              <div className="text-center text-[10px] font-medium py-1" style={{ color: 'var(--accent)' }}>
                Saved to memory
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
