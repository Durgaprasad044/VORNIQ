'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const PERSONAS = [
  {
    role: 'Controller',
    desc: 'Month-end close, reconciliations, GAAP compliance, audit readiness.',
    rules: ['Reconcile everything, every month', 'GAAP compliance is non-negotiable', 'Audit readiness is a daily practice'],
  },
  {
    role: 'Financial Analyst',
    desc: 'DCF modeling, scenario analysis, valuation, investment research.',
    rules: ['State assumptions before conclusions', 'Always build scenario analysis', 'Sensitivity-test every recommendation'],
  },
  {
    role: 'FP&A Analyst',
    desc: 'Budgeting, variance analysis, rolling forecasts, headcount planning.',
    rules: ['Tie every budget to a business driver', 'Variance analysis must explain the future', 'Make trade-offs visible'],
  },
  {
    role: 'Investment Researcher',
    desc: 'Due diligence, portfolio analysis, risk assessment, equity research.',
    rules: ['Separate thesis from narrative', 'Always present both sides', 'Quantify the downside'],
  },
  {
    role: 'Tax Strategist',
    desc: 'Tax optimization, multi-jurisdiction compliance, entity structuring.',
    rules: ['Compliance is non-negotiable', 'Document every position', 'Connect tax to business decisions'],
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Set Your Profile',
    desc: 'VORNIQ learns your complete financial picture — income, expenses, investments, tax situation, and goals.',
  },
  {
    num: '02',
    title: 'Ask Anything',
    desc: 'Switch between specialized agents or let them collaborate. Every answer is grounded in your actual data.',
  },
  {
    num: '03',
    title: 'Remember Everything',
    desc: 'Hindsight memory ensures every insight persists across sessions. Never repeat context again.',
  },
];

const STATS = [
  { value: '5', label: 'Expert Agents' },
  { value: '∞', label: 'Memory Retention' },
  { value: '<1s', label: 'Response Time' },
  { value: '24/7', label: 'Availability' },
];

export default function LandingPage() {
  const hero = useInView(0.1);
  const features = useInView(0.1);
  const how = useInView(0.1);
  const cta = useInView(0.2);

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-wide" style={{ color: 'var(--text-primary)' }}>VORNIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>Features</a>
            <a href="#how" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>How It Works</a>
          </div>
          <Link
            href="/chat"
            className="px-5 py-2 text-black text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        ref={hero.ref}
        className={`relative min-h-screen flex items-center overflow-hidden ${hero.inView ? 'animate-fade-in' : 'opacity-0'}`}
      >
        {/* Radial glow */}
        <div className="absolute inset-0 radial-glow pointer-events-none" />

        {/* Glowing rings */}
        <div className="hero-rings">
          <div className="hero-ring hero-ring-1" />
          <div className="hero-ring hero-ring-2" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className={`mb-6 ${hero.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 text-[#22c55e] text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                Personal Finance Intelligence
              </span>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 ${hero.inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`} style={{ color: 'var(--text-primary)' }}>
              Every Number
              <br />
              <span className="gradient-text">Tells a Story</span>
            </h1>

            <p className={`text-base md:text-lg text-[#888888] max-w-lg mb-10 leading-relaxed ${hero.inView ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
              Five expert financial agents. One unified memory. Ask anything about your finances and get answers grounded in your complete financial profile.
            </p>

            <div className={`flex flex-col sm:flex-row items-center gap-4 ${hero.inView ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
              <Link
                href="/chat"
                className="group px-7 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] text-sm inline-flex items-center gap-2"
              >
                Launch App
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#how"
                className="px-7 py-3.5 border border-[#333333] hover:border-[#555555] text-white font-semibold rounded-xl transition-all duration-200 text-sm inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                See How It Works
              </a>
            </div>
          </div>

          {/* Right: Floating chat panel */}
          <div className={`flex justify-center lg:justify-end ${hero.inView ? 'animate-slide-in-right delay-300' : 'opacity-0'}`}>
            <div className="w-full max-w-md animate-float">
              <div className="rounded-2xl border border-[#1e2a23] bg-[#0d1210]/90 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(34,197,94,0.08)]">
                {/* Panel top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2a23]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                    <span className="text-xs font-medium text-[#888888]">Financial Analyst</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#22c55e] tracking-wider uppercase">Live</span>
                </div>

                {/* Panel body */}
                <div className="p-5 space-y-4">
                  {/* Memory indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111a14] border border-[#1e2a23]">
                      <svg className="w-3 h-3 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-[10px] text-[#666666] font-medium">3 memories recalled</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111a14] border border-[#1e2a23]">
                      <span className="text-[10px] text-[#666666] font-medium">Session 4</span>
                    </div>
                  </div>

                  {/* Chat exchange */}
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-[#1e3a2f]/60 text-[#d4f0e0] text-xs px-3.5 py-2.5 rounded-xl rounded-br-sm max-w-[85%] leading-relaxed">
                        Analyze my Q2 cash flow position
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#111a14] text-[#cccccc] text-xs px-3.5 py-2.5 rounded-xl rounded-bl-sm max-w-[90%] border border-[#1e2a23] leading-relaxed">
                        <span className="text-[#22c55e] font-semibold">Base case:</span>{' '}
                        Positive operating cash flow of ₹12.4L.
                        <span className="text-[#555555] block mt-2 text-[10px]">
                          Source: Controller&apos;s Q2 books, 3 prior sessions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Persona tabs */}
                  <div className="flex gap-2 pt-1">
                    {['Controller', 'Analyst', 'FP&A', 'Researcher', 'Tax'].map((p, i) => (
                      <div
                        key={p}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                          i === 1
                            ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]'
                            : 'bg-[#111a14] border-[#1e2a23] text-[#555555]'
                        }`}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#0a0a0a]/60 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center ${hero.inView ? 'animate-count-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-[#22c55e] mb-0.5">{stat.value}</div>
                  <div className="text-[11px] text-[#555555] font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" ref={features.ref} className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 ${features.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="text-xs font-bold text-[#22c55e] tracking-[0.2em] uppercase mb-3 block">Expert Agents</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Five Specialists, One Brain
            </h2>
            <p className="text-[#888888] max-w-xl mx-auto">
              Each agent brings deep domain expertise. Switch between them instantly — they all share the same memory of your finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERSONAS.map((p, i) => (
              <div
                key={p.role}
                className={`group p-6 rounded-2xl border border-[#222222] bg-[#111111] hover:border-[#22c55e]/30 hover:bg-[#0f1a14] transition-all duration-300 ${
                  features.inView ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mb-4 group-hover:bg-[#22c55e]/20 transition-colors">
                  <span className="text-[#22c55e] text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{p.role}</h3>
                <p className="text-[#666666] text-xs leading-relaxed mb-4">{p.desc}</p>
                <ul className="space-y-1.5">
                  {p.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-xs text-[#888888]">
                      <span className="text-[#22c55e] mt-0.5 flex-shrink-0">-</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* CTA card */}
            <div
              className={`group p-6 rounded-2xl border border-[#22c55e]/20 bg-[#162312] hover:border-[#22c55e]/40 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                features.inView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '500ms' }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">Try It Now</h3>
              <p className="text-[#666666] text-xs mb-4">Switch agents mid-conversation. Each one remembers everything.</p>
              <Link
                href="/chat"
                className="px-5 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-black text-xs font-semibold rounded-lg transition-all"
              >
                Open App
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" ref={how.ref} className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 radial-glow pointer-events-none opacity-50" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className={`text-center mb-16 ${how.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="text-xs font-bold text-[#22c55e] tracking-[0.2em] uppercase mb-3 block">Simple Workflow</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How VORNIQ Works
            </h2>
            <p className="text-[#888888] max-w-xl mx-auto">
              Three steps to complete financial intelligence. No setup complexity. No data entry. Just ask.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`relative ${how.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[1px] bg-gradient-to-r from-[#22c55e]/30 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-[#222222] flex items-center justify-center mx-auto mb-6 relative">
                    <span className="text-2xl font-bold gradient-text">{step.num}</span>
                    <div className="absolute inset-0 rounded-2xl border border-[#22c55e]/10 animate-border-glow" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                  <p className="text-[#666666] text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={cta.ref} className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className={`max-w-2xl mx-auto text-center relative z-10 ${cta.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Know Your Numbers?
          </h2>
          <p className="text-[#888888] mb-8 max-w-lg mx-auto">
            Stop juggling spreadsheets and guessing. Let five financial experts remember everything and advise you in real time.
          </p>
          <Link
            href="/chat"
            className="inline-block px-10 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] text-sm"
          >
            Launch VORNIQ
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#22c55e] flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">VORNIQ</span>
          </div>
          <p className="text-xs text-[#555555]">
            Powered by Hindsight Memory &middot; Built with Groq
          </p>
        </div>
      </footer>
    </div>
  );
}
