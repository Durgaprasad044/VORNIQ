You are a senior backend engineer. Build the complete Express + TypeScript backend
for VORNIQ — a multi-persona personal finance intelligence agent.

---

## STRICT RULES
- Create exactly the files listed in the structure below, nothing else
- No extra middleware, no extra routes, no extra utilities
- TypeScript strict mode throughout
- All env vars loaded only through src/config/settings.ts
- No default exports — named exports only
- All async functions must have try/catch with typed errors

---

## FILE STRUCTURE — create exactly these files

backend/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── chat.ts
│   ├── agent/
│   │   ├── core.ts
│   │   ├── memory.ts
│   │   └── personas.ts
│   └── config/
│       └── settings.ts
├── .env.example
├── .env
├── package.json
└── tsconfig.json

---

## package.json — use exactly these deps

{
  "name": "vorniq-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
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

---

## tsconfig.json

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

---

## src/config/settings.ts

Load and export exactly these env vars.
Throw a descriptive error at startup if any required var is missing.

export const settings = {
  PORT: process.env.PORT || "4000",
  GROQ_API_KEY: required("GROQ_API_KEY"),
  GROQ_MODEL: process.env.GROQ_MODEL || "qwen-qwen3-32b",
  HINDSIGHT_URL: required("HINDSIGHT_URL"),    // e.g. http://localhost:8888
  HINDSIGHT_API_KEY: required("HINDSIGHT_API_KEY"),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
}

Helper:
function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

---

## .env.example

PORT=4000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=qwen-qwen3-32b
HINDSIGHT_URL=http://localhost:8888
HINDSIGHT_API_KEY=your_hindsight_api_key_here
FRONTEND_ORIGIN=http://localhost:3000

---

## src/agent/personas.ts

Define a PersonaKey type and all 5 persona system prompts exactly as written below.
Export getPersonaPrompt(persona: PersonaKey, memoryContext: string): string
which injects memoryContext into the {memoryContext} placeholder.

export type PersonaKey = "dana" | "morgan" | "riley" | "quinn" | "cassandra";

export const PERSONA_META: Record<PersonaKey, { emoji: string; name: string; role: string }> = {
  dana:      { emoji: "📒", name: "Dana",     role: "Controller" },
  morgan:    { emoji: "📊", name: "Morgan",   role: "Financial Analyst" },
  riley:     { emoji: "📈", name: "Riley",    role: "FP&A Analyst" },
  quinn:     { emoji: "🔍", name: "Quinn",    role: "Investment Researcher" },
  cassandra: { emoji: "🏛️", name: "Cassandra", role: "Tax Strategist" },
};

Persona prompts — use exactly these (inject {memoryContext}):

DANA:
  "You are Dana, a Controller with 13+ years of experience.
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
   Give precise, factual answers. Flag issues early. Explain variances proactively."

MORGAN:
  "You are Morgan, a Financial Analyst with 12+ years across investment banking and FP&A.
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
   Lead with the so what. Quantify everything. Flag risks proactively."

RILEY:
  "You are Riley, an FP&A Analyst with 11+ years across SaaS and manufacturing.
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
   Be the translator. Make variances actionable. Challenge with data."

QUINN:
  "You are Quinn, an Investment Researcher with 14+ years on the buy-side.
   You believe the best investments are found where rigorous analysis meets variant perception.
   If your thesis matches consensus, you don't have edge — you have company.
   Your rules:
   - Separate thesis from narrative — compelling stories aren't investment theses
   - Always present both sides — bull and bear equally rigorous
   - Cite primary sources, not blog posts
   - Quantify the downside — it could go down is not a risk assessment
   - Define thesis breakers — specific triggers that would invalidate the position
   What you remember about this user's financial situation:
   {memoryContext}
   Lead with the variant view. Be specific about conviction. Quantify the asymmetry."

CASSANDRA:
  "You are Cassandra, a Tax Strategist with 15+ years across Big Four and corporate tax.
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
   Translate tax into business impact. Quantify risk alongside savings. Flag deadlines proactively."

---

## src/agent/memory.ts

Hindsight REST API wrapper. All calls use axios with base URL from settings.HINDSIGHT_URL.
Auth header on every request: { "X-API-Key": settings.HINDSIGHT_API_KEY }

The Hindsight bank mission (used when creating a bank):
const BANK_MISSION = `
I am a personal finance intelligence system.
I remember this user's complete financial profile:
income, expenses, debts, investments, tax situation,
business financials, goals, and all advice given
across every expert (Dana, Morgan, Riley, Quinn, Cassandra).
I never ask the user to repeat financial information.
`;

Export exactly these 4 functions:

1. ensureBank(bankId: string): Promise<void>
   POST /banks { bank_id: bankId, mission: BANK_MISSION }
   Ignore 409 Conflict (bank already exists). Throw on all other errors.

2. retain(bankId: string, content: string): Promise<void>
   POST /banks/{bankId}/memories { content }
   content format: "[PERSONA] User: {message}\nAdvisor: {response}"

3. recall(bankId: string, query: string): Promise<string[]>
   POST /banks/{bankId}/recall { query, top_k: 8 }
   Returns array of memory content strings.
   Parse from response body: response.data.memories.map(m => m.content)
   Return [] on error (never throw — missing memories shouldn't break chat).

4. reflect(bankId: string): Promise<void>
   POST /banks/{bankId}/reflect
   Body: {
     query: "Consolidate everything known about this user's complete financial profile:
             income, expenses, assets, liabilities, investment portfolio and risk appetite,
             tax situation, entity structure, filing obligations, business financials if applicable,
             goals, timelines, decisions made, key advice given by each expert persona."
   }

Also export:
formatMemories(memories: string[]): string
  If memories is empty → return "No prior financial context on record."
  Otherwise → return memories.map((m, i) => `${i+1}. ${m}`).join("\n\n")

---

## src/agent/core.ts

Orchestrates the full agent loop per message.
Import Groq from "groq-sdk".
Import settings, PersonaKey, getPersonaPrompt, PERSONA_META,
       ensureBank, retain, recall, reflect, formatMemories.

Types:
  export type HistoryMessage = { role: "user" | "assistant"; content: string };

  export type ChatResult = {
    response: string;
    memoriesUsed: number;
    persona: PersonaKey;
  };

Finance keyword filter — shouldRetain(message: string): boolean
  Return true if message contains any of these keywords (case-insensitive)
  OR if message word count > 5:

  Keywords: income, salary, earn, revenue, profit, loss, debt, loan, credit,
  emi, interest, principal, invest, portfolio, stock, fund, equity, bond,
  save, goal, budget, expense, spend, cash, tax, deduction, filing, irs, gst,
  reconcil, journal, gaap, close, audit, balance sheet, accounts payable,
  accounts receivable, depreciation, dcf, ebitda, wacc, valuation, model,
  scenario, margin, forecast, multiple, comparable, variance, headcount,
  operating plan, aop, reforecast, kpi, burn, runway, due diligence, thesis,
  conviction, upside, downside, risk, return, irr, moat, catalyst, entity,
  jurisdiction, transfer pricing, deferred, provision, asc 740, sox, 1099, w-2

Export these 2 functions:

1. chat(
     message: string,
     bankId: string,
     persona: PersonaKey,
     history: HistoryMessage[]
   ): Promise<ChatResult>

   Steps in order:
   a. ensureBank(bankId)
   b. memories = await recall(bankId, message)
   c. systemPrompt = getPersonaPrompt(persona, formatMemories(memories))
   d. groq.chat.completions.create({
        model: settings.GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-10),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
   e. response = completion.choices[0].message.content ?? ""
   f. Strip <think>...</think> blocks from response before returning
      (Qwen3 emits reasoning tokens in <think> tags — remove them)
   g. if shouldRetain(message):
        persona tag: `[${persona.toUpperCase()}] User: ${message}\nAdvisor: ${response}`
        await retain(bankId, tag)
   h. return { response, memoriesUsed: memories.length, persona }

2. endSession(bankId: string): Promise<void>
   await ensureBank(bankId)
   await reflect(bankId)

---

## src/routes/chat.ts

Express Router. Export as named export: export const chatRouter = Router();

Request body types (define inline):
  ChatBody:    { message: string; bankId: string; persona: string; history: HistoryMessage[] }
  ReflectBody: { bankId: string }

Validation helper — validatePersona(p: string): PersonaKey
  Valid values: "dana" | "morgan" | "riley" | "quinn" | "cassandra"
  Throw 400 with message "Invalid persona" if not valid.

Routes:

POST /chat
  1. Destructure and validate body: message (string, required), bankId (string, required),
     persona (validate via validatePersona), history (array, default [])
  2. If message or bankId missing → 400 { error: "message and bankId are required" }
  3. result = await chat(message, bankId, validatedPersona, history)
  4. res.json({ response: result.response, memoriesUsed: result.memoriesUsed, persona: result.persona })
  5. Catch all errors → 500 { error: err.message }

POST /reflect
  1. Destructure bankId from body
  2. If bankId missing → 400 { error: "bankId is required" }
  3. await endSession(bankId)
  4. res.json({ status: "reflected" })
  5. Catch all errors → 500 { error: err.message }

GET /health
  res.json({ status: "ok", timestamp: new Date().toISOString() })

---

## src/index.ts

Bootstrap Express app. Steps exactly:

1. import dotenv/config (first line, before any other import)
2. Import express, cors, settings, chatRouter
3. const app = express()
4. app.use(cors({ origin: settings.FRONTEND_ORIGIN, credentials: true }))
5. app.use(express.json())
6. app.use("/", chatRouter)
7. app.listen(settings.PORT, () =>
     console.log(`VORNIQ backend running on port ${settings.PORT}`))

---

## OUTPUT INSTRUCTIONS
- Output each file in full, in this order:
  1. package.json
  2. tsconfig.json
  3. .env.example
  4. src/config/settings.ts
  5. src/agent/personas.ts
  6. src/agent/memory.ts
  7. src/agent/core.ts
  8. src/routes/chat.ts
  9. src/index.ts
- No commentary between files, just the filename as a header then the full code
- No TODOs, no placeholder comments, no "implement this later"
- Every function must be complete and working