
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Quote } from 'lucide-react';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import HiringStatusBadge from '@/components/projects/HiringStatusBadge';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import { useAuth } from '@/context/AuthContext';

interface ProjectStatusProps {
  projectId: string;
  status: string;
  hiringStatus: string;
  applicationsCount: number;
  clientId?: string;
}

const ProjectStatus = ({ 
  projectId, 
  status, 
  hiringStatus, 
  applicationsCount,
  clientId,
}: ProjectStatusProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  const isBusiness = user?.user_metadata?.user_type === 'business';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Project Status</h4>
          <div>
            <ProjectStatusBadge status={status} />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Hiring Status</h4>
          <div>
            <HiringStatusBadge status={hiringStatus} />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Applications</h4>
          <p className="font-medium">{applicationsCount || 0} applications</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch space-y-2 pt-2">
        {isBusiness && applicationsCount > 0 && (
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => navigate(`/project/${projectId}/applications`)}
          >
            <Users className="h-4 w-4 mr-2" />
            View Applications
          </Button>
        )}
        
        {isFreelancer && clientId && (
          <QuoteDialog 
            projectId={projectId}
            projectTitle={status} // Ideally this should be the project title
            clientId={clientId}
            onQuoteSubmitted={() => {
              // Refresh the page or data after quote submission
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectStatus;
