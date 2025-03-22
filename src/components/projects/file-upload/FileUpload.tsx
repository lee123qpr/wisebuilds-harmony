
import React from 'react';
import Dropzone from './Dropzone';
import SelectedFiles from './SelectedFiles';
import UploadedFiles from './UploadedFiles';
import { FileUploadProps } from './types';
import { useFileUpload } from './useFileUpload';

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesUploaded, 
  existingFiles = [],
  projectId,
  quoteId
}) => {
  const {
    files,
    uploadedFiles,
    isUploading,
    uploadProgress,
    handleFileSelection,
    removeFile,
    removeUploadedFile,
    uploadSelectedFiles,
    clearAllFiles
  } = useFileUpload(existingFiles, onFilesUploaded, projectId, quoteId);

  return (
    <div className="space-y-4">
      <Dropzone 
        onFilesSelected={handleFileSelection} 
        isUploading={isUploading} 
      />

      {/* Selected files waiting to be uploaded */}
      <SelectedFiles
        files={files}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onRemoveFile={removeFile}
        onClearAll={clearAllFiles}
        onUpload={uploadSelectedFiles}
      />

      {/* Already uploaded files */}
      <UploadedFiles
        files={uploadedFiles}
        onRemoveFile={removeUploadedFile}
      />
    </div>
  );
};

export default FileUpload;
