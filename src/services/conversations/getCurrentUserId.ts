
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to get the current user ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};
