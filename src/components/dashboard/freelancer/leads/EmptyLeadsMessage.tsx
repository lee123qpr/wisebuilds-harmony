
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useFreelancerDashboard } from '@/hooks/useFreelancerDashboard';
import { formatBudget, formatRole, formatDuration, formatWorkType } from '@/utils/projectFormatters';

const EmptyLeadsMessage: React.FC = () => {
  const navigate = useNavigate();
  const { leadSettings } = useFreelancerDashboard();

  // Debug - let's check what lead settings we actually have
  console.log('EmptyLeadsMessage - current lead settings:', leadSettings);

  // Format the hiring status for display
  const formatHiringStatus = (status: string) => {
    if (!status || status === 'any' || status === 'Any') return 'Any';
    
    const statusMap: Record<string, string> = {
      'enquiring': 'Just Enquiring',
      'ready': 'Ready to Hire',
      'urgent': 'Urgent',
      'hiring': 'Currently Hiring'
    };
    
    return statusMap[status] || status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
            <li><span className="font-medium">Role:</span> {leadSettings?.role ? formatRole(leadSettings.role) : 'Any'}</li>
            <li><span className="font-medium">Location:</span> {leadSettings?.location || 'Any'}</li>
            <li><span className="font-medium">Work Type:</span> {leadSettings?.work_type ? formatWorkType(leadSettings.work_type) : 'Any'}</li>
            
            {/* Budget filter */}
            <li><span className="font-medium">Budget:</span> {leadSettings?.budget ? formatBudget(leadSettings.budget) : 'Any'}</li>
            
            {/* Duration filter */}
            <li><span className="font-medium">Duration:</span> {leadSettings?.duration ? formatDuration(leadSettings.duration) : 'Any'}</li>
            
            {/* Hiring Status filter - now using formatted text */}
            <li><span className="font-medium">Hiring Status:</span> {leadSettings?.hiring_status ? formatHiringStatus(leadSettings.hiring_status) : 'Any'}</li>
            
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
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyLeadsMessage;
