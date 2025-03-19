
import React from 'react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { UploadedFile } from '@/components/projects/file-upload/types';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, FileImage, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allowedFileTypes } from '@/components/projects/file-upload/utils';

interface QuoteFilesProps {
  quoteFiles: UploadedFile[];
  onQuoteFilesUploaded: (files: UploadedFile[]) => void;
}

const QuoteFiles: React.FC<QuoteFilesProps> = ({ quoteFiles, onQuoteFilesUploaded }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;

    // Filter out invalid file types
    const validFiles = Array.from(newFiles).filter(file => {
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

    if (validFiles.length === 0) return;

    // Start upload process automatically
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedItems: UploadedFile[] = [];
    let completedUploads = 0;
    
    for (const file of validFiles) {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      try {
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
      } catch (error) {
        console.error('Exception during file upload:', error);
        toast({
          title: "Upload error",
          description: `An error occurred uploading ${file.name}`,
          variant: "destructive"
        });
      }
      
      completedUploads++;
      setUploadProgress(Math.round((completedUploads / validFiles.length) * 100));
    }
    
    setIsUploading(false);
    
    // Combine with existing files
    const allUploadedFiles = [...quoteFiles, ...uploadedItems];
    onQuoteFilesUploaded(allUploadedFiles);
    
    if (uploadedItems.length > 0) {
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedItems.length} file(s)`,
      });
    }
    
    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    const fileToRemove = quoteFiles[index];
    const updatedFiles = quoteFiles.filter((_, i) => i !== index);
    onQuoteFilesUploaded(updatedFiles);
    
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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <FormLabel>Quote Documents</FormLabel>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="quote-file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="quote-file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, Word, Excel, Images, DWG (MAX. 10MB)
            </p>
          </div>
        </label>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-center mt-1">Uploading: {uploadProgress}%</p>
        </div>
      )}

      {/* Already uploaded files */}
      {quoteFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {quoteFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-100">
                <div className="flex items-center space-x-2">
                  <span>{getFileIcon(file.type)}</span>
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
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <FormDescription>
        Upload any formal quote documents or additional terms
      </FormDescription>
    </div>
  );
};

export default QuoteFiles;
