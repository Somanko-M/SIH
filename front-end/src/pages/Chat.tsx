// src/pages/Chat.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Send,
  Heart,
  Lightbulb,
  BookOpen,
  Users,
  Smile,
  ThumbsUp,
} from "lucide-react";
import chatbotAvatar from "@/assets/chatbot-avatar.jpg";
import { Link, useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  emoji?: string;
}

interface Conversation {
  conversationId: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
}

const NODE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PY_API_URL = import.meta.env.VITE_API_URL_PY || "http://127.0.0.1:8000";

// Helpline number
const HELPLINE_NUMBER = "141116";

// Regex for detecting self-harm / suicidal intent phrases (case-insensitive)
// This is intentionally broad; adjust phrases as you like.
const SELF_HARM_REGEX = /\b(kill myself|kill me|i want to die|want to die|end my life|suicide|suicidal|die by suicide|hurt myself|cut myself|self[- ]harm|kill myself|i'm going to die|i can't go on|i can't do this anymore|i can't take it|overdose|take pills|want to end it all)\b/i;

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);

  // --- Quick Suggestions ---
  const quickSuggestions = [
    { text: "I'm feeling anxious", emoji: "😰" },
    { text: "Having trouble sleeping", emoji: "😴" },
    { text: "Stressed about exams", emoji: "📚" },
    { text: "Feeling lonely", emoji: "🤗" },
    { text: "Just want to chat", emoji: "💬" },
  ];

  // --- Auto-scroll ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Helper functions ---
  const getUserEmail = () => localStorage.getItem("userEmail");
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || "";
    const userEmail = getUserEmail();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (userEmail) headers["X-User-Email"] = userEmail;
    return headers;
  };

  const isSelfHarmMessage = (text: string) => {
    if (!text) return false;
    return SELF_HARM_REGEX.test(text);
  };

  // --- Load conversations ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = getUserEmail();
    if (!token && !userEmail) {
      navigate("/login");
      return;
    }

    const loadConversations = async () => {
      try {
        const res = await fetch(`${PY_API_URL}/conversations`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          const txt = await res.text();
          console.error("Failed to load conversations:", res.status, txt);
          return;
        }
        const data = await res.json();
        const convs: Conversation[] = data.conversations || [];
        setConversations(convs);
        if (convs.length > 0) setSelectedConv(convs[0].conversationId);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    loadConversations();
  }, [navigate]);

  // --- Load messages for selected conversation ---
  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `${PY_API_URL}/chat/history?conversationId=${encodeURIComponent(selectedConv)}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );
        if (!res.ok) {
          const txt = await res.text();
          console.error("Failed to load messages:", res.status, txt);
          setMessages([]);
          return;
        }
        const data = await res.json();
        const rawMsgs: any[] = data.messages || [];

        const formatted: Message[] = rawMsgs.map((msg: any, idx: number) => {
          const isBot = msg.role === "assistant" || msg.sender === "serene_bot";
          return {
            id: msg.id ? String(msg.id) : `${idx}_${Date.now()}`,
            content: msg.content ?? msg.text ?? "",
            sender: isBot ? "bot" : "user",
            timestamp: msg.sentAt ? new Date(msg.sentAt) : new Date(),
            emoji: msg.sender === "serene_bot" ? "🌸" : undefined,
          };
        });

        setMessages(formatted);
      } catch (err) {
        console.error("Error loading messages:", err);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedConv]);

  // --- Send message handler ---
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const token = localStorage.getItem("token");
    const userEmail = getUserEmail();
    if (!token && !userEmail) {
      navigate("/login");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const convId = selectedConv || undefined;

    // If content matches self-harm patterns => immediately respond with helpline and store messages.
    if (isSelfHarmMessage(content)) {
      try {
        const helplineText =
          `📞 If you are thinking about harming yourself or are in immediate danger, please call ${HELPLINE_NUMBER} right now. ` +
          `If you can, try to stay with someone you trust and seek emergency help. You are not alone. 💙`;

        const helplineMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: helplineText,
          sender: "bot",
          timestamp: new Date(),
          emoji: "☎️",
        };

        // Update UI
        setMessages((prev) => [...prev, helplineMessage]);

        // Save user message to backend
        try {
          await fetch(`${PY_API_URL}/chat/send`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              conversationId: convId,
              sender: userEmail,
              recipient: "serene_bot",
              text: content,
            }),
          });
        } catch (err) {
          console.error("Failed saving user message (self-harm):", err);
        }

        // Save helpline bot message to backend
        try {
          await fetch(`${PY_API_URL}/chat/send`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              conversationId: convId,
              sender: "serene_bot",
              recipient: userEmail,
              text: helplineText,
            }),
          });
        } catch (err) {
          console.error("Failed saving helpline message:", err);
        }
      } catch (err) {
        console.error("Error handling self-harm message:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            content: "⚠️ Sorry, something went wrong while processing your message.",
            sender: "bot",
            timestamp: new Date(),
            emoji: "❌",
          },
        ]);
      } finally {
        setIsTyping(false);
      }

      // Important: do NOT forward the self-harm message to the external bot API in order to avoid unsafe replies.
      return;
    }

    // --- Normal flow: send to Node backend (Gemini AI) and store messages ---
    try {
      const botRes = await fetch(`${NODE_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, sessionId: selectedConv || "default" }),
      });
      if (!botRes.ok) throw new Error("Bot API failed");
      const botData = await botRes.json();
      const botReplyText = botData.reply;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botReplyText,
        sender: "bot",
        timestamp: new Date(),
        emoji: "🤖",
      };

      // Save user message to backend
      try {
        await fetch(`${PY_API_URL}/chat/send`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            conversationId: convId,
            sender: userEmail,
            recipient: "serene_bot",
            text: content,
          }),
        });
      } catch (err) {
        console.error("Failed saving user message:", err);
      }

      // Save bot reply to backend
      try {
        await fetch(`${PY_API_URL}/chat/send`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            conversationId: convId,
            sender: "serene_bot",
            recipient: userEmail,
            text: botReplyText,
          }),
        });
      } catch (err) {
        console.error("Failed saving bot reply:", err);
      }

      // Update UI
      setMessages((prev) => [...prev, botMessage]);

      // If user asked for help/number via non-self-harm keywords, still optionally show helpline
      if (/help|emergency|number|call/i.test(content)) {
        const helplineText = `📞 You can call ${HELPLINE_NUMBER} for immediate support. You are not alone. 💙`;
        const helplineMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: helplineText,
          sender: "bot",
          timestamp: new Date(),
          emoji: "☎️",
        };
        setMessages((prev) => [...prev, helplineMessage]);

        // Save helpline message to backend
        try {
          await fetch(`${PY_API_URL}/chat/send`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              conversationId: convId,
              sender: "serene_bot",
              recipient: userEmail,
              text: helplineText,
            }),
          });
        } catch (err) {
          console.error("Failed saving helpline message:", err);
        }
      }

      if (!selectedConv && convId) setSelectedConv(convId);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 3).toString(),
          content: "⚠️ Sorry, something went wrong!",
          sender: "bot",
          timestamp: new Date(),
          emoji: "❌",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  // --- Render ---
  return (
    <div className="flex h-screen bg-background">
      {/* --- Chat Area --- */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border/40 bg-card/80 backdrop-blur-sm p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={chatbotAvatar}
                alt="Skye - AI Wellness Companion"
                className="w-12 h-12 rounded-full shadow-[0_4px_15px_hsl(160_50%_85%_/_0.3)]"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-forest rounded-full border-2 border-card animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Skye</h2>
              <p className="text-sm text-muted-foreground">
                Your AI wellness companion • Always here to listen 💙
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${m.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}
              >
                {m.emoji && m.sender === "bot" && <div className="text-lg mb-1">{m.emoji}</div>}
                <p className="text-sm leading-relaxed">{m.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble-bot">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/40 p-4">
          <p className="text-sm text-muted-foreground mb-3">💭 Quick suggestions:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickSuggestions.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(s.text)}
                className="border-0 hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">{s.emoji}</span>
                {s.text}
              </Button>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              placeholder="Share what's on your mind... 💭"
              className="flex-1 rounded-full bg-muted/50 border-border/40"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              className="btn-hero rounded-full px-6"
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- Sidebar --- */}
      <div className="w-80 border-l border-border/40 bg-muted/30 p-6 space-y-6">
        {/* Wellness Stats */}
        <Card className="card-floating">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-primary">Today's Wellness</h3>
            <div className="flex justify-around">
              <div className="text-center">
                <Smile className="w-6 h-6 text-sunset mb-1" />
                <p className="text-xs text-muted-foreground">Mood</p>
                <p className="text-sm font-medium">Good</p>
              </div>
              <div className="text-center">
                <Heart className="w-6 h-6 text-ocean mb-1" />
                <p className="text-xs text-muted-foreground">Check-ins</p>
                <p className="text-sm font-medium">3</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommended Content */}
        <Card className="card-floating">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-sunshine" />
              <h3 className="font-semibold">Recommended for You</h3>
            </div>
            <div className="space-y-3">
              <a href="https://www.headspace.com/mindfulness/5-minute-breathing-exercise" target="_blank" className="block text-sm hover:underline">🫁 5-Minute Breathing</a>
              <a href="https://www.verywellmind.com/how-to-cope-with-test-anxiety-2797528" target="_blank" className="block text-sm hover:underline">📖 Test Anxiety Tips</a>
              <a href="https://www.sleepfoundation.org/sleep-hygiene" target="_blank" className="block text-sm hover:underline">🌙 Sleep Hygiene</a>
              <a href="https://www.youtube.com/watch?v=F0zL6OtQemw" target="_blank" className="block text-sm hover:underline">🌅 Morning Routine</a>
            </div>
            <Link to="/Library">
              <Button className="btn-calm w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Library
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="card-floating">
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/groups">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-3" />
                  Join Support Group
                </Button>
              </Link>
              <Link to="/Assessment">
                <Button variant="outline" className="w-full justify-start">
                  <ThumbsUp className="w-4 h-4 mr-3" />
                  Daily Assessment
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
