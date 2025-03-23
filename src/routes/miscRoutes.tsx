
import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import FreelancerProfileView from '@/pages/freelancer/FreelancerProfileView';
import ClientProfileView from '@/pages/client/ClientProfileView';
import About from '@/pages/About';
import HowItWorks from '@/pages/HowItWorks';

export const miscRoutes: RouteObject[] = [
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/how-it-works',
    element: <HowItWorks />
  },
  {
    path: '/freelancer/:freelancerId',
    element: <FreelancerProfileView />
  },
  {
    path: '/client/:clientId',
    element: <ClientProfileView />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
