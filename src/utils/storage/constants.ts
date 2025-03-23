
/**
 * Enum of available storage buckets
 */
export enum StorageBucket {
  PROJECTS = 'project-documents',
  ATTACHMENTS = 'attachments',
  AVATARS = 'avatar', // Changed to be more generic, will be resolved during runtime
  VERIFICATION = 'verification_documents'
}
