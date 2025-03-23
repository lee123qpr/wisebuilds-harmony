
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
    contact_phone: '+44 7700 900123',
    previous_employers: [
      'Wood Masters Ltd',
      'Carpentry Solutions'
    ],
    previous_work: [
      'Custom Kitchen Cabinets',
      'Wooden Furniture'
    ],
    qualifications: ['Certified Carpenter', 'Health and Safety Certificate'],
    indemnity_insurance: true,
    created_at: '2022-05-15T12:00:00Z',
    website: 'https://johncarpentry.example.com',
    hourly_rate: '£45',
    rate: '£45',
    day_rate: '£350',
    availability: 'Weekdays',
    experience: '10+ years',
    accreditations: ['Guild of Master Craftsmen'],
    role: 'Independent Contractor',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    work_type: 'On-site',
    travel_distance: '50 miles'
  };
  
  // Minimal profile with only required fields
  const minimalFreelancer: ProfileData = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    user_id: '223e4567-e89b-12d3-a456-426614174001',
    display_name: 'Jane Smith',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    bio: '',
    contact_phone: '',
    role: '',
    avatar_url: '',
    rate: '',
    location: '',
    indemnity_insurance: false,
    previous_employers: [],
    previous_work: [],
    skills: [],
    qualifications: [],
    created_at: '2023-06-20T10:00:00Z',
    work_type: '',
    availability: '',
    travel_distance: '',
    verified: false
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
    contact_phone: '+44 7700 900456',
    role: 'Electrical Engineer',
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rate: '',
    indemnity_insurance: false,
    previous_employers: [],
    previous_work: [],
    qualifications: ['BSc Electrical Engineering'],
    created_at: '2023-12-01T09:00:00Z',
    work_type: 'Remote',
    availability: 'Flexible',
    travel_distance: '25 miles'
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
    contact_phone: '+44 7700 900789',
    role: 'Senior Interior Designer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rate: '£85',
    location: 'Edinburgh, UK',
    indemnity_insurance: true,
    previous_employers: ['Elite Interiors', 'Williams Design Studio'],
    previous_work: ['Luxury Apartment Redesign', 'Restaurant Interior'],
    qualifications: ['BA Interior Design', 'MA Design Management'],
    created_at: '2020-03-10T08:00:00Z',
    website: 'https://sarahwilliamsdesign.com',
    hourly_rate: '£85',
    day_rate: '£650',
    availability: 'Limited availability',
    experience: '15+ years',
    accreditations: ['Society of British Interior Design', 'International Interior Design Association'],
    work_type: 'Hybrid',
    travel_distance: '100 miles'
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
