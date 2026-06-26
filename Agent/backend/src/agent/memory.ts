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
    .post(`/v1/default/banks/${bankId}/memories`, { content })
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
    const memories: Array<{ text: string }> = response.data.memories || [];
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