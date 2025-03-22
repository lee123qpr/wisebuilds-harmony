
import React from 'react';
import { Card } from '@/components/ui/card';
import { Project } from './useProjects';
import { format } from 'date-fns';
import { ChevronRight, UserRound, MessageSquare, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useQuotes } from '@/hooks/quotes/useQuotes';

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
      className="p-6 mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">Posted {formattedDate}</p>
          </div>
          
          <h3 className="text-xl font-semibold mb-5">{project.title}</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Interested freelancers box */}
            <div 
              className="border rounded-md p-4 flex items-center cursor-pointer hover:bg-slate-50"
              onClick={handleInterestedClick}
              role="button"
              aria-label={`View ${interestedCount} interested freelancers`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-3">
                <span className="text-2xl font-bold text-primary">{interestedCount}</span>
              </div>
              <div>
                <p className="font-medium">Interested</p>
                <p className="text-sm text-muted-foreground">Waiting for your decision</p>
              </div>
            </div>
            
            {/* Quotes box */}
            <div 
              className="border rounded-md p-4 flex items-center cursor-pointer hover:bg-slate-50"
              onClick={handleQuotesClick}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-3">
                <span className="text-2xl font-bold text-primary">{quoteCount}</span>
              </div>
              <div>
                <p className="font-medium">Quotes</p>
                <p className="text-sm text-muted-foreground">Received quotes for project</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center h-full">
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      
      {/* Add a "Test" badge for test projects */}
      {project.title.startsWith('Test ') && (
        <Badge variant="outline" className="absolute top-3 right-3 text-xs bg-yellow-50">Test</Badge>
      )}
    </Card>
  );
};

export default ProjectCardHorizontal;
