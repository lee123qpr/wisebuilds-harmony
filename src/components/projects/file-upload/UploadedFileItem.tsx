
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { UploadedFileItemProps } from './types';
import { getFileIcon, formatFileSize } from './utils';

const UploadedFileItem: React.FC<UploadedFileItemProps> = ({ file, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-100">
      <div className="flex items-center space-x-2">
        <span>{getFileIcon(file)}</span>
        <a 
          href={file.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
        >
          {file.name}
        </a>
        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
        <Check className="h-3 w-3 text-green-500" />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UploadedFileItem;
