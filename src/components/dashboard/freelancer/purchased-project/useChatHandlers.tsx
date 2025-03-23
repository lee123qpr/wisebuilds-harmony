
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { createConversation } from '@/services/conversations';

export const useChatHandlers = (project: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleStartChat = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to start a conversation',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate project data
    if (!project?.id || !project?.user_id) {
      toast({
        title: 'Invalid project data',
        description: 'Could not start conversation due to missing project information',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Check if conversation already exists
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', project.id)
        .eq('freelancer_id', user.id)
        .eq('client_id', project.user_id);
        
      if (checkError) throw checkError;
      
      if (existingConversations && existingConversations.length > 0) {
        navigate(`/dashboard/freelancer?tab=messages&conversation=${existingConversations[0].id}`);
      } else {
        // Create a new conversation
        const newConversation = await createConversation(user.id, project.user_id, project.id);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        navigate(`/dashboard/freelancer?tab=messages&conversation=${newConversation.id}`);
      }
    } catch (error: any) {
      toast({
        title: 'Error starting chat',
        description: error.message || 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };
  
  return { handleStartChat };
};
