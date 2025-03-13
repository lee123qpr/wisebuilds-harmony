
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import FreelancerDashboard from "./pages/dashboard/FreelancerDashboard";
import BusinessDashboard from "./pages/dashboard/BusinessDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            
            {/* Dashboard Routes - Protected */}
            <Route 
              path="/dashboard/freelancer" 
              element={
                <ProtectedRoute allowedUserTypes={['freelancer']}>
                  <FreelancerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/business" 
              element={
                <ProtectedRoute allowedUserTypes={['business']}>
                  <BusinessDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedUserTypes={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<NotFound />} />
            <Route path="/marketplace/:projectId" element={<NotFound />} />
            
            {/* Messages Routes */}
            <Route path="/messages" element={<NotFound />} />
            <Route path="/messages/:conversationId" element={<NotFound />} />
            
            {/* Settings Routes */}
            <Route path="/settings" element={<NotFound />} />
            
            {/* Info Pages */}
            <Route path="/how-it-works" element={<NotFound />} />
            <Route path="/about" element={<NotFound />} />
            
            {/* Legal Pages */}
            <Route path="/legal/privacy" element={<NotFound />} />
            <Route path="/legal/terms" element={<NotFound />} />
            <Route path="/legal/cookies" element={<NotFound />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
