// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // make sure node-fetch is installed
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Track conversation state
let userSessions = {}; // { sessionId: { messages: [], questionCount: 0 } }

const PY_API_URL = process.env.VITE_API_URL_PY || "http://127.0.0.1:8000";

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

    // Start session if new
    if (!userSessions[sessionId]) {
      userSessions[sessionId] = { messages: [], questionCount: 0 };
    }

    const session = userSessions[sessionId];

    // ✅ Friend-style prompt
    const systemPrompt = `
You are a warm, supportive CBT-inspired friend.
Guidelines:
- Sound like a caring, close friend texting back — casual, empathetic, human.
- Write naturally in 1–3 short sentences. No lists, no reports, no formal tone.
- Use CBT gently: reframe negative thoughts, suggest small doable actions (walk, journaling, breaks).
- Ask at most 2–3 thoughtful questions early on to show interest, then shift to encouragement and advice.
- Avoid constant probing — stressed people may not want to answer many questions.
- After 3 questions, stop asking and focus on gentle, practical suggestions, encouragement, or sharing coping tips.
- End replies with warmth and reassurance, so the user feels safe to return.
- If user says "thank you," respond kindly and close naturally.
- If user hints at serious harm or suicidal thoughts, encourage urgent real-life help in a compassionate way (e.g., "I care about you. Please talk to a trusted person right now or call a helpline — you don’t have to go through this alone.").
- Subtly nudge towards real human connection when possible (e.g., "It might help to share this with a close friend or counselor too.").
- Goal: make the user feel heard, lighter, and encouraged to come back whenever they need a safe space.
`;

    // ✅ After 3 questions → structured, but natural suggestion
    if (session.questionCount >= 3) {
      const forcedSuggestionPrompt = `
The user has already answered 3 questions.
Now, stop asking more. 
Reply like a caring friend giving advice, NOT a therapist or report. 
Keep it short and natural. Example style: 
"Sounds like you're carrying a lot. Maybe try breaking things into small steps, like writing your thoughts down or taking a quick walk. Even a few deep breaths can help calm things. You’re doing better than you think, and talking to someone you trust could really help too."

User: "${message}"
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(forcedSuggestionPrompt);
      const reply = result.response.text();

      // Save conversation locally
      session.messages.push({ role: "user", text: message });
      session.messages.push({ role: "assistant", text: reply });

      // ✅ Send only bot reply to Python backend
      await fetch(`${PY_API_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: sessionId,
          recipient: "serene_bot",
          text: reply,
        }),
      });

      session.questionCount = 0;

      return res.json({ reply });
    }

    // ✅ Normal flow
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const combinedPrompt = `${systemPrompt}
Conversation so far: ${JSON.stringify(session.messages)}
User: "${message}"
Friend:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 300,
      },
    });

    let reply = result.response.text();

    if (reply.trim().endsWith("?")) {
      session.questionCount += 1;
    }

    // Save conversation locally
    session.messages.push({ role: "user", text: message });
    session.messages.push({ role: "assistant", text: reply });

    // ✅ Send only bot reply to Python backend
    await fetch(`${PY_API_URL}/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: sessionId,
        recipient: "serene_bot",
        text: reply,
      }),
    });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error in /chat:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 🔹 Change port to 5000 to avoid conflict with frontend
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
