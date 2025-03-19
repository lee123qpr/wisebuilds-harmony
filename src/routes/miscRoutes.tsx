
import React from "react";
import { Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import FreelancerProfileView from "@/pages/freelancer/FreelancerProfileView";

export const miscRoutes = (
  <>
    <Route path="/freelancer/:freelancerId" element={<FreelancerProfileView />} />
    <Route path="*" element={<NotFound />} />
  </>
);
