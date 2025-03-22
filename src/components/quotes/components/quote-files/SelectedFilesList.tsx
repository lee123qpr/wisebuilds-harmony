
import React from 'react';
import { formatFileSize } from '../file-upload/fileUtils';

interface SelectedFilesListProps {
  selectedFiles: File[];
  isUploading: boolean;
  onRemoveFile: (index: number) => void;
  onClearAll: () => void;
  onUpload: () => void;
}

const SelectedFilesList: React.FC<SelectedFilesListProps> = ({
  selectedFiles,
  isUploading,
  onRemoveFile,
  onClearAll,
  onUpload
}) => {
  if (selectedFiles.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Selected Files</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {selectedFiles.map((file, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between bg-gray-50 p-2 rounded border"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({formatFileSize(file.size)})
              </span>
            </div>
            <button 
              className="text-gray-500 hover:text-red-500"
              onClick={() => onRemoveFile(index)}
              disabled={isUploading}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
          onClick={onClearAll}
          disabled={isUploading}
        >
          Clear All
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  );
};

export default SelectedFilesList;
