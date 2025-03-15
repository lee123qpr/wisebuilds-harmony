
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useCredits';
import { useQueryClient } from '@tanstack/react-query';

export const usePurchaseLead = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { creditBalance, refetchCredits } = useCredits();

  const purchaseLead = async (projectId: string, projectTitle?: string, message?: string) => {
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
    const displayTitle = projectTitle || `Project ID: ${projectId.substring(0, 8)}...`;

    try {
      console.log(`Purchasing lead for project: ${displayTitle} (${projectId})`);
      
      // Call the apply_to_project RPC function
      const { data, error } = await supabase.rpc('apply_to_project', {
        project_id: projectId,
        message: message || null,
        credits_to_use: 1
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      // Check if data exists and is not null
      if (!data) {
        console.error('No data returned from server');
        throw new Error('No data returned from server');
      }
      
      console.log(`RPC response for project ${displayTitle}:`, data);
      
      // Determine if operation was successful
      let success = false;
      let responseMessage = 'Unknown response format';
      
      if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
        // It's an object, extract success and message properties if they exist
        success = data.success === true;
        responseMessage = typeof data.message === 'string' ? data.message : 'Unknown error';
        
        console.log(`Lead purchase for ${displayTitle}: success=${success}, message=${responseMessage}`);
      }
      
      if (!success) {
        toast({
          title: 'Purchase failed',
          description: responseMessage,
          variant: 'destructive',
        });
        return false;
      }

      // Invalidate relevant queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['creditBalance'] });
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // Refetch credits directly
      if (refetchCredits) {
        await refetchCredits();
      }

      toast({
        title: 'Lead purchased successfully',
        description: `You can now contact the client for ${displayTitle}`,
      });
      
      return true;
    } catch (error: any) {
      console.error(`Error purchasing lead for ${displayTitle}:`, error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to purchase lead. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };

  return { purchaseLead, isPurchasing };
};
