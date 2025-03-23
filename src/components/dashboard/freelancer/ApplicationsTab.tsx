import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import EmptyStateCard from './EmptyStateCard';
import { Project } from '@/components/projects/useProjects';
import ProjectListView from './ProjectListView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Application {
  id: string;
  created_at: string;
  project_id: string;
}

interface ApplicationWithProject extends Project {
  application_id: string;
  application_created_at: string;
}

const ApplicationsTab: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
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
        const { data: applicationData, error: appError } = await supabase.rpc('get_user_applications', {
          user_id: user.id
        });
        
        if (appError) {
          console.error('Error fetching applications:', appError);
          throw appError;
        }
        
        if (!applicationData || applicationData.length === 0) {
          console.log('No applications found');
          return [];
        }
        
        console.log('Received application data:', applicationData);
        
        const applicationProjects = applicationData.map((app: any) => ({
          ...app.project,
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
  
  const selectedProject = applications?.find(app => app.id === selectedProjectId) || null;
  
  useEffect(() => {
    if (applications?.length && !selectedProjectId) {
      setSelectedProjectId(applications[0].id);
      console.log('Setting initial selected project:', applications[0].id);
    }
  }, [applications, selectedProjectId]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  if (error) {
    console.error('Error loading applications:', error);
  }
  
  if (!isLoading && (!applications || applications.length === 0)) {
    return (
      <EmptyStateCard
        title="My Responses"
        description="Once you purchase a lead, the project details and client contact information will appear here."
        buttonText="Browse Available Projects"
        buttonAction={() => navigate('/dashboard/freelancer')}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Responses</h2>
      <p className="text-muted-foreground mb-4">
        Projects you've purchased contact information for
      </p>
      
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600 mr-2" />
        <AlertDescription className="text-blue-800">
          You've purchased these leads and can now access their full project details and contact information. Select a project to view all available details.
        </AlertDescription>
      </Alert>
      
      <ProjectListView
        projects={applications || []}
        isLoading={isLoading}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        selectedProject={selectedProject}
        showContactInfo={true}
      />
    </div>
  );
};

export default ApplicationsTab;
