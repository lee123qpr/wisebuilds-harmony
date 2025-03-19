
import { QuoteWithFreelancer } from '@/types/quotes';

/**
 * Formats quotes with freelancer profile data
 */
export const formatQuotesWithProfiles = (
  quotes: any[], 
  profileMap: Record<string, any>
): QuoteWithFreelancer[] => {
  return quotes.map(quote => {
    const freelancerProfile = profileMap[quote.freelancer_id] || {};
    
    return {
      ...quote,
      status: quote.status as QuoteWithFreelancer['status'],
      duration_unit: quote.duration_unit as QuoteWithFreelancer['duration_unit'],
      quote_files: Array.isArray(quote.quote_files) ? quote.quote_files : [],
      freelancer_profile: {
        first_name: freelancerProfile.first_name,
        last_name: freelancerProfile.last_name,
        display_name: freelancerProfile.display_name,
        profile_photo: freelancerProfile.profile_photo,
        job_title: freelancerProfile.job_title,
        rating: freelancerProfile.rating,
      }
    };
  });
};

/**
 * Formats all quotes data directly from a query including freelancer data
 */
export const formatDirectQuotesWithFreelancers = (
  quotesData: any[]
): QuoteWithFreelancer[] => {
  return quotesData.map(quote => {
    const freelancerProfile = quote.freelancer || {};
    
    return {
      ...quote,
      status: quote.status as QuoteWithFreelancer['status'],
      duration_unit: quote.duration_unit as QuoteWithFreelancer['duration_unit'],
      quote_files: Array.isArray(quote.quote_files) ? quote.quote_files : [],
      freelancer_profile: {
        id: freelancerProfile.id,
        first_name: freelancerProfile.first_name || '',
        last_name: freelancerProfile.last_name || '',
        display_name: freelancerProfile.display_name || '',
        profile_photo: freelancerProfile.profile_photo || '',
        job_title: freelancerProfile.job_title || '',
        rating: freelancerProfile.rating || 0,
      }
    };
  });
};
