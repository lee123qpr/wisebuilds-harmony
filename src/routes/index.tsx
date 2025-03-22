import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { projectRoutes } from './projectRoutes';
import { miscRoutes } from './miscRoutes';
import Index from '../pages/Index';
import NotFound from '../pages/NotFound';
import FreelancerProfileView from '../pages/freelancer/FreelancerProfileView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
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
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
