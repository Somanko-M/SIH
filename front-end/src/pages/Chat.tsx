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
import { Link } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  emoji?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! I'm Sage, your wellness companion. I'm here to listen, support, and help you navigate whatever's on your mind. How are you feeling today? 😊",
      sender: "bot",
      timestamp: new Date(),
      emoji: "👋",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Quick Suggestions ---
  const quickSuggestions = [
    {
      text: "I'm feeling anxious",
      emoji: "😰",
      color: "from-sunset/20 to-primary/20",
    },
    {
      text: "Having trouble sleeping",
      emoji: "😴",
      color: "from-lavender/20 to-accent/20",
    },
    {
      text: "Stressed about exams",
      emoji: "📚",
      color: "from-ocean/20 to-secondary/20",
    },
    {
      text: "Feeling lonely",
      emoji: "🤗",
      color: "from-forest/20 to-secondary/20",
    },
    {
      text: "Just want to chat",
      emoji: "💬",
      color: "from-sunshine/20 to-primary/20",
    },
  ];

  // --- Recommended Content (Sidebar) ---
  const libraryRecommendations = [
    {
      title: "5-Minute Breathing Exercise",
      type: "Exercise",
      emoji: "🫁",
      link: "https://www.headspace.com/mindfulness/5-minute-breathing-exercise",
    },
    {
      title: "Managing Test Anxiety",
      type: "Article",
      emoji: "📖",
      link: "https://www.verywellmind.com/how-to-cope-with-test-anxiety-2797528",
    },
    {
      title: "Sleep Hygiene Guide",
      type: "Guide",
      emoji: "🌙",
      link: "https://www.sleepfoundation.org/sleep-hygiene",
    },
    {
      title: "Mindful Morning Routine",
      type: "Video",
      emoji: "🌅",
      link: "https://www.youtube.com/watch?v=F0zL6OtQemw",
    },
  ];

  // --- Auto-scroll on new message ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // --- Send Message ---
const handleSendMessage = async (content: string) => {
  if (!content.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });

    const data = await response.json();

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: data.reply, // <-- Gemini response
      sender: "bot",
      timestamp: new Date(),
      emoji: "🤖",
    };

    setMessages((prev) => [...prev, botResponse]);
  } catch (error) {
    console.error("Error fetching bot response:", error);

    const errorResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: "⚠️ Sorry, I’m having trouble connecting right now.",
      sender: "bot",
      timestamp: new Date(),
      emoji: "❌",
    };

    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setIsTyping(false);
  }
};

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

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
                alt="Sage - AI Wellness Companion"
                className="w-12 h-12 rounded-full shadow-[0_4px_15px_hsl(160_50%_85%_/_0.3)]"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-forest rounded-full border-2 border-card animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sage</h2>
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
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  m.sender === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-bot"
                }`}
              >
                {m.emoji && m.sender === "bot" && (
                  <div className="text-lg mb-1">{m.emoji}</div>
                )}
                <p className="text-sm leading-relaxed">{m.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {m.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble-bot">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions + Input */}
        <div className="border-t border-border/40 p-4">
          <p className="text-sm text-muted-foreground mb-3">💭 Quick suggestions:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickSuggestions.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(s.text)}
                className={`bg-gradient-to-r ${s.color} border-0 hover:scale-105 transition-all duration-300`}
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
              className="flex-1 rounded-full bg-muted/50 border-border/40 focus:border-primary/40 transition-colors"
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
                <div className="w-12 h-12 bg-gradient-to-r from-sunshine/20 to-sunset/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Smile className="w-6 h-6 text-sunset" />
                </div>
                <p className="text-xs text-muted-foreground">Mood</p>
                <p className="text-sm font-medium">Good</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-ocean/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Heart className="w-6 h-6 text-ocean" />
                </div>
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
              {libraryRecommendations.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-accent/10 to-lavender/10 hover:from-accent/20 hover:to-lavender/20 cursor-pointer transition-all duration-300 group"
                >
                  <div className="text-lg">{item.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                </a>
              ))}
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
              <Button variant="outline" className="w-full justify-start text-left hover:bg-accent/10">
                <Users className="w-4 h-4 mr-3" />
                Join Support Group
              </Button>
              </Link>
              <Link to="/Assessment">
              <Button variant="outline" className="w-full justify-start text-left hover:bg-accent/10">
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
