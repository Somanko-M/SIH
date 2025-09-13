// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Track conversation state
let userSessions = {}; // { sessionId: { messages: [], questionCount: 0 } }

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

    // Start session if new
    if (!userSessions[sessionId]) {
      userSessions[sessionId] = { messages: [], questionCount: 0 };
    }

    const session = userSessions[sessionId];

    // ✅ Your original style + constraints
    const systemPrompt = `
You are a supportive CBT (Cognitive Behavioral Therapy) assistant acting like a close, caring friend.
Always:
- Be warm, empathetic, and conversational — like a real friend, not a therapist.
- Encourage reflection on thoughts, feelings, and behaviors.
- Use CBT techniques gently (thought reframing, journaling, behavior activation).
- Give short, natural replies (1–3 sentences), not long paragraphs.
- Avoid constant questioning. Maximum 3 relevant questions per session.
- If asking, keep questions very relevant to what the user said.
- After 3 questions → stop asking and offer structured help instead.
- Strictly avoid formatting like **bold** or underlines (feels too AI).
- If user says “thank you” → end chat kindly and close the conversation.
- If user shows signs of harm → gently encourage seeking urgent crisis help.
- After understanding their problem (3–4 exchanges), ask if they’d like a suggestion. 
  If yes → provide a structured solution:
  1. Summarize concern in one short sentence.
  2. Offer 2–3 practical CBT-style steps.
  3. Give one small exercise (breathing, journaling, small activity).
  4. End with gentle encouragement and a nudge towards real-life therapy/support.
    `;

    // Force structured suggestion after 3 questions
    if (session.questionCount >= 3) {
      const forcedSuggestionPrompt = `
The user has already answered enough questions. 
Now, without asking anything further, respond as:
1) One-line summary of their concern.
2) 2–3 practical CBT-style steps they can try.
3) One quick, actionable exercise (like journaling or breathing).
4) A warm closing note with encouragement and a reminder that seeking real-life support is okay.
User: "${message}"
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(forcedSuggestionPrompt);
      const reply = result.response.text();

      session.messages.push({ role: "user", text: message });
      session.messages.push({ role: "assistant", text: reply });

      return res.json({ reply });
    }

    // Normal flow
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const combinedPrompt = `${systemPrompt}
Conversation so far: ${JSON.stringify(session.messages)}
User: "${message}"
Assistant:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    });

    let reply = result.response.text();

    // Count if Gemini ended with a question
    if (reply.trim().endsWith("?")) {
      session.questionCount += 1;
    }

    // Save convo
    session.messages.push({ role: "user", text: message });
    session.messages.push({ role: "assistant", text: reply });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error in /chat:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
