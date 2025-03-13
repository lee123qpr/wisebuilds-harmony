
import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadButtonsProps } from './types';

const UploadButtons: React.FC<UploadButtonsProps> = ({ 
  onClearAll, 
  onUpload, 
  isUploading, 
  fileCount 
}) => {
  if (fileCount === 0) return null;
  
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClearAll} 
        disabled={isUploading}
      >
        Clear All
      </Button>
      <Button 
        size="sm" 
        onClick={onUpload} 
        disabled={isUploading}
        className="flex items-center space-x-1"
      >
        {isUploading ? 'Uploading...' : 'Upload Files'}
      </Button>
    </div>
  );
};

export default UploadButtons;
