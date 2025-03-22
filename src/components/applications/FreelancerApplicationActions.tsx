
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createConversation } from '@/services/conversations';
import { useAuth } from '@/context/AuthContext';
import { FreelancerProfile } from '@/types/applications';

interface FreelancerApplicationActionsProps {
  profile?: FreelancerProfile;
  projectId: string;
}

const FreelancerApplicationActions: React.FC<FreelancerApplicationActionsProps> = ({ profile, projectId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStartChat = async () => {
    try {
      const clientId = user?.id;
      if (!clientId) {
        throw new Error('Not authenticated');
      }
      
      if (!profile?.id) {
        throw new Error('Freelancer profile not found');
      }
      
      console.log('Starting chat between client', clientId, 'and freelancer', profile.id, 'for project', projectId);
      
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', projectId)
        .eq('freelancer_id', profile.id)
        .eq('client_id', clientId);
        
      if (checkError) throw checkError;
      
      if (existingConversations && existingConversations.length > 0) {
        console.log('Using existing conversation:', existingConversations[0].id);
        navigate(`/dashboard/business?tab=messages&conversation=${existingConversations[0].id}`);
      } else {
        const newConversation = await createConversation(profile.id, clientId, projectId);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        console.log('Created new conversation:', newConversation.id);
        navigate(`/dashboard/business?tab=messages&conversation=${newConversation.id}`);
      }
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: 'Error starting chat',
        description: error.message || 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const handleViewProfile = () => {
    if (!profile?.id) {
      toast({
        title: "Profile not available",
        description: "This freelancer's profile cannot be viewed at this time.",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate directly to the freelancer's profile page with state data
    // This ensures FreelancerProfileView knows where to return to
    navigate(`/freelancer/${profile.id}`, {
      state: { 
        from: 'projectApplications', 
        projectId 
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button 
        onClick={handleStartChat}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Message now
      </Button>
      
      <Button 
        variant="outline"
        onClick={handleViewProfile}
      >
        View full profile
      </Button>
    </div>
  );
};

export default FreelancerApplicationActions;
