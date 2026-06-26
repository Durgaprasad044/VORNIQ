'use client';

import React, { useMemo } from 'react';
import type { Message } from './MessageBubble';
import { PERSONAS, PersonaId } from './Sidebar';

interface DashboardViewProps {
  messages: Message[];
  onClose: () => void;
}

function extractFinancialData(messages: Message[]) {
  const data = {
    totalMessages: messages.length,
    userMessages: messages.filter((m) => m.role === 'user').length,
    assistantMessages: messages.filter((m) => m.role === 'assistant').length,
    memoriesUsed: messages.reduce((sum, m) => sum + (m.memoriesUsed || 0), 0),
    personaUsage: {} as Record<string, number>,
    topics: [] as string[],
  };

  for (const msg of messages) {
    if (msg.persona) {
      data.personaUsage[msg.persona] = (data.personaUsage[msg.persona] || 0) + 1;
    }
  }

  const topicKeywords = ['income', 'tax', 'investment', 'budget', 'debt', 'savings', 'profit', 'revenue', 'expense', 'portfolio'];
  const allText = messages.map((m) => m.content.toLowerCase()).join(' ');
  data.topics = topicKeywords.filter((t) => allText.includes(t));

  return data;
}

export default function DashboardView({ messages, onClose }: DashboardViewProps) {
  const data = useMemo(() => extractFinancialData(messages), [messages]);

  const maxPersonaCount = Math.max(...Object.values(data.personaUsage), 1);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'var(--shadow-overlay)' }} onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-6"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Financial Dashboard</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Overview of your VORNIQ activity</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Messages', value: data.totalMessages, color: 'var(--accent)' },
            { label: 'Your Questions', value: data.userMessages, color: 'var(--accent)' },
            { label: 'AI Responses', value: data.assistantMessages, color: 'var(--accent)' },
            { label: 'Memories Recalled', value: data.memoriesUsed, color: 'var(--accent)' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border p-4"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Persona usage */}
        <div
          className="rounded-xl border p-5 mb-6"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Agent Usage</h3>
          <div className="space-y-3">
            {PERSONAS.map((p) => {
              const count = data.personaUsage[p.id] || 0;
              const pct = maxPersonaCount > 0 ? (count / maxPersonaCount) * 100 : 0;
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{p.role}</span>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topics discussed */}
        {data.topics.length > 0 && (
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Topics Discussed</h3>
            <div className="flex flex-wrap gap-2">
              {data.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize"
                  style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)', border: `0.5px solid var(--accent-border)` }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
