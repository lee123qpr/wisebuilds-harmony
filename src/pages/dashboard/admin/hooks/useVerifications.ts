
import { useState, useEffect } from 'react';
import { fetchAllVerifications, getUserInfoForVerification } from '../services/verificationService';
import { Verification } from '../types';

export type { Verification };

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
              ...userInfo,
              // Ensure all required fields are present
              verification_status: verification.status,
              id_document_path: verification.document_path
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
            ...userInfo,
            // Ensure all required fields are present
            verification_status: verification.status,
            id_document_path: verification.document_path
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
