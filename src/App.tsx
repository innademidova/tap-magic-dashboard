import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import PRSessionDetails from "./pages/PRSessionDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword.tsx";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerAgents from "./pages/CustomerAgents";
import { AuthProvider, useAuth } from "./lib/auth-context";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/agents" element={<CustomerAgents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pr-session/:sessionId" element={<PRSessionDetails />} />
        <Route path="/article/:articleId" element={<ArticleDetails />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
