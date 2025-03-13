
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileUploadProps, UploadedFile } from './types';
import Dropzone from './Dropzone';
import FileItem from './FileItem';
import UploadedFileItem from './UploadedFileItem';
import UploadButtons from './UploadButtons';
import UploadProgress from './UploadProgress';
import { allowedFileTypes } from './utils';

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, existingFiles = [] }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelection = (newFiles: File[]) => {
    // Filter out invalid file types
    const validFiles = newFiles.filter(file => {
      const isValid = allowedFileTypes.includes(file.type) || file.name.endsWith('.dwg');
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an allowed file type`,
          variant: "destructive"
        });
      }
      return isValid;
    });
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    
    // Update parent component
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesUploaded(updatedFiles);
    
    // Optionally delete from storage
    if (fileToRemove.path) {
      supabase.storage
        .from('project-documents')
        .remove([fileToRemove.path])
        .then(({ error }) => {
          if (error) {
            console.error('Error removing file:', error);
          }
        });
    }
  };

  const uploadFiles = async () => {
    if (!files.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedItems: UploadedFile[] = [];
    let completedUploads = 0;
    
    for (const file of files) {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}: ${error.message}`,
          variant: "destructive"
        });
        console.error('Error uploading file:', error);
      } else {
        // Get the public URL for the file
        const { data: { publicUrl } } = supabase.storage
          .from('project-documents')
          .getPublicUrl(filePath);
        
        uploadedItems.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          path: filePath
        });
      }
      
      completedUploads++;
      setUploadProgress(Math.round((completedUploads / files.length) * 100));
    }
    
    setIsUploading(false);
    setFiles([]);
    
    // Combine with existing files
    const allUploadedFiles = [...uploadedFiles, ...uploadedItems];
    setUploadedFiles(allUploadedFiles);
    
    // Notify parent component
    onFilesUploaded(allUploadedFiles);
    
    toast({
      title: "Files uploaded",
      description: `Successfully uploaded ${uploadedItems.length} file(s)`,
      variant: "default"
    });
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  return (
    <div className="space-y-4">
      <Dropzone 
        onFilesSelected={handleFileSelection} 
        isUploading={isUploading} 
      />

      {/* Selected files waiting to be uploaded */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <FileItem 
                key={index} 
                file={file} 
                onRemove={() => removeFile(index)} 
                isUploading={isUploading} 
              />
            ))}
          </div>
          <UploadButtons 
            onClearAll={clearAllFiles} 
            onUpload={uploadFiles} 
            isUploading={isUploading} 
            fileCount={files.length} 
          />
          {isUploading && <UploadProgress progress={uploadProgress} />}
        </div>
      )}

      {/* Already uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <UploadedFileItem 
                key={index} 
                file={file} 
                onRemove={() => removeUploadedFile(index)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
