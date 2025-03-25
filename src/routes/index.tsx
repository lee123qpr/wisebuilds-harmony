
import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { projectRoutes } from './projectRoutes';
import { miscRoutes } from './miscRoutes';
import Index from '../pages/Index';
import NotFound from '../pages/NotFound';
import FreelancerProfileView from '../pages/freelancer/FreelancerProfileView';
import ClientProfileView from '../pages/client/ClientProfileView';

const router = createBrowserRouter([
  // Main home route
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />,
  },
  // Client profile view route
  {
    path: '/client/:clientId',
    element: <ClientProfileView />,
  },
  // Freelancer profile view route
  {
    path: '/freelancer/:freelancerId',
    element: <FreelancerProfileView />,
  },
  // Other route groups
  ...authRoutes,
  ...dashboardRoutes,
  ...projectRoutes,
  ...miscRoutes,
  // Catch-all route for 404s
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
