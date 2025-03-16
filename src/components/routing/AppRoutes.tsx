
import { Routes, Route } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { FreelancerRoutes } from "./FreelancerRoutes";
import { BusinessRoutes } from "./BusinessRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { PublicRoutes } from "./PublicRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <AuthRoutes />
      <FreelancerRoutes />
      <BusinessRoutes />
      <AdminRoutes />
      <PublicRoutes />
    </Routes>
  );
};

export default AppRoutes;
