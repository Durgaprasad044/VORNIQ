# 💰 FinSight — Personal Finance Intelligence Agent

> Powered by [Hindsight](https://hindsight.vectorize.io/) — persistent memory for AI agents.

FinSight is a web-based AI finance assistant with 5 specialized expert personas. It remembers your complete financial profile across every session — income, debts, goals, tax situation, investments, and past advice — and gets sharper the more you use it.

---

## The 5 Expert Personas

| Persona | Name | Specialization |
|---------|------|---------------|
| 📒 Bookkeeper & Controller | Dana | Month-end close, reconciliations, GAAP compliance, internal controls |
| 📊 Financial Analyst | Morgan | Financial modeling, DCF, scenario analysis, valuation |
| 📈 FP&A Analyst | Riley | Budgeting, variance analysis, rolling forecasts, operating plans |
| 🔍 Investment Researcher | Quinn | Due diligence, portfolio analysis, equity research, risk assessment |
| 🏛️ Tax Strategist | Cassandra | Tax optimization, multi-jurisdiction compliance, transfer pricing |

The user selects a persona per session. Hindsight memory persists across all personas — Dana remembers what Quinn learned.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Express.js + TypeScript |
| LLM | Groq — qwen/qwen3-32b |
| Memory | Hindsight by Vectorize |

---

## Project Structure

```
finsight/
├── backend/
│   ├── src/
│   │   ├── index.ts                  # Express app entry point
│   │   ├── routes/
│   │   │   └── chat.ts               # POST /chat, POST /reflect, GET /health
│   │   ├── agent/
│   │   │   ├── core.ts               # Recall → LLM → Retain → Reflect logic
│   │   │   ├── memory.ts             # Hindsight client wrapper
│   │   │   └── personas.ts           # All 5 persona system prompts
│   │   └── config/
│   │       └── settings.ts           # Loads env vars
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home — renders ChatWindow
│   │   └── globals.css               # Dark theme styles
│   ├── components/
│   │   ├── ChatWindow.tsx            # Main chat UI, holds all state
│   │   ├── MessageBubble.tsx         # Individual message bubble
│   │   ├── InputBar.tsx              # Textarea + send button
│   │   └── Sidebar.tsx               # Persona selector + session controls
│   ├── lib/
│   │   └── api.ts                    # fetch wrappers for backend
│   ├── .env.local
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
├── agents.md
└── antigravity.md
```

---

## Quickstart

### 0. Setup Hindsight Skills (Run First)

```bash
git clone --depth 1 https://github.com/vectorize-io/hindsight-skills.git ~/hindsight-skills
cd ~/hindsight-skills && ./setup
```

Then inside your coding agent run:
```
/hindsight-architect
```

> 💡 Use promo code **MEMHACK625** on [Hindsight Cloud](https://ui.hindsight.vectorize.io) for $50 free credits — add in billing after registering.

---

### 1. Start Hindsight Server

```bash
pip install hindsight-api
export HINDSIGHT_API_LLM_API_KEY=your_groq_key
hindsight-api
# Runs at http://localhost:8888
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your keys
npm run dev
# Runs at http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

---

## Environment Variables

### backend/.env
```
GROQ_API_KEY=your_groq_key
HINDSIGHT_BASE_URL=http://localhost:8888
HINDSIGHT_BANK_ID=finsight-bank
PORT=4000
```

### frontend/.env.local
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

---

## API Endpoints

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/chat` | `{ message, bankId, persona, history }` | Memory-aware response |
| `POST` | `/reflect` | `{ bankId }` | Consolidate session memories |
| `GET` | `/health` | — | Liveness check |

---

## How Memory Works

```
Browser (user selects persona + types message)
        │
        ▼
Next.js → POST /chat { message, bankId, persona, history }
        │
        ▼
   [Recall] ── Hindsight TEMPR search
        │       Semantic + BM25 + Graph + Temporal
        │       Returns: income, debts, goals, tax situation,
        │                investments, past advice across ALL personas
        ▼
   [Persona Prompt] ── Dana / Morgan / Riley / Quinn / Cassandra
        │               system prompt injected with recalled memories
        ▼
   [Groq LLM] ── qwen/qwen3-32b
        │
        ▼
   [Retain] ── save financial facts back to Hindsight
        │
        ▼
Response → Next.js → chat UI
        │
   (session end)
        ▼
   [Reflect] ── consolidate full financial profile
```

---

## Example — Cross-Persona Memory

**Session 1 — Quinn (Investment Researcher):**
```
You: I have ₹5L to invest, moderate risk appetite, 5 year horizon.
Quinn: Given your profile, here's a diversified allocation...
[Retained: investable_capital=₹5L, risk=moderate, horizon=5yr]
```

**Session 2 — Cassandra (Tax Strategist):**
```
You: What's the most tax-efficient way to invest?
Cassandra: Given your ₹5L corpus and 5-year horizon Quinn noted,
           ELSS funds give you Section 80C deduction up to ₹1.5L
           and qualify for LTCG exemption after 1 year.
```

Memory flows across personas. One financial profile. Five expert views.

---

## Resources

- [Hindsight Docs](https://hindsight.vectorize.io/)
- [Hindsight GitHub](https://github.com/vectorize-io/hindsight)
- [Agent Memory Overview](https://vectorize.io/what-is-agent-memory)
- [Hindsight Cloud](https://ui.hindsight.vectorize.io) — promo **MEMHACK625**
- [Groq Console](https://console.groq.com)
- [Hindsight Community Slack](https://hindsight.vectorize.io/)