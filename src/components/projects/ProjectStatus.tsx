
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import HiringStatusBadge from '@/components/projects/HiringStatusBadge';

interface ProjectStatusProps {
  projectId: string;
  status: string;
  hiringStatus: string;
  applicationsCount: number;
}

const ProjectStatus = ({ projectId, status, hiringStatus, applicationsCount }: ProjectStatusProps) => {
  const navigate = useNavigate();

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
      {applicationsCount > 0 && (
        <CardFooter className="pt-2">
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => navigate(`/project/${projectId}/applications`)}
          >
            <Users className="h-4 w-4 mr-2" />
            View Applications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectStatus;
