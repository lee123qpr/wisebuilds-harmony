
import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminDashboard from "../../pages/dashboard/AdminDashboard";

const AdminRoutes = () => {
  return (
    <Route 
      path="/dashboard/admin" 
      element={
        <ProtectedRoute allowedUserTypes={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } 
    />
  );
};

export default AdminRoutes;
