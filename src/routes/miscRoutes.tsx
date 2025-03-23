
import TestSkeleton from '../components/test/TestSkeleton';
import FreelancerProfileCardsTest from '../pages/test/FreelancerProfileCardsTest';
import FreelancerDetailedProfileTest from '../pages/test/FreelancerDetailedProfileTest';

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
  }
];
