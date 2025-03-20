import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProjectApplications } from '@/hooks/useProjectApplications';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import FreelancerApplicationCard from '@/components/applications/FreelancerApplicationCard';
import BackButton from '@/components/common/BackButton';

const ProjectApplications = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we came from the business dashboard
  const fromBusinessDashboard = location.state?.from === 'businessDashboard';
  
  const { applications, isLoading: isLoadingApplications } = useProjectApplications(projectId);
  const { project, loading: isLoadingProject } = useProjectDetails(projectId);
  
  const handleGoBack = () => {
    if (fromBusinessDashboard) {
      // If we came from the business dashboard, go back there directly
      navigate('/dashboard/business');
    } else {
      // Otherwise go back to the project details page
      navigate(`/project/${projectId}`);
    }
  };
  
  const isLoading = isLoadingApplications || isLoadingProject;
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <BackButton onClick={handleGoBack} />
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Applications for {project?.title || 'Project'}</CardTitle>
            <CardDescription>
              {isLoading 
                ? 'Loading applications...' 
                : `${applications.length} freelancer${applications.length !== 1 ? 's' : ''} applied to this project`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No applications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <FreelancerApplicationCard 
                    key={application.id} 
                    application={application} 
                    projectId={projectId!}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProjectApplications;
