
import ProtectedRoute from "../components/auth/ProtectedRoute";
import FreelancerDashboard from "../pages/dashboard/FreelancerDashboard";
import BusinessDashboard from "../pages/dashboard/BusinessDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import LeadSettings from "../pages/dashboard/leadSettings";
import ClientProfile from "../pages/dashboard/ClientProfile";
import FreelancerProfile from "../pages/dashboard/FreelancerProfile";
import CreditsPage from "../pages/dashboard/freelancer/credits/CreditsPage";
import SuccessPage from "../pages/dashboard/freelancer/credits/SuccessPage";
import { Navigate } from "react-router-dom";

export const dashboardRoutes = [
  {
    path: "/dashboard/freelancer",
    element: <ProtectedRoute allowedUserTypes={['freelancer']}><FreelancerDashboard /></ProtectedRoute>
  },
  {
    path: "/dashboard/business",
    element: <ProtectedRoute allowedUserTypes={['business']}><BusinessDashboard /></ProtectedRoute>
  },
  {
    path: "/dashboard/admin",
    element: <ProtectedRoute allowedUserTypes={['admin']}><AdminDashboard /></ProtectedRoute>
  },
  {
    path: "/dashboard/freelancer/credits",
    element: <ProtectedRoute allowedUserTypes={['freelancer']}><CreditsPage /></ProtectedRoute>
  },
  {
    path: "/dashboard/freelancer/credits/success",
    element: <ProtectedRoute allowedUserTypes={['freelancer']}><SuccessPage /></ProtectedRoute>
  },
  {
    path: "/dashboard/freelancer/lead-settings",
    element: <ProtectedRoute allowedUserTypes={['freelancer']}><LeadSettings /></ProtectedRoute>
  },
  {
    path: "/dashboard/business/profile",
    element: <ProtectedRoute allowedUserTypes={['business']}><ClientProfile /></ProtectedRoute>
  },
  {
    path: "/dashboard/freelancer/profile",
    element: <ProtectedRoute allowedUserTypes={['freelancer']}><FreelancerProfile /></ProtectedRoute>
  },
  {
    path: "/dashboard/business/account",
    element: <ProtectedRoute allowedUserTypes={['business']}><Navigate to="/dashboard/business/profile" replace /></ProtectedRoute>
  },
  {
    path: "/dashboard/freelancer/account",
    element: <ProtectedRoute allowedUserTypes={['freelancer']}><Navigate to="/dashboard/freelancer/profile" replace /></ProtectedRoute>
  }
];
