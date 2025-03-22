
export interface FreelancerEmployer {
  employerName: string;
  startDate: string; // Store dates as ISO strings
  endDate?: string | null;
  current: boolean;
  position: string;
}

export interface FreelancerProfileFormData {
  fullName: string;
  profession: string;
  previousEmployers: FreelancerEmployer[];
  location: string;
  bio?: string;
  phoneNumber: string;
  website?: string;
  hourlyRate?: string;
  availability?: string;
  skills: string[];
  experience?: string;
  qualifications: string[];
  accreditations: string[];
  indemnityInsurance: {
    hasInsurance: boolean;
    coverLevel?: string;
  };
  previousWork: {
    name: string;
    url: string;
    type: string;
    size: number;
    path: string;
  }[];
  idVerified: boolean;
}
