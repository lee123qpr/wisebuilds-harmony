
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SubmitQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  onQuoteSubmitted?: () => void;
}

const SubmitQuoteDialog: React.FC<SubmitQuoteDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  onQuoteSubmitted
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // For now, we're just creating a basic quote record
      // We'll add more quote details later
      const { data: clientData } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
      
      if (!clientData) {
        throw new Error('Could not find project client');
      }
      
      const clientId = clientData.user_id;
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }
      
      const freelancerId = userData.user.id;
      
      const { data, error } = await supabase
        .from('quotes')
        .insert([
          {
            project_id: projectId,
            freelancer_id: freelancerId,
            client_id: clientId
          }
        ]);
      
      if (error) throw error;
      
      if (onQuoteSubmitted) {
        onQuoteSubmitted();
      }
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      toast({
        variant: 'destructive',
        title: 'Quote submission failed',
        description: err.message || 'Failed to submit quote. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Quote for Project</DialogTitle>
          <DialogDescription>
            You're submitting a quote for: <span className="font-medium">{projectTitle}</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              This is a basic quote submission. You'll be able to add more details to your quote later.
            </p>
            
            {/* Quote form fields will be added here later */}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quote'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitQuoteDialog;
