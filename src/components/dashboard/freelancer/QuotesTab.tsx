
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import EmptyStateCard from './EmptyStateCard';
import { Project } from '@/components/projects/useProjects';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import PurchasedProjectCard from './PurchasedProjectCard';

interface Application {
  id: string;
  created_at: string;
  project_id: string;
}

interface ApplicationWithProject extends Project {
  application_id: string;
  application_created_at: string;
}

const QuotesTab: React.FC = () => {
  const navigate = useNavigate();
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
        
        console.log('Received application data:', applicationData);
        
        // Transform the data to match the ApplicationWithProject interface
        const applicationProjects = applicationData.map((app) => ({
          ...app.projects,
          application_id: app.id,
          application_created_at: app.created_at
        }));
        
        console.log('Processed applications:', applicationProjects);
        return applicationProjects as ApplicationWithProject[];
      } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
      }
    },
    enabled: !!user,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
  
  // Force refresh when tab becomes visible
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  if (error) {
    console.error('Error loading applications:', error);
  }
  
  if (!isLoading && (!applications || applications.length === 0)) {
    return (
      <EmptyStateCard
        title="My Quotes"
        description="Once you purchase a lead, the project details and client contact information will appear here."
        buttonText="Browse Available Projects"
        buttonAction={() => navigate('/marketplace')}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Quotes</h2>
      <p className="text-muted-foreground mb-4">
        Projects you've purchased contact information for
      </p>
      
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600 mr-2" />
        <AlertDescription className="text-blue-800">
          You've purchased these leads and can now access their full project details and contact information. Use the action buttons to view details, message clients, or create quotes.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          applications?.map((project) => (
            <PurchasedProjectCard 
              key={project.id}
              project={project}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuotesTab;
