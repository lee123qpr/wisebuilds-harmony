
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const HowItWorks = lazy(() => import('../pages/HowItWorks'));
const CookiePolicy = lazy(() => import('../pages/CookiePolicy'));

export const miscRoutes: RouteObject[] = [
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/how-it-works',
    element: <HowItWorks />,
  },
  {
    path: '/cookie-policy',
    element: <CookiePolicy />,
  },
];
