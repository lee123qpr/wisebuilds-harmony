
import React from 'react';
import FileItem from './FileItem';
import UploadButtons from './UploadButtons';
import UploadProgress from './UploadProgress';

interface SelectedFilesProps {
  files: File[];
  isUploading: boolean;
  uploadProgress: number;
  onRemoveFile: (index: number) => void;
  onClearAll: () => void;
  onUpload: () => void;
}

const SelectedFiles: React.FC<SelectedFilesProps> = ({
  files,
  isUploading,
  uploadProgress,
  onRemoveFile,
  onClearAll,
  onUpload
}) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Selected Files</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <FileItem 
            key={index} 
            file={file} 
            onRemove={() => onRemoveFile(index)} 
            isUploading={isUploading} 
          />
        ))}
      </div>
      <UploadButtons 
        onClearAll={onClearAll} 
        onUpload={onUpload} 
        isUploading={isUploading} 
        fileCount={files.length} 
      />
      {isUploading && <UploadProgress progress={uploadProgress} />}
    </div>
  );
};

export default SelectedFiles;
