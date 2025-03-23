
export interface FreelancerProfile {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  job_title: string;
  email_verified: boolean;
  verified: boolean;
  rating: number | null;
  reviews_count: number;
  skills: string[];
  location: string;
  member_since: string | null;
  jobs_completed: number;
  bio: string;
  email: string;
  phone_number: string;
}

export const getTestFreelancers = () => {
  // Complete profile with all data
  const completeFreelancer: FreelancerProfile = {
    id: '123e4567-e89b-12d3-a456-426614174000',
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
    phone_number: '+44 7700 900123'
  };
  
  // Minimal profile with only required fields
  const minimalFreelancer: FreelancerProfile = {
    id: '223e4567-e89b-12d3-a456-426614174001',
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
    phone_number: ''
  };
  
  // New freelancer with some data
  const newFreelancer: FreelancerProfile = {
    id: '323e4567-e89b-12d3-a456-426614174002',
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
    phone_number: '+44 7700 900456'
  };
  
  // Highly rated freelancer
  const expertFreelancer: FreelancerProfile = {
    id: '423e4567-e89b-12d3-a456-426614174003',
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
    phone_number: '+44 7700 900789'
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
