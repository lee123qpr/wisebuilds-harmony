
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LeadSettingsAlertProps {
  isLoading: boolean;
}

const LeadSettingsAlert: React.FC<LeadSettingsAlertProps> = ({ isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>No Lead Settings</CardTitle>
        <CardDescription>Set up your lead preferences to get customized project recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => navigate('/dashboard/freelancer/lead-settings')}
          className="w-full"
        >
          Set Up Lead Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default LeadSettingsAlert;
