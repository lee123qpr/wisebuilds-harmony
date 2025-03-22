
import { supabase } from '@/integrations/supabase/client';
import { NotificationType } from '../types';

// Process new message and create a notification
export const handleNewMessage = async (message: any, addNotification: (notification: any) => void) => {
  console.log('Processing message for notification:', message);
  try {
    // Get conversation details to determine who sent the message
    const { data: conversationData, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', message.conversation_id)
      .single();
    
    if (convError || !conversationData) {
      console.error('Error fetching conversation data:', convError);
      return;
    }
    
    let senderName = 'Someone';
    
    // If the sender is the client, get client info
    if (conversationData.client_id === message.sender_id) {
      const { data: clientData } = await supabase
        .from('client_profiles')
        .select('company_name, contact_name')
        .eq('id', message.sender_id)
        .maybeSingle();
        
      if (clientData) {
        senderName = clientData.company_name || clientData.contact_name || 'A client';
      } else {
        // Try to get from auth via edge function
        try {
          const { data: userData } = await supabase.functions.invoke(
            'get-user-email',
            { body: { userId: message.sender_id } }
          );
          
          if (userData) {
            senderName = userData.full_name || userData.email?.split('@')[0] || 'A client';
          }
        } catch (err) {
          console.error('Error fetching user data from edge function:', err);
        }
      }
    } 
    // If the sender is the freelancer, get freelancer info
    else if (conversationData.freelancer_id === message.sender_id) {
      const { data: freelancerData } = await supabase
        .from('freelancer_profiles')
        .select('display_name, first_name, last_name')
        .eq('id', message.sender_id)
        .maybeSingle();
        
      if (freelancerData) {
        senderName = freelancerData.display_name || 
                    `${freelancerData.first_name || ''} ${freelancerData.last_name || ''}`.trim() || 
                    'A freelancer';
      }
    }
    
    console.log('Creating notification for message from:', senderName);
    
    const notification = {
      type: 'message' as NotificationType,
      title: `New Message from ${senderName}`,
      description: message.message?.substring(0, 50) || 'You have received a new message',
      data: {
        conversation_id: message.conversation_id,
        message: message.message,
        sender_id: message.sender_id
      }
    };
    
    console.log('Adding notification:', notification);
    addNotification(notification);
  } catch (error) {
    console.error('Error processing message notification:', error);
  }
};
