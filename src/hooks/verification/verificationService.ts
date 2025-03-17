
// Main verification service file - exports all services
import { mapStatusToVerificationStatus } from './utils/status-utils';
import { isUserFreelancer } from './services/user-verification';
import { fetchVerificationStatus } from './services/verification-status';
import { uploadVerificationDocument } from './services/document-upload';
import { deleteVerificationDocument } from './services/document-deletion';
import type { VerificationData } from './types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export {
  mapStatusToVerificationStatus,
  isUserFreelancer,
  fetchVerificationStatus,
  uploadVerificationDocument,
  deleteVerificationDocument
};

export type {
  VerificationData,
  VerificationStatus
};
