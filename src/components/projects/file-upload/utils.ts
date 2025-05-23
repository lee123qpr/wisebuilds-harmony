
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
  'application/octet-stream', // For DWG files
  'application/acad',         // Another DWG MIME type
  'image/vnd.dwg',            // Another DWG MIME type
  'application/dwg',          // Another DWG MIME type
  'application/x-dwg'         // Another DWG MIME type
];

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Return a React element for the file icon
export const getFileIcon = (file: File | { type: string, name: string }): React.ReactNode => {
  const fileType = file.type;
  const fileName = file.name;
  
  // Helper function to check if it's a DWG file
  const isDwgFile = () => fileName.toLowerCase().endsWith('.dwg');
  
  if (fileType.includes('image')) {
    return React.createElement(FileImageIcon, { className: "h-4 w-4" });
  } else if (fileType.includes('pdf')) {
    return React.createElement(FileTextIcon, { className: "h-4 w-4" });
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return React.createElement(FileSpreadsheetIcon, { className: "h-4 w-4" });
  } else if (isDwgFile() || fileType.includes('dwg') || fileType.includes('acad')) {
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

// Helper function to check if a file is valid
export const isValidFile = (file: File): boolean => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return false;
  }
  
  // Check known MIME types
  if (allowedFileTypes.includes(file.type)) {
    return true;
  }
  
  // Special handling for DWG files which may have inconsistent MIME types
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (fileExtension === 'dwg') {
    return true;
  }
  
  return false;
};

// Generate appropriate file path based on user type and context
export const generateFilePath = (file: File, context: {
  projectId?: string;
  quoteId?: string;
  userId: string;
  userType?: string;
}): string => {
  const { projectId, quoteId, userId, userType } = context;
  const fileExt = file.name.split('.').pop() || '';
  const uniquePart = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  
  // Create organized folder structure - always start with userId for RLS policies
  let basePath = `${userId}`;
  
  if (userType === 'admin') {
    basePath += '/admin';
  } else if (quoteId) {
    // For quote-related files
    basePath += `/quotes/${quoteId}`;
  } else if (projectId) {
    // For project-related files
    basePath += `/projects/${projectId}`;
  }
  
  return `${basePath}/${uniquePart}.${fileExt}`;
};
