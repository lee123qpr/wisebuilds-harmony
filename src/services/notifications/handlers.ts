
import { Notification, NotificationType } from './types';
import { supabase } from '@/integrations/supabase/client';
import { sendLeadMatchEmail, sendNotificationEmail } from './emailService';

/**
 * Handle a new message notification
 */
export const handleNewMessage = async (
  message: any,
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void,
  recipientId: string
) => {
  try {
    // First, get conversation details to craft the notification
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', message.conversation_id)
      .single();
      
    if (convError) {
      console.error('Error fetching conversation for notification:', convError);
      return;
    }
    
    // Determine if this is for a client or freelancer
    const isForClient = conversation.client_id === recipientId;
    const senderId = isForClient ? conversation.freelancer_id : conversation.client_id;
    
    // Get sender name
    const { data: senderData } = await supabase
      .from(isForClient ? 'freelancer_profiles' : 'client_profiles')
      .select(isForClient ? 'first_name, last_name' : 'contact_name, company_name')
      .eq('id', senderId)
      .single();
    
    // Create sender name
    const senderName = isForClient 
      ? `${senderData?.first_name || ''} ${senderData?.last_name || ''}`.trim()
      : (senderData?.company_name || senderData?.contact_name || 'Client');
    
    // Create the notification
    const notification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
      type: 'message' as NotificationType,
      title: `New message from ${senderName}`,
      description: message.message.length > 100 
        ? `${message.message.substring(0, 100)}...` 
        : message.message,
      user_id: recipientId,
      data: {
        conversation_id: message.conversation_id,
        message_id: message.id,
        sender_id: message.sender_id
      }
    };
    
    // Add notification to the UI state
    addNotification(notification);
    
    // Create notification in database
    const { data: notifData, error: notifError } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
      
    if (notifError) {
      console.error('Error creating message notification in DB:', notifError);
      return;
    }
    
    // Check if user has email notifications enabled
    const { data: userSettings } = await supabase
      .from('lead_settings')
      .select('email_alerts')
      .eq('user_id', recipientId)
      .single();
      
    // Get recipient email
    const { data: userData } = await supabase
      .from(isForClient ? 'client_profiles' : 'freelancer_profiles')
      .select('email')
      .eq('id', recipientId)
      .single();
      
    if (userSettings?.email_alerts && userData?.email) {
      // Send email notification
      await sendNotificationEmail(
        recipientId,
        userData.email,
        notifData
      );
    }
    
  } catch (error) {
    console.error('Error in handleNewMessage:', error);
  }
};

/**
 * Handle new project match for leads notification
 */
export const handleNewProjectMatch = async (
  project: any,
  freelancerId: string,
  freelancerName: string,
  freelancerEmail: string,
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void
) => {
  try {
    // Create the notification
    const notification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
      type: 'lead' as NotificationType,
      title: 'New Lead Available',
      description: `A new project "${project.title}" matching your criteria has been posted`,
      user_id: freelancerId,
      data: {
        id: project.id,
        title: project.title
      }
    };
    
    // Add notification to the UI state
    addNotification(notification);
    
    // Create notification in database
    const { data: notifData, error: notifError } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
      
    if (notifError) {
      console.error('Error creating lead notification in DB:', notifError);
      return;
    }
    
    // Check if user has email notifications enabled
    const { data: userSettings } = await supabase
      .from('lead_settings')
      .select('email_alerts')
      .eq('user_id', freelancerId)
      .single();
      
    if (userSettings?.email_alerts && freelancerEmail) {
      // Send email notification for lead match
      await sendLeadMatchEmail(
        freelancerId,
        project.id,
        freelancerEmail,
        freelancerName
      );
    }
    
  } catch (error) {
    console.error('Error in handleNewProjectMatch:', error);
  }
};
