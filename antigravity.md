# antigravity.md — The Problem, The Approach, What I Learned

## The Problem

Every AI agent I've ever used has the memory of a goldfish.

You spend 10 minutes explaining your project, your preferences, your stack — and the next day you open a new tab and it's gone. You're back to square one. Again.

This isn't a small UX issue. It's a fundamental ceiling on what AI agents can actually do.

A truly useful personal agent needs to:
- Know who you are without asking every time
- Remember what you told it last week
- Build on past conversations instead of ignoring them
- Get *better* at helping you over time

Standard approaches fail here:
- **Stuffing full chat history into context** — burns tokens, hits limits, doesn't scale
- **Simple vector search** — no temporal reasoning, misses time-based queries entirely
- **Prompt engineering tricks** — duct tape on a structural problem

The real fix is a memory layer built specifically for agents. That's Hindsight.

---

## The Approach

### What I Built

A full-stack web-based personal AI assistant — Next.js frontend, Express backend, Groq for the LLM, and Hindsight for persistent memory across sessions.

Every conversation follows a tight loop:

```
Recall past context → Respond with that context → Retain new facts → Reflect at session end
```

No conversation ever starts cold again.

### Why Next.js + Express

Splitting frontend and backend was a deliberate call.

Next.js handles the UI — App Router, server components, clean component structure. No backend logic leaks into the frontend. Express handles the agent logic — recall, LLM call, retain — as a clean API layer. Each side can be developed, tested, and deployed independently.

The alternative was a Next.js API route handling everything. That works but it mixes concerns. Keeping Express separate means the backend can be swapped, scaled, or tested without touching the UI.

### Why Groq

Groq is free, fast, and has a generous tier. For a hackathon where the story is about memory — not the LLM — spending zero on inference is the right call. `llama-3.3-70b-versatile` is capable enough to make the memory integration shine without distracting from it.

### Why Hindsight

| Option | Problem |
|--------|---------|
| Store full chat history | Token bloat, no semantic search |
| Basic vector DB | No temporal reasoning, no graph traversal |
| Custom memory system | Weeks of engineering |
| **Hindsight** | Purpose-built for agents. Retain/Recall/Reflect out of the box. |

Hindsight's TEMPR retrieval runs 4 strategies in parallel — semantic, BM25, graph, temporal. That matters. "What was I working on last Tuesday?" is a temporal query. "What stack do I prefer?" is semantic. A single strategy misses half the queries.

### Implementation

**Backend core — what runs on every message:**
```typescript
const memories = await recall(bankId, message);
const context = formatMemories(memories);
const system = buildSystemPrompt(context);

const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "system", content: system }, ...history,
             { role: "user", content: message }],
});

const response = completion.choices[0].message.content;

if (shouldRetain(message)) {
  await retain(bankId, `User: ${message}\nAgent: ${response}`);
}
```

**Frontend — what happens on send:**
```typescript
const result = await sendMessage(message, bankId, history);
setMessages(prev => [...prev, { role: "agent", content: result.response }]);
```

**Session end — reflect fires automatically:**
```typescript
// Sidebar "End Session" button
await endSession(bankId);
// Also fires on tab close via beforeunload
```

**Bank ID — simplest possible identity:**
```typescript
// On first load
const bankId = localStorage.getItem("bankId") ?? crypto.randomUUID();
localStorage.setItem("bankId", bankId);
```

No auth. No database. Same browser = same memory. That's the right scope for a personal agent.

---

## What Surprised Me

**1. Splitting frontend and backend clarified everything**
When it was one system, agent logic kept bleeding into UI logic. Once Express owned the agent and Next.js owned the UI, both got simpler. Each file has one job.

**2. Reflect is not optional**
Without reflect, retained facts pile up as raw noise. Reflect consolidates them into observations — "User mentioned TypeScript 4 times" becomes "User strongly prefers TypeScript." That observation shapes every future response in a way raw facts don't.

**3. localStorage bank_id eliminated auth entirely**
No login, no session table, no JWT. The browser holds identity. Hindsight holds memory. Two decisions that cut scope by more than half.

**4. Filler retention kills recall quality**
Retaining "ok", "thanks", "sure" filled the memory bank with noise fast. A simple `shouldRetain()` filter — messages over 4 words with actual content — fixed it immediately.

**5. Groq is genuinely fast**
Response latency on `llama-3.3-70b-versatile` is low enough that the typing indicator barely shows. For a chat UI where perceived speed matters, that's a real win.

---

## Lessons Learned

**1. Recall before respond, always**
Never let the LLM answer cold. Pull memory first, inject into system prompt, then generate. This single pattern is what makes memory-augmented agents feel different.

**2. Keep Express thin**
Route handlers call core functions, core functions call memory and LLM. No business logic in route handlers, no HTTP logic in core. Clean separation pays off immediately when debugging.

**3. Frontend owns UX, backend owns intelligence**
Next.js manages what the user sees and how it feels. Express manages what the agent knows and how it thinks. Never mix the two.

**4. Reflect once per session**
Reflect is expensive. Once at session end is the right tradeoff — latency stays low during conversation, memory quality stays high across sessions.

**5. The demo is one question**
Open a fresh browser tab. Type "what do you know about me?" Watch it answer with everything from a previous session. That moment is the before/after. Everything else is supporting detail.

---

## Stack Summary

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Express.js + TypeScript |
| LLM | Groq — llama-3.3-70b-versatile (free) |
| Memory | [Hindsight](https://hindsight.vectorize.io/) |
| Memory Server | hindsight-api (Python, local :8888) |
| Identity | bank_id in browser localStorage |

---

## Resources Used

- [Hindsight Docs](https://hindsight.vectorize.io/)
- [Hindsight GitHub](https://github.com/vectorize-io/hindsight)
- [Agent Memory Overview](https://vectorize.io/what-is-agent-memory)
- [Hindsight Cloud UI](https://ui.hindsight.vectorize.io)
- [Groq Console](https://console.groq.com)