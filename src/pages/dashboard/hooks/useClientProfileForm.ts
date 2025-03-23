
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientProfileSchema } from '../components/profile/schema';
import { z } from 'zod';

type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

export const useClientProfileForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      isIndividual: false,
      companyName: '',
      contactName: '',
      companyLocation: '',
      companyDescription: '',
      phoneNumber: '',
      website: '',
      companyType: '',
      companyTurnover: '',
      employeeSize: '',
      companySpecialism: '',
    },
    mode: 'onChange',
  });

  return {
    form,
    isLoading,
    setIsLoading
  };
};
