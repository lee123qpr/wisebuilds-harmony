
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useQuoteDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteQuote = async (quoteId: string, notifyClient: boolean = false) => {
    if (!quoteId) {
      toast.error('No quote ID provided');
      return;
    }

    setIsDeleting(true);
    try {
      // If we need to notify client, first mark the quote as retracted before deleting
      if (notifyClient) {
        // First update the quote status to 'retracted' so the client sees it as retracted
        const { error: updateError } = await supabase
          .from('quotes')
          .update({ 
            status: 'declined', // Mark as declined (this is visible to clients)
            retracted_by_freelancer: true, // Add flag to indicate this was retracted
            updated_at: new Date().toISOString()
          })
          .eq('id', quoteId);

        if (updateError) {
          throw updateError;
        }
        
        // Allow a small delay for any real-time listeners to pick up the status change
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Delete the quote from the database
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) {
        throw error;
      }

      // Invalidate any relevant queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['quotes'],
      });
      
      queryClient.invalidateQueries({
        queryKey: ['freelancer-applications'],
      });

      toast.success(notifyClient 
        ? 'Quote retracted and client notified' 
        : 'Quote successfully deleted');
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteQuote,
    isDeleting
  };
};
