
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useQuoteSubmission } from '@/hooks/quotes/useQuoteSubmission';
import { useAuth } from '@/context/AuthContext';
import { UploadedFile } from '@/components/projects/file-upload/types';

// Import quote form components
import ProjectInfo from './components/ProjectInfo';
import PriceTypeSelector from './components/PriceTypeSelector';
import PriceFields from './components/PriceFields';
import AvailableStartDate from './components/AvailableStartDate';
import DurationFields from './components/DurationFields';
import PaymentFields from './components/PaymentFields';
import DescriptionField from './components/DescriptionField';
import QuoteFiles from './components/QuoteFiles';
import FormActions from './components/FormActions';

// Import schema
import { quoteFormSchema, QuoteFormValues } from './schema/quoteFormSchema';

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionDate, setSubmissionDate] = useState<string>('');
  
  const { submitQuote, isSubmitting, isSuccess } = useQuoteSubmission({ 
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
  
  useEffect(() => {
    setPriceType(watchPriceType);
  }, [watchPriceType]);
  
  // Handle successful submission
  useEffect(() => {
    if (isSuccess) {
      setIsSubmitted(true);
      setSubmissionDate(format(new Date(), 'MMMM d, yyyy h:mm a'));
      onSubmitSuccess();
    }
  }, [isSuccess, onSubmitSuccess]);

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
      
      console.log('Submitting quote data:', quoteData);
      
      submitQuote(quoteData);
    } catch (error) {
      console.error('Error preparing quote data:', error);
      toast({
        title: 'Failed to submit quote',
        description: 'Please check the form inputs and try again',
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
        <ProjectInfo 
          projectTitle={projectTitle} 
          clientName={clientName}
          quoteSubmitted={isSubmitted}
          submissionDate={submissionDate}
        />
        
        <PriceTypeSelector form={form} />
        
        <PriceFields form={form} priceType={priceType} />
        
        <AvailableStartDate form={form} />
        
        <DurationFields form={form} />
        
        <PaymentFields form={form} />
        
        <DescriptionField form={form} />
        
        <QuoteFiles 
          quoteFiles={quoteFiles}
          onQuoteFilesUploaded={handleQuoteFilesUploaded}
        />
        
        <FormActions 
          isSubmitting={isSubmitting} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
};

export default QuoteForm;
