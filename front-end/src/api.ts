const API_URL = "http://127.0.0.1:8000"; // change if deployed

export async function registerUser(userData: any) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function loginUser(credentials: any) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function sendMessage(tokenEmail: string, message: any) {
  const res = await fetch(`${API_URL}/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Email": tokenEmail, // 🔑 header-based auth
    },
    body: JSON.stringify(message),
  });
  return res.json();
}

export async function getConversations(tokenEmail: string) {
  const res = await fetch(`${API_URL}/conversations`, {
    headers: { "X-User-Email": tokenEmail },
  });
  return res.json();
}

export async function getMessages(tokenEmail: string, conversationId: string) {
  const res = await fetch(`${API_URL}/chat/${conversationId}/messages`, {
    headers: { "X-User-Email": tokenEmail },
  });
  return res.json();
}
