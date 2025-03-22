
import { allowedFileTypes } from '@/components/projects/file-upload/utils';

/**
 * Validates if a file is of an allowed type
 */
export const validateFile = (file: File): boolean => {
  return allowedFileTypes.includes(file.type) || file.name.endsWith('.dwg');
};
