
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactInfoActionsProps {
  projectId: string;
  clientId: string;
}

const ContactInfoActions: React.FC<ContactInfoActionsProps> = ({ 
  projectId,
  clientId 
}) => {
  const navigate = useNavigate();

  const handleMessageNow = () => {
    navigate(`/dashboard/freelancer?tab=messages&projectId=${projectId}&clientId=${clientId}`);
  };

  const handleViewProfile = () => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="flex items-center pt-2 gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        className="border-blue-200 hover:bg-blue-100 text-blue-700"
        onClick={handleViewProfile}
      >
        <User className="h-4 w-4 mr-2" />
        View Client Profile
      </Button>
      
      <Button
        variant="default"
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={handleMessageNow}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Message Now
      </Button>
    </div>
  );
};

export default ContactInfoActions;
