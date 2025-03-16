
import { supabase } from '@/integrations/supabase/client';
import { PurchaseLeadOptions, PurchaseLeadResult } from '../types';

export const purchaseLeadApi = async (options: PurchaseLeadOptions): Promise<PurchaseLeadResult> => {
  const { projectId, message } = options;
  
  // Call the apply_to_project RPC function
  const { data, error } = await supabase.rpc('apply_to_project', {
    project_id: projectId,
    message: message || null,
    credits_to_use: 1
  });

  if (error) {
    console.error('RPC error:', error);
    throw error;
  }

  // Check if data exists and is not null
  if (!data) {
    console.error('No data returned from server');
    throw new Error('No data returned from server');
  }
  
  // Determine if operation was successful
  let success = false;
  let responseMessage = 'Unknown response format';
  
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    // It's an object, extract success and message properties if they exist
    success = data.success === true;
    responseMessage = typeof data.message === 'string' ? data.message : 'Unknown error';
  }
  
  return {
    success,
    message: responseMessage
  };
};
