
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";

export const authRoutes = [
  {
    path: "/auth/login",
    element: <Login />
  },
  {
    path: "/auth/signup",
    element: <Signup />
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />
  },
];
