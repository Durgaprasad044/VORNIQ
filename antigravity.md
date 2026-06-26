# antigravity.md — The Problem, The Approach, What I Learned

## The Problem

Financial advice is broken in two ways.

**First:** Every financial tool forgets you. You explain your income, your debts, your tax situation to a chatbot — and the next session it's gone. You're back to zero. Again. The "AI advisor" you just onboarded is dumber than a notepad.

**Second:** No single advisor knows everything. Your bookkeeper doesn't think like your investment researcher. Your tax strategist doesn't build financial models like your FP&A analyst. Real financial clarity requires multiple expert lenses on the same situation.

FinSight solves both.

Five specialized finance expert personas — Dana (Controller), Morgan (Financial Analyst), Riley (FP&A), Quinn (Investment Researcher), Cassandra (Tax Strategist) — share a single persistent memory bank powered by Hindsight. Every persona knows everything the others learned. One financial profile. Five expert views.

Without memory: "What's my tax situation?" → Generic answer about tax brackets.
With FinSight: "What's my tax situation?" → Cassandra references the ₹5L investment Quinn discussed, the entity structure Dana tracks, and the budget Riley built. Concrete, personalized, cross-domain.

---

## The Approach

### Architecture Decision: Multi-Persona, Single Memory Bank

The key insight was that financial advice is naturally multi-disciplinary — but your financial context is one thing. Separating personas while unifying memory was the core design decision.

One Hindsight bank per user. Every retain call is tagged with the persona that generated it:
```typescript
`[${persona.toUpperCase()}] User: ${message}\nAdvisor: ${response}`
```

When Quinn retains your investment risk appetite, Cassandra recalls it when you ask about tax-efficient investing. The memory is shared. The expertise is specialized.

### The 5 Personas (from agency-agents/finance)

Each persona has a distinct identity, communication style, and retention focus:

**Dana** (Bookkeeper & Controller) — 13 years closing books. Reconciles everything. Flags issues early. Retains: transactions, close schedules, accounting software, audit findings.

**Morgan** (Financial Analyst) — 12 years in IB and FP&A. Thinks in cash flows. Always builds 3 scenarios. Retains: revenue model, EBITDA, growth rates, valuation assumptions.

**Riley** (FP&A Analyst) — 11 years in SaaS FP&A. Strategy's translator. Ties every budget to a business driver. Retains: budget targets, variances, headcount plans, forecast assumptions.

**Quinn** (Investment Researcher) — 14 years buy-side. Finds alpha in the footnotes. Always presents the bear case as rigorously as the bull. Retains: portfolio, risk appetite, investment thesis, conviction levels.

**Cassandra** (Tax Strategist) — 15 years Big Four and corporate tax. Thinks in after-tax returns. Tax is a strategic lever, not an afterthought. Retains: entity structure, tax positions, elections, filing jurisdictions.

### Finance-Specific Retain Filter

Generic word-count filters weren't enough. Built a domain-aware keyword list covering all 5 personas:
```typescript
const FINANCIAL_KEYWORDS = [
  "income", "salary", "debt", "loan", "invest", "portfolio",
  "tax", "deduction", "budget", "variance", "ebitda", "dcf",
  "reconcil", "audit", "gaap", "thesis", "conviction", "moat",
  "entity", "jurisdiction", "transfer pricing", "headcount", "burn"
  // ... 40+ keywords across all domains
];
```

A short message like "EBITDA is ₹40L" gets retained. "ok thanks" doesn't.

### Hindsight Integration

Setup:
```bash
git clone --depth 1 https://github.com/vectorize-io/hindsight-skills.git ~/hindsight-skills
cd ~/hindsight-skills && ./setup
# then /hindsight-architect in coding agent
```

Bank mission — the single most important configuration:
```typescript
const BANK_MISSION = `
I am a personal finance intelligence system.
I remember this user's complete financial profile — income, debts,
investments, tax situation, business financials, goals, and all advice
given across every expert persona (Dana, Morgan, Riley, Quinn, Cassandra).
I never ask the user to repeat financial information.
`;
```

Core loop — same pattern for every persona:
```typescript
const memories = await recall(bankId, message);
const context = formatMemories(memories);
const system = getPersonaPrompt(persona, context); // injects memories into persona
const response = await groq.chat.completions.create({
  model: "qwen/qwen3-32b",
  messages: [{ role: "system", content: system }, ...history,
             { role: "user", content: message }]
});
if (shouldRetain(message)) {
  await retain(bankId, `[${persona.toUpperCase()}] User: ${message}\nAdvisor: ${response}`);
}
```

Reflect at session end:
```typescript
await reflect(bankId, `
  Consolidate this user's complete financial profile:
  income, expenses, debts, investments, tax situation,
  business financials, goals, and advice across all personas.
`);
```

After reflect, the next session opens with a fully consolidated financial profile — not a pile of raw facts. Every persona starts sharp.

---

## What Surprised Me

**1. Cross-persona memory is the real demo**
I expected the single-persona memory to be compelling. It was. But the moment Cassandra referenced something Quinn had retained two sessions ago — without being prompted — that was the real "wait, how did it know that?" moment. That's the before/after that wins.

**2. Persona-tagged retention is critical for recall quality**
Early version retained without persona tags. Recall results were noisy — hard to tell which expert context generated which memory. Adding `[DANA]`, `[QUINN]` etc. to every retain dramatically improved the relevance of recalled memories.

**3. Bank mission shapes reflect quality more than anything else**
The reflect output is only as good as the bank's mission statement. A vague mission produces vague consolidated observations. A precise mission — listing all 5 personas and their domains explicitly — produces a consolidated financial profile that's immediately usable on next session open.

**4. Temporal retrieval matters for financial advice**
"What did we decide about my investment allocation last month?" is a temporal query. "What's my risk appetite?" is semantic. Hindsight's TEMPR running both in parallel meant both queries worked. A semantic-only approach would have missed the temporal one entirely.

**5. The persona selector changes behavior without changing the memory**
Same bank. Same memories. Different persona selected = completely different communication style, analytical framework, and focus area. Morgan gives you a DCF. Cassandra gives you the after-tax analysis of the same decision. The shared memory makes both instantly personalized.

---

## Lessons Learned

**1. Multi-persona + single memory bank is the right architecture for finance**
Financial context is unified. Financial expertise is specialized. Separating them was the right call.

**2. Tag your retains with context**
`[PERSONA] User: ... Advisor: ...` format makes recalled memories interpretable. Without tags, recalled memory loses context about which domain generated it.

**3. Bank mission is not optional configuration**
It's the most important thing you configure in Hindsight. Get it right before anything else. Be explicit about what domains the bank covers.

**4. Domain-aware retain filter beats generic filters**
Know your domain's vocabulary. Build the filter around it. Quality of retained memory determines quality of recalled context.

**5. Reflect produces the consolidated financial profile**
Raw retained facts are noisy. Reflect consolidates them into a clean, structured financial profile. The next session's first recall pulls this consolidated profile instantly. That's what makes session 5 feel like talking to an advisor who's known you for years.

**6. The demo needs 2 sessions minimum**
Session 1 is setup. Session 2 is the magic. Show both. The contrast is everything.

---

## Stack Summary

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Express.js + TypeScript |
| LLM | Groq — qwen/qwen3-32b (free tier) |
| Memory | [Hindsight](https://hindsight.vectorize.io/) |
| Memory Server | hindsight-api (Python, local :8888) |
| Personas | Dana, Morgan, Riley, Quinn, Cassandra |
| Identity | bankId in browser localStorage |

---

## Resources Used

- [Hindsight Docs](https://hindsight.vectorize.io/)
- [Hindsight GitHub](https://github.com/vectorize-io/hindsight)
- [Agent Memory Overview](https://vectorize.io/what-is-agent-memory)
- [Hindsight Cloud](https://ui.hindsight.vectorize.io) — promo code **MEMHACK625**
- [Groq Console](https://console.groq.com)
- [Hindsight Community Slack](https://hindsight.vectorize.io/)
- [Finance Agent Personas](https://github.com/msitarzewski/agency-agents/tree/main/finance)