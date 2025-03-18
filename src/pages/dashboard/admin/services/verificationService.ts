
import { supabase } from '@/integrations/supabase/client';

export const fetchAllVerifications = async () => {
  try {
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching verifications:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in fetchAllVerifications:', error);
    throw error;
  }
};

export const getUserInfoForVerification = async (userId: string) => {
  try {
    // Get user info from freelancer_profiles instead of auth.users
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('email, full_name')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user info:', error);
      return {
        user_email: 'Not available',
        user_full_name: 'Unknown User'
      };
    }
    
    if (!data) {
      // Try to get info from user metadata as fallback
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        return {
          user_email: 'Not available',
          user_full_name: 'Unknown User'
        };
      }
      
      return {
        user_email: userData.user.email || 'No email provided',
        user_full_name: userData.user.user_metadata?.full_name || 'Unknown User'
      };
    }
    
    return {
      user_email: data.email || 'No email provided',
      user_full_name: data.full_name || 'Unknown User'
    };
  } catch (error) {
    console.error('Exception in getUserInfoForVerification:', error);
    return {
      user_email: 'Error fetching',
      user_full_name: 'Error fetching'
    };
  }
};

export const getDocumentSignedUrl = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('verification_documents')
      .createSignedUrl(path, 60); // 60 seconds expiry
    
    if (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Exception in getDocumentSignedUrl:', error);
    throw error;
  }
};

export const updateVerification = async (
  verificationId: string, 
  status: 'approved' | 'rejected', 
  adminNotes: string
) => {
  try {
    const { data, error } = await supabase
      .from('freelancer_verification')
      .update({
        verification_status: status,
        verified_at: new Date().toISOString(),
        admin_notes: adminNotes
      })
      .eq('id', verificationId)
      .select();
    
    if (error) {
      console.error('Error updating verification:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in updateVerification:', error);
    throw error;
  }
};
