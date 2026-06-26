'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar, { PERSONAS, PersonaId } from './Sidebar';
import MessageBubble, { TypingIndicator, Message } from './MessageBubble';
import InputBar from './InputBar';
import { sendMessage } from '../lib/api';

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

export default function ChatWindow() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('dana');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bankId, setBankId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load or generate bankId on first mount
  useEffect(() => {
    let id = localStorage.getItem('vorniq_bank_id');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('vorniq_bank_id', id);
    }
    setBankId(id);
  }, []);

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

  const handleNewChat = () => {
    setMessages([]);
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
      // 1.5-second artificial delay to simulate typing
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

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  // Retrieve memoriesUsed from the last assistant message
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const memoriesUsed = lastAssistantMsg?.memoriesUsed || 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
        onNewChat={handleNewChat}
        bankId={bankId}
      />

      {/* Main chat section */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Chat Header */}
        <header className="h-[60px] min-h-[60px] border-b-[0.5px] border-[#222222] bg-[#0a0a0a] px-6 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wider flex items-center gap-1">
              <span className="text-[#666666] font-medium">Talking to</span>{' '}
              <span className="text-[#22c55e] font-bold">{currentPersona.name}</span>{' '}
              <span className="text-[#666666] font-medium">— {currentPersona.role}</span>
            </span>
          </div>

          {memoriesUsed > 0 && (
            <div className="bg-[#162312] border-[0.5px] border-[#22c55e33] text-[#22c55e] text-xs font-semibold px-3 py-1.5 rounded-full select-none flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              {memoriesUsed} {memoriesUsed === 1 ? 'memory' : 'memories'} recalled
            </div>
          )}
        </header>

        {/* Message window list */}
        <div className="flex-1 overflow-y-auto py-6 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto flex flex-col justify-start min-h-full">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none my-auto">
                <span className="text-4xl mb-4">{currentPersona.emoji}</span>
                <h2 className="text-lg font-bold text-white mb-1">
                  How can I help you?
                </h2>
                <p className="text-xs text-[#666666] max-w-sm">
                  Ask {currentPersona.name} about your {currentPersona.role.toLowerCase()} tasks or review historical memory.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  message={msg}
                  personaEmoji={
                    PERSONAS.find((p) => p.id === msg.persona)?.emoji || currentPersona.emoji
                  }
                />
              ))
            )}

            {isLoading && <TypingIndicator personaEmoji={currentPersona.emoji} />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <InputBar
          onSend={handleSendMessage}
          personaName={currentPersona.name}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
