
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';
import { z } from 'zod';

type FreelancerProfileFormValues = z.infer<typeof freelancerProfileSchema>;

export const useFreelancerProfileForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<FreelancerProfileFormValues>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: {
      fullName: '',
      profession: '',
      role: '',
      location: '',
      bio: '',
      phoneNumber: '',
      website: '',
      hourlyRate: '',
      availability: '',
      skills: [],
      experience: '',
      qualifications: [],
      accreditations: [],
      indemnityInsurance: {
        hasInsurance: false,
        coverLevel: '',
      },
      previousWork: [],
      idVerified: false,
    },
    mode: 'onChange',
  });

  return {
    form,
    isLoading,
    setIsLoading
  };
};
