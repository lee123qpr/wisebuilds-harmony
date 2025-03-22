
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreditPlan } from './types';
import { useToast } from '@/hooks/use-toast';

export const useCreditPlans = () => {
  const { toast } = useToast();
  
  const {
    data: creditPlans,
    isLoading: isLoadingPlans,
    error: plansError,
    refetch: refetchPlans
  } = useQuery({
    queryKey: ['creditPlans'],
    queryFn: async () => {
      try {
        console.log('Fetching credit plans...');
        const { data, error } = await supabase
          .from('credit_plans')
          .select('*')
          .eq('is_active', true)
          .order('credits', { ascending: true });
        
        if (error) {
          console.error('Error fetching credit plans:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log('No active credit plans found');
        } else {
          console.log(`Found ${data.length} credit plans`);
        }
        
        return data as CreditPlan[];
      } catch (error) {
        console.error('Failed to fetch credit plans:', error);
        toast({
          title: 'Error loading plans',
          description: 'Failed to load credit plans. Please try refreshing the page.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  return {
    creditPlans,
    isLoadingPlans,
    plansError,
    refetchPlans
  };
};
