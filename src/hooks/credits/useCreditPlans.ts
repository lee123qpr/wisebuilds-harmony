
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreditPlan } from './types';

export const useCreditPlans = () => {
  const {
    data: creditPlans,
    isLoading: isLoadingPlans,
    error: plansError,
  } = useQuery({
    queryKey: ['creditPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_plans')
        .select('*')
        .eq('is_active', true)
        .order('credits', { ascending: true });
      
      if (error) {
        console.error('Error fetching credit plans:', error);
        throw error;
      }
      
      return data as CreditPlan[];
    },
  });

  return {
    creditPlans,
    isLoadingPlans,
    plansError,
  };
};
