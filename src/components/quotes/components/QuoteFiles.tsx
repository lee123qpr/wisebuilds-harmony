
import React from 'react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import FileUpload from '@/components/projects/file-upload/FileUpload';
import { UploadedFile } from '@/components/projects/file-upload/types';

interface QuoteFilesProps {
  quoteFiles: UploadedFile[];
  onQuoteFilesUploaded: (files: UploadedFile[]) => void;
}

const QuoteFiles: React.FC<QuoteFilesProps> = ({ quoteFiles, onQuoteFilesUploaded }) => {
  return (
    <div className="space-y-4">
      <FormLabel>Quote Documents</FormLabel>
      <FileUpload 
        onFilesUploaded={onQuoteFilesUploaded}
        existingFiles={quoteFiles}
      />
      <FormDescription>
        Upload any formal quote documents or additional terms
      </FormDescription>
    </div>
  );
};

export default QuoteFiles;
