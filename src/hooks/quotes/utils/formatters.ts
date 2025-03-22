
import { QuoteWithFreelancer } from '@/types/quotes';

/**
 * Formats quotes with freelancer profile data
 */
export const formatQuotesWithProfiles = (
  quotes: any[], 
  profileMap: Record<string, any>
): QuoteWithFreelancer[] => {
  if (!quotes || !Array.isArray(quotes)) {
    console.warn('Invalid quotes data received for formatting', quotes);
    return [];
  }
  
  return quotes.map(quote => {
    // Safety checks for null/undefined values
    if (!quote) return null;
    
    const freelancerProfile = profileMap[quote.freelancer_id] || {};
    
    console.log('Formatting quote for freelancer:', quote.freelancer_id, 'with profile:', freelancerProfile);
    console.log('Project data in formatter:', quote.project || quote.projects);
    
    // Extract project data - account for both 'project' and 'projects' field naming from different queries
    const project = quote.project || quote.projects || {};
    
    return {
      ...quote,
      status: quote.status as QuoteWithFreelancer['status'],
      duration_unit: quote.duration_unit as QuoteWithFreelancer['duration_unit'],
      quote_files: Array.isArray(quote.quote_files) ? quote.quote_files : [],
      project: {
        title: project.title || 'Untitled Project',
        budget: project.budget || '',
        status: project.status || '',
        role: project.role || 'Not specified',  // Make sure to include the role
      },
      freelancer_profile: {
        first_name: freelancerProfile.first_name || '',
        last_name: freelancerProfile.last_name || '',
        display_name: freelancerProfile.display_name || '',
        profile_photo: freelancerProfile.profile_photo || '',
        job_title: freelancerProfile.job_title || '',
        rating: freelancerProfile.rating || 0,
        location: freelancerProfile.location || '',
        verified: freelancerProfile.verified || false,
      }
    };
  }).filter(Boolean) as QuoteWithFreelancer[];
};

/**
 * Helper function to check if a freelancer profile is empty
 */
export const isEmptyFreelancerProfile = (profile: any): boolean => {
  if (!profile) return true;
  
  // Check if all essential fields are empty
  return (
    (!profile.first_name || profile.first_name.trim() === '') &&
    (!profile.last_name || profile.last_name.trim() === '') &&
    (!profile.display_name || profile.display_name.trim() === '')
  );
};
