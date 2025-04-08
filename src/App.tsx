
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

const queryClient = new QueryClient();

const App = () => {
  // This would be replaced with actual auth check when Supabase is integrated
  const isAuthenticated = () => {
    // For demo purposes, always consider authenticated except on sign-in page
    const path = window.location.pathname;
    return path !== "/signin";
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            
            {/* Protected routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
