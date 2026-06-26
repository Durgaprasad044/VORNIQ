import Groq from "groq-sdk";
import { settings } from "../config/settings";
import { PersonaKey, getPersonaPrompt } from "./personas";
import { ensureBank, retain, recall, reflect, formatMemories } from "./memory";

export type HistoryMessage = { role: "user" | "assistant"; content: string };

export type ChatResult = {
  response: string;
  memoriesUsed: number;
  persona: PersonaKey;
};

const FINANCIAL_KEYWORDS: string[] = [
  "income", "salary", "earn", "revenue", "profit", "loss",
  "debt", "loan", "credit", "emi", "interest", "principal",
  "invest", "portfolio", "stock", "fund", "equity", "bond",
  "save", "goal", "budget", "expense", "spend", "cash",
  "tax", "deduction", "filing", "irs", "gst",
  "reconcil", "journal", "gaap", "close", "audit", "balance sheet",
  "accounts payable", "accounts receivable", "depreciation",
  "dcf", "ebitda", "wacc", "valuation", "model", "scenario",
  "margin", "forecast", "multiple", "comparable",
  "variance", "headcount", "operating plan", "aop", "reforecast",
  "kpi", "burn", "runway",
  "due diligence", "thesis", "conviction", "upside", "downside",
  "risk", "return", "irr", "moat", "catalyst",
  "entity", "jurisdiction", "transfer pricing", "deferred",
  "provision", "asc 740", "sox", "1099", "w-2",
];

function shouldRetain(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    FINANCIAL_KEYWORDS.some((k) => lower.includes(k)) ||
    message.trim().split(/\s+/).length > 5
  );
}

function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

const groq = new Groq({ apiKey: settings.GROQ_API_KEY });

export async function chat(
  message: string,
  bankId: string,
  persona: PersonaKey,
  history: HistoryMessage[]
): Promise<ChatResult> {
  try {
    // Memory is optional — if Hindsight is down, chat still works
    try {
      await ensureBank(bankId);
    } catch (bankErr: unknown) {
      console.warn(`[core] ensureBank failed (Hindsight may be offline): ${(bankErr as Error).message}`);
    }

    const memories = await recall(bankId, message);

    const systemPrompt = getPersonaPrompt(persona, formatMemories(memories));

    const completion = await groq.chat.completions.create({
      model: settings.GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-10),
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    let response = completion.choices[0].message.content ?? "";
    response = stripThinkTags(response);

    if (shouldRetain(message)) {
      const tag = `[${persona.toUpperCase()}] User: ${message}\nAdvisor: ${response}`;
      retain(bankId, tag);
    }

    return { response, memoriesUsed: memories.length, persona };
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[core] chat error: ${error.message}`);
    throw error;
  }
}

export async function endSession(bankId: string): Promise<void> {
  try {
    await ensureBank(bankId);
    await reflect(bankId);
  } catch (err: unknown) {
    const error = err as Error;
    console.warn(`[core] endSession error (Hindsight may be offline): ${error.message}`);
    // Don't throw — session end is best-effort
  }
}
