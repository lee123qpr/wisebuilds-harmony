
import React from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentUploadSectionProps {
  setupComplete: boolean;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  setupComplete,
  isUploading,
  onFileSelected,
}) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please upload a JPEG, PNG or PDF file.',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
        });
        return;
      }
      
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      onFileSelected(file);
    }
  };

  return (
    <div className="space-y-4">
      {!setupComplete && (
        <Alert variant="default" className="bg-amber-50 border-amber-300 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertDescription className="text-amber-800">
            Setting up verification system. This may take a moment.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="id-document"
          onChange={handleFileChange}
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          disabled={isUploading || !setupComplete}
        />
        <label
          htmlFor="id-document"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {!setupComplete ? (
            <Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
          )}
          <p className="text-sm text-gray-600 font-medium">
            {!setupComplete 
              ? 'Setting up verification system...' 
              : 'Click to upload your ID document'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG, PNG or PDF (max. 5MB)
          </p>
          <p className="text-xs text-orange-500 mt-1">
            UK or Ireland documents only
          </p>
        </label>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
