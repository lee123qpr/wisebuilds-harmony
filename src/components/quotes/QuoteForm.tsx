
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import FileUpload from '@/components/projects/file-upload/FileUpload';
import { UploadedFile } from '@/components/projects/file-upload/types';

const quoteFormSchema = z.object({
  priceType: z.enum(['fixed', 'estimated', 'day_rate']),
  fixedPrice: z.string().optional().refine(val => val === undefined || val.length > 0, { 
    message: 'Fixed price is required when price type is fixed'
  }),
  estimatedPrice: z.string().optional().refine(val => val === undefined || val.length > 0, { 
    message: 'Estimated price is required when price type is estimated'
  }),
  dayRate: z.string().optional().refine(val => val === undefined || val.length > 0, { 
    message: 'Day rate is required when price type is day rate'
  }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  availableStartDate: z.date({
    required_error: 'Please select a start date',
  }),
  estimatedDuration: z.string().min(1, { message: 'Estimated duration is required' }),
  durationUnit: z.enum(['days', 'weeks', 'months'], {
    required_error: 'Please select a duration unit',
  }),
  preferredPaymentMethod: z.string().min(1, { message: 'Preferred payment method is required' }),
  paymentTerms: z.string().min(1, { message: 'Payment terms are required' }),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  projectId: string;
  projectTitle: string;
  clientName: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  projectId, 
  projectTitle, 
  clientName,
  onSubmitSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [priceType, setPriceType] = useState<'fixed' | 'estimated' | 'day_rate'>('fixed');
  const [quoteFiles, setQuoteFiles] = useState<UploadedFile[]>([]);
  
  const { submitQuote, isSubmitting } = useQuoteSubmission({ 
    projectId, 
    clientId: user?.id || ''
  });
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      priceType: 'fixed',
      fixedPrice: '',
      estimatedPrice: '',
      dayRate: '',
      description: '',
      estimatedDuration: '',
      durationUnit: 'days',
      preferredPaymentMethod: '',
      paymentTerms: '',
    },
  });

  // Watch for price type changes to update UI
  const watchPriceType = form.watch('priceType');
  
  React.useEffect(() => {
    setPriceType(watchPriceType);
  }, [watchPriceType]);

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      // Format the quote data based on the form inputs
      const quoteData = {
        fixed_price: data.priceType === 'fixed' ? data.fixedPrice : undefined,
        estimated_price: data.priceType === 'estimated' ? data.estimatedPrice : undefined,
        day_rate: data.priceType === 'day_rate' ? data.dayRate : undefined,
        description: data.description,
        available_start_date: data.availableStartDate ? format(data.availableStartDate, 'yyyy-MM-dd') : undefined,
        estimated_duration: data.estimatedDuration,
        duration_unit: data.durationUnit,
        preferred_payment_method: data.preferredPaymentMethod,
        payment_terms: data.paymentTerms,
        quote_files: quoteFiles.length > 0 ? quoteFiles : undefined,
      };
      
      const success = await submitQuote(quoteData);
      
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

  const handleQuoteFilesUploaded = (files: UploadedFile[]) => {
    setQuoteFiles(files);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Project: {projectTitle}</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Client: {clientName}
          </p>
          <p className="text-sm text-muted-foreground">
            Provide details of your proposal to the client
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="priceType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Price Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed Price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="estimated" id="estimated" />
                    <Label htmlFor="estimated">Estimated Price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="day_rate" id="day_rate" />
                    <Label htmlFor="day_rate">Day Rate</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select your preferred pricing approach for this project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {priceType === 'fixed' && (
          <FormField
            control={form.control}
            name="fixedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fixed Price (£)</FormLabel>
                <FormControl>
                  <Input placeholder="£0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the total fixed price for this project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {priceType === 'estimated' && (
          <FormField
            control={form.control}
            name="estimatedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Price (£)</FormLabel>
                <FormControl>
                  <Input placeholder="£0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Enter an estimated price range for this project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {priceType === 'day_rate' && (
          <FormField
            control={form.control}
            name="dayRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day Rate (£)</FormLabel>
                <FormControl>
                  <Input placeholder="£0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your day rate for this project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="availableStartDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Available to Start On</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When can you start working on this project?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Duration</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="e.g. 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="durationUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="preferredPaymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Payment Method</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Bank Transfer, PayPal" {...field} />
              </FormControl>
              <FormDescription>
                How would you prefer to be paid for this project?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Payment on completion, 50% upfront" {...field} />
              </FormControl>
              <FormDescription>
                What are your payment terms for this project?
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
        
        <div className="space-y-4">
          <FormLabel>Quote Documents</FormLabel>
          <FileUpload 
            onFilesUploaded={handleQuoteFilesUploaded}
            existingFiles={quoteFiles}
          />
          <FormDescription>
            Upload any formal quote documents or additional terms
          </FormDescription>
        </div>
        
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
