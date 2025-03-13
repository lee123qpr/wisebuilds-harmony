
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

interface DashboardHeaderProps {
  fullName: string;
  hasLeadSettings: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ fullName, hasLeadSettings }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {fullName}</h1>
        <p className="text-muted-foreground">Your freelancer dashboard</p>
      </div>
      <Button 
        onClick={() => navigate('/dashboard/freelancer/lead-settings')}
        className="flex items-center gap-2"
      >
        <Settings size={16} />
        {hasLeadSettings ? 'Update Lead Settings' : 'Set Up Lead Settings'}
      </Button>
    </div>
  );
};

export default DashboardHeader;
