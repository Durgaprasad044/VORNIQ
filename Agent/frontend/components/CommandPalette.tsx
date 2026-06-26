'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PERSONAS, PersonaId } from './Sidebar';
import type { ChatSession } from '../lib/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchPersona: (persona: PersonaId) => void;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  sessions: ChatSession[];
  selectedPersona: PersonaId;
}

interface Command {
  id: string;
  label: string;
  category: string;
  action: () => void;
  icon: React.ReactNode;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSwitchPersona,
  onNewChat,
  onLoadSession,
  sessions,
  selectedPersona,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      category: 'Actions',
      action: () => { onNewChat(); onClose(); },
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    ...PERSONAS.map((p) => ({
      id: `persona-${p.id}`,
      label: `Switch to ${p.role}`,
      category: 'Personas',
      action: () => { onSwitchPersona(p.id as PersonaId); onClose(); },
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    })),
    ...sessions.slice(0, 20).map((s) => ({
      id: `session-${s.id}`,
      label: s.title,
      category: 'History',
      action: () => { onLoadSession(s.id); onClose(); },
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    })),
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const executeCommand = useCallback(
    (cmd: Command) => {
      cmd.action();
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeCommand(filtered[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, executeCommand, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0" style={{ backgroundColor: 'var(--shadow-overlay)' }} />
      <div
        className="relative w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <div ref={inputRef} className="flex-1">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, personas, history..."
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border font-mono" style={{ color: 'var(--text-faint)', borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}>
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div ref={listRef} className="max-h-[300px] overflow-y-auto py-2">
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                  {category}
                </span>
              </div>
              {cmds.map((cmd) => {
                const idx = filtered.indexOf(cmd);
                const isSelected = idx === selectedIndex;
                const isActive = cmd.id === `persona-${selectedPersona}`;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{
                      backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {cmd.icon}
                    </span>
                    <span className="text-sm font-medium flex-1 truncate">{cmd.label}</span>
                    {isActive && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)' }}>
                        active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center">
              <span className="text-sm" style={{ color: 'var(--text-faint)' }}>No results found</span>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t flex items-center gap-4" style={{ borderColor: 'var(--border-primary)' }}>
          <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
            <kbd className="px-1 py-0.5 rounded border text-[9px] font-mono" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}>↑↓</kbd>
            navigate
          </span>
          <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
            <kbd className="px-1 py-0.5 rounded border text-[9px] font-mono" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}>↵</kbd>
            select
          </span>
        </div>
      </div>
    </div>
  );
}
