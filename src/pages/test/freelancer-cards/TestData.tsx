
import { ProfileData } from '@/hooks/freelancer/useFreelancerProfileData';

export const getTestFreelancers = () => {
  // Complete profile with all data
  const completeFreelancer: ProfileData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    display_name: 'John Carpenter',
    first_name: 'John',
    last_name: 'Carpenter',
    profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    job_title: 'Independent Contractor',
    email_verified: true,
    verified: true,
    rating: 4.7,
    reviews_count: 12,
    skills: ['Carpentry', 'Woodworking', 'Furniture Making', 'Cabinet Installation'],
    location: 'London, UK',
    member_since: '2022-05-15',
    jobs_completed: 24,
    bio: 'Professional carpenter with over 10 years of experience in custom woodworking and furniture making.',
    email: 'john.carpenter@example.com',
    phone_number: '+44 7700 900123',
    previous_employers: [
      {
        employerName: 'Wood Masters Ltd',
        position: 'Senior Carpenter',
        startDate: '2018-01-01',
        endDate: null,
        current: true
      }
    ],
    previous_work: [
      {
        title: 'Custom Kitchen Cabinets',
        description: 'Designed and built custom kitchen cabinets for a high-end residential project.'
      }
    ],
    qualifications: ['Certified Carpenter', 'Health and Safety Certificate'],
    indemnity_insurance: { hasInsurance: true, coverLevel: '£1,000,000' },
    created_at: '2022-05-15T12:00:00Z',
    updated_at: '2023-01-10T15:30:00Z',
    website: 'https://johncarpentry.example.com',
    hourly_rate: '£45',
    day_rate: '£350',
    availability: 'Weekdays',
    experience: '10+ years',
    accreditations: ['Guild of Master Craftsmen']
  };
  
  // Minimal profile with only required fields
  const minimalFreelancer: ProfileData = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    user_id: '223e4567-e89b-12d3-a456-426614174001',
    display_name: 'Jane Smith',
    first_name: 'Jane',
    last_name: 'Smith',
    profile_photo: null,
    job_title: '',
    email_verified: false,
    verified: false,
    rating: null,
    reviews_count: 0,
    skills: [],
    location: '',
    member_since: null,
    jobs_completed: 0,
    bio: '',
    email: 'jane.smith@example.com',
    phone_number: '',
    previous_employers: [],
    previous_work: [],
    qualifications: [],
    indemnity_insurance: null,
    created_at: '2023-06-20T10:00:00Z',
    updated_at: '2023-06-20T10:00:00Z'
  };
  
  // New freelancer with some data
  const newFreelancer: ProfileData = {
    id: '323e4567-e89b-12d3-a456-426614174002',
    user_id: '323e4567-e89b-12d3-a456-426614174002',
    display_name: 'Robert Johnson',
    first_name: 'Robert',
    last_name: 'Johnson',
    profile_photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    job_title: 'Electrical Engineer',
    email_verified: true,
    verified: false,
    rating: 0,
    reviews_count: 0,
    skills: ['Electrical', 'Wiring', 'Lighting'],
    location: 'Manchester, UK',
    member_since: '2023-12-01',
    jobs_completed: 0,
    bio: 'Recently qualified electrical engineer looking for projects.',
    email: 'robert.johnson@example.com',
    phone_number: '+44 7700 900456',
    previous_employers: [],
    previous_work: [],
    qualifications: ['BSc Electrical Engineering'],
    indemnity_insurance: { hasInsurance: false },
    created_at: '2023-12-01T09:00:00Z',
    updated_at: '2023-12-05T14:20:00Z'
  };
  
  // Highly rated freelancer
  const expertFreelancer: ProfileData = {
    id: '423e4567-e89b-12d3-a456-426614174003',
    user_id: '423e4567-e89b-12d3-a456-426614174003',
    display_name: 'Sarah Williams',
    first_name: 'Sarah',
    last_name: 'Williams',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    job_title: 'Senior Interior Designer',
    email_verified: true,
    verified: true,
    rating: 5.0,
    reviews_count: 48,
    skills: ['Interior Design', 'Space Planning', 'Color Theory', 'Furniture Selection', 'Concept Development'],
    location: 'Edinburgh, UK',
    member_since: '2020-03-10',
    jobs_completed: 53,
    bio: 'Award-winning interior designer with over 15 years of experience working with residential and commercial clients.',
    email: 'sarah.williams@example.com',
    phone_number: '+44 7700 900789',
    previous_employers: [
      {
        employerName: 'Elite Interiors',
        position: 'Lead Designer',
        startDate: '2015-05-10',
        endDate: '2020-02-28',
        current: false
      },
      {
        employerName: 'Williams Design Studio',
        position: 'Owner',
        startDate: '2020-03-01',
        endDate: null,
        current: true
      }
    ],
    previous_work: [
      {
        title: 'Luxury Apartment Redesign',
        description: 'Complete redesign of a 3000 sq ft penthouse apartment in central London.'
      },
      {
        title: 'Restaurant Interior',
        description: 'Designed the interior for an upscale restaurant in Edinburgh.'
      }
    ],
    qualifications: ['BA Interior Design', 'MA Design Management'],
    indemnity_insurance: { hasInsurance: true, coverLevel: '£2,000,000' },
    created_at: '2020-03-10T08:00:00Z',
    updated_at: '2023-09-15T16:45:00Z',
    website: 'https://sarahwilliamsdesign.com',
    hourly_rate: '£85',
    day_rate: '£650',
    availability: 'Limited availability',
    experience: '15+ years',
    accreditations: ['Society of British Interior Design', 'International Interior Design Association']
  };

  return {
    completeFreelancer,
    minimalFreelancer,
    newFreelancer,
    expertFreelancer,
    mockQuoteDate: new Date().toISOString(),
    mockProjectId: 'project-123'
  };
};
