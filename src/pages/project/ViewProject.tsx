
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectDetails from '@/components/projects/ProjectDetails';
import ProjectStatus from '@/components/projects/ProjectStatus';
import ProjectDocuments from '@/components/projects/ProjectDocuments';
import ProjectNotFound from '@/components/projects/ProjectNotFound';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { ProjectDeleteHandler } from '@/components/projects/ProjectDeleteHandler';
import LeadPurchaseButton from '@/components/projects/LeadPurchaseButton';
import { useAuth } from '@/context/AuthContext';
import { 
  ProjectHeaderSkeleton, 
  ProjectDetailsSkeleton, 
  ProjectStatusSkeleton, 
  ProjectDocumentsSkeleton 
} from '@/components/projects/skeletons/ProjectSkeletons';

const ViewProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, loading } = useProjectDetails(projectId);
  const { user } = useAuth();
  const [refreshContactInfo, setRefreshContactInfo] = React.useState(false);
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';

  const handlePurchaseSuccess = () => {
    setRefreshContactInfo(prev => !prev);
  };

  if (!project && !loading) {
    return (
      <MainLayout>
        <ProjectNotFound />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
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
            <ProjectDeleteHandler projectId={project!.id}>
              {(handleDelete) => (
                <ProjectHeader 
                  projectId={project!.id} 
                  onDelete={handleDelete} 
                />
              )}
            </ProjectDeleteHandler>

            {isFreelancer && (
              <div className="flex justify-end mb-4">
                <LeadPurchaseButton 
                  projectId={project!.id}
                  projectTitle={project!.title}
                  onPurchaseSuccess={handlePurchaseSuccess}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ProjectDetails project={project!} />
              </div>

              <div className="space-y-6">
                <ProjectStatus 
                  projectId={project!.id}
                  status={project!.status}
                  hiringStatus={project!.hiring_status}
                  applicationsCount={project!.applications || 0}
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
