import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/components/projects/useProjects';
import ProjectHeader from './ProjectHeader';
import ProjectDescription from './ProjectDescription';
import ProjectMetadata from './ProjectMetadata';
import ProjectRequirements from './ProjectRequirements';
import ProjectDocuments from './ProjectDocuments';
import ProjectActions from './ProjectActions';
import ClientContactInfo from './ClientContactInfo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useContactInfo } from '@/hooks/leads/useContactInfo';
import { useCheckPurchaseStatus } from '@/hooks/leads/useCheckPurchaseStatus';
import SubmitQuoteButton from './SubmitQuoteButton';

interface ProjectDetailsProps {
  project: Project;
  refreshTrigger?: number;
  forceShowContactInfo?: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  project, 
  refreshTrigger,
  forceShowContactInfo = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState(null);
  const [isLoadingContactInfo, setIsLoadingContactInfo] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isBusiness = user?.user_metadata?.user_type === 'business';
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  const isOwner = user?.id === project.user_id;

  const { 
    contactInfo: fetchedContactInfo, 
    isLoading: loadingContactInfo 
  } = useContactInfo(project.user_id);
  
  const { 
    isPurchased: leadIsPurchased, 
    isLoading: loadingPurchaseStatus 
  } = useCheckPurchaseStatus(project.id);

  useEffect(() => {
    if (fetchedContactInfo) {
      setContactInfo(fetchedContactInfo);
    }
    setIsLoadingContactInfo(loadingContactInfo);
  }, [fetchedContactInfo, loadingContactInfo]);

  useEffect(() => {
    setIsPurchased(leadIsPurchased);
    setIsLoading(loadingPurchaseStatus);
  }, [leadIsPurchased, loadingPurchaseStatus]);

  const handleEdit = () => {
    navigate(`/project/${project.id}/edit`);
  };

  const handleDelete = () => {
    // Implement delete logic here
    toast({
      title: 'Project deleted',
      description: 'Your project has been deleted successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      
      {/* Add Quote button for freelancers who have purchased */}
      {isFreelancer && isPurchased && project.status === 'active' && (
        <div className="flex justify-end mb-4">
          <SubmitQuoteButton 
            projectId={project.id}
            projectTitle={project.title}
            isPurchased={isPurchased}
          />
        </div>
      )}
      
      <ProjectDescription description={project.description} />
      
      {/* Show contact info if purchased or force show */}
      {(isPurchased || forceShowContactInfo) && !isLoading && (
        <ClientContactInfo 
          clientId={project.user_id} 
          contactInfo={contactInfo} 
          isLoading={isLoadingContactInfo}
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectMetadata project={project} />
        <ProjectRequirements project={project} />
      </div>
      
      {project.documents && project.documents.length > 0 && (
        <ProjectDocuments documents={project.documents} />
      )}
      
      {/* Project actions for authorized users */}
      {isBusiness && isOwner && (
        <ProjectActions 
          project={project} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
};

export default ProjectDetails;
