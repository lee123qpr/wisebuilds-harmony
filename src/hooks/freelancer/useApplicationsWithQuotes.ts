
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/projects/useProjects';
import { Quote } from '@/types/quotes';

interface Application {
  id: string;
  created_at: string;
  project_id: string;
}

export interface ApplicationWithProject extends Project {
  application_id: string;
  application_created_at: string;
  quote_status?: Quote['status'];
}

export const useApplicationsWithQuotes = () => {
  const { user } = useAuth();
  
  const {
    data: applications,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        console.log('Fetching user applications...');
        
        // Directly fetch applications and join with projects
        const { data: applicationData, error: appError } = await supabase
          .from('project_applications')
          .select(`
            id,
            created_at,
            project_id,
            projects:project_id (
              id,
              title,
              description,
              budget,
              location,
              work_type,
              duration,
              role,
              created_at,
              status,
              hiring_status,
              requires_insurance,
              requires_equipment,
              requires_site_visits
            )
          `)
          .eq('user_id', user.id);
        
        if (appError) {
          console.error('Error fetching applications:', appError);
          throw appError;
        }
        
        if (!applicationData || applicationData.length === 0) {
          console.log('No applications found');
          return [];
        }
        
        // Transform the data to match the ApplicationWithProject interface
        const applicationProjects = applicationData.map((app) => ({
          ...app.projects,
          application_id: app.id,
          application_created_at: app.created_at
        }));
        
        // Fetch all quotes for this user in a single query instead of multiple queries
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('status, project_id')
          .eq('freelancer_id', user.id)
          .in('project_id', applicationProjects.map(p => p.id));
          
        if (quotesError) {
          console.error('Error fetching quotes:', quotesError);
        }
        
        // Create a map of project_id -> quote status for faster lookup
        const quoteStatusMap = (quotesData || []).reduce((map, quote) => {
          map[quote.project_id] = quote.status;
          return map;
        }, {});
        
        // Merge quote status into the application data
        const projectsWithQuoteStatus = applicationProjects.map(project => ({
          ...project,
          quote_status: quoteStatusMap[project.id]
        }));
        
        return projectsWithQuoteStatus as ApplicationWithProject[];
      } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 60000, // 1 minute cache
    refetchOnWindowFocus: true
  });
  
  return {
    applications,
    isLoading,
    error,
    refetch
  };
};
