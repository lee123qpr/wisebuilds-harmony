
import { Route } from "react-router-dom";
import ViewProject from "../pages/project/ViewProject";
import EditProject from "../pages/project/EditProject";
import ProjectDocuments from "../pages/project/ProjectDocuments";
import ProjectApplications from "../pages/project/ProjectApplications";
import ProjectQuotesComparison from "../pages/project/ProjectQuotesComparison";
import ViewQuoteDetails from "../pages/project/ViewQuoteDetails";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export const projectRoutes = [
  {
    path: "/project/:projectId",
    element: <ViewProject />
  },
  {
    path: "/project/:projectId/edit",
    element: <ProtectedRoute allowedUserTypes={['business']}><EditProject /></ProtectedRoute>
  },
  {
    path: "/project/:projectId/documents",
    element: <ProjectDocuments />
  },
  {
    path: "/project/:projectId/applications",
    element: <ProtectedRoute allowedUserTypes={['business']}><ProjectApplications /></ProtectedRoute>
  },
  {
    path: "/project/:projectId/quotes",
    element: <ProtectedRoute allowedUserTypes={['business']}><ProjectQuotesComparison /></ProtectedRoute>
  },
  {
    path: "/project/:projectId/quotes/:quoteId",
    element: <ProtectedRoute allowedUserTypes={['business']}><ViewQuoteDetails /></ProtectedRoute>
  }
];
