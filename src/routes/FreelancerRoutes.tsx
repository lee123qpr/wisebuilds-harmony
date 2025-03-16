
import React from 'react';
import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Freelancer Dashboard Pages
import FreelancerDashboard from "@/pages/dashboard/FreelancerDashboard";
import LeadSettings from "@/pages/dashboard/leadSettings";
import FreelancerProfile from "@/pages/dashboard/FreelancerProfile";
import ViewProject from "@/pages/project/ViewProject";

// Credits Pages
import CreditsPage from "@/pages/dashboard/freelancer/credits/CreditsPage";
import SuccessPage from "@/pages/dashboard/freelancer/credits/SuccessPage";

const FreelancerRoutes: React.FC = () => {
  return (
    <>
      <Route 
        path="/dashboard/freelancer" 
        element={
          <ProtectedRoute allowedUserTypes={['freelancer']}>
            <FreelancerDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/freelancer/lead-settings" 
        element={
          <ProtectedRoute allowedUserTypes={['freelancer']}>
            <LeadSettings />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/freelancer/profile" 
        element={
          <ProtectedRoute allowedUserTypes={['freelancer']}>
            <FreelancerProfile />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/freelancer/account" 
        element={
          <ProtectedRoute allowedUserTypes={['freelancer']}>
            <Navigate to="/dashboard/freelancer/profile" replace />
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
      
      {/* Marketplace Routes */}
      <Route 
        path="/marketplace/:projectId" 
        element={
          <ProtectedRoute allowedUserTypes={['freelancer']}>
            <ViewProject />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default FreelancerRoutes;
