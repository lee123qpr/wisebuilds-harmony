
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export async function fetchCompletedJobsCount(user: User | null, profileData: any) {
  if (!user) return 0;
  
  // Get jobs count directly from the profile data first
  let jobsCount = profileData?.jobs_completed || 0;
  
  // Try to get a more accurate count from completed quotes
  try {
    // Count completed jobs where the freelancer participated
    const { count, error: countError } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('freelancer_id', user.id)
      .eq('freelancer_completed', true)
      .eq('client_completed', true)
      .not('completed_at', 'is', null);
      
    if (!countError && count !== null) {
      // If we got a valid count, use it
      jobsCount = count;
    }
  } catch (countErr) {
    console.error('Error counting completed jobs:', countErr);
  }
  
  console.log('Setting jobs completed count to:', jobsCount);
  return jobsCount;
}
