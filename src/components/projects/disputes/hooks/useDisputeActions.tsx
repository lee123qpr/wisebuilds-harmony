
import { useState } from 'react';
import { addDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/toast';
import { DisputeFormData } from '../DisputeForm';

interface UseDisputeActionsProps {
  quoteId: string;
  projectId: string;
}

export const useDisputeActions = ({ quoteId, projectId }: UseDisputeActionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  // Calculate deadlines - 10 days from today for submission
  const submissionDeadline = addDays(new Date(), 10);
  
  const openDisputeForm = () => {
    setIsOpen(true);
  };
  
  const handleSubmitDispute = async (data: DisputeFormData) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to submit a dispute',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert dispute record
      const { data: disputeData, error } = await supabase
        .from('project_disputes')
        .insert({
          project_id: projectId,
          quote_id: quoteId,
          user_id: user.id,
          reason: data.reason,
          at_fault_statement: data.atFault,
          evidence_files: data.evidenceFiles,
          submission_deadline: submissionDeadline.toISOString(),
          admin_decision_deadline: addDays(submissionDeadline, 10).toISOString()
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Optionally update project/quote status
      const { error: quoteError } = await supabase
        .from('quotes')
        .update({ 
          status: 'disputed' 
        })
        .eq('id', quoteId);
      
      if (quoteError) {
        console.error('Error updating quote status:', quoteError);
      }
      
      toast({
        title: 'Dispute submitted',
        description: 'Your dispute has been submitted for review',
        variant: 'default'
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting dispute:', error);
      toast({
        title: 'Failed to submit dispute',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isOpen,
    setIsOpen,
    isSubmitting,
    submissionDeadline,
    openDisputeForm,
    handleSubmitDispute
  };
};
