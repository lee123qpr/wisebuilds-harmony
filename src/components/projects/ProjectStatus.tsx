
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Briefcase, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import HiringStatusBadge from './HiringStatusBadge';
import { useAuth } from '@/context/AuthContext';

interface ProjectStatusProps {
  projectId: string;
  status: string;
  hiringStatus: string;
  applicationsCount: number;
}

const ProjectStatus: React.FC<ProjectStatusProps> = ({
  projectId,
  status,
  hiringStatus,
  applicationsCount
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBusiness = user?.user_metadata?.user_type === 'business';
  
  const handleViewApplications = () => {
    navigate(`/project/${projectId}/applications`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Applications
          </span>
          <span className="font-medium">{applicationsCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Hiring Status
          </span>
          <HiringStatusBadge status={hiringStatus} />
        </div>
      </CardContent>
      
      {isBusiness && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleViewApplications}
          >
            View Applications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectStatus;
