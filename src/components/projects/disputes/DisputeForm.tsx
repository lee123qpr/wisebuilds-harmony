
import React, { useState } from 'react';
import { AlertTriangle, Upload, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from '@/hooks/toast';
import FileUpload from '@/components/projects/file-upload/FileUpload';

interface DisputeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DisputeFormData) => Promise<void>;
  isSubmitting: boolean;
  quoteId: string;
  projectId: string;
  deadlineDate: Date;
}

export interface DisputeFormData {
  reason: string;
  atFault: string;
  evidenceFiles?: any[];
}

const DisputeForm: React.FC<DisputeFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  quoteId,
  projectId,
  deadlineDate
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  
  const form = useForm<DisputeFormData>({
    defaultValues: {
      reason: '',
      atFault: '',
    }
  });
  
  const handleSubmit = async (data: DisputeFormData) => {
    if (data.reason.trim().length === 0) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for the dispute',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await onSubmit({
        ...data,
        evidenceFiles: uploadedFiles
      });
    } catch (error) {
      console.error('Error submitting dispute:', error);
    }
  };
  
  const handleFilesUploaded = (files: any[]) => {
    setUploadedFiles(files);
  };
  
  const deadlineFormatted = format(deadlineDate, 'MMMM d, yyyy');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Submit Dispute Information
          </DialogTitle>
          <DialogDescription>
            Please provide details about the dispute. You have until {deadlineFormatted} to submit your case.
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Both parties have 10 days to submit their case. Admin will review and make a decision within the following 10 days.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reason for Dispute
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain in detail why you're disputing the completion of this project..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="atFault"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Who do you believe is at fault?
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain who you believe is responsible and why..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Supporting Evidence</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload any relevant files (emails, screenshots, photos, documents) to support your case.
              </p>
              <FileUpload
                onFilesUploaded={handleFilesUploaded}
                projectId={projectId}
                quoteId={quoteId}
              />
            </div>
          
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeForm;
