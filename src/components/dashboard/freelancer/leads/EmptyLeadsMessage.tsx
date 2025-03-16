
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Info, Plus } from 'lucide-react';
import { useFreelancerDashboard } from '@/hooks/useFreelancerDashboard';
import { useCreateTestProject } from '@/hooks/projects/useCreateTestProject';

const EmptyLeadsMessage: React.FC = () => {
  const navigate = useNavigate();
  const { leadSettings } = useFreelancerDashboard();
  const { createTestProject, isCreating } = useCreateTestProject();

  // Debug - let's check what lead settings we actually have
  console.log('EmptyLeadsMessage - current lead settings:', leadSettings);

  const handleCreateTestProject = () => {
    if (leadSettings?.role) {
      createTestProject(leadSettings.role);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>No Matching Leads Available</CardTitle>
            <CardDescription>
              We couldn't find any projects matching your current preferences
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4 text-sm text-muted-foreground">
          <p>Your current filters:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Role: {leadSettings?.role || 'Not set'}</li>
            <li>Location: {leadSettings?.location || 'Not set'}</li>
            <li>Work Type: {leadSettings?.work_type || 'Any'}</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <Button 
            onClick={() => navigate('/dashboard/freelancer/lead-settings')}
            variant="outline"
          >
            Update Lead Settings
          </Button>
          
          {process.env.NODE_ENV !== 'production' && leadSettings?.role && (
            <Button 
              onClick={handleCreateTestProject}
              variant="secondary"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-2" /> 
              {isCreating ? 'Creating...' : 'Create Test Project'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyLeadsMessage;
