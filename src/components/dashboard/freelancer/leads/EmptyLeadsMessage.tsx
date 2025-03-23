
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

  // Helper to safely format filters and handle "any" values
  const formatFilterValue = (value: any, formatter?: (val: string) => string) => {
    if (!value || value === 'any' || value === 'Any') return 'Any';
    return formatter ? formatter(value) : value;
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
            <li><span className="font-medium">Role:</span> {formatFilterValue(leadSettings?.role, formatRole)}</li>
            <li><span className="font-medium">Location:</span> {formatFilterValue(leadSettings?.location)}</li>
            <li><span className="font-medium">Work Type:</span> {formatFilterValue(leadSettings?.work_type, formatWorkType)}</li>
            <li><span className="font-medium">Budget:</span> {formatFilterValue(leadSettings?.budget, formatBudget)}</li>
            <li><span className="font-medium">Duration:</span> {formatFilterValue(leadSettings?.duration, formatDuration)}</li>
            <li><span className="font-medium">Hiring Status:</span> {formatFilterValue(leadSettings?.hiring_status, formatHiringStatus)}</li>
            <li><span className="font-medium">Insurance Required:</span> {leadSettings?.requires_insurance ? 'Yes' : 'Any'}</li>
            <li><span className="font-medium">Site Visits Required:</span> {leadSettings?.requires_site_visits ? 'Yes' : 'Any'}</li>
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
