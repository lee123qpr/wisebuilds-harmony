
/**
 * This file re-exports all verification service functions to maintain backward compatibility
 */
export {
  setupVerification,
  fetchVerificationStatus,
  uploadVerificationDocument,
  deleteVerificationDocument,
  mapDatabaseStatusToVerificationStatus,
  isUserVerified,
  getUserVerificationStatus,
  isUserFreelancer
} from './services';
