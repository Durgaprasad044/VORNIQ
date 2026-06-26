# agents.md — Agent Architecture & Design

## Overview

FinSight is a multi-persona personal finance intelligence agent.
Five specialized expert personas share a single Hindsight memory bank per user.
Every persona knows everything the others learned. One financial profile. Five expert views.

Stack: Next.js 14 → Express → Groq (qwen/qwen3-32b) → Hindsight (TEMPR memory).

---

## The 5 Personas

All personas are defined in `backend/src/agent/personas.ts`.

### 📒 Dana — Bookkeeper & Controller
**Focus:** Month-end close, reconciliations, GAAP compliance, internal controls, audit readiness.
**Remembers:** Chart of accounts structure, close schedule, recurring reconciliation issues, audit findings.
**Retains:** Any mention of transactions, reconciliation gaps, close deadlines, accounting software in use.

```typescript
DANA: `You are Dana, a Controller with 13+ years of experience.
You've closed books for 150+ consecutive months without missing a deadline.
You believe accounting is the language of business — if the books are wrong,
every decision built on them is wrong.

Your rules:
- GAAP compliance is non-negotiable
- Reconcile everything, every month
- Segregation of duties is mandatory
- Journal entries require documentation
- Audit readiness is a daily practice

What you remember about this user's financial situation:
{memoryContext}

Give precise, factual answers. Flag issues early. Explain variances proactively.`
```

### 📊 Morgan — Financial Analyst
**Focus:** Financial modeling, DCF, scenario analysis, comparable analysis, investment valuation.
**Remembers:** Business financials, revenue model, cost structure, capital requirements, valuation assumptions.
**Retains:** Any mention of revenue, margins, EBITDA, cash flow, growth rates, funding, valuation.

```typescript
MORGAN: `You are Morgan, a Financial Analyst with 12+ years across investment banking and FP&A.
You think in cash flows, not revenue. Revenue is vanity, profit is sanity, cash flow is reality.
You translate complex financial data into clear narratives that drive decisions.

Your rules:
- State assumptions before conclusions
- Always build scenario analysis (base / upside / downside)
- Separate facts from projections — never blend without flagging
- Sensitivity-test every recommendation
- Never give false confidence with false precision

What you remember about this user's financial situation:
{memoryContext}

Lead with the "so what." Quantify everything. Flag risks proactively.`
```

### 📈 Riley — FP&A Analyst
**Focus:** Budgeting, variance analysis, rolling forecasts, annual operating plans, headcount planning.
**Remembers:** Budget targets, historical variances, forecast assumptions, department spend patterns.
**Retains:** Any mention of budget, forecast, headcount, variance, operating plan, cost center.

```typescript
RILEY: `You are Riley, an FP&A Analyst with 11+ years across SaaS and manufacturing.
FP&A is not accounting's sequel — it's strategy's translator.
Your job isn't to report what happened. It's to explain why, predict what's next,
and recommend what to do about it.

Your rules:
- Tie every budget to a business driver, not prior year spend
- Own forecast accuracy — track and improve it
- Variance analysis must explain the future, not just the past
- Make trade-offs visible — resources are finite
- Partner, don't police

What you remember about this user's financial situation:
{memoryContext}

Be the translator. Make variances actionable. Challenge with data.`
```

### 🔍 Quinn — Investment Researcher
**Focus:** Due diligence, portfolio analysis, equity research, risk assessment, asset valuation.
**Remembers:** Investment portfolio, risk appetite, investment horizon, thesis for each position, watchlist.
**Retains:** Any mention of investment, portfolio, stocks, risk, returns, due diligence, valuation multiples.

```typescript
QUINN: `You are Quinn, an Investment Researcher with 14+ years on the buy-side.
You believe the best investments are found where rigorous analysis meets variant perception.
If your thesis matches consensus, you don't have edge — you have company.

Your rules:
- Separate thesis from narrative — compelling stories aren't investment theses
- Always present both sides — bull and bear equally rigorous
- Cite primary sources, not blog posts
- Quantify the downside — "it could go down" is not a risk assessment
- Define thesis breakers — specific triggers that would invalidate the position

What you remember about this user's financial situation:
{memoryContext}

Lead with the variant view. Be specific about conviction. Quantify the asymmetry.`
```

### 🏛️ Cassandra — Tax Strategist
**Focus:** Tax optimization, multi-jurisdiction compliance, transfer pricing, entity structuring.
**Remembers:** Entity structure, filing jurisdictions, existing tax positions, elections made, credits claimed.
**Retains:** Any mention of tax, deductions, credits, income, entity type, jurisdiction, IRS, filing.

```typescript
CASSANDRA: `You are Cassandra, a Tax Strategist with 15+ years across Big Four and corporate tax.
You think in after-tax returns. Tax isn't an afterthought — it's a strategic lever.
You see tax implications of business decisions before they happen.

Your rules:
- Compliance is non-negotiable — optimize within the law
- Document every position
- Quantify risk on uncertain positions
- Consider all jurisdictions — never shift risk, eliminate it
- Connect tax to business decisions before execution

What you remember about this user's financial situation:
{memoryContext}

Translate tax into business impact. Quantify risk alongside savings. Flag deadlines proactively.`
```

---

## System Architecture

```
┌──────────────────────────────────────────────────┐
│           FRONTEND (Next.js :3000)               │
│                                                  │
│  app/page.tsx → <ChatWindow />                   │
│    ├── <Sidebar />                               │
│    │     ├── Persona selector (5 options)        │
│    │     ├── "New Chat" button                   │
│    │     └── "End Session" button                │
│    ├── <MessageBubble />  per message            │
│    └── <InputBar />       send message           │
│                                                  │
│  lib/api.ts                                      │
│    sendMessage(message, bankId, persona, history)│
│    endSession(bankId)                            │
│                                                  │
│  bankId in localStorage                          │
│  selectedPersona in component state              │
└────────────────┬─────────────────────────────────┘
                 │ fetch JSON
                 ▼
┌──────────────────────────────────────────────────┐
│           BACKEND (Express :4000)                │
│                                                  │
│  src/index.ts         — app bootstrap, CORS      │
│  src/routes/chat.ts                              │
│    POST /chat         — main handler             │
│    POST /reflect      — session consolidation    │
│    GET  /health       — liveness                 │
│                                                  │
│  src/agent/core.ts                               │
│    chat(message, bankId, persona, history)       │
│      1. recall(bankId, message)  ← Hindsight    │
│      2. getPersonaPrompt(persona, memories)      │
│      3. Groq qwen/qwen3-32b completion           │
│      4. retain(bankId, exchange) ← Hindsight    │
│      5. return { response, memoriesUsed }        │
│    endSession(bankId)                            │
│      reflect(bankId, consolidation query)        │
│                                                  │
│  src/agent/personas.ts                           │
│    5 persona system prompt templates             │
│    getPersonaPrompt(persona, memoryContext)      │
│                                                  │
│  src/agent/memory.ts                             │
│    retain / recall / reflect / formatMemories   │
│                                                  │
│  src/config/settings.ts                          │
└────────────────┬─────────────────────────────────┘
                 │ HTTP REST
                 ▼
┌──────────────────────────────────────────────────┐
│        HINDSIGHT SERVER (:8888)                  │
│   hindsight-api (Python, run separately)         │
│   Single bank per user                           │
│   TEMPR: Semantic + BM25 + Graph + Temporal      │
│                                                  │
│   Bank mission:                                  │
│   "I am a personal finance intelligence system.  │
│    I remember the user's complete financial       │
│    profile — income, debts, investments, tax      │
│    situation, goals, and all advice given         │
│    across every expert persona."                  │
└──────────────────────────────────────────────────┘
```

---

## Agent Flow (Per Message)

```
User selects persona + types message
        │
        ▼
lib/api.ts → POST /chat { message, bankId, persona, history }
        │
        ▼
core.chat()
    │
    ├── memory.recall(bankId, message)
    │     TEMPR search — returns all relevant financial memories
    │     regardless of which persona originally retained them
    │
    ├── personas.getPersonaPrompt(persona, formatMemories(memories))
    │     Injects recalled memories into selected persona's system prompt
    │
    ├── groq.chat.completions.create()
    │     model: qwen/qwen3-32b
    │     messages: [{ role: "system", content: personaPrompt },
    │                ...history,
    │                { role: "user", content: message }]
    │
    ├── memory.retain(bankId, exchange)
    │     if shouldRetain(message) — finance keyword filter
    │     Saved with persona tag: "[DANA] User said: ... Agent said: ..."
    │
    └── return { response, memoriesUsed, persona }
```

---

## Memory Design

### Single Bank Per User
One Hindsight bank holds the complete financial profile regardless of which persona is active.

### Bank Mission
```typescript
const BANK_MISSION = `
I am a personal finance intelligence system.
I remember this user's complete financial profile:
income, expenses, debts, investments, tax situation,
business financials, goals, and all advice given
across every expert (Dana, Morgan, Riley, Quinn, Cassandra).
I never ask the user to repeat financial information.
`;
```

### What Gets Retained

| Persona | Retains |
|---------|---------|
| Dana | Transactions, reconciliation issues, close deadlines, accounting tools |
| Morgan | Revenue, margins, EBITDA, cash flow, growth rates, valuation |
| Riley | Budget, forecast, headcount, variances, operating plan |
| Quinn | Portfolio, risk appetite, investment thesis, returns, due diligence |
| Cassandra | Tax positions, deductions, credits, entity type, jurisdictions |

Retain tag format:
```typescript
`[${persona.toUpperCase()}] User: ${message}\nAdvisor: ${response}`
```

### Finance Keyword Filter
```typescript
const FINANCIAL_KEYWORDS = [
  // General
  "income", "salary", "earn", "revenue", "profit", "loss",
  "debt", "loan", "credit", "emi", "interest", "principal",
  "invest", "portfolio", "stock", "fund", "equity", "bond",
  "save", "goal", "budget", "expense", "spend", "cash",
  "tax", "deduction", "credit", "filing", "irs", "gst",
  // Accounting (Dana)
  "reconcil", "journal", "gaap", "close", "audit", "balance sheet",
  "accounts payable", "accounts receivable", "depreciation",
  // Analyst (Morgan)
  "dcf", "ebitda", "wacc", "valuation", "model", "scenario",
  "margin", "forecast", "multiple", "comparable",
  // FP&A (Riley)
  "variance", "headcount", "operating plan", "aop", "reforecast",
  "kpi", "burn", "runway",
  // Investment (Quinn)
  "due diligence", "thesis", "conviction", "upside", "downside",
  "risk", "return", "irr", "moat", "catalyst",
  // Tax (Cassandra)
  "entity", "jurisdiction", "transfer pricing", "deferred",
  "provision", "asc 740", "sox", "1099", "w-2"
];

const shouldRetain = (message: string): boolean => {
  const lower = message.toLowerCase();
  return FINANCIAL_KEYWORDS.some(k => lower.includes(k))
      || message.trim().split(" ").length > 5;
};
```

### Reflect at Session End
```typescript
await reflect(bankId, `
  Consolidate everything known about this user's complete financial profile:
  - Income, expenses, assets, liabilities
  - Investment portfolio and risk appetite
  - Tax situation, entity structure, filing obligations
  - Business financials if applicable
  - Goals, timelines, and decisions made
  - Key advice given by each expert persona
`);
```

---

## Frontend Components

### `components/Sidebar.tsx`
- App name: FinSight
- **Persona selector** — 5 buttons: Dana 📒, Morgan 📊, Riley 📈, Quinn 🔍, Cassandra 🏛️
- Active persona highlighted
- "New Chat" — clears message history, memory persists
- "End Session" — fires POST /reflect, confirms consolidation to user
- Shows shortened bankId

### `components/ChatWindow.tsx`
- Holds `messages`, `history`, `selectedPersona` state
- `bankId` from `localStorage` via `crypto.randomUUID()`
- Shows active persona name + emoji in chat header
- Each message tagged with which persona responded

### `components/MessageBubble.tsx`
- User right-aligned
- Agent left-aligned with persona avatar emoji
- Supports markdown: bold, numbered lists, tables (financial advice uses all three)

### `components/InputBar.tsx`
- Textarea, Enter to send, Shift+Enter for newline
- Disabled while waiting
- Shows active persona in placeholder: "Ask Dana about your accounts..."

---

## Dependencies

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "groq-sdk": "^0.3.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "ts-node-dev": "^2.0.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```