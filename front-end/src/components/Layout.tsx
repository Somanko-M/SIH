import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, BookOpen, Users, Brain, Home, AlertTriangle } from "lucide-react";
import { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [showEmergency, setShowEmergency] = useState(false);

  // 🔑 Replace this later with actual auth state
  const isAuthenticated = false;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/assessment", icon: Brain, label: "Assessment" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/groups", icon: Users, label: "Groups" },
  ];

  const emergencyContacts = [
    { name: "Crisis Text Line", contact: "Text HOME to 741741", type: "text" },
    { name: "National Suicide Prevention", contact: "988", type: "call" },
    { name: "Campus Counseling", contact: "(555) 123-4567", type: "call" },
    { name: "Local Emergency", contact: "911", type: "emergency" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-sunshine rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-sunset bg-clip-text text-transparent">
                MindSpace
              </span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-sunshine/10 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right-side Actions */}
            <div className="flex items-center space-x-3">
              {/* Emergency Button */}
              <div className="relative">
                <Button
                  onClick={() => setShowEmergency(!showEmergency)}
                  className="btn-emergency text-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Need Help?
                </Button>

                {showEmergency && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-3xl shadow-[0_12px_40px_hsl(0_70%_60%_/_0.2)] border border-destructive/20 p-6 z-50">
                    <h3 className="text-lg font-semibold text-destructive mb-4">
                      💝 Immediate Support
                    </h3>
                    <div className="space-y-3">
                      {emergencyContacts.map((contact, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-2xl bg-destructive/5 hover:bg-destructive/10 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.contact}</p>
                          </div>
                          <Button size="sm" className="btn-emergency text-xs">
                            {contact.type === "call" ? "📞" : contact.type === "text" ? "💬" : "🚨"}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      You're not alone. Help is always available. 💙
                    </p>
                  </div>
                )}
              </div>

              {/* Show Login/Signup only if NOT signed in */}
              {!isAuthenticated && (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-sunshine text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/40 px-4 py-2 z-40">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-sunshine/20 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-sunshine/20 rounded-full float-gentle"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-ocean/20 rounded-full float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-lavender/20 rounded-full float-gentle"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-forest/20 rounded-full float-delayed"></div>
      </div>
    </div>
  );
};

export default Layout;
