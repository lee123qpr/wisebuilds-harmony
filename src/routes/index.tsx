
import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { projectRoutes } from './projectRoutes';
import { miscRoutes } from './miscRoutes';
import Index from '../pages/Index';
import NotFound from '../pages/NotFound';
import FreelancerProfileView from '../pages/freelancer/FreelancerProfileView';
import ClientProfileView from '../pages/client/ClientProfileView';

// Log routes for debugging
const logRoutes = (routes) => {
  console.log('Registering routes:', routes.map(r => r.path).filter(Boolean));
  return routes;
};

// Initialize the router with all routes
const router = createBrowserRouter(logRoutes([
  // Main home route (with error element for sub-routes)
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
  // Include all route groups
  ...authRoutes,
  ...dashboardRoutes,
  ...projectRoutes,
  ...miscRoutes,
  // Catch-all route for 404s (must be last)
  {
    path: '*',
    element: <NotFound />,
  },
]));

// Add debugging info
console.log('Router initialized with', router.routes.length, 'routes');

export default router;
