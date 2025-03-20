
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import EmptyStateCard from './EmptyStateCard';
import { Project } from '@/components/projects/useProjects';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import PurchasedProjectCard from './PurchasedProjectCard';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import { Quote } from '@/types/quotes';

interface Application {
  id: string;
  created_at: string;
  project_id: string;
}

interface ApplicationWithProject extends Project {
  application_id: string;
  application_created_at: string;
  quote_status?: Quote['status']; // Add quote status
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
        
        // Fetch quote status for each project
        const projectsWithQuoteStatus = await Promise.all(
          applicationProjects.map(async (project) => {
            try {
              const { data: quoteData } = await supabase
                .from('quotes')
                .select('status')
                .eq('project_id', project.id)
                .eq('freelancer_id', user.id)
                .maybeSingle();
                
              return {
                ...project,
                quote_status: quoteData?.status
              };
            } catch (error) {
              console.error('Error fetching quote status:', error);
              return project;
            }
          })
        );
        
        console.log('Processed applications with quote status:', projectsWithQuoteStatus);
        return projectsWithQuoteStatus as ApplicationWithProject[];
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
  
  // Count for each status
  const acceptedCount = applications?.filter(p => p.quote_status === 'accepted').length || 0;
  const pendingCount = applications?.filter(p => p.quote_status === 'pending').length || 0;
  const declinedCount = applications?.filter(p => p.quote_status === 'declined').length || 0;
  const noQuoteCount = applications?.filter(p => !p.quote_status).length || 0;
  
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
          {acceptedCount > 0 && (
            <span className="font-medium"> You have been hired for {acceptedCount} project{acceptedCount > 1 ? 's' : ''}!</span>
          )}
        </AlertDescription>
      </Alert>
      
      {/* Quote status summary */}
      {applications && applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="text-green-800 text-sm font-medium">Hired</div>
            <div className="text-2xl font-bold text-green-700">{acceptedCount}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="text-yellow-800 text-sm font-medium">Pending</div>
            <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-red-800 text-sm font-medium">Declined</div>
            <div className="text-2xl font-bold text-red-700">{declinedCount}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <div className="text-gray-800 text-sm font-medium">No Quote</div>
            <div className="text-2xl font-bold text-gray-700">{noQuoteCount}</div>
          </div>
        </div>
      )}
      
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
              project={{
                ...project,
                quote_status: project.quote_status
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuotesTab;
