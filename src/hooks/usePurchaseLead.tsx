
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useCredits';
import { useQueryClient } from '@tanstack/react-query';

interface PurchaseResponse {
  success: boolean;
  message: string;
}

export const usePurchaseLead = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { creditBalance } = useCredits();

  const purchaseLead = async (projectId: string, message?: string) => {
    if (!projectId) {
      toast({
        title: 'Error',
        description: 'Invalid project',
        variant: 'destructive',
      });
      return false;
    }

    if (typeof creditBalance !== 'number' || creditBalance <= 0) {
      toast({
        title: 'Not enough credits',
        description: 'You need at least 1 credit to purchase this lead',
        variant: 'destructive',
      });
      return false;
    }

    setIsPurchasing(true);

    try {
      // Use the apply_to_project function we created in the database
      const { data, error } = await supabase.rpc('apply_to_project', {
        project_id: projectId,
        message: message || null,
        credits_to_use: 1
      });

      if (error) throw error;

      // Properly handle the JSON response by first checking its shape
      if (!data || typeof data !== 'object' || !('success' in data) || !('message' in data)) {
        throw new Error('Invalid response format from server');
      }
      
      const response = data as PurchaseResponse;
      
      if (!response.success) {
        toast({
          title: 'Purchase failed',
          description: response.message || 'Unknown error occurred',
          variant: 'destructive',
        });
        return false;
      }

      // Invalidate relevant queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['creditBalance'] });
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });

      toast({
        title: 'Lead purchased successfully',
        description: 'You can now contact the client directly',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error purchasing lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to purchase lead. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };

  return { purchaseLead, isPurchasing };
};
