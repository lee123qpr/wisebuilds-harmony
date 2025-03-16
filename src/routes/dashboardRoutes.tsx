
import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import FreelancerDashboard from "../pages/dashboard/FreelancerDashboard";
import BusinessDashboard from "../pages/dashboard/BusinessDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import LeadSettings from "../pages/dashboard/leadSettings";
import ClientProfile from "../pages/dashboard/ClientProfile";
import FreelancerProfile from "../pages/dashboard/FreelancerProfile";
import CreditsPage from "../pages/dashboard/freelancer/credits/CreditsPage";
import SuccessPage from "../pages/dashboard/freelancer/credits/SuccessPage";

export const dashboardRoutes = (
  <>
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
    
    {/* Lead Settings Route */}
    <Route 
      path="/dashboard/freelancer/lead-settings" 
      element={
        <ProtectedRoute allowedUserTypes={['freelancer']}>
          <LeadSettings />
        </ProtectedRoute>
      } 
    />
    
    {/* Profile routes */}
    <Route 
      path="/dashboard/business/profile" 
      element={
        <ProtectedRoute allowedUserTypes={['business']}>
          <ClientProfile />
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
    
    {/* Redirect from account page to profile page */}
    <Route 
      path="/dashboard/business/account" 
      element={
        <ProtectedRoute allowedUserTypes={['business']}>
          <Navigate to="/dashboard/business/profile" replace />
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
  </>
);
