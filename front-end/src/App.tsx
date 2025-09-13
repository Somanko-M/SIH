import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Assessment from "./pages/Assessment";
import Library from "./pages/Library";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";

// 🔥 import the new pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// 🔥 import admin pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import ResourceManager from "./admin/pages/ResourceManager";
import ScreeningReports from "./admin/pages/ScreeningReports";
import StudentTrends from "./admin/pages/StudentTrends";
import Settings from "./admin/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* existing routes */}
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/library" element={<Library />} />
            <Route path="/groups" element={<Groups />} />

            {/* auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/resources" element={<ResourceManager />} />
            <Route path="/admin/reports" element={<ScreeningReports />} />
            <Route path="/admin/trends" element={<StudentTrends />} />
            <Route path="/admin/settings" element={<Settings />} />

            {/* catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
