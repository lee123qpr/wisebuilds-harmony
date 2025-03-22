
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
  
  // For clients, we show all quotes for their project by default
  // For freelancers, we only show their own quotes
  if (userId) {
    if (forClient) {
      // When viewing as a client, don't filter by client_id unless explicitly asked not to show all quotes
      // This ensures clients see all quotes for their projects by default
      if (!includeAllQuotes) {
        query = query.eq('client_id', userId);
        console.log('Filtering by client_id:', userId);
      } else {
        console.log('Showing all quotes for this project regardless of client_id');
      }
    } else {
      // For freelancers, only show their own quotes
      query = query.eq('freelancer_id', userId);
      console.log('Filtering by freelancer_id:', userId);
    }
  } else if (includeAllQuotes) {
    console.log('Bypassing client/freelancer filter to see all quotes for this project');
  }
  
  // If we want to exclude quotes for completed projects, add a join filter
  if (excludeCompletedProjects) {
    // Filter out quotes where the project status is 'completed'
    query = query.not('projects.status', 'eq', 'completed');
    console.log('Excluding quotes for completed projects');
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
