
export { uploadVerificationDocument } from './document-upload';
export { setupVerification, createBucketPolicies } from './verification-setup';
export { 
  fetchVerificationStatus, 
  deleteVerificationDocument,
  isUserVerified,
  getUserVerificationStatus,
  isUserFreelancer
} from './verification-status';
export { getVerificationBucketName } from './storage-utils';
