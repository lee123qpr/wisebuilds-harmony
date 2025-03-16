
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Info, Plus } from 'lucide-react';
import { useFreelancerDashboard } from '@/hooks/useFreelancerDashboard';
import { useCreateTestProject } from '@/hooks/projects/useCreateTestProject';
import { formatBudget, formatRole } from '@/utils/projectFormatters';
import HiringStatusBadge from '../badges/HiringStatusBadge';

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

  // Format the duration for display
  const formatDuration = (duration: string) => {
    if (!duration) return 'Any';
    
    const durationMap: Record<string, string> = {
      'less_than_1_week': 'Less than 1 week',
      '1_week': '1 week',
      '2_weeks': '2 weeks',
      '3_weeks': '3 weeks',
      '4_weeks': '4 weeks',
      '6_weeks_plus': '6+ weeks'
    };
    
    return durationMap[duration] || duration;
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
          <p className="font-medium mb-2">Your current filters:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">Role:</span> {formatRole(leadSettings?.role || 'Not set')}</li>
            <li><span className="font-medium">Location:</span> {leadSettings?.location || 'Not set'}</li>
            <li><span className="font-medium">Work Type:</span> {leadSettings?.work_type || 'Any'}</li>
            
            {/* Budget filter */}
            <li><span className="font-medium">Budget:</span> {leadSettings?.budget ? formatBudget(leadSettings.budget) : 'Any'}</li>
            
            {/* Duration filter */}
            <li><span className="font-medium">Duration:</span> {leadSettings?.duration ? formatDuration(leadSettings.duration) : 'Any'}</li>
            
            {/* Hiring Status filter */}
            <li className="flex items-center gap-2">
              <span className="font-medium">Hiring Status:</span> 
              {leadSettings?.hiring_status ? (
                <span className="mt-1 inline-block">
                  <HiringStatusBadge status={leadSettings.hiring_status} />
                </span>
              ) : 'Any'}
            </li>
            
            {/* Insurance Requirements filter */}
            <li><span className="font-medium">Insurance Required:</span> {leadSettings?.requires_insurance ? 'Yes' : 'Any'}</li>
            
            {/* Site Visits Requirements filter */}
            <li><span className="font-medium">Site Visits Required:</span> {leadSettings?.requires_site_visits ? 'Yes' : 'Any'}</li>
            
            {/* Keywords filter */}
            <li>
              <span className="font-medium">Keywords:</span> {
                !leadSettings?.keywords || 
                (typeof leadSettings.keywords === 'string' 
                  ? leadSettings.keywords.length === 0 
                  : leadSettings.keywords.length === 0) 
                  ? 'None' 
                  : (typeof leadSettings.keywords === 'string' 
                      ? leadSettings.keywords 
                      : leadSettings.keywords.join(', '))
              }
            </li>
          </ul>
        </div>
        
        <div className="border-t pt-4 text-sm text-muted-foreground">
          <p>Try broadening your filters to see more leads or check back later for new projects.</p>
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
