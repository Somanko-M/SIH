import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageCircle, Brain, BookOpen, Users, Star, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Wellness Chat",
      description: "Chat with our supportive AI companion anytime you need someone to listen",
      color: "from-primary to-sunset",
      emoji: "💬",
      link: "/chat"
    },
    {
      icon: Brain,
      title: "Daily Check-ins",
      description: "Fun, interactive assessments to track your mental wellness journey",
      color: "from-secondary to-ocean",
      emoji: "🧠",
      link: "/assessment"
    },
    {
      icon: BookOpen,
      title: "Wellness Library",
      description: "Curated content, exercises, and resources for your mental health",
      color: "from-accent to-lavender",
      emoji: "📚",
      link: "/library"
    },
    {
      icon: Users,
      title: "Peer Support",
      description: "Connect with a caring community of students who understand",
      color: "from-forest to-secondary",
      emoji: "🤝",
      link: "/groups"
    }
  ];

  const testimonials = [
    {
      name: "Alex",
      avatar: "🌟",
      text: "MindSpace helped me through my toughest semester. The daily check-ins became part of my self-care routine!",
      mood: "grateful"
    },
    {
      name: "Sam",
      avatar: "🌱",
      text: "The peer support groups made me realize I wasn't alone. Found my people here! 💚",
      mood: "connected"
    },
    {
      name: "Jordan",
      avatar: "☀️",
      text: "The AI chat is like having a wise friend available 24/7. So comforting during late-night anxiety.",
      mood: "peaceful"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-sunshine/10 rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Your wellness journey starts here</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Your{" "}
                  <span className="bg-gradient-to-r from-primary via-sunset to-sunshine bg-clip-text text-transparent">
                    happy place
                  </span>{" "}
                  for mental wellness
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A supportive digital space where you can check in with yourself, chat with an AI companion, 
                  and connect with peers who understand your journey. 🌈
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chat">
                  <Button className="btn-hero group">
                    Start Chatting
                    <MessageCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <Link to="/assessment">
                  <Button className="btn-calm group">
                    Take Assessment
                    <Brain className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                  <span>Anonymous & Safe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                  <span>Student-Focused</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Happy students supporting each other"
                  className="w-full h-auto rounded-3xl shadow-[0_20px_60px_hsl(15_85%_65%_/_0.3)]"
                />
              </div>
              {/* Floating decorations */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-sunshine/30 rounded-full float-gentle"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-lavender/30 rounded-full float-delayed"></div>
              <div className="absolute top-1/3 -right-4 w-8 h-8 bg-ocean/30 rounded-full float-gentle"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need for{" "}
              <span className="bg-gradient-to-r from-primary to-sunset bg-clip-text text-transparent">
                mental wellness
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple, supportive tools designed specifically for students navigating life's ups and downs ✨
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="card-floating group cursor-pointer h-full">
                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                        {feature.emoji}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center text-primary group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Stories from our{" "}
              <span className="bg-gradient-to-r from-accent to-lavender bg-clip-text text-transparent">
                amazing community
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">Real experiences from students just like you 💙</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-warm text-center">
                <div className="space-y-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <blockquote className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-primary">- {testimonial.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">Feeling {testimonial.mood}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-sunshine/5 to-sunset/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to start your{" "}
              <span className="bg-gradient-to-r from-primary to-sunshine bg-clip-text text-transparent">
                wellness journey?
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who've found their supportive community and inner peace. 
              Your mental health matters, and we're here to help. 🌟
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button className="btn-hero">
                  Start Your Journey
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/library">
                <Button className="btn-calm">
                  Explore Resources
                  <BookOpen className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;