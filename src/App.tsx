import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import FreelancerDashboard from "./pages/dashboard/FreelancerDashboard";
import BusinessDashboard from "./pages/dashboard/BusinessDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ViewProject from "./pages/project/ViewProject";
import EditProject from "./pages/project/EditProject";
import ProjectDocuments from "./pages/project/ProjectDocuments";
import ProjectApplications from "./pages/project/ProjectApplications";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LeadSettings from "./pages/dashboard/leadSettings";
import ClientProfile from "./pages/dashboard/ClientProfile";
import CreditsPage from "./pages/dashboard/freelancer/credits/CreditsPage";
import SuccessPage from "./pages/dashboard/freelancer/credits/SuccessPage";
import ClientProfileAndSettings from './pages/dashboard/ClientProfileAndSettings';

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
            
            {/* Credits Routes */}
            <Route 
              path="/dashboard/freelancer/credits" 
              element={
                <ProtectedRoute allowedUserTypes={['freelancer']}>
                  <CreditsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/freelancer/credits/success" 
              element={
                <ProtectedRoute allowedUserTypes={['freelancer']}>
                  <SuccessPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Project Routes */}
            <Route 
              path="/project/:projectId" 
              element={
                <ProtectedRoute allowedUserTypes={['business']}>
                  <ViewProject />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project/:projectId/edit" 
              element={
                <ProtectedRoute allowedUserTypes={['business']}>
                  <EditProject />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project/:projectId/documents" 
              element={
                <ProtectedRoute allowedUserTypes={['business']}>
                  <ProjectDocuments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project/:projectId/applications" 
              element={
                <ProtectedRoute allowedUserTypes={['business']}>
                  <ProjectApplications />
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
            
            {/* Route for Lead Settings - Note: Keep this before the catch-all route */}
            <Route 
              path="/dashboard/freelancer/lead-settings" 
              element={
                <ProtectedRoute allowedUserTypes={['freelancer']}>
                  <LeadSettings />
                </ProtectedRoute>
              } 
            />
            
            {/* Combined profile and settings page */}
            <Route 
              path="/dashboard/business/profile" 
              element={
                <ClientProfileAndSettings />
              } 
            />
            
            {/* Redirect from account page to profile page */}
            <Route 
              path="/dashboard/business/account" 
              element={
                <ProtectedRoute allowedUserTypes={['business']}>
                  <Navigate to="/dashboard/business/profile" replace />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
