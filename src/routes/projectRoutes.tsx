
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ViewProject from "../pages/project/ViewProject";
import EditProject from "../pages/project/EditProject";
import ProjectDocuments from "../pages/project/ProjectDocuments";
import ProjectApplications from "../pages/project/ProjectApplications";
import NotFound from "../pages/NotFound";

export const projectRoutes = (
  <>
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
    <Route 
      path="/marketplace/:projectId" 
      element={
        <ProtectedRoute allowedUserTypes={['freelancer']}>
          <ViewProject />
        </ProtectedRoute>
      } 
    />
    <Route path="/marketplace" element={<NotFound />} />
  </>
);
