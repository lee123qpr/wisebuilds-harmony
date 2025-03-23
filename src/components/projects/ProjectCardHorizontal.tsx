import React from 'react';
import { Card } from '@/components/ui/card';
import { Project } from './useProjects';
import { format } from 'date-fns';
import { ChevronRight, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { formatRole } from '@/utils/projectFormatters';

interface ProjectCardHorizontalProps {
  project: Project;
}

const ProjectCardHorizontal: React.FC<ProjectCardHorizontalProps> = ({ project }) => {
  const navigate = useNavigate();
  
  // Get real-time quote count
  const { data: quotes, isLoading: isLoadingQuotes } = useQuotes({ 
    projectId: project.id,
    forClient: true,
    refreshInterval: 10000 // Refresh every 10 seconds
  });
  
  // Format posted date
  const formattedDate = format(new Date(project.created_at), 'dd MMM yyyy');
  
  // Number of interested freelancers
  const interestedCount = project.applications || 0;
  
  // Number of quotes - always use the live data from the quotes hook when available
  const quoteCount = !isLoadingQuotes && quotes ? quotes.length : (project.quote_count || 0);
  
  // Format the role properly using our utility function
  const roleFormatted = formatRole(project.role || ''); 
  
  const handleClick = () => {
    navigate(`/project/${project.id}`, { 
      state: { from: 'businessDashboard' }
    });
  };
  
  const handleInterestedClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    console.log(`Navigating to applications for project: ${project.id} with ${interestedCount} applications`);
    navigate(`/project/${project.id}/applications`, {
      state: { from: 'businessDashboard' }
    });
  };
  
  const handleQuotesClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    navigate(`/project/${project.id}/quotes`, {
      state: { from: 'businessDashboard' }
    });
  };
  
  return (
    <Card 
      className="p-6 mb-4 cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-transparent hover:border-l-4 hover:border-primary"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Posted {formattedDate}</p>
            
            {/* Add a "Test" badge for test projects */}
            {project.title.startsWith('Test ') && (
              <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700">Test</Badge>
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
          
          {/* Add role information */}
          <p className="text-sm text-muted-foreground mb-4">
            Looking for: <span className="font-medium text-primary">{roleFormatted}</span>
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Interested freelancers box */}
            <div 
              className="border rounded-md p-4 flex items-center cursor-pointer relative overflow-hidden group transition-all duration-200"
              onClick={handleInterestedClick}
              role="button"
              aria-label={`View ${interestedCount} interested freelancers`}
            >
              {/* Green hover overlay */}
              <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-3 z-10 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl font-bold text-primary">{interestedCount}</span>
              </div>
              <div className="z-10">
                <p className="font-medium group-hover:text-primary/90 transition-colors">Interested</p>
                <p className="text-sm text-muted-foreground">Waiting for your decision</p>
              </div>
            </div>
            
            {/* Quotes box */}
            <div 
              className="border rounded-md p-4 flex items-center cursor-pointer relative overflow-hidden group transition-all duration-200"
              onClick={handleQuotesClick}
            >
              {/* Green hover overlay */}
              <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-3 z-10 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl font-bold text-primary">{quoteCount}</span>
              </div>
              <div className="z-10">
                <p className="font-medium group-hover:text-primary/90 transition-colors">Quotes</p>
                <p className="text-sm text-muted-foreground">Received quotes for project</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center h-full">
          <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Card>
  );
};

export default ProjectCardHorizontal;
