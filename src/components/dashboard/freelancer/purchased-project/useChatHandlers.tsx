
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
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Validate project data
      if (!project?.id) {
        console.error('Missing project ID', project);
        throw new Error('Missing project ID');
      }
      
      if (!project?.user_id) {
        console.error('Missing client ID', project);
        throw new Error('Missing client ID');
      }
      
      console.log('Starting chat between freelancer', user.id, 'and client', project.user_id, 'for project', project.id);
      
      // Check if conversation already exists
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', project.id)
        .eq('freelancer_id', user.id)
        .eq('client_id', project.user_id);
        
      if (checkError) throw checkError;
      
      if (existingConversations && existingConversations.length > 0) {
        console.log('Using existing conversation:', existingConversations[0].id);
        navigate(`/dashboard/freelancer?tab=messages&conversation=${existingConversations[0].id}`);
      } else {
        // Create a new conversation
        const newConversation = await createConversation(user.id, project.user_id, project.id);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        console.log('Created new conversation:', newConversation.id);
        navigate(`/dashboard/freelancer?tab=messages&conversation=${newConversation.id}`);
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
  
  return { handleStartChat };
};
