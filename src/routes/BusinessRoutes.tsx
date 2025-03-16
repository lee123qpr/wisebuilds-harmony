
import React from 'react';
import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Business Dashboard Pages
import BusinessDashboard from "@/pages/dashboard/BusinessDashboard";
import ClientProfile from "@/pages/dashboard/ClientProfile";

// Project Pages
import ViewProject from "@/pages/project/ViewProject";
import EditProject from "@/pages/project/EditProject";
import ProjectDocuments from "@/pages/project/ProjectDocuments";
import ProjectApplications from "@/pages/project/ProjectApplications";

const BusinessRoutes: React.FC = () => {
  return (
    <>
      <Route 
        path="/dashboard/business" 
        element={
          <ProtectedRoute allowedUserTypes={['business']}>
            <BusinessDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/business/profile" 
        element={
          <ProtectedRoute allowedUserTypes={['business']}>
            <ClientProfile />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/business/account" 
        element={
          <ProtectedRoute allowedUserTypes={['business']}>
            <Navigate to="/dashboard/business/profile" replace />
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
    </>
  );
};

export default BusinessRoutes;
