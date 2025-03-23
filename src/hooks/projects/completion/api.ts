
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks the completion status of a quote
 */
export const checkCompletionStatus = async (quoteId: string) => {
  if (!quoteId) return null;
  
  console.log('Checking completion status for quote:', quoteId);
  
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('freelancer_completed, client_completed, completed_at')
      .eq('id', quoteId)
      .single();
      
    if (error) {
      console.error('Error checking completion status:', error);
      return null;
    }
    
    console.log('Completion status:', data);
    return data;
  } catch (err) {
    console.error('Exception checking completion status:', err);
    return null;
  }
};

/**
 * Updates the quote with the user's completion status and increments jobs_completed count if both parties have completed
 */
export const updateQuoteCompletionStatus = async (
  quoteId: string, 
  projectId: string, 
  userId: string, 
  isFreelancer: boolean
) => {
  console.log('Marking project as complete:', { projectId, quoteId, userId, isFreelancer });
  
  // Determine whether this is a freelancer or client based on user metadata
  // Update the appropriate completion field based on user type
  const updateField = isFreelancer ? 'freelancer_completed' : 'client_completed';
  
  console.log(`Setting ${updateField} to true for quote ${quoteId}`);
  
  try {
    // Get the quote to check current status and get freelancer ID
    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .select('freelancer_id, client_id, freelancer_completed, client_completed')
      .eq('id', quoteId)
      .single();
      
    if (quoteError) {
      console.error('Error getting quote data:', quoteError);
      throw quoteError;
    }
    
    // Update the quote's completion status
    const { data, error } = await supabase
      .from('quotes')
      .update({ 
        [updateField]: true,
        // If both parties are marking complete, set the completed_at timestamp
        ...((!isFreelancer && quoteData.freelancer_completed) || 
           (isFreelancer && quoteData.client_completed) 
            ? { completed_at: new Date().toISOString() } 
            : {})
      })
      .eq('id', quoteId)
      .select('freelancer_completed, client_completed')
      .single();
      
    if (error) {
      console.error('Error updating completion status:', error);
      throw error;
    }
    
    // Check if both parties have now marked it as complete
    const bothCompleted = data.freelancer_completed && data.client_completed;
    
    if (bothCompleted) {
      // If both parties have completed, increment the jobs_completed counter for the freelancer
      const freelancerId = quoteData.freelancer_id;
      
      console.log('Both parties marked complete, incrementing jobs_completed for freelancer:', freelancerId);
      
      // First, get the current jobs_completed count
      const { data: profileData, error: fetchError } = await supabase
        .from('freelancer_profiles')
        .select('jobs_completed')
        .eq('id', freelancerId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching jobs_completed count:', fetchError);
        // Continue despite error in fetching
      }
      
      // Calculate the new count (default to 1 if we couldn't fetch the current value)
      const currentCount = profileData?.jobs_completed || 0;
      const newCount = currentCount + 1;
      
      console.log(`Updating jobs_completed from ${currentCount} to ${newCount}`);
      
      // Update the freelancer's completed jobs count
      const { error: updateError } = await supabase
        .from('freelancer_profiles')
        .update({ jobs_completed: newCount })
        .eq('id', freelancerId);
      
      if (updateError) {
        console.error('Error incrementing jobs_completed:', updateError);
        // Don't throw here, just log the error since the primary operation succeeded
      } else {
        console.log('Successfully updated jobs_completed to', newCount);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Exception in project completion:', error);
    throw error;
  }
};

/**
 * Marks a project as incomplete and sends a reason message
 */
export const revertCompletionStatus = async (
  quoteId: string,
  projectId: string,
  userId: string,
  isFreelancer: boolean,
  reason: string
) => {
  console.log('Marking project as incomplete:', { projectId, quoteId, userId, isFreelancer });
  
  try {
    // Start a transaction to ensure both operations succeed or fail together
    const updateField = isFreelancer ? 'freelancer_completed' : 'client_completed';
    
    // 1. Update the completion status to false
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ [updateField]: false })
      .eq('id', quoteId);
      
    if (updateError) {
      console.error('Error reverting completion status:', updateError);
      throw updateError;
    }
    
    // 2. Create a new message in the conversation
    // First, get the conversation ID
    const { data: conversationData, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('project_id', projectId)
      .single();
      
    if (convError) {
      console.error('Error finding conversation:', convError);
      throw convError;
    }
    
    // Then, send the message
    const conversationId = conversationData.id;
    const completionMessageText = isFreelancer 
      ? "I've marked this project as incomplete because: " + reason
      : "I've marked this project as incomplete because: " + reason;
      
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        message: completionMessageText
      });
      
    if (messageError) {
      console.error('Error sending completion message:', messageError);
      throw messageError;
    }
    
    // Return success with conversation details
    return { success: true, conversationId };
  } catch (error) {
    console.error('Exception in project revert completion:', error);
    throw error;
  }
};
