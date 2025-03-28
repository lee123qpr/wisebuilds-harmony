
// Define all storage bucket names in one place for consistency
export enum StorageBucket {
  AVATARS = 'freelancer-avatars',
  PROJECTS = 'project-documents',
  VERIFICATION = 'verification-documents'
}

// Export upload function from the supabaseStorage utility
export { uploadFile, removeFile, checkBucketAccess } from './supabaseStorage';
