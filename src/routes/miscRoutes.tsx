
import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import HowItWorks from '@/pages/HowItWorks';
import NotFound from '@/pages/NotFound';
import Contact from '@/pages/Contact';
import CookiePolicy from '@/pages/CookiePolicy';
import TestSkeleton from '@/components/test/TestSkeleton';
import TestDashboard from '@/pages/test/TestDashboard';
import FreelancerProfileCardsTest from '@/pages/test/FreelancerProfileCardsTest';
import FreelancerDetailedProfileTest from '@/pages/test/FreelancerDetailedProfileTest';
import ClientProfileTest from '@/pages/test/ClientProfileTest';
import FreelancerProfileTest from '@/pages/test/FreelancerProfileTest';
import ClientViewFreelancerTest from '@/pages/test/ClientViewFreelancerTest';
import EmailTest from '@/pages/test/EmailTest';

export const miscRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicy />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/test",
    element: <TestDashboard />,
  },
  {
    path: "/test-skeleton",
    element: <TestSkeleton />,
  },
  {
    path: "/test/profile-cards",
    element: <FreelancerProfileCardsTest />,
  },
  {
    path: "/test/freelancer-detailed-profile",
    element: <FreelancerDetailedProfileTest />,
  },
  {
    path: "/test/client-profile",
    element: <ClientProfileTest />,
  },
  {
    path: "/test/freelancer-profile",
    element: <FreelancerProfileTest />,
  },
  {
    path: "/test/client-view-freelancer",
    element: <ClientViewFreelancerTest />,
  },
  {
    path: "/test/email-test",
    element: <EmailTest />,
  }
];
