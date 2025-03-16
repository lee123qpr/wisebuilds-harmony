
import { Routes } from "react-router-dom";

// Route Groups
import AuthRoutes from "./AuthRoutes";
import FreelancerRoutes from "./FreelancerRoutes";
import BusinessRoutes from "./BusinessRoutes";
import AdminRoutes from "./AdminRoutes";
import PublicRoutes from "./PublicRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <AuthRoutes />
      
      {/* Freelancer Routes */}
      <FreelancerRoutes />
      
      {/* Business Routes */}
      <BusinessRoutes />
      
      {/* Admin Routes */}
      <AdminRoutes />
      
      {/* Public Routes (including catch-all) */}
      <PublicRoutes />
    </Routes>
  );
};

export default AppRoutes;
