
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { projectRoutes } from "./projectRoutes";
import { miscRoutes } from "./miscRoutes";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {authRoutes}
      {dashboardRoutes}
      {projectRoutes}
      {miscRoutes}
    </Routes>
  </BrowserRouter>
);
