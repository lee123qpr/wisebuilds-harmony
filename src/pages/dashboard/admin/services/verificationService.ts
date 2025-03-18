
import { supabase } from '@/integrations/supabase/client';
import { Verification } from '../types';

// Fetch all verification requests from the database
export const fetchAllVerifications = async (): Promise<Verification[]> => {
  console.log('Fetching verification requests...');
  
  const { data, error } = await supabase
    .from('freelancer_verification')
    .select('*');

  if (error) {
    console.error('Error fetching verification data:', error);
    throw error;
  }
  
  console.log('Found verification records:', data?.length || 0);
  return data || [];
};

// Get user information for a verification record
export const getUserInfoForVerification = async (userId: string): Promise<{
  user_email: string;
  user_full_name: string;
}> => {
  try {
    console.log('Fetching user data for:', userId);
    
    // Instead of directly querying auth.users, use the freelancer_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('email, display_name, first_name, last_name')
      .eq('id', userId)
      .single();
    
    if (profileError || !profileData) {
      console.error('Error fetching user profile data:', profileError);
      return {
        user_email: 'Unknown',
        user_full_name: 'Unknown'
      };
    }
    
    // Construct the full name from available data
    const fullName = profileData.display_name || 
      (profileData.first_name && profileData.last_name ? 
        `${profileData.first_name} ${profileData.last_name}` : 'Unknown');
    
    return {
      user_email: profileData.email || 'Unknown',
      user_full_name: fullName
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      user_email: 'Error fetching',
      user_full_name: 'Unknown'
    };
  }
};

// Get signed URL for a document
export const getDocumentSignedUrl = async (documentPath: string): Promise<string | null> => {
  try {
    console.log('Getting signed URL for:', documentPath);
    const { data, error } = await supabase.storage
      .from('id-documents')
      .createSignedUrl(documentPath, 60); // 1 minute expiry
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    console.log('Signed URL created:', data.signedUrl);
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
};

// Update verification status
export const updateVerification = async (
  verificationId: string, 
  status: 'approved' | 'rejected',
  adminNotes: string
): Promise<void> => {
  console.log('Updating verification status to:', status);
  
  const { error } = await supabase
    .from('freelancer_verification')
    .update({
      verification_status: status,
      admin_notes: adminNotes,
      verified_at: new Date().toISOString(),
      verified_by: (await supabase.auth.getSession()).data.session?.user.id
    })
    .eq('id', verificationId);
  
  if (error) {
    console.error('Error updating verification status:', error);
    throw error;
  }
  
  console.log('Verification status updated successfully');
};
