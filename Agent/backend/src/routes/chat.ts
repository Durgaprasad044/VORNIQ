import { Router, Request, Response } from "express";
import { PersonaKey } from "../agent/personas";
import { chat, endSession, HistoryMessage } from "../agent/core";
import {
  saveSession,
  loadSession,
  listSessions,
  deleteSession,
  ChatMessage,
} from "../agent/memory";

interface ChatBody {
  message: string;
  bankId: string;
  persona: string;
  history: HistoryMessage[];
}

interface ReflectBody {
  bankId: string;
}

interface SaveSessionBody {
  bankId: string;
  sessionId: string;
  title: string;
  persona: string;
  messages: ChatMessage[];
}

interface LoadSessionBody {
  bankId: string;
  sessionId: string;
}

interface ListSessionsBody {
  bankId: string;
}

interface DeleteSessionBody {
  bankId: string;
  sessionId: string;
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
      memoriesList: result.memoriesList,
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

// --- Session Management Routes ---

chatRouter.post("/sessions/save", async (req: Request, res: Response) => {
  try {
    const { bankId, sessionId, title, persona, messages } = req.body as SaveSessionBody;
    if (!bankId || !sessionId) {
      res.status(400).json({ error: "bankId and sessionId are required" });
      return;
    }
    await saveSession(bankId, sessionId, title || "Untitled", persona || "dana", messages || []);
    res.json({ status: "saved" });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[route] /sessions/save error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

chatRouter.post("/sessions/load", async (req: Request, res: Response) => {
  try {
    const { bankId, sessionId } = req.body as LoadSessionBody;
    if (!bankId || !sessionId) {
      res.status(400).json({ error: "bankId and sessionId are required" });
      return;
    }
    const messages = await loadSession(bankId, sessionId);
    res.json({ messages: messages || [] });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[route] /sessions/load error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

chatRouter.post("/sessions/list", async (req: Request, res: Response) => {
  try {
    const { bankId } = req.body as ListSessionsBody;
    if (!bankId) {
      res.status(400).json({ error: "bankId is required" });
      return;
    }
    const sessions = await listSessions(bankId);
    res.json({ sessions });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[route] /sessions/list error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

chatRouter.post("/sessions/delete", async (req: Request, res: Response) => {
  try {
    const { bankId, sessionId } = req.body as DeleteSessionBody;
    if (!bankId || !sessionId) {
      res.status(400).json({ error: "bankId and sessionId are required" });
      return;
    }
    await deleteSession(bankId, sessionId);
    res.json({ status: "deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[route] /sessions/delete error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});
