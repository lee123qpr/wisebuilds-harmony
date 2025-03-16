
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface ApplicationActionsProps {
  onStartChat: () => void;
  onViewProfile?: () => void;
}

export const ApplicationActions: React.FC<ApplicationActionsProps> = ({ 
  onStartChat,
  onViewProfile
}) => {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button 
        onClick={onStartChat}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Message now
      </Button>
      
      {onViewProfile && (
        <Button variant="outline" onClick={onViewProfile}>
          View full profile
        </Button>
      )}
    </div>
  );
};
