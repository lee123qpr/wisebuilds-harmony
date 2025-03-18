
import { Route } from "react-router-dom";
import ViewProject from "../pages/project/ViewProject";
import EditProject from "../pages/project/EditProject";
import ProjectDocuments from "../pages/project/ProjectDocuments";
import ProjectApplications from "../pages/project/ProjectApplications";
import ProjectQuotesComparison from "../pages/project/ProjectQuotesComparison";
import ViewQuoteDetails from "../pages/project/ViewQuoteDetails";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export const projectRoutes = (
  <>
    {/* Project Routes */}
    <Route 
      path="/project/:projectId" 
      element={<ViewProject />} 
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
      element={<ProjectDocuments />} 
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
      path="/project/:projectId/quotes" 
      element={
        <ProtectedRoute allowedUserTypes={['business']}>
          <ProjectQuotesComparison />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/project/:projectId/quotes/:quoteId" 
      element={
        <ProtectedRoute allowedUserTypes={['business']}>
          <ViewQuoteDetails />
        </ProtectedRoute>
      } 
    />
  </>
);
