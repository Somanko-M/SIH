import React, { createContext, useState, useEffect } from "react";

interface User {
  email: string;
  username?: string;
  token?: string;
  role: "user" | "admin"; // ✅ enforce role
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

// ✅ Centralized admin user (you won’t need to redefine elsewhere)
export const ADMIN_USER: User = {
  email: "admin@123",
  username: "Admin",
  role: "admin",
  token: "admin-token",
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Restore user from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        setUser(null);
      }
    }
  }, []);

  // ✅ Save role immediately during login
  const login = (userData: User, token?: string) => {
    const userWithRole: User = {
      ...userData,
      token: token || userData.token,
      role: userData.role ?? "user", // fallback to "user" if missing
    };

    localStorage.setItem("user", JSON.stringify(userWithRole));
    setUser(userWithRole); // ✅ updates context instantly
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
