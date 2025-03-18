
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuoteSubmission } from '@/hooks/quotes/useQuoteSubmission';
import { useAuth } from '@/context/AuthContext';

const quoteFormSchema = z.object({
  price: z.string().min(1, { message: 'Price is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  estimatedDuration: z.string().min(1, { message: 'Estimated duration is required' }),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  projectId: string;
  projectTitle: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  projectId, 
  projectTitle, 
  onSubmitSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const clientId = user?.user_metadata?.client_id || '';
  
  const { submitQuote, isSubmitting } = useQuoteSubmission({ 
    projectId, 
    clientId 
  });
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      price: '',
      description: '',
      estimatedDuration: '',
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      const success = await submitQuote(data);
      
      if (success) {
        toast({
          title: 'Quote submitted successfully',
          description: 'Your quote has been sent to the client',
        });
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: 'Failed to submit quote',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Submit Quote for: {projectTitle}</h2>
          <p className="text-sm text-muted-foreground">
            Provide details of your proposal to the client
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (£)</FormLabel>
              <FormControl>
                <Input placeholder="£0.00" {...field} />
              </FormControl>
              <FormDescription>
                Enter the total price for this project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2 weeks" {...field} />
              </FormControl>
              <FormDescription>
                How long will it take you to complete this project?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your approach to this project..."
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Explain how you'll approach the project, your experience, and why you're the best fit
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Quote'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoteForm;
