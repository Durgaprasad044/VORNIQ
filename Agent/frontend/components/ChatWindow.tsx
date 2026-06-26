'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar, { PERSONAS, PersonaId } from './Sidebar';
import MessageBubble, { TypingIndicator, Message } from './MessageBubble';
import InputBar from './InputBar';
import CommandPalette from './CommandPalette';
import OnboardingFlow from './OnboardingFlow';
import DashboardView from './DashboardView';
import { useTheme } from '../lib/theme';
import {
  sendMessage,
  saveSession as apiSaveSession,
  loadSession as apiLoadSession,
  listSessions as apiListSessions,
  deleteSession as apiDeleteSession,
  ChatSession,
} from '../lib/api';

const SESSIONS_KEY = 'vorniq_sessions';
const MESSAGES_PREFIX = 'vorniq_messages_';

const MOCK_RESPONSES: Record<PersonaId, { response: string; memoriesUsed: number; memoriesList?: string[] }> = {
  dana: {
    response: `I've completed the preliminary close checks and ledger reconciliation:

- **Ledger Balance**: All cash accounts match statement statements.
- **Accruals**: Recorded recurring monthly depreciation and deferred revenue.
- **Pending Review**: Found a discrepancy of **₹45,000** in Accounts Receivable from Invoice #1029.

GAAP compliance is verified for all journal entries.`,
    memoriesUsed: 2,
    memoriesList: ['GAAP guidelines', 'Invoice #1029 details'],
  },
  morgan: {
    response: `Based on the ₹80L ARR Quinn noted and your 40% YoY growth, here's the base case DCF:

WACC: 14% | Terminal growth: 4%
Base case equity value: ₹3.2Cr
Upside (50% growth): ₹4.8Cr
Downside (25% growth): ₹2.1Cr

The biggest sensitivity driver is your gross margin — if it holds above 70%, the base case improves by ~18%.`,
    memoriesUsed: 4,
    memoriesList: ['ARR from Quinn', 'risk profile from Cassandra'],
  },
  riley: {
    response: `I have updated the rolling forecast with Q2 headcount planning drivers:

- **Target Budget**: ₹2.5Cr total operational expenses.
- **Variance**: Marketing spend was 12% over budget, driven by CAC inflation.
- **Runway**: Remaining cash runway is approximately 14 months.

Recommend adjusting the Q3 AOP driver to align marketing spend.`,
    memoriesUsed: 3,
    memoriesList: ['Q2 Budget targets', 'headcount roadmap'],
  },
  quinn: {
    response: `Here is the equity research review for your investment portfolio:

- **Allocation**: 45% equity, 35% debt, 20% liquid cash.
- **Investment Thesis**: Buy-side consensus is bullish, but variant perception indicates rates will compress valuation multiples.
- **Risk Assessment**: Volatility is high due to tech growth exposure.

Recommend moving 10% to low-duration funds to optimize your return asymmetric profile.`,
    memoriesUsed: 5,
    memoriesList: ['Portfolio weightings', 'risk tolerance parameters'],
  },
  cassandra: {
    response: `Following up on the ₹5L investment Quinn discussed, here's the tax optimization structure:

- **Deductions**: Utilize Section 80C up to ₹1.5L using ELSS funds.
- **Capital Gains**: Hold equities for over 1 year to qualify for LTCG exemption.
- **Transfer Pricing**: Document transfer pricing rules if setting up a partnership.

Let me know if you need to calculate the provision for corporate tax.`,
    memoriesUsed: 3,
    memoriesList: ['5L investment from Quinn', 'ELSS rules'],
  },
};

// --- LocalStorage helpers (always work, no backend needed) ---

function loadLocalSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function loadLocalMessages(sessionId: string): Message[] {
  try {
    const raw = localStorage.getItem(MESSAGES_PREFIX + sessionId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(sessionId: string, messages: Message[]) {
  localStorage.setItem(MESSAGES_PREFIX + sessionId, JSON.stringify(messages));
}

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getTitleFromMessage(content: string): string {
  const cleaned = content.replace(/\*\*/g, '').replace(/\n/g, ' ').trim();
  return cleaned.length > 40 ? cleaned.substring(0, 40) + '...' : cleaned;
}

export default function ChatWindow() {
  const { theme, toggleTheme } = useTheme();
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('dana');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bankId, setBankId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Initialize bankId and load sessions
  useEffect(() => {
    let id = localStorage.getItem('vorniq_bank_id');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('vorniq_bank_id', id);
    }
    setBankId(id);

    // Load from localStorage first (instant, always works)
    const localSessions = loadLocalSessions();
    if (localSessions.length > 0) {
      setSessions(localSessions);
      const latest = localSessions[0];
      setActiveSessionId(latest.id);
      setSelectedPersona(latest.persona as PersonaId);
      setMessages(loadLocalMessages(latest.id));
      initializedRef.current = true;
    } else {
      const newId = generateId();
      setActiveSessionId(newId);
      initializedRef.current = true;
    }

    // Then try to merge with Hindsight (best effort, async)
    apiListSessions(id).then((remoteSessions) => {
      if (remoteSessions.length > 0) {
        setSessions((prev) => {
          const merged = [...remoteSessions];
          for (const local of prev) {
            if (!merged.find((r) => r.id === local.id)) {
              merged.push(local);
            }
          }
          merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          saveLocalSessions(merged);
          return merged;
        });
      }
    }).catch(() => {});

    // Check onboarding
    const onboardingDone = localStorage.getItem('vorniq_onboarding_done');
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  }, []);

  // Debounced save: localStorage (instant) + Hindsight (best effort)
  const debouncedSave = useCallback(
    (sessionId: string, msgs: Message[], persona: PersonaId, title: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        // Always save to localStorage
        saveLocalMessages(sessionId, msgs);

        // Update sessions list in localStorage
        setSessions((prev) => {
          const exists = prev.find((s) => s.id === sessionId);
          let updated: ChatSession[];
          if (exists) {
            updated = prev.map((s) =>
              s.id === sessionId ? { ...s, title, persona } : s
            );
          } else {
            updated = [{ id: sessionId, title, createdAt: new Date().toISOString(), persona }, ...prev];
          }
          saveLocalSessions(updated);
          return updated;
        });

        // Also try to save to Hindsight (best effort)
        apiSaveSession(bankId, sessionId, title, persona, msgs).catch(() => {});
      }, 500);
    },
    [bankId]
  );

  // Save messages when they change (after init)
  useEffect(() => {
    if (!initializedRef.current || !activeSessionId || !bankId) return;
    const firstUserMsg = messages.find((m) => m.role === 'user');
    const title = firstUserMsg ? getTitleFromMessage(firstUserMsg.content) : 'New conversation';
    debouncedSave(activeSessionId, messages, selectedPersona, title);
  }, [messages, activeSessionId, selectedPersona, debouncedSave]);

  // Handle sendBeacon on page/tab close
  useEffect(() => {
    if (!bankId) return;

    const handleUnload = () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const blob = new Blob([JSON.stringify({ bankId })], { type: 'application/json' });
      navigator.sendBeacon(`${backendUrl}/reflect`, blob);
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [bankId]);

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewChat = () => {
    const newId = generateId();
    const newSession: ChatSession = {
      id: newId,
      title: 'New conversation',
      createdAt: new Date().toISOString(),
      persona: selectedPersona,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveLocalSessions(updated);
    setActiveSessionId(newId);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleLoadSession = async (sessionId: string) => {
    if (sessionId === activeSessionId) {
      setSidebarOpen(false);
      return;
    }
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setSelectedPersona(session.persona as PersonaId);
    }
    setActiveSessionId(sessionId);
    setSidebarOpen(false);

    // Load from localStorage first (instant)
    const localMsgs = loadLocalMessages(sessionId);
    if (localMsgs.length > 0) {
      setMessages(localMsgs);
    }

    // Then try Hindsight (might have more data)
    try {
      const remoteMsgs = await apiLoadSession(bankId, sessionId);
      if (remoteMsgs.length > 0) {
        setMessages(remoteMsgs);
        saveLocalMessages(sessionId, remoteMsgs);
      } else if (localMsgs.length === 0) {
        setMessages([]);
      }
    } catch {
      if (localMsgs.length === 0) {
        setMessages([]);
      }
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    // Remove from localStorage
    localStorage.removeItem(MESSAGES_PREFIX + sessionId);
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    saveLocalSessions(updated);

    // Also try to delete from Hindsight (best effort)
    apiDeleteSession(bankId, sessionId).catch(() => {});

    if (sessionId === activeSessionId) {
      if (updated.length > 0) {
        const latest = updated[0];
        setActiveSessionId(latest.id);
        setSelectedPersona(latest.persona as PersonaId);
        setMessages(loadLocalMessages(latest.id));
      } else {
        handleNewChat();
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !bankId) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp,
      persona: selectedPersona,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Limit API history to the last 10 messages
    const apiHistory = messages
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const data = await sendMessage(text, bankId, selectedPersona, apiHistory);
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response,
        memoriesUsed: data.memoriesUsed,
        persona: selectedPersona,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn("Backend API offline, falling back to mock response.");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mock = MOCK_RESPONSES[selectedPersona];
      const assistantMsg: Message = {
        role: 'assistant',
        content: mock.response,
        memoriesUsed: mock.memoriesUsed,
        memoriesList: mock.memoriesList,
        persona: selectedPersona,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = (answers: Record<string, string>) => {
    localStorage.setItem('vorniq_onboarding_done', 'true');
    setShowOnboarding(false);
    const summary = Object.entries(answers)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    if (summary) {
      handleSendMessage(`Here's my financial profile:\n${summary}`);
    }
  };

  const handleFileContent = (content: string, fileName: string) => {
    handleSendMessage(`I've uploaded a file called "${fileName}". Here's the content:\n\n${content}`);
  };

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const memoriesUsed = lastAssistantMsg?.memoriesUsed || 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSwitchPersona={(p) => setSelectedPersona(p)}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        sessions={sessions}
        selectedPersona={selectedPersona}
      />

      {/* Onboarding */}
      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={() => {
            localStorage.setItem('vorniq_onboarding_done', 'true');
            setShowOnboarding(false);
          }}
        />
      )}

      {/* Dashboard */}
      {showDashboard && (
        <DashboardView messages={messages} onClose={() => setShowDashboard(false)} />
      )}

      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        bankId={bankId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onLoadSession={handleLoadSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main chat section */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Chat Header */}
        <header className="h-[60px] min-h-[60px] border-b px-4 md:px-6 flex items-center justify-between select-none" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-base)' }}>
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg transition-colors md:hidden"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
            <span className="text-xs font-semibold tracking-wider flex items-center gap-1 min-w-0 truncate" style={{ color: 'var(--text-primary)' }}>
              <span className="font-medium hidden sm:inline" style={{ color: 'var(--text-muted)' }}>Active</span>{' '}
              <span className="font-bold truncate" style={{ color: 'var(--accent)' }}>{currentPersona.role}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {memoriesUsed > 0 && (
              <div className="text-xs font-semibold px-3 py-1.5 rounded-full select-none flex items-center gap-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)', border: '0.5px solid var(--accent-border)' }}>
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="hidden sm:inline">{memoriesUsed} {memoriesUsed === 1 ? 'memory' : 'memories'}</span>
                <span className="sm:hidden">{memoriesUsed}</span>
              </div>
            )}

            {/* Dashboard button */}
            <button
              onClick={() => setShowDashboard(true)}
              className="p-2 rounded-lg transition-colors hidden sm:flex"
              style={{ color: 'var(--text-muted)' }}
              title="Dashboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Cmd+K hint */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
              style={{ color: 'var(--text-dim)', backgroundColor: 'var(--bg-elevated)', border: '0.5px solid var(--border-primary)' }}
            >
              <kbd className="text-[9px] font-mono">⌘K</kbd>
            </button>
          </div>
        </header>

        {/* Message window list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 md:py-6" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="max-w-4xl mx-auto flex flex-col justify-start min-h-full overflow-hidden">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-8 select-none my-auto">
                <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  How can I help you?
                </h2>
                <p className="text-xs max-w-sm" style={{ color: 'var(--text-faint)' }}>
                  Ask about your financial tasks or review historical memory.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[10px] px-2 py-1 rounded-md" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--bg-elevated)', border: '0.5px solid var(--border-primary)' }}>
                    Press <kbd className="font-mono text-[9px]">⌘K</kbd> for commands
                  </span>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  message={msg}
                />
              ))
            )}

            {isLoading && <TypingIndicator persona={selectedPersona} />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <InputBar
          onSend={handleSendMessage}
          selectedPersona={selectedPersona}
          setSelectedPersona={setSelectedPersona}
          disabled={isLoading}
          onFileContent={handleFileContent}
          onVoiceTranscript={handleSendMessage}
        />
      </div>
    </div>
  );
}
