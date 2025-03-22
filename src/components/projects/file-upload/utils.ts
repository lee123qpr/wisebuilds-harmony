
import { FileIcon, FileImageIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';
import React from 'react';

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

// Return a React element for the file icon
export const getFileIcon = (file: File | { type: string, name: string }): React.ReactNode => {
  const fileType = file.type;
  const fileName = file.name;
  
  if (fileType.includes('image')) {
    return React.createElement(FileImageIcon, { className: "h-4 w-4" });
  } else if (fileType.includes('pdf')) {
    return React.createElement(FileTextIcon, { className: "h-4 w-4" });
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return React.createElement(FileSpreadsheetIcon, { className: "h-4 w-4" });
  } else if (fileName.endsWith('.dwg')) {
    return React.createElement(FileIcon, { className: "h-4 w-4" });
  } else {
    return React.createElement(FileTextIcon, { className: "h-4 w-4" });
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};
