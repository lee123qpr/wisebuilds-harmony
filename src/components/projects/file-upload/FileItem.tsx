
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FileItemProps } from './types';
import { getFileIcon, formatFileSize } from './utils';

const FileItem: React.FC<FileItemProps> = ({ file, onRemove, isUploading }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
      <div className="flex items-center space-x-2">
        <span>{getFileIcon(file)}</span>
        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRemove}
        disabled={isUploading}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileItem;
