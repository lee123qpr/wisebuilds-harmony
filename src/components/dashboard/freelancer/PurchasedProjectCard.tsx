
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useContactInfo } from '@/hooks/leads/useContactInfo';
import { useProjectQuote } from './purchased-project/useProjectQuote';
import { useChatHandlers } from './purchased-project/useChatHandlers';
import ProjectHeader from './purchased-project/ProjectHeader';
import ProjectMetadata from './purchased-project/ProjectMetadata';
import QuoteDetailsView from './purchased-project/QuoteDetailsView';
import ProjectActions from './purchased-project/ProjectActions';
import { User } from 'lucide-react';

interface PurchasedProjectProps {
  project: any;
}

const PurchasedProjectCard: React.FC<PurchasedProjectProps> = ({ project }) => {
  const navigate = useNavigate();
  const { clientInfo, isLoading: isLoadingClientInfo } = useContactInfo(project.id);
  
  const {
    existingQuote,
    hasSubmittedQuote,
    showQuoteDetails,
    setShowQuoteDetails,
    handleRefresh
  } = useProjectQuote(project.id);
  
  const { handleStartChat } = useChatHandlers(project);
  
  const quoteStatus = project.quote_status || existingQuote?.status;
  
  // Add a proper navigate implementation to view project details
  const handleViewDetails = () => {
    navigate(`/project/${project.id}`);
  };
  
  const formattedDate = project.created_at 
    ? format(new Date(project.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  
  // Display client name if available
  const clientName = clientInfo?.contact_name || 'Client';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <ProjectHeader project={project} quoteStatus={quoteStatus} />
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          <div className="space-y-4">
            {/* Client information */}
            {!isLoadingClientInfo && (
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <User className="h-4 w-4" />
                <span>Client: <span className="font-semibold">{clientName}</span></span>
              </div>
            )}
            
            <QuoteDetailsView 
              showQuoteDetails={showQuoteDetails}
              hasSubmittedQuote={hasSubmittedQuote}
              projectId={project.id}
              projectTitle={project.title}
            />
            
            <ProjectActions 
              project={project}
              hasSubmittedQuote={hasSubmittedQuote}
              showQuoteDetails={showQuoteDetails}
              setShowQuoteDetails={setShowQuoteDetails}
              handleRefresh={handleRefresh}
              handleStartChat={handleStartChat}
              handleViewDetails={handleViewDetails}
              quoteStatus={quoteStatus}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasedProjectCard;
