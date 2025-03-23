
import TestSkeleton from '../components/test/TestSkeleton';
import FreelancerProfileCardsTest from '../pages/test/FreelancerProfileCardsTest';
import FreelancerDetailedProfileTest from '../pages/test/FreelancerDetailedProfileTest';
import ClientProfileTest from '../pages/test/ClientProfileTest';
import FreelancerProfileTest from '../pages/test/FreelancerProfileTest';
import ClientViewFreelancerTest from '../pages/test/ClientViewFreelancerTest';

export const miscRoutes = [
  {
    path: '/test-skeleton',
    element: <TestSkeleton />,
  },
  {
    path: '/test/profile-cards',
    element: <FreelancerProfileCardsTest />,
  },
  {
    path: '/test/freelancer-profile-cards-test',
    element: <FreelancerProfileCardsTest />,
  },
  {
    path: '/test/freelancer-detailed-profile',
    element: <FreelancerDetailedProfileTest />,
  },
  {
    path: '/test/client-profile',
    element: <ClientProfileTest />,
  },
  {
    path: '/test/freelancer-profile',
    element: <FreelancerProfileTest />,
  },
  {
    path: '/test/client-view-freelancer',
    element: <ClientViewFreelancerTest />,
  }
];
