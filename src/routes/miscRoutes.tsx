
import { Route, Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import BusinessMessagesTab from "../components/dashboard/business/MessagesTab";
import MessagesTab from "../components/dashboard/freelancer/MessagesTab";
import Index from "../pages/Index";

export const miscRoutes = (
  <>
    {/* Home Route */}
    <Route path="/" element={<Index />} />
    
    {/* Message Routes - Direct access */}
    <Route 
      path="/messages/:partnerId" 
      element={
        <ProtectedRoute>
          <Navigate to="/dashboard/business?tab=messages" replace />
        </ProtectedRoute>
      } 
    />
    
    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </>
);
