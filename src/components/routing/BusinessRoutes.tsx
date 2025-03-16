
import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import BusinessDashboard from "../../pages/dashboard/BusinessDashboard";
import ViewProject from "../../pages/project/ViewProject";
import EditProject from "../../pages/project/EditProject";
import ProjectDocuments from "../../pages/project/ProjectDocuments";
import ProjectApplications from "../../pages/project/ProjectApplications";
import ClientProfile from "../../pages/dashboard/ClientProfile";

export const BusinessRoutes = () => {
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
    </>
  );
};

export default BusinessRoutes;
