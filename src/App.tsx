
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<NotFound />} />
          <Route path="/auth/signup/freelancer" element={<NotFound />} />
          <Route path="/auth/signup/business" element={<NotFound />} />
          <Route path="/auth/forgot-password" element={<NotFound />} />
          
          {/* Marketplace Routes */}
          <Route path="/marketplace" element={<NotFound />} />
          <Route path="/marketplace/:projectId" element={<NotFound />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/freelancer" element={<NotFound />} />
          <Route path="/dashboard/business" element={<NotFound />} />
          <Route path="/dashboard/admin" element={<NotFound />} />
          
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
  </QueryClientProvider>
);

export default App;
