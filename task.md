You are a senior frontend engineer. Build the frontend for VORNIQ — a multi-persona personal finance intelligence agent — using Next.js 14 App Router and Tailwind CSS.

STRICT RULES:
- Do not add any files outside the structure below
- Do not add tests, storybook, extra components, or pages
- Do not use any component libraries (no shadcn, no chakra, no MUI)
- Pure Tailwind CSS only
- No gradients, no glassmorphism, no animations except typing indicator pulse

FILE STRUCTURE — create exactly these files, nothing else:
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   ├── InputBar.tsx
│   └── Sidebar.tsx
├── lib/
│   └── api.ts
├── .env.local
├── package.json
└── tsconfig.json

DESIGN SPEC — follow exactly:
- Background: #0a0a0a
- Sidebar background: #111111
- Message bubble (agent): #1a1a1a
- Message bubble (user): #1e3a2f
- User text: #d4f0e0
- Agent text: #cccccc
- Accent color: #22c55e (green) — send button, active persona, memory pill, dots
- All borders: 0.5px solid #222222
- Font: system-ui
- No rounded corners above 12px
- Sidebar width: 220px fixed
- Input bar fixed at bottom

SIDEBAR — build exactly this:
- App logo: green chart icon + "VORNIQ" + tagline "every number tells a story"
- Section label: "PERSONAS" in 10px uppercase muted text
- 5 persona buttons — each with emoji avatar + name + role:
  📒 Dana — Controller
  📊 Morgan — Financial Analyst
  📈 Riley — FP&A Analyst
  🔍 Quinn — Investment Researcher
  🏛️ Cassandra — Tax Strategist
- Active persona: #162312 background + #22c55e33 border + green name text
- Hover: #1a1a1a background
- Bottom section separated by border:
  - "New Chat" button — clears messages state only, memory persists
  - "End Session" button — calls endSession() from lib/api.ts then shows "Session saved." confirmation
  - Session ID display: shortened bankId in 10px muted text

CHAT HEADER — build exactly this:
- Active green dot + "Talking to [PersonaName] — [Role]" in muted text
- Right side: memory pill showing "N memories recalled" in green — only visible when memoriesUsed > 0

MESSAGES — build exactly this:
- Agent messages: left-aligned, persona emoji avatar, #1a1a1a bubble, border-radius 2px 12px 12px 12px
- User messages: right-aligned, "D" initial avatar in green, #1e3a2f bubble, border-radius 12px 2px 12px 12px
- Below agent message: if memoriesUsed > 0, show memory tag: small green pill "recalled: N memories"
- Timestamp below each message in 10px muted text
- Support bold text and line breaks in agent messages
- Typing indicator: 3 dots pulsing in #1a1a1a bubble while waiting for response

INPUT BAR — build exactly this:
- Full width, fixed at bottom, border-top 0.5px solid #1a1a1a
- Textarea: #1a1a1a background, placeholder "Ask [PersonaName] about your financials..."
- Placeholder updates when persona changes
- Enter to send, Shift+Enter for newline
- Disabled while waiting for response (opacity 0.5)
- Send button: #22c55e background, black arrow-up icon, 36x36px, border-radius 10px

APP STATE — manage in ChatWindow.tsx:
- messages: array of { role, content, memoriesUsed, persona, timestamp }
- history: array of { role, content } for API (last 10 messages only)
- selectedPersona: one of "dana" | "morgan" | "riley" | "quinn" | "cassandra"
- isLoading: boolean
- bankId: string from localStorage (generate with crypto.randomUUID() on first load)

lib/api.ts — build exactly these two functions:
- sendMessage(message, bankId, persona, history) — POST to NEXT_PUBLIC_BACKEND_URL/chat, returns { response, memoriesUsed }
- endSession(bankId) — POST to NEXT_PUBLIC_BACKEND_URL/reflect, returns { status }

.env.local:
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

On tab close, fire endSession via navigator.sendBeacon to POST /reflect with bankId.

Do not add anything beyond what is listed. No tests, no extra pages, no extra components.