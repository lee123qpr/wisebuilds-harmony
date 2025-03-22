
import React, { useState } from 'react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { UploadedFile } from '@/components/projects/file-upload/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import FileDropzone from './file-upload/FileDropzone';
import UploadProgressBar from './file-upload/UploadProgressBar';
import FileList from './file-upload/FileList';
import { uploadFile, validateFile, removeFileFromStorage } from './file-upload/fileUtils';

interface QuoteFilesProps {
  quoteFiles: UploadedFile[];
  onQuoteFilesUploaded: (files: UploadedFile[]) => void;
  projectId?: string;
  quoteId?: string;
}

const QuoteFiles: React.FC<QuoteFilesProps> = ({ 
  quoteFiles, 
  onQuoteFilesUploaded, 
  projectId, 
  quoteId 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0 || !user) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to upload files",
          variant: "destructive"
        });
      }
      return;
    }

    // Filter out invalid file types
    const validFiles = Array.from(newFiles).filter(file => {
      const isValid = validateFile(file);
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an allowed file type`,
          variant: "destructive"
        });
      }
      return isValid;
    });

    if (validFiles.length === 0) return;

    // Add to selected files instead of uploading immediately
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedItems: UploadedFile[] = [];
    let completedUploads = 0;
    
    const uploadContext = {
      projectId,
      quoteId,
      userId: user.id,
      userType: user.user_metadata?.user_type
    };
    
    for (const file of selectedFiles) {
      try {
        const uploadedFile = await uploadFile(file, uploadContext);
        
        if (uploadedFile) {
          uploadedItems.push(uploadedFile);
        } else {
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Exception during file upload:', error);
        toast({
          title: "Upload error",
          description: `An error occurred uploading ${file.name}`,
          variant: "destructive"
        });
      }
      
      completedUploads++;
      setUploadProgress(Math.round((completedUploads / selectedFiles.length) * 100));
    }
    
    setIsUploading(false);
    setSelectedFiles([]);
    
    // Combine with existing files
    const allUploadedFiles = [...quoteFiles, ...uploadedItems];
    onQuoteFilesUploaded(allUploadedFiles);
    
    if (uploadedItems.length > 0) {
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedItems.length} file(s)`,
      });
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    const fileToRemove = quoteFiles[index];
    const updatedFiles = quoteFiles.filter((_, i) => i !== index);
    onQuoteFilesUploaded(updatedFiles);
    
    // Optionally delete from storage
    if (fileToRemove.path) {
      removeFileFromStorage(fileToRemove.path);
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel>Quote Documents</FormLabel>
      
      <FileDropzone 
        isUploading={isUploading}
        onFileSelect={handleFileChange}
      />

      {/* Display selected files waiting to be uploaded */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                <div className="flex items-center space-x-2">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button 
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => removeSelectedFile(index)}
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
              onClick={() => setSelectedFiles([])}
            >
              Clear All
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </div>
      )}

      {isUploading && <UploadProgressBar progress={uploadProgress} />}

      <FileList 
        files={quoteFiles}
        onRemoveFile={removeFile}
      />

      <FormDescription>
        Upload any formal quote documents or additional terms
      </FormDescription>
    </div>
  );
};

export default QuoteFiles;
