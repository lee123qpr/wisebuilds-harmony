
import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import FreelancerProfileView from '@/pages/freelancer/FreelancerProfileView';
import ClientProfileView from '@/pages/client/ClientProfileView';

export const miscRoutes: RouteObject[] = [
  {
    path: '/freelancer/:freelancerId',
    element: <FreelancerProfileView />
  },
  {
    path: '/client-profile/:clientId',
    element: <ClientProfileView />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
