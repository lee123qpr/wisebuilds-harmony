
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import EmptyStateCard from './EmptyStateCard';
import { Project } from '@/components/projects/useProjects';
import ProjectListView from './ProjectListView';

interface Application {
  id: string;
  created_at: string;
  project: Project;
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
    error
  } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First get the applications
      const { data: applicationData, error: appError } = await supabase
        .from('project_applications')
        .select('id, created_at, project_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (appError) {
        console.error('Error fetching applications:', appError);
        throw appError;
      }
      
      if (!applicationData || applicationData.length === 0) {
        return [];
      }
      
      // Then get the projects for those applications
      const projectPromises = applicationData.map(async (app) => {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', app.project_id)
          .single();
          
        if (projectError) {
          console.error('Error fetching project:', projectError);
          return null;
        }
        
        // Transform the data to fit the ApplicationWithProject type
        return {
          ...projectData,
          application_id: app.id,
          application_created_at: app.created_at
        } as ApplicationWithProject;
      });
      
      const results = await Promise.all(projectPromises);
      return results.filter(Boolean) as ApplicationWithProject[];
    },
    enabled: !!user
  });
  
  // Find the selected project from applications
  const selectedProject = applications?.find(app => app.id === selectedProjectId) || null;
  
  // Set first project as selected when data loads
  useEffect(() => {
    if (applications?.length && !selectedProjectId) {
      setSelectedProjectId(applications[0].id);
    }
  }, [applications]);
  
  if (error) {
    console.error('Error loading applications:', error);
  }
  
  if (!isLoading && (!applications || applications.length === 0)) {
    return (
      <EmptyStateCard
        title="My Applications"
        description="You haven't applied to any projects yet."
        buttonText="Browse Available Projects"
        buttonAction={() => navigate('/marketplace')}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Applications</h2>
      <p className="text-muted-foreground mb-6">
        Projects you've purchased contact information for
      </p>
      
      <ProjectListView
        projects={applications || []}
        isLoading={isLoading}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        selectedProject={selectedProject}
      />
    </div>
  );
};

export default ApplicationsTab;
