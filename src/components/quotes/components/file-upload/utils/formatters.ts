
import { UploadedFile } from '@/components/projects/file-upload/types';

/**
 * Formats file size from bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Gets the appropriate icon type for a file based on its MIME type
 */
export const getFileIcon = (fileType: string) => {
  if (fileType.includes('image')) return 'image';
  return 'document';
};
