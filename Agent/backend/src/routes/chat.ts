import { Router, Request, Response } from "express";
import { PersonaKey } from "../agent/personas";
import { chat, endSession, HistoryMessage } from "../agent/core";

interface ChatBody {
  message: string;
  bankId: string;
  persona: string;
  history: HistoryMessage[];
}

interface ReflectBody {
  bankId: string;
}

const VALID_PERSONAS: PersonaKey[] = ["dana", "morgan", "riley", "quinn", "cassandra"];

function validatePersona(p: string): PersonaKey {
  if (!VALID_PERSONAS.includes(p as PersonaKey)) {
    throw new Error("Invalid persona");
  }
  return p as PersonaKey;
}

export const chatRouter = Router();

chatRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, bankId, persona, history = [] } = req.body as ChatBody;

    if (!message || !bankId) {
      res.status(400).json({ error: "message and bankId are required" });
      return;
    }

    let validatedPersona: PersonaKey;
    try {
      validatedPersona = validatePersona(persona);
    } catch (validationErr: unknown) {
      res.status(400).json({ error: (validationErr as Error).message });
      return;
    }

    const result = await chat(message, bankId, validatedPersona, history);
    res.json({
      response: result.response,
      memoriesUsed: result.memoriesUsed,
      persona: result.persona,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[route] /chat error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

chatRouter.post("/reflect", async (req: Request, res: Response) => {
  try {
    const { bankId } = req.body as ReflectBody;

    if (!bankId) {
      res.status(400).json({ error: "bankId is required" });
      return;
    }

    await endSession(bankId);
    res.json({ status: "reflected" });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[route] /reflect error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

chatRouter.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
