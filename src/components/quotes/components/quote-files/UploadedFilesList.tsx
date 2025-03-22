import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadedFile } from '@/components/projects/file-upload/types';
import { FileText, FileImage, X, Check } from 'lucide-react';
import { formatFileSize, getFileIcon } from '../file-upload/utils';

interface UploadedFilesListProps {
  files: UploadedFile[];
  onRemoveFile: (index: number) => void;
}

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Uploaded Files</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-100">
            <div className="flex items-center space-x-2">
              <span>
                {getFileIcon(file.type) === 'image' ? (
                  <FileImage className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </span>
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
              onClick={() => onRemoveFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedFilesList;
