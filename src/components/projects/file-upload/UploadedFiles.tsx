
import React from 'react';
import { UploadedFile } from './types';
import UploadedFileItem from './UploadedFileItem';

interface UploadedFilesProps {
  files: UploadedFile[];
  onRemoveFile: (index: number) => void;
}

const UploadedFiles: React.FC<UploadedFilesProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Uploaded Files</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <UploadedFileItem 
            key={index} 
            file={file} 
            onRemove={() => onRemoveFile(index)} 
          />
        ))}
      </div>
    </div>
  );
};

export default UploadedFiles;
