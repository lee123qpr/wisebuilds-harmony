
import React from 'react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { UploadedFile } from '@/components/projects/file-upload/types';
import FileDropzone from './FileDropzone';
import SelectedFilesList from './SelectedFilesList';
import UploadedFilesList from './UploadedFilesList';
import { useQuoteFiles } from './useQuoteFiles';

interface QuoteFilesProps {
  quoteFiles: UploadedFile[];
  onQuoteFilesUploaded: (files: UploadedFile[]) => void;
  projectId?: string;
  quoteId?: string;
}

const QuoteFilesComponent: React.FC<QuoteFilesProps> = ({ 
  quoteFiles, 
  onQuoteFilesUploaded, 
  projectId, 
  quoteId 
}) => {
  const {
    isUploading,
    uploadProgress,
    selectedFiles,
    handleFileChange,
    handleUpload,
    removeSelectedFile,
    removeFile
  } = useQuoteFiles({
    quoteFiles,
    onQuoteFilesUploaded,
    projectId,
    quoteId
  });

  return (
    <div className="space-y-4">
      <FormLabel>Quote Documents</FormLabel>
      
      <FileDropzone 
        isUploading={isUploading}
        onFileSelect={handleFileChange}
      />

      {/* Display selected files waiting to be uploaded */}
      <SelectedFilesList 
        selectedFiles={selectedFiles}
        isUploading={isUploading}
        onRemoveFile={removeSelectedFile}
        onClearAll={() => selectedFiles.length > 0 && selectedFiles.forEach((_, i) => removeSelectedFile(i))}
        onUpload={handleUpload}
      />

      {isUploading && (
        <UploadProgressBar progress={uploadProgress} />
      )}

      <UploadedFilesList 
        files={quoteFiles}
        onRemoveFile={removeFile}
      />

      <FormDescription>
        Upload any formal quote documents or additional terms
      </FormDescription>
    </div>
  );
};

export default QuoteFilesComponent;

// Import the UploadProgressBar component
import UploadProgressBar from '../file-upload/UploadProgressBar';
