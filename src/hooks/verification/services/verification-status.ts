
import { supabase } from '@/integrations/supabase/client';
import { VerificationData } from '../types';
import { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';
import { mapDatabaseStatusToVerificationStatus } from './status-utils';

export const fetchVerificationStatus = async (): Promise<VerificationData | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return null;
    
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error in fetchVerificationStatus:', error);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in fetchVerificationStatus:', error);
    return null;
  }
};

export const deleteVerificationDocument = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return false;
    
    const { data: verificationData, error: fetchError } = await supabase
      .from('freelancer_verification')
      .select('document_path')
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (fetchError || !verificationData?.document_path) {
      console.error('Error fetching document path:', fetchError);
      return false;
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('verification_documents')
      .remove([verificationData.document_path]);
    
    if (storageError) {
      console.error('Error deleting document from storage:', storageError);
      return false;
    }
    
    // Update the verification record
    const { error: updateError } = await supabase
      .from('freelancer_verification')
      .update({
        document_path: null,
        document_name: null,
        document_size: null,
        document_type: null,
        verification_status: 'not_submitted',
        admin_notes: null,
        submitted_at: null,
        verified_at: null
      })
      .eq('user_id', user.user.id);
    
    if (updateError) {
      console.error('Error updating verification record:', updateError);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteVerificationDocument:', error);
    return false;
  }
};

export const isUserVerified = async (): Promise<boolean> => {
  try {
    const verificationData = await fetchVerificationStatus();
    if (!verificationData) return false;
    
    return verificationData.verification_status === 'approved';
  } catch (error) {
    console.error('Error checking user verification status:', error);
    return false;
  }
};

export const getUserVerificationStatus = async (): Promise<VerificationStatus> => {
  try {
    const verificationData = await fetchVerificationStatus();
    if (!verificationData) return 'not_submitted';
    
    return mapDatabaseStatusToVerificationStatus(verificationData.verification_status);
  } catch (error) {
    console.error('Error getting user verification status:', error);
    return 'not_submitted';
  }
};

export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return false;
    
    // Check if user exists in freelancer_profiles
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking if user is freelancer:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isUserFreelancer:', error);
    return false;
  }
};
