# agents.md — Agent Architecture & Design

## Overview

MemoryAgent is a full-stack TypeScript application.
- **Frontend:** Next.js 14 App Router — ChatGPT-style UI
- **Backend:** Express.js — agent logic, Groq LLM, Hindsight memory
- **Memory:** Hindsight local server — TEMPR retrieval across sessions

Every message follows: Recall → Respond → Retain. Reflect runs at session end.

---

## System Architecture

```
┌──────────────────────────────────────────────┐
│           FRONTEND (Next.js :3000)           │
│                                              │
│  app/page.tsx                                │
│    └── <ChatWindow />                        │
│          ├── <Sidebar />      (session info) │
│          ├── <MessageBubble /> (per message) │
│          └── <InputBar />     (send message) │
│                                              │
│  lib/api.ts                                  │
│    sendMessage(message, bankId)              │
│    endSession(bankId)                        │
│                                              │
│  bankId stored in localStorage               │
└────────────────┬─────────────────────────────┘
                 │ fetch (JSON)
                 ▼
┌──────────────────────────────────────────────┐
│           BACKEND (Express :4000)            │
│                                              │
│  src/index.ts         — app bootstrap, CORS  │
│  src/routes/chat.ts                          │
│    POST /chat         — main message handler │
│    POST /reflect      — session consolidation│
│    GET  /health       — liveness check       │
│                                              │
│  src/agent/core.ts                           │
│    chat()     — recall → LLM → retain        │
│    endSession()— reflect()                   │
│                                              │
│  src/agent/memory.ts                         │
│    retain()   — store fact in Hindsight      │
│    recall()   — TEMPR search                 │
│    reflect()  — consolidate observations     │
│                                              │
│  src/config/settings.ts                      │
│    loads GROQ_API_KEY, HINDSIGHT_BASE_URL    │
└────────────────┬─────────────────────────────┘
                 │ HTTP REST
                 ▼
┌──────────────────────────────────────────────┐
│        HINDSIGHT SERVER (:8888)              │
│   hindsight-api (Python, run separately)     │
│   TEMPR: Semantic + BM25 + Graph + Temporal  │
└──────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│           GROQ API (cloud)                   │
│   Model: llama-3.3-70b-versatile             │
│   Free tier — no cost                        │
└──────────────────────────────────────────────┘
```

---

## Agent Flow (Per Message)

```
User types in InputBar
        │
        ▼
lib/api.ts → POST /chat { message, bankId }
        │
        ▼
routes/chat.ts → agent/core.ts chat()
        │
        ├── memory.recall(bankId, message)
        │     └── GET hindsight :8888/recall
        │         Returns: relevant past memories
        │
        ├── buildSystemPrompt(memories)
        │     └── Injects recalled context into system prompt
        │
        ├── Groq.chat.completions.create()
        │     model: llama-3.3-70b-versatile
        │     messages: [system, ...history, user]
        │
        ├── memory.retain(bankId, exchange)
        │     └── POST hindsight :8888/retain
        │         Only if message > 4 words (filler filter)
        │
        └── return { response, memoriesUsed }
                │
                ▼
        Next.js renders MessageBubble
```

---

## Backend Components

### `src/index.ts`
Express bootstrap. Enables CORS for `localhost:3000`. Mounts `/chat`, `/reflect`, `/health`.

### `src/routes/chat.ts`
```typescript
router.post("/chat", async (req, res) => {
  const { message, bankId, history } = req.body;
  const result = await chat(message, bankId, history);
  res.json(result);
});

router.post("/reflect", async (req, res) => {
  const { bankId } = req.body;
  await endSession(bankId);
  res.json({ status: "ok" });
});
```

### `src/agent/core.ts`
```typescript
export async function chat(message: string, bankId: string, history: Message[]) {
  // 1. Recall
  const memories = await recall(bankId, message);
  const context = formatMemories(memories);

  // 2. Build prompt
  const system = buildSystemPrompt(context);

  // 3. Groq LLM
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: system }, ...history,
               { role: "user", content: message }],
  });
  const response = completion.choices[0].message.content;

  // 4. Retain
  if (shouldRetain(message)) {
    await retain(bankId, `User: ${message}\nAgent: ${response}`);
  }

  return { response, memoriesUsed: memories.length };
}
```

### `src/agent/memory.ts`
Hindsight REST client. Three functions: `retain`, `recall`, `reflect`. Each wrapped in try/catch.

### `src/config/settings.ts`
```typescript
import dotenv from "dotenv";
dotenv.config();

export const GROQ_API_KEY = process.env.GROQ_API_KEY!;
export const HINDSIGHT_BASE_URL = process.env.HINDSIGHT_BASE_URL || "http://localhost:8888";
export const HINDSIGHT_BANK_ID = process.env.HINDSIGHT_BANK_ID || "memoryagent-bank";
export const PORT = process.env.PORT || 4000;
```

---

## Frontend Components

### `app/page.tsx`
Root page. Renders `<ChatWindow />`.

### `components/ChatWindow.tsx`
Main layout. Holds message state, calls `lib/api.ts`, passes data down to children.

### `components/MessageBubble.tsx`
Renders one message. User messages right-aligned, agent messages left-aligned with avatar.

### `components/InputBar.tsx`
Textarea + send button. Submits on Enter (Shift+Enter for newline). Disabled while waiting for response.

### `components/Sidebar.tsx`
- Shows current session bank ID
- "New Chat" button — clears message history (memory persists in Hindsight)
- "End Session" button — calls `POST /reflect` to consolidate memories

### `lib/api.ts`
```typescript
export async function sendMessage(message: string, bankId: string, history: Message[]) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, bankId, history }),
  });
  return res.json();
}

export async function endSession(bankId: string) {
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reflect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bankId }),
  });
}
```

---

## Dependencies

### Backend (backend/package.json)
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

### Frontend (frontend/package.json)
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

---

## Memory Bank Design

### Bank ID Strategy
Generated on first frontend visit using `crypto.randomUUID()`, stored in `localStorage`.
Same browser = same bank = same memories across sessions.

### System Prompt
```typescript
const buildSystemPrompt = (memoryContext: string) => `
You are a personal AI assistant with persistent memory.
You remember everything this user has told you across all sessions.

What you remember about this user:
${memoryContext}

Rules:
- Use memory naturally, never mention you are recalling it
- Never ask the user to repeat themselves
- Be concise, direct, and helpful
`;
```

### Filler Filter
```typescript
const shouldRetain = (message: string): boolean => {
  const filler = new Set(["ok", "okay", "thanks", "sure", "yes", "no", "got it"]);
  const words = message.trim().toLowerCase().split(" ");
  return words.length > 4 && !filler.has(message.trim().toLowerCase());
};
```