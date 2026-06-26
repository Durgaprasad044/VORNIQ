const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  memoriesUsed?: number;
  persona?: string;
  timestamp?: string;
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
