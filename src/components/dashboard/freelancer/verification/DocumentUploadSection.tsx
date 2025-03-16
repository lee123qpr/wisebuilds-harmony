
import React from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      
      onFileSelected(file);
    }
  };

  return (
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
        <p className="text-xs text-gray-500 mt-1">
          You must be registered as a freelancer to upload documents
        </p>
      </label>
    </div>
  );
};

export default DocumentUploadSection;
