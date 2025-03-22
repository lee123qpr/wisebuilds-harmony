
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { QuoteWithFreelancer } from '@/types/quotes';
import { logQuoteFetchDiagnostics, checkAllProjectQuotes } from './diagnostics';
import { buildQuotesQuery, fetchFreelancerProfiles, createProfileMap } from './queries';
import { formatQuotesWithProfiles } from './formatters';

interface FetchQuotesProps {
  user: User;
  projectId?: string;
  forClient: boolean;
  includeAllQuotes: boolean;
  excludeCompletedProjects: boolean;
}

export const fetchQuotesData = async ({
  user,
  projectId,
  forClient,
  includeAllQuotes,
  excludeCompletedProjects
}: FetchQuotesProps): Promise<QuoteWithFreelancer[]> => {
  const userType = user.user_metadata?.user_type;
  const isFreelancer = userType === 'freelancer';
  
  try {
    let quotesData;
    
    // For dashboard views where we need all quotes for a user
    if (!projectId) {
      console.log("Fetching all quotes for user:", user.id, "isFreelancer:", isFreelancer);
      
      if (isFreelancer) {
        // For freelancers, get their submitted quotes
        const { data, error } = await supabase
          .from('quotes')
          .select('*, project:projects(*)')
          .eq('freelancer_id', user.id);
          
        if (error) {
          console.error('Error fetching quotes for freelancer:', error);
          throw error;
        }
        
        console.log("Fetched quotes for freelancer:", data?.length);
        quotesData = data;
      } else {
        // For clients, get quotes for their projects
        const { data, error } = await supabase
          .from('quotes')
          .select('*, project:projects(*)')
          .eq('client_id', user.id);
          
        if (error) {
          console.error('Error fetching quotes for client:', error);
          throw error;
        }
        
        console.log("Fetched quotes for client:", data?.length);
        quotesData = data;
      }
    } else {
      // If we have a projectId, use the existing query building logic
      // Log diagnostics for quote fetching
      logQuoteFetchDiagnostics(projectId, forClient, user.id, includeAllQuotes);
      
      // Build and execute the main quotes query
      const query = buildQuotesQuery(projectId, forClient, user.id, includeAllQuotes, excludeCompletedProjects);
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching quotes:', error);
        throw error;
      }
      
      quotesData = data;
      
      // If no quotes were found with the initial query
      if (!quotesData || quotesData.length === 0) {
        // Check if there are any quotes for this project
        if (projectId) {
          const allProjectQuotes = await checkAllProjectQuotes(projectId);
          
          // If we should include all quotes, use these results instead
          if (includeAllQuotes && allProjectQuotes && allProjectQuotes.length > 0) {
            console.log('Using all quotes found due to includeAllQuotes=true');
            quotesData = allProjectQuotes;
          }
        }
      }
    }
    
    if (!quotesData || quotesData.length === 0) {
      console.log("No quotes found, returning empty array");
      return [];
    }
    
    console.log(`Found ${quotesData.length} quotes:`, quotesData);
    
    // Fetch freelancer profiles for these quotes
    const freelancerIds = quotesData.map(quote => quote.freelancer_id);
    const freelancerProfiles = await fetchFreelancerProfiles(freelancerIds);
    
    // Create a map of freelancer profiles by ID for quick lookup
    const profileMap = createProfileMap(freelancerProfiles);
    
    // Combine quotes with freelancer profiles
    const result = formatQuotesWithProfiles(quotesData, profileMap);
    
    return result;
  } catch (error) {
    console.error('Error in fetchQuotesData function:', error);
    throw error;
  }
};
