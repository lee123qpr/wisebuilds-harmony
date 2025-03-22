
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Index from "../pages/Index";

export const miscRoutes = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/messages/:partnerId",
    element: <ProtectedRoute><Navigate to="/dashboard/business?tab=messages" replace /></ProtectedRoute>
  },
  {
    path: "*",
    element: <NotFound />
  }
];
