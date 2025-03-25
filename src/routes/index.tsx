
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

// Use BrowserRouter with a basename if we're not at the root
const basename = document.querySelector('base')?.getAttribute('href') || '/';
console.log('Using basename:', basename);

// Initialize the router with all routes, ensuring root route is correct
const router = createBrowserRouter(logRoutes([
  // Main home route (with error element for sub-routes)
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
    id: "home-route"
  },
  // Client profile view route
  {
    path: "/client/:clientId",
    element: <ClientProfileView />,
  },
  // Freelancer profile view route
  {
    path: "/freelancer/:freelancerId",
    element: <FreelancerProfileView />,
  },
  // Include all route groups - spread them out to avoid nesting issues
  ...authRoutes,
  ...dashboardRoutes,
  ...projectRoutes,
  ...miscRoutes,
  // Catch-all route for 404s (must be last)
  {
    path: "*",
    element: <NotFound />,
    id: "not-found"
  },
]));

// Enhanced debugging info
console.log('Router initialized with', router.routes.length, 'routes');
console.log('Root route defined as:', router.routes[0].path);
console.log('Home route ID:', router.routes.find(r => r.path === '/')?.id);
console.log('All defined paths:', router.routes.map(r => r.path));

export default router;
