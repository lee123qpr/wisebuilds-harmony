
import { Route, Navigate } from "react-router-dom";
import Login from "../../pages/auth/Login";
import Signup from "../../pages/auth/Signup";
import ForgotPassword from "../../pages/auth/ForgotPassword";

const AuthRoutes = () => {
  return (
    <>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
    </>
  );
};

export default AuthRoutes;
