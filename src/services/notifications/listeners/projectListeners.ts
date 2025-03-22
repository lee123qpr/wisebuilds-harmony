
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Setup a listener for new projects
export const createProjectListener = (
  userId: string,
  onNewProject: (project: any) => void
): RealtimeChannel => {
  console.log('Setting up project listener for user:', userId);
  
  return supabase
    .channel('public:projects')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'projects',
      },
      (payload) => {
        console.log('New project received:', payload.new);
        onNewProject(payload.new);
      }
    )
    .subscribe();
};
