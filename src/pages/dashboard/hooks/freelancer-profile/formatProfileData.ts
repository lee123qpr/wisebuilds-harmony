
import { FreelancerEmployer } from '@/types/freelancer';
import { User } from '@supabase/supabase-js';

export function formatProfileData(profileData: any, user: User | null) {
  if (!profileData) {
    return null;
  }
  
  const previousEmployers = Array.isArray(profileData.previous_employers) 
    ? (profileData.previous_employers as any[]).map(emp => ({
        employerName: emp.employerName || '',
        startDate: emp.startDate || '',
        endDate: emp.endDate || null,
        current: emp.current || false,
        position: emp.position || ''
      })) as FreelancerEmployer[]
    : [];
    
  const skills = Array.isArray(profileData.skills) 
    ? profileData.skills as string[] 
    : [];
    
  const qualifications = Array.isArray(profileData.qualifications) 
    ? profileData.qualifications as string[] 
    : [];
    
  const accreditations = Array.isArray(profileData.accreditations) 
    ? profileData.accreditations as string[] 
    : [];
    
  const previousWork = Array.isArray(profileData.previous_work) 
    ? profileData.previous_work as any[] 
    : [];

  const indemnity_insurance = typeof profileData.indemnity_insurance === 'object' 
    ? profileData.indemnity_insurance as { hasInsurance: boolean; coverLevel?: string }
    : { hasInsurance: false };
  
  const fullName = profileData.display_name || 
                  `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
  
  const formattedEmployers = previousEmployers.map(employer => ({
    ...employer,
    startDate: employer.startDate ? new Date(employer.startDate) : new Date(),
    endDate: employer.endDate ? new Date(employer.endDate) : null
  }));
  
  return {
    fullName,
    formattedEmployers,
    skills,
    qualifications,
    accreditations,
    previousWork,
    indemnity_insurance,
    profileData
  };
}

export function formatUserMetadata(user: User | null) {
  if (!user) return null;
  
  const userMetadata = user.user_metadata || {};
  
  const previousEmployers = Array.isArray(userMetadata.previous_employers) 
    ? (userMetadata.previous_employers as any[]).map(emp => ({
        employerName: emp.employerName || '',
        startDate: emp.startDate || '',
        endDate: emp.endDate || null,
        current: emp.current || false,
        position: emp.position || ''
      })) as FreelancerEmployer[]
    : [];
    
  const formattedEmployers = previousEmployers.map(employer => ({
    ...employer,
    startDate: employer.startDate ? new Date(employer.startDate) : new Date(),
    endDate: employer.endDate ? new Date(employer.endDate) : null
  }));
  
  return {
    fullName: userMetadata.full_name || '',
    profession: userMetadata.profession || '',
    previousEmployers: formattedEmployers,
    location: userMetadata.location || '',
    bio: userMetadata.bio || '',
    phoneNumber: userMetadata.phone_number || userMetadata.phone || '',
    website: userMetadata.website || '',
    hourlyRate: userMetadata.hourly_rate || '',
    availability: userMetadata.availability || '',
    skills: userMetadata.skills || [],
    experience: userMetadata.experience || '',
    qualifications: userMetadata.qualifications || [],
    accreditations: userMetadata.accreditations || [],
    indemnity_insurance: {
      hasInsurance: userMetadata.indemnity_insurance?.hasInsurance || false,
      coverLevel: userMetadata.indemnity_insurance?.coverLevel || '',
    },
    previousWork: userMetadata.previous_work || [],
    idVerified: userMetadata.id_verified || false,
    profileImage: userMetadata.profile_image_url || null,
  };
}
