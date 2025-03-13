
import React from 'react';
import { Upload } from 'lucide-react';
import { DropzoneProps } from './types';

const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, isUploading }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            onFilesSelected(Array.from(e.target.files));
          }
        }}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 font-medium">
          Click to upload project documents
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Support for images, PDF, Word, Excel, DWG, and more
        </p>
      </label>
    </div>
  );
};

export default Dropzone;
