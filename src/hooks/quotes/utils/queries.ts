
import { supabase } from '@/integrations/supabase/client';

/**
 * Builds the base query for fetching quotes
 */
export const buildQuotesQuery = (
  projectId?: string, 
  forClient: boolean = false, 
  userId?: string,
  includeAllQuotes: boolean = false,
  excludeCompletedProjects: boolean = false
) => {
  let query = supabase
    .from('quotes')
    .select(`
      *,
      projects:project_id (
        title,
        budget,
        status
      )
    `);
  
  // If projectId is provided, filter by that project
  if (projectId) {
    query = query.eq('project_id', projectId);
    console.log('Filtering by project_id:', projectId);
  }
  
  // For clients, we filter by client_id
  // For freelancers, we only show their own quotes
  if (userId) {
    if (forClient) {
      // When viewing as a client, filter by client_id
      // This ensures we get all quotes for this client user
      query = query.eq('client_id', userId);
      console.log('Filtering by client_id:', userId);
    } else {
      // For freelancers, only show their own quotes
      query = query.eq('freelancer_id', userId);
      console.log('Filtering by freelancer_id:', userId);
    }
  }
  
  // If we want to exclude quotes for completed projects, add a join filter
  if (excludeCompletedProjects) {
    // Filter out quotes where the project status is 'completed'
    query = query.not('projects.status', 'eq', 'completed');
    
    // Also filter out quotes that have been marked as completed by both parties
    query = query.or('freelancer_completed.is.null,client_completed.is.null');
    
    console.log('Excluding quotes for completed projects and fully completed quotes');
  }
  
  return query;
};

/**
 * Fetches freelancer profiles for a list of quotes
 */
export const fetchFreelancerProfiles = async (freelancerIds: string[]) => {
  if (!freelancerIds || !freelancerIds.length) {
    console.log('No freelancer IDs provided to fetch profiles');
    return [];
  }
  
  // Remove any duplicates from the array
  const uniqueFreelancerIds = [...new Set(freelancerIds)];
  console.log('Fetching profiles for freelancers:', uniqueFreelancerIds);
  
  const { data: freelancerProfiles, error: profilesError } = await supabase
    .from('freelancer_profiles')
    .select('id, first_name, last_name, display_name, profile_photo, job_title, rating')
    .in('id', uniqueFreelancerIds);
  
  if (profilesError) {
    console.error('Error fetching freelancer profiles:', profilesError);
    return [];
  }
  
  console.log('Fetched freelancer profiles:', freelancerProfiles?.length || 0);
  return freelancerProfiles || [];
};

/**
 * Creates a map of freelancer profiles by ID for quick lookup
 */
export const createProfileMap = (profiles: any[]): Record<string, any> => {
  if (!profiles || !profiles.length) {
    return {};
  }
  
  return profiles.reduce((map, profile) => {
    if (profile && profile.id) {
      map[profile.id] = profile;
    }
    return map;
  }, {} as Record<string, any>);
};
