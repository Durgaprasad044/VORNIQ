import axios, { AxiosError } from "axios";
import { settings } from "../config/settings";

const BANK_MISSION = `
I am a personal finance intelligence system.
I remember this user's complete financial profile:
income, expenses, debts, investments, tax situation,
business financials, goals, and all advice given
across every expert (Dana, Morgan, Riley, Quinn, Cassandra).
I never ask the user to repeat financial information.
`;

function getHttp() {
  return axios.create({
    baseURL: settings.HINDSIGHT_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.HINDSIGHT_API_KEY}`,
    },
  });
}

export async function ensureBank(bankId: string): Promise<void> {
  try {
    await getHttp().put(`/v1/default/banks/${bankId}`, {
      retain_mission: BANK_MISSION.trim(),
    });
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error(`[memory] ensureBank failed: ${axiosErr.message}`);
    throw err;
  }
}

export async function retain(bankId: string, content: string): Promise<void> {
  getHttp()
    .post(`/v1/default/banks/${bankId}/memories`, { items: [{ content }] })
    .catch((err: AxiosError) =>
      console.error(`[memory] retain failed: ${err.message}`)
    );
}

export async function recall(bankId: string, query: string): Promise<string[]> {
  try {
    const response = await getHttp().post(
      `/v1/default/banks/${bankId}/memories/recall`,
      {
        query,
        types: ["world", "experience", "observation"],
        budget: "mid",
      }
    );
    const memories: Array<{ text: string }> = response.data.results || [];
    return memories.map((m) => m.text);
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error(`[memory] recall failed: ${axiosErr.message}`);
    return [];
  }
}

export async function reflect(bankId: string): Promise<void> {
  try {
    await getHttp().post(`/v1/default/banks/${bankId}/reflect`, {
      query: `Consolidate everything known about this user's complete financial profile:
      income, expenses, assets, liabilities, investment portfolio and risk appetite,
      tax situation, entity structure, filing obligations, business financials if applicable,
      goals, timelines, decisions made, key advice given by each expert persona.`,
    });
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error(`[memory] reflect failed: ${axiosErr.message}`);
    throw err;
  }
}

export function formatMemories(memories: string[]): string {
  if (memories.length === 0) {
    return "No prior financial context on record.";
  }
  return memories.map((m, i) => `${i + 1}. ${m}`).join("\n\n");
}

// --- Chat Session Management via Hindsight ---

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  memoriesUsed?: number;
  memoriesList?: string[];
  persona?: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  persona: string;
}

export async function saveSession(
  bankId: string,
  sessionId: string,
  title: string,
  persona: string,
  messages: ChatMessage[]
): Promise<void> {
  try {
    await ensureBank(bankId);
    const content = `[SESSION:${sessionId}] [PERSONA:${persona}] [CREATED:${new Date().toISOString()}] ${JSON.stringify({ title, messages })}`;
    await getHttp().post(`/v1/default/banks/${bankId}/memories`, { items: [{ content }] });
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error(`[memory] saveSession failed: ${axiosErr.message}`);
  }
}

export async function loadSession(
  bankId: string,
  sessionId: string
): Promise<ChatMessage[] | null> {
  try {
    const response = await getHttp().post(
      `/v1/default/banks/${bankId}/memories/recall`,
      {
        query: `SESSION ${sessionId}`,
        types: ["world", "experience", "observation"],
        budget: "high",
      }
    );
    const memories: Array<{ text: string }> = response.data.results || [];
    for (const mem of memories) {
      const match = mem.text.match(/^\[SESSION:([^\]]+)\]/);
      if (match && match[1] === sessionId) {
        const jsonMatch = mem.text.match(/\{[\s\S]*\}$/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.messages as ChatMessage[];
        }
      }
    }
    return null;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error(`[memory] loadSession failed: ${axiosErr.message}`);
    return null;
  }
}

export async function listSessions(bankId: string): Promise<ChatSession[]> {
  try {
    const response = await getHttp().post(
      `/v1/default/banks/${bankId}/memories/recall`,
      {
        query: "conversation session history chat",
        types: ["world", "experience", "observation"],
        budget: "high",
      }
    );
    const memories: Array<{ text: string }> = response.data.results || [];
    const sessions: ChatSession[] = [];
    for (const mem of memories) {
      const match = mem.text.match(
        /^\[SESSION:([^\]]+)\]\s*\[PERSONA:([^\]]+)\]\s*\[CREATED:([^\]]+)\]\s*(\{[\s\S]*\})$/
      );
      if (match) {
        const json = JSON.parse(match[4]);
        sessions.push({
          id: match[1],
          title: json.title || "Untitled",
          createdAt: match[3],
          persona: match[2],
        });
      }
    }
    return sessions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error(`[memory] listSessions failed: ${axiosErr.message}`);
    return [];
  }
}

export async function deleteSession(
  bankId: string,
  sessionId: string
): Promise<void> {
  try {
    await ensureBank(bankId);
    const content = `[DELETED:${sessionId}] Session ${sessionId} permanently deleted.`;
    await getHttp().post(`/v1/default/banks/${bankId}/memories`, { items: [{ content }] });
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error(`[memory] deleteSession failed: ${axiosErr.message}`);
  }
}