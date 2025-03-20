
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectDetails from '@/components/projects/ProjectDetails';
import ProjectStatus from '@/components/projects/ProjectStatus';
import ProjectDocuments from '@/components/projects/ProjectDocuments';
import ProjectNotFound from '@/components/projects/ProjectNotFound';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { LeadPurchaseButton } from '@/components/projects/lead-purchase';
import { useAuth } from '@/context/AuthContext';
import { 
  ProjectHeaderSkeleton, 
  ProjectDetailsSkeleton, 
  ProjectStatusSkeleton, 
  ProjectDocumentsSkeleton 
} from '@/components/projects/skeletons/ProjectSkeletons';
import BackButton from '@/components/common/BackButton';

const ViewProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { project, loading } = useProjectDetails(projectId);
  const { user } = useAuth();
  const [refreshContactInfo, setRefreshContactInfo] = React.useState(false);
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  const isBusiness = user?.user_metadata?.user_type === 'business';

  const handlePurchaseSuccess = () => {
    setRefreshContactInfo(prev => !prev);
  };

  const handleProjectDeleted = async () => {
    // Navigate back to the dashboard after project deletion
    navigate('/dashboard/business');
  };

  const handleGoBack = () => {
    // Go back to previous page
    if (isFreelancer) {
      navigate('/dashboard/freelancer?tab=quotes');
    } else if (isBusiness) {
      navigate('/dashboard/business');
    } else {
      navigate(-1); // Default fallback to browser history
    }
  };

  if (!project && !loading) {
    return (
      <MainLayout>
        <ProjectNotFound />
      </MainLayout>
    );
  }

  // Get the client ID from the project
  const clientId = project?.user_id;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <BackButton onClick={handleGoBack} />
        </div>

        {loading ? (
          <>
            <ProjectHeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ProjectDetailsSkeleton />
              </div>
              <div className="space-y-6">
                <ProjectStatusSkeleton />
                <ProjectDocumentsSkeleton />
              </div>
            </div>
          </>
        ) : (
          <>
            {isBusiness && (
              <ProjectHeader 
                projectId={project!.id}
                refreshProjects={handleProjectDeleted}
              />
            )}

            {isFreelancer && !isBusiness && (
              <div className="mb-4">
                <h1 className="text-2xl font-bold">{project!.title}</h1>
              </div>
            )}

            {isFreelancer && (
              <div className="flex justify-end mb-4">
                <LeadPurchaseButton 
                  projectId={project!.id}
                  projectTitle={project!.title}
                  project={project}
                  purchasesCount={project!.purchases_count || 0}
                  onPurchaseSuccess={handlePurchaseSuccess}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ProjectDetails 
                  project={project!} 
                  forceShowContactInfo={isFreelancer && project!.purchases_count > 0}
                />
              </div>

              <div className="space-y-6">
                <ProjectStatus 
                  projectId={project!.id}
                  status={project!.status}
                  hiringStatus={project!.hiring_status}
                  applicationsCount={project!.applications || 0}
                  clientId={clientId}
                  projectTitle={project!.title}
                />

                <ProjectDocuments 
                  projectId={project!.id}
                  documents={project!.documents}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ViewProject;
