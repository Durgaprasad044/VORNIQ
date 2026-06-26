You are a senior backend engineer reviewing the VORNIQ project.

Read every file in the backend/ directory carefully:
- backend/src/index.ts
- backend/src/config/settings.ts
- backend/src/agent/memory.ts
- backend/src/agent/core.ts
- backend/src/agent/personas.ts
- backend/src/routes/chat.ts
- backend/.env

Also read:
- antigravity.md (at the project root)

CRITICAL CONTEXT — READ THIS FIRST:
This project uses Hindsight CLOUD, not a local Hindsight instance.
This is non-negotiable. Do not suggest running Hindsight locally.
Do not reference localhost:8888 anywhere. The correct setup is:

  HINDSIGHT_URL=https://api.hindsight.vectorize.io
  HINDSIGHT_API_KEY=hsk_1af03f95bb4657cc38f3e23c2eaf1866_b6421be662e1c194

Hindsight Cloud API rules (apply these everywhere in memory.ts):
- Base URL: https://api.hindsight.vectorize.io
- Auth header: Authorization: Bearer {HINDSIGHT_API_KEY}
  NOT X-API-Key. NOT x-api-key. ONLY Authorization: Bearer.
- ensureBank → PUT /v1/default/banks/{bankId}
  body: { retain_mission: "..." }
  NOT POST /banks. NOT { mission: "..." }.
- retain → POST /v1/default/banks/{bankId}/memories
  body: { content: "..." }
  fire-and-forget, do not await, do not block chat response
- recall → POST /v1/default/banks/{bankId}/memories/recall
  body: { query, types: ["world","experience","observation"], budget: "mid" }
  parse response as: response.data.memories.map(m => m.text)
  NOT m.content. Return [] on any error, never throw.
- reflect → POST /v1/default/banks/{bankId}/reflect
  body: { query: "..." }

Your job:

STEP 1 — Understand antigravity.md fully.
Read it completely. Understand what VORNIQ is supposed to do,
what the memory system should do, what the personas should do,
and what the API contract looks like.

STEP 2 — Audit every backend file against antigravity.md
AND the Hindsight Cloud rules above.
Check each file for:
- Any reference to localhost:8888 → replace with https://api.hindsight.vectorize.io
- Wrong auth header (X-API-Key) → replace with Authorization: Bearer
- Wrong ensureBank method (POST) → replace with PUT
- Wrong ensureBank body key (mission) → replace with retain_mission
- Wrong recall path → fix to /v1/default/banks/{bankId}/memories/recall
- Wrong recall body (top_k) → fix to types + budget
- Wrong recall response parsing (m.content) → fix to m.text
- retain being awaited → make it fire-and-forget
- Wrong model string (qwen-qwen3-32b) → replace with openai/gpt-oss-120b
- Missing <think> tag stripping in core.ts
- Any persona prompt missing {memoryContext} injection
- Any route missing validation or error handling
- Any TypeScript errors or type issues
- Anything contradicting antigravity.md

STEP 3 — Fix everything you find.
Make the actual changes to the files. Do not just report issues.
Fix them directly. Show a summary of what you changed and why.

STEP 4 — Confirm the final state.
After fixing, list every file and confirm it is correct,
consistent with antigravity.md, and using Hindsight Cloud
(not local). If anything cannot be fixed without more
information, flag it clearly.

Do not skip any file. Do not leave any issue unfixed.