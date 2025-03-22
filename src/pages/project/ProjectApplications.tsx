
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProjectApplications } from '@/hooks/useProjectApplications';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import FreelancerApplicationCard from '@/components/applications/FreelancerApplicationCard';
import BackButton from '@/components/common/BackButton';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ProjectApplications = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we came from the business dashboard
  const fromBusinessDashboard = location.state?.from === 'businessDashboard';
  
  const { applications, isLoading: isLoadingApplications, error } = useProjectApplications(projectId);
  const { project, loading: isLoadingProject } = useProjectDetails(projectId);
  
  useEffect(() => {
    // Log for debugging
    console.log("ProjectApplications page - Applications:", applications?.length);
    console.log("Project ID:", projectId);
    
    if (error) {
      console.error("Error loading applications:", error);
      toast.error("Failed to load applications");
    }
  }, [applications, error, projectId]);
  
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
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error.message || "Failed to load applications. Please try again."}
                </AlertDescription>
              </Alert>
            )}
            
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
