
import React from 'react';
import { UploadedFile } from '@/components/projects/file-upload/types';
import QuoteFilesComponent from './quote-files/QuoteFilesComponent';

interface QuoteFilesProps {
  quoteFiles: UploadedFile[];
  onQuoteFilesUploaded: (files: UploadedFile[]) => void;
  projectId?: string;
  quoteId?: string;
}

const QuoteFiles: React.FC<QuoteFilesProps> = (props) => {
  return <QuoteFilesComponent {...props} />;
};

export default QuoteFiles;
