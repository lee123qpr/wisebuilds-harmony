
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useQuoteDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteQuote = async (quoteId: string) => {
    if (!quoteId) {
      toast.error('No quote ID provided');
      return;
    }

    setIsDeleting(true);
    try {
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

      toast.success('Quote successfully deleted');
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
