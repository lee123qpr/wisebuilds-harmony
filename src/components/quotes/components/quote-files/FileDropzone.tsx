
import React from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ isUploading, onFileSelect }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        multiple
        onChange={onFileSelect}
        className="hidden"
        id="quote-file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="quote-file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload className="w-8 h-8 mb-3 text-gray-500" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          PDF, Word, Excel, Images, DWG (MAX. 10MB)
        </p>
      </label>
    </div>
  );
};

export default FileDropzone;
