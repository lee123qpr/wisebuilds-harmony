
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { purchaseLeadApi } from './api/purchaseLeadApi';
import { PurchaseLeadOptions } from './types';
import { calculateLeadCredits } from './utils/calculateLeadCredits';

export const usePurchaseLead = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { creditBalance, refetchCredits } = useCredits();

  const purchaseLead = async (projectId: string, projectTitle?: string, message?: string, projectDetails?: any) => {
    if (!projectId) {
      toast({
        title: 'Error',
        description: 'Invalid project',
        variant: 'destructive',
      });
      return false;
    }

    // Calculate required credits if project details are available
    let requiredCredits = 1; // Default
    if (projectDetails && projectDetails.budget && projectDetails.duration && projectDetails.hiring_status) {
      requiredCredits = calculateLeadCredits(
        projectDetails.budget,
        projectDetails.duration,
        projectDetails.hiring_status
      );
    }

    if (typeof creditBalance !== 'number' || creditBalance < requiredCredits) {
      toast({
        title: 'Not enough credits',
        description: `You need at least ${requiredCredits} ${requiredCredits === 1 ? 'credit' : 'credits'} to purchase this lead`,
        variant: 'destructive',
      });
      return false;
    }

    setIsPurchasing(true);
    const displayTitle = projectTitle || `Project ID: ${projectId.substring(0, 8)}...`;

    try {
      console.log(`Purchasing lead for project: ${displayTitle} (${projectId}), required credits: ${requiredCredits}`);
      
      const result = await purchaseLeadApi({
        projectId,
        projectTitle,
        message,
        projectDetails
      });
      
      console.log(`Lead purchase for ${displayTitle}: success=${result.success}, message=${result.message}`);
      
      if (!result.success) {
        toast({
          title: 'Purchase failed',
          description: result.message,
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
