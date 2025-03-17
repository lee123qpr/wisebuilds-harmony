
import { Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";

export const authRoutes = (
  <>
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/signup" element={<Signup />} />
    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
  </>
);
