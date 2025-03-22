
export { useVerification } from './useVerification';
export { useVerificationSetup } from './useVerificationSetup';
export { useDocumentUpload } from './useDocumentUpload';
export { useDocumentDeletion } from './useDocumentDeletion';
export { 
  setupVerification,
  fetchVerificationStatus,
  uploadVerificationDocument,
  deleteVerificationDocument,
  isUserVerified,
  getUserVerificationStatus
} from './services';
export type { VerificationData, UseVerificationResult } from './types';
