
import { FileIcon, FileImageIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';

// Allowed file types for uploading
export const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/octet-stream' // For DWG files
];

export const getFileIcon = (file: File | { type: string, name: string }) => {
  const fileType = file.type;
  const fileName = file.name;
  
  if (fileType.includes('image')) {
    return <FileImageIcon className="h-4 w-4" />;
  } else if (fileType.includes('pdf')) {
    return <FileTextIcon className="h-4 w-4" />;
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return <FileSpreadsheetIcon className="h-4 w-4" />;
  } else if (fileName.endsWith('.dwg')) {
    return <FileIcon className="h-4 w-4" />;
  } else {
    return <FileTextIcon className="h-4 w-4" />;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};
