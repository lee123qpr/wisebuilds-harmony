
import { supabase } from '@/integrations/supabase/client';

/**
 * Logs detailed diagnostics for quote fetching
 */
export const logQuoteFetchDiagnostics = (
  projectId?: string, 
  forClient: boolean = false, 
  userId?: string, 
  includeAllQuotes: boolean = false
) => {
  console.log('------------- QUOTE FETCH DIAGNOSTICS START -------------');
  console.log('Fetching quotes for', forClient ? 'client' : 'freelancer', 'with projectId:', projectId);
  console.log('User ID:', userId);
  console.log('Include all quotes (bypass client filter):', includeAllQuotes);
};

/**
 * Verifies project ownership
 */
export const verifyProjectOwnership = async (projectId: string, userId: string) => {
  if (!projectId || !userId) {
    console.warn('Missing projectId or userId for ownership verification');
    return false;
  }

  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', projectId)
    .single();
    
  if (projectError) {
    console.error('Error verifying project ownership:', projectError);
    return false;
  } 
  
  console.log('Project data:', projectData);
  
  if (projectData.user_id !== userId) {
    console.warn('Project does not belong to current user. Project user_id:', projectData.user_id, 'Current user_id:', userId);
    return false;
  }
  
  return true;
};

/**
 * Logs a sample of quotes from the system for debugging
 */
export const logSystemQuotesSample = async () => {
  console.log('Checking if there are ANY quotes in the system:');
  const { data: systemQuotes, error: systemError } = await supabase
    .from('quotes')
    .select('*')
    .limit(10);
    
  if (systemError) {
    console.error('Error fetching system quotes sample:', systemError);
    return;
  }
  
  if (systemQuotes && systemQuotes.length > 0) {
    console.log('Sample of quotes in the system:', systemQuotes);
    const projects = [...new Set(systemQuotes.map(q => q.project_id))];
    const clients = [...new Set(systemQuotes.map(q => q.client_id))];
    const freelancers = [...new Set(systemQuotes.map(q => q.freelancer_id))];
    console.log('Projects with quotes:', projects);
    console.log('Clients with quotes:', clients);
    console.log('Freelancers with quotes:', freelancers);
  } else {
    console.log('No quotes found in the system');
  }
  
  console.log('------------- QUOTE FETCH DIAGNOSTICS END -------------');
};

/**
 * Checks for all quotes related to a project regardless of client/freelancer
 */
export const checkAllProjectQuotes = async (projectId: string) => {
  if (!projectId) {
    console.warn('Missing projectId for checkAllProjectQuotes');
    return null;
  }
  
  console.log('Checking ALL quotes for this project regardless of client_id...');
  
  // Get all quotes for this project without any client/freelancer filtering
  const { data: allQuotesData, error: allQuotesError } = await supabase
    .from('quotes')
    .select('*')
    .eq('project_id', projectId);
    
  if (allQuotesError) {
    console.error('Error checking all project quotes:', allQuotesError);
    return null;
  }
  
  if (allQuotesData && allQuotesData.length > 0) {
    console.log('Found quotes for this project:', allQuotesData.length, 'quotes');
    console.log('Quote client_ids:', allQuotesData.map(q => q.client_id));
    console.log('Quote freelancer_ids:', allQuotesData.map(q => q.freelancer_id));
  } else {
    console.log('No quotes found for this project at all');
  }
  
  return allQuotesData;
};
