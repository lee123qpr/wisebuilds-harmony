
/**
 * Validates if a file is of an allowed type
 */
export const validateFile = (file: File): boolean => {
  const allowedFileTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf'
  ];
  
  return allowedFileTypes.includes(file.type) || file.name.endsWith('.dwg');
};
