const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export interface ChatMessage {
  role: 'user' | 'assistant';
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

export async function sendMessage(
  message: string,
  bankId: string,
  persona: string,
  history: { role: string; content: string }[]
): Promise<{ response: string; memoriesUsed: number }> {
  const response = await fetch(`${BACKEND_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, bankId, persona, history }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  return response.json();
}

export async function endSession(
  bankId: string
): Promise<{ status: string }> {
  const response = await fetch(`${BACKEND_URL}/reflect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bankId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to end session: ${response.statusText}`);
  }

  return response.json();
}

export async function saveSession(
  bankId: string,
  sessionId: string,
  title: string,
  persona: string,
  messages: ChatMessage[]
): Promise<void> {
  await fetch(`${BACKEND_URL}/sessions/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bankId, sessionId, title, persona, messages }),
  });
}

export async function loadSession(
  bankId: string,
  sessionId: string
): Promise<ChatMessage[]> {
  const response = await fetch(`${BACKEND_URL}/sessions/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bankId, sessionId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to load session: ${response.statusText}`);
  }

  const data = await response.json();
  return data.messages || [];
}

export async function listSessions(
  bankId: string
): Promise<ChatSession[]> {
  const response = await fetch(`${BACKEND_URL}/sessions/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bankId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to list sessions: ${response.statusText}`);
  }

  const data = await response.json();
  return data.sessions || [];
}

export async function deleteSession(
  bankId: string,
  sessionId: string
): Promise<void> {
  await fetch(`${BACKEND_URL}/sessions/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bankId, sessionId }),
  });
}
