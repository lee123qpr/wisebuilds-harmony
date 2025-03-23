
/**
 * Generates a unique file path for uploads
 */
export const generateFilePath = (
  file: File,
  userId: string,
  bucket: string,
  folder?: string
): string => {
  const fileExt = file.name.split('.').pop() || '';
  const uniquePart = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  
  // Create organized folder structure
  // Always start with userId for RLS policies to work correctly
  let basePath = `${userId}`;
  
  // Add optional folder if provided
  if (folder) {
    basePath += `/${folder}`;
  }
  
  return `${basePath}/${uniquePart}.${fileExt}`;
};
