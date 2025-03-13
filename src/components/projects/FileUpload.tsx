
import React, { useState } from 'react';
import { Upload, File, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UploadedFile = {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
};

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, existingFiles = [] }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Allowed file types
  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/msword', // doc
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'application/vnd.autocad.dwg', // dwg
    'application/acad', // dwg alternative
    'image/vnd.dwg', // dwg alternative
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles = Array.from(e.target.files);
    
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
  
  // Format file size
  const formatFileSize = (size: number) => {
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon
  const getFileIcon = (file: File | UploadedFile) => {
    if (file.type.startsWith('image/')) return '🖼️';
    else if (file.type.includes('pdf')) return '📄';
    else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return '📝';
    else if (file.type.includes('sheet') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) return '📊';
    else if (file.type.includes('dwg') || file.name.endsWith('.dwg')) return '📐';
    return '📎';
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
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

      {/* Selected files waiting to be uploaded */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                <div className="flex items-center space-x-2">
                  <span>{getFileIcon(file)}</span>
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFiles([])} 
              disabled={isUploading}
            >
              Clear All
            </Button>
            <Button 
              size="sm" 
              onClick={uploadFiles} 
              disabled={isUploading}
              className="flex items-center space-x-1"
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center mt-1">{uploadProgress}% complete</p>
            </div>
          )}
        </div>
      )}

      {/* Already uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-100">
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
                  onClick={() => removeUploadedFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
