// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL_PY || "http://localhost:8000";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Try to parse JSON even for non-OK responses to show server message
      let data: any = null;
      try {
        data = await response.json();
      } catch (err) {
        // ignore parse errors
      }

      if (!response.ok) {
        const message =
          (data && (data.detail || data.message)) ||
          `Login failed with status ${response.status}`;
        // show a user-friendly message
        alert("Error: " + message);
        setLoading(false);
        return;
      }

      // Successful login
      console.log("Login successful:", data);

      // Normalize token (backend may return access_token or token)
      const token = data?.access_token || data?.token || null;
      if (token) {
        localStorage.setItem("token", token); // other code expects 'token'
      }

      // Determine email to store: prefer backend returned user.email, else input email
      const returnedEmail = data?.user?.email || data?.email || email;
      if (returnedEmail) {
        localStorage.setItem("userEmail", returnedEmail);
      }

      // Store user object (without password) if provided
      if (data?.user) {
        const safeUser = { ...data.user };
        if (safeUser.password) delete safeUser.password;
        try {
          localStorage.setItem("user", JSON.stringify(safeUser));
        } catch (err) {
          // ignore storage quota errors
        }
      }

      // Navigate to chat after login
      navigate("/chat");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-sunshine/10">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back 👋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-sunshine text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
