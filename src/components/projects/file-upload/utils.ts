
import { UploadedFile } from './types';

// Allowed file types
export const allowedFileTypes = [
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

// Format file size
export const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B';
  else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  else return (size / (1024 * 1024)).toFixed(1) + ' MB';
};

// Get file icon
export const getFileIcon = (file: File | UploadedFile) => {
  if (file.type.startsWith('image/')) return '🖼️';
  else if (file.type.includes('pdf')) return '📄';
  else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return '📝';
  else if (file.type.includes('excel') || file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) return '📊';
  else if (file.type.includes('dwg') || file.name.endsWith('.dwg')) return '📐';
  return '📎';
};
