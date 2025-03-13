
import React from 'react';
import { FileText, FileImage, X, Upload } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from './constants';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from './schema';

interface DocumentUploadProps {
  form: UseFormReturn<ProjectFormValues>;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  form, 
  selectedFiles, 
  setSelectedFiles 
}) => {
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    let hasInvalidFile = false;
    let errorMessage = '';

    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        hasInvalidFile = true;
        errorMessage = `File ${file.name} exceeds the 10MB limit`;
        return;
      }

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        hasInvalidFile = true;
        errorMessage = `File ${file.name} is not a supported file type`;
        return;
      }

      newFiles.push(file);
    });

    if (hasInvalidFile) {
      toast({
        variant: 'destructive',
        title: 'Invalid file',
        description: errorMessage,
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <FormField
      control={form.control}
      name="documents"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Documents</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, DWG, JPG, PNG, XLSX (MAX. 10MB)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.dwg,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                </label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.type)}
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload key project documents here
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
