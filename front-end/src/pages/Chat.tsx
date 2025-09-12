import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Heart, Lightbulb, BookOpen, Users, Smile, ThumbsUp } from "lucide-react";
import chatbotAvatar from "@/assets/chatbot-avatar.jpg";

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
      content: "Hi there! I'm Sage, your wellness companion. I'm here to listen, support, and help you navigate whatever's on your mind. How are you feeling today? 😊",
      sender: "bot",
      timestamp: new Date(),
      emoji: "👋"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    { text: "I'm feeling anxious", emoji: "😰", color: "from-sunset/20 to-primary/20" },
    { text: "Having trouble sleeping", emoji: "😴", color: "from-lavender/20 to-accent/20" },
    { text: "Stressed about exams", emoji: "📚", color: "from-ocean/20 to-secondary/20" },
    { text: "Feeling lonely", emoji: "🤗", color: "from-forest/20 to-secondary/20" },
    { text: "Just want to chat", emoji: "💬", color: "from-sunshine/20 to-primary/20" },
  ];

  const libraryRecommendations = [
    { title: "5-Minute Breathing Exercise", type: "Exercise", emoji: "🫁" },
    { title: "Managing Test Anxiety", type: "Article", emoji: "📖" },
    { title: "Sleep Hygiene Guide", type: "Guide", emoji: "🌙" },
    { title: "Mindful Morning Routine", type: "Video", emoji: "🌅" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage: string): string => {
    const responses = {
      anxious: "I hear you, and it's completely normal to feel anxious sometimes. Let's try a quick grounding exercise: Can you name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste? This can help bring you back to the present moment. 🌿",
      sleep: "Sleep troubles can be really frustrating! Here are a few gentle suggestions: try keeping your room cool and dark, avoid screens an hour before bed, and consider doing some light stretching or reading. Would you like me to guide you through a relaxation exercise? 😴",
      stress: "Exam stress is so real - you're definitely not alone in feeling this way! Breaking tasks into smaller chunks and taking regular breaks can help. Remember, your worth isn't defined by grades. You're doing your best, and that's what matters. 💪",
      lonely: "Feeling lonely can be really tough, especially in college. You're brave for reaching out. Remember that many students feel this way - you're not alone in this experience. Have you considered joining any campus groups or activities? Sometimes even small connections can make a big difference. 🤗",
      default: "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me a bit more about what's been on your mind lately? Sometimes just talking through things can help us see them more clearly. 💙"
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried")) {
      return responses.anxious;
    }
    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("insomnia")) {
      return responses.sleep;
    }
    if (lowerMessage.includes("stress") || lowerMessage.includes("exam") || lowerMessage.includes("overwhelmed")) {
      return responses.stress;
    }
    if (lowerMessage.includes("lonely") || lowerMessage.includes("alone") || lowerMessage.includes("isolated")) {
      return responses.lonely;
    }
    return responses.default;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateBotResponse(content),
        sender: "bot",
        timestamp: new Date(),
        emoji: "🤖"
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
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
              <p className="text-sm text-muted-foreground">Your AI wellness companion • Always here to listen 💙</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${message.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>
                {message.emoji && message.sender === "bot" && (
                  <div className="text-lg mb-1">{message.emoji}</div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="border-t border-border/40 p-4">
          <p className="text-sm text-muted-foreground mb-3">💭 Quick suggestions:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion.text)}
                className={`bg-gradient-to-r ${suggestion.color} border-0 hover:scale-105 transition-all duration-300`}
              >
                <span className="mr-2">{suggestion.emoji}</span>
                {suggestion.text}
              </Button>
            ))}
          </div>

          {/* Message Input */}
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

      {/* Sidebar */}
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
              {libraryRecommendations.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-accent/10 to-lavender/10 hover:from-accent/20 hover:to-lavender/20 cursor-pointer transition-all duration-300 group"
                >
                  <div className="text-lg">{item.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="btn-calm w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Library
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="card-floating">
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left hover:bg-accent/10">
                <Users className="w-4 h-4 mr-3" />
                Join Support Group
              </Button>
              <Button variant="outline" className="w-full justify-start text-left hover:bg-accent/10">
                <ThumbsUp className="w-4 h-4 mr-3" />
                Daily Assessment
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;