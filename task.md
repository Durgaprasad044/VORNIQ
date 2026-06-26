Agent/
├── backend/                        # Express API server
│   ├── src/
│   │   ├── index.ts                # Express app entry point
│   │   ├── routes/
│   │   │   └── chat.ts             # POST /chat, POST /reflect, GET /health        
│   │   ├── agent/
│   │   │   ├── core.ts              # Recall → LLM → Retain → Reflect logic
│   │   │   ├── memory.ts            # Hindsight client wrapper
│   │   │   └── personas.ts        ← NEW: all 5 persona prompts
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