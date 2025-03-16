
import React from 'react';
import { CalendarIcon, MapPinIcon, Clock, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  isSelected: boolean;
  onClick: () => void;
}

const PurchasedProjectCard: React.FC<PurchasedProjectCardProps> = ({ 
  project, 
  isSelected,
  onClick 
}) => {
  // Format the timeAgo string
  const timeAgo = formatDistanceToNow(new Date(project.application_created_at), { addSuffix: true });
  
  // Map budget to a readable format
  const budgetMap: Record<string, string> = {
    'less_than_1000': '< $1,000',
    '1000_to_5000': '$1,000 - $5,000',
    '5000_to_10000': '$5,000 - $10,000',
    '10000_to_25000': '$10,000 - $25,000',
    '25000_to_50000': '$25,000 - $50,000',
    'more_than_50000': '> $50,000',
  };
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">
            Purchased {timeAgo}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 leading-tight">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{project.role.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{project.duration.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-sm font-medium">
          Budget: {budgetMap[project.budget] || project.budget}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PurchasedProjectCard;
