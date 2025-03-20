
import React from "react";
import { Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import FreelancerProfileView from "@/pages/freelancer/FreelancerProfileView";
import Index from "@/pages/Index";

export const miscRoutes = (
  <>
    <Route path="/" element={<Index />} />
    <Route path="/freelancer/:freelancerId" element={<FreelancerProfileView />} />
    <Route path="*" element={<NotFound />} />
  </>
);
