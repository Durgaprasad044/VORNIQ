# 🧠 MemoryAgent — An AI Agent That Actually Remembers You

> Powered by [Hindsight](https://hindsight.vectorize.io/) — persistent memory for AI agents.

A full-stack web-based AI assistant with a ChatGPT-style interface. Every conversation persists across sessions — the agent remembers who you are, what you've told it, and builds on it every time.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Express.js |
| LLM | Groq (llama-3.3-70b-versatile) |
| Memory | Hindsight by Vectorize |
| Language | TypeScript |

---

## Project Structure

```
Agent/
├── backend/                        # Express API server
│   ├── src/
│   │   ├── index.ts                # Express app entry point
│   │   ├── routes/
│   │   │   └── chat.ts             # POST /chat, POST /reflect, GET /health
│   │   ├── agent/
│   │   │   ├── core.ts             # Recall → LLM → Retain → Reflect logic
│   │   │   └── memory.ts           # Hindsight client wrapper
│   │   └── config/
│   │       └── settings.ts         # Loads env vars
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                       # Next.js app
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home — renders ChatWindow
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ChatWindow.tsx          # Full chat UI component
│   │   ├── MessageBubble.tsx       # Individual message bubble
│   │   ├── InputBar.tsx            # Textarea + send button
│   │   └── Sidebar.tsx             # Session info + end session button
│   ├── lib/
│   │   └── api.ts                  # fetch wrappers for backend calls
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

Then inside your coding agent (Claude Code/Codex), run:
```
/hindsight-architect
```
This reads your repo and wires Hindsight automatically. Do this before anything else.
---

### 1. Start Hindsight Server

```bash
pip install hindsight-api
export OPENAI_API_KEY=your_openai_key        # Hindsight needs this internally
export HINDSIGHT_API_LLM_API_KEY=$OPENAI_API_KEY
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
# .env.local already points to backend at localhost:4000
npm run dev
# Runs at http://localhost:3000
```

---

## Environment Variables

### backend/.env
```
GROQ_API_KEY=your_groq_key
HINDSIGHT_BASE_URL=http://localhost:8888
HINDSIGHT_BANK_ID=memoryagent-bank
PORT=4000
```

### frontend/.env.local
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send message, get memory-aware response |
| `POST` | `/reflect` | Consolidate session memories |
| `GET` | `/health` | Health check |

### POST /chat
```json
Request:  { "message": "My name is Durga", "bankId": "user-abc123" }
Response: { "response": "Nice to meet you, Durga!", "memoriesUsed": 0 }
```

---

## How Memory Works

```
Browser (user types)
      │
      ▼
Next.js → POST /chat (Express)
      │
      ▼
  [Recall] ── Hindsight TEMPR search
      │        Semantic + BM25 + Graph + Temporal
      ▼
  [Groq LLM] ── system prompt + memories + message
      │
      ▼
  [Retain] ── save exchange to Hindsight
      │
      ▼
Response → Next.js → rendered in chat UI
      │
  (session end)
      ▼
  [Reflect] ── POST /reflect → consolidate observations
```

---

## Example

**Session 1:**
```
You: I'm Durga, building a startup called VEQRON in AI/ML.
Agent: That's exciting, Durga! What are you working on today?
```

**Session 2 (fresh browser tab):**
```
You: Hey, what do you know about me?
Agent: Hey Durga! You mentioned you're building VEQRON,
       your AI/ML startup. Want to pick up where we left off?
```

No re-introduction. No forgetting. That's Hindsight.

---

## Resources

- [Hindsight Docs](https://hindsight.vectorize.io/)
- [Hindsight GitHub](https://github.com/vectorize-io/hindsight)
- [Agent Memory Overview](https://vectorize.io/what-is-agent-memory)
- [Groq Console](https://console.groq.com)