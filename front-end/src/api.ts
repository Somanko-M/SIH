// src/api.ts
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

type SendPayload = {
  conversationId?: string | null;
  recipient?: string | null;
  text: string;
  userEmail: string;
};

export async function sendChat(payload: SendPayload) {
  const { conversationId, recipient, text, userEmail } = payload;
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Email": userEmail,
    },
    body: JSON.stringify({ conversationId, recipient, text }),
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { ok, conversationId, messageId } or error
}

export async function getChatHistory(conversationId?: string | null, userEmail?: string) {
  const url = conversationId
    ? `${API}/chat/history?conversationId=${encodeURIComponent(conversationId)}`
    : `${API}/chat/history`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "X-User-Email": userEmail || "" },
  });
  if (!res.ok) throw await res.json();
  return res.json(); // if messages returned it could be an array or object depending on backend
}

export async function listConversations(userEmail: string) {
  const res = await fetch(`${API}/conversations`, {
    method: "GET",
    headers: { "X-User-Email": userEmail },
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { conversations: [...] }
}
