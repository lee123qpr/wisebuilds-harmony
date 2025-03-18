
import React from 'react';
import { CalendarIcon, MapPinIcon, Clock, Briefcase, Eye, MessageSquare, Quote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatBudget, formatRole, formatDuration } from '@/utils/projectFormatters';

interface Project {
  id: string;
  title: string;
  budget: string;
  location: string;
  work_type: string;
  duration: string;
  role: string;
  created_at: string;
  application_created_at: string;
}

interface PurchasedProjectCardProps {
  project: Project;
}

const PurchasedProjectCard: React.FC<PurchasedProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  
  // Format the timeAgo string
  const timeAgo = formatDistanceToNow(new Date(project.application_created_at), { addSuffix: true });

  const handleViewDetails = () => {
    navigate(`/marketplace/${project.id}`);
  };

  const handleMessage = () => {
    // Future implementation: Open message dialog or navigate to messages
    console.log('Message client for project:', project.id);
  };

  const handleQuote = () => {
    // Navigate to project page to submit a quote
    navigate(`/project/${project.id}`);
  };
  
  return (
    <Card className="mb-4 hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-grow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Purchased {timeAgo}
              </Badge>
            </div>
            <CardTitle className="text-lg">{project.title}</CardTitle>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatRole(project.role)}</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDuration(project.duration)}</span>
              </div>
            </div>
            
            <div className="mt-2 text-sm font-medium">
              Budget: {formatBudget(project.budget)}
            </div>
          </CardContent>
        </div>
        
        <div className="flex flex-row md:flex-col justify-end items-center gap-2 p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden md:inline">View Details</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
            onClick={handleMessage}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Message</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
            onClick={handleQuote}
          >
            <Quote className="h-4 w-4" />
            <span className="hidden md:inline">Quote</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PurchasedProjectCard;
