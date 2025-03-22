
import { useState, useEffect } from 'react';
import { fetchAllVerifications, getUserInfoForVerification } from '../services/verificationService';

export interface Verification {
  id: string;
  user_id: string;
  document_path: string | null;
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  submitted_at: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  document_name: string | null;
  document_type: string | null;
  document_size: number | null;
  user_email: string;
  user_full_name: string;
}

export const useVerifications = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadVerifications = async () => {
      try {
        setLoading(true);
        const verificationData = await fetchAllVerifications();
        
        // Enhance verification data with user information
        const enhancedVerifications = await Promise.all(
          verificationData.map(async (verification) => {
            const userInfo = await getUserInfoForVerification(verification.user_id);
            return {
              ...verification,
              ...userInfo
            };
          })
        );
        
        setVerifications(enhancedVerifications as Verification[]);
      } catch (err: any) {
        console.error('Error loading verifications:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadVerifications();
  }, []);

  const refreshVerifications = async () => {
    setLoading(true);
    try {
      const verificationData = await fetchAllVerifications();
      
      // Enhance verification data with user information
      const enhancedVerifications = await Promise.all(
        verificationData.map(async (verification) => {
          const userInfo = await getUserInfoForVerification(verification.user_id);
          return {
            ...verification,
            ...userInfo
          };
        })
      );
      
      setVerifications(enhancedVerifications as Verification[]);
      setError(null);
    } catch (err: any) {
      console.error('Error refreshing verifications:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { verifications, loading, error, refreshVerifications };
};
