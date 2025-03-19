
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
    
    return {
      ...quote,
      status: quote.status as QuoteWithFreelancer['status'],
      duration_unit: quote.duration_unit as QuoteWithFreelancer['duration_unit'],
      quote_files: Array.isArray(quote.quote_files) ? quote.quote_files : [],
      freelancer_profile: {
        first_name: freelancerProfile.first_name || '',
        last_name: freelancerProfile.last_name || '',
        display_name: freelancerProfile.display_name || '',
        profile_photo: freelancerProfile.profile_photo || '',
        job_title: freelancerProfile.job_title || '',
        rating: freelancerProfile.rating || 0,
      }
    };
  }).filter(Boolean) as QuoteWithFreelancer[];
};
