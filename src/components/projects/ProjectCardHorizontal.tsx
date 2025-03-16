
import React from 'react';
import { Card } from '@/components/ui/card';
import { Project } from './useProjects';
import { format } from 'date-fns';
import { ChevronRight, UserRound, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ProjectCardHorizontalProps {
  project: Project;
}

const ProjectCardHorizontal: React.FC<ProjectCardHorizontalProps> = ({ project }) => {
  const navigate = useNavigate();
  
  // Format posted date
  const formattedDate = format(new Date(project.created_at), 'dd MMM yyyy');
  
  // Number of interested freelancers
  const interestedCount = project.applications || 0;
  
  // Number of chats
  const chatCount = project.chat_count || 0;
  
  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };
  
  const handleInterestedClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    navigate(`/project/${project.id}/applications`);
  };
  
  const handleChatsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    // For now, just navigate to the project page
    navigate(`/project/${project.id}`);
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
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-3">
                <span className="text-2xl font-bold text-primary">{interestedCount}</span>
              </div>
              <div>
                <p className="font-medium">Interested</p>
                <p className="text-sm text-muted-foreground">Waiting for your decision</p>
              </div>
            </div>
            
            {/* Chats box */}
            <div 
              className="border rounded-md p-4 flex items-center cursor-pointer hover:bg-slate-50"
              onClick={handleChatsClick}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-3">
                <span className="text-2xl font-bold text-primary">{chatCount}</span>
              </div>
              <div>
                <p className="font-medium">Chats</p>
                <p className="text-sm text-muted-foreground">Chat started to discuss job</p>
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
