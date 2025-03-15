
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ClientInfo, Conversation } from '@/types/messaging';

// Get current user ID helper
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};

// Fetch all conversations for a user
export const fetchConversations = async (userId: string) => {
  try {
    // First fetch all conversations
    const { data: conversationsData, error: conversationsError } = await (supabase
      .from('conversations') as any)
      .select(`
        id, 
        client_id, 
        freelancer_id, 
        project_id, 
        last_message_time,
        projects:project_id (title)
      `)
      .eq('freelancer_id', userId)
      .order('last_message_time', { ascending: false });
    
    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      toast({
        title: "Failed to load conversations",
        description: conversationsError.message,
        variant: "destructive"
      });
      return [];
    }
    
    // Then fetch client info separately for each conversation
    const formattedConversations = await Promise.all(conversationsData.map(async (conv: any) => {
      // Get client info from client_profiles
      const { data: clientData, error: clientError } = await supabase
        .from('client_profiles')
        .select('contact_name, company_name')
        .eq('id', conv.client_id)
        .maybeSingle();
      
      if (clientError) {
        console.error('Error fetching client info:', clientError);
      }
      
      let clientInfo: ClientInfo;
      
      // If no client profile found, try to get user data from auth using edge function
      if (!clientData) {
        try {
          // Call the edge function to get user email and full name
          const { data: userData, error: userError } = await supabase.functions.invoke('get-user-email', {
            body: { userId: conv.client_id }
          });
          
          if (userError) {
            console.error('Error fetching user data from edge function:', userError);
            clientInfo = {
              contact_name: 'Unknown Client',
              company_name: null,
              email: null
            };
          } else {
            // Use the full name if available, otherwise fallback to email username
            clientInfo = {
              contact_name: userData?.full_name || (userData?.email ? userData.email.split('@')[0] : 'Unknown Client'),
              company_name: null,
              email: userData?.email || null
            };
          }
        } catch (error) {
          console.error('Error calling edge function:', error);
          clientInfo = {
            contact_name: 'Unknown Client',
            company_name: null,
            email: null
          };
        }
      } else {
        // Use the client profile data
        clientInfo = {
          contact_name: clientData.contact_name || 'Unknown Client',
          company_name: clientData.company_name,
          email: null
        };
      }
      
      return {
        ...conv,
        project_title: conv.projects?.title || 'Unknown Project',
        client_info: clientInfo
      };
    }));
    
    return formattedConversations;
  } catch (e) {
    console.error('Error in fetchConversations:', e);
    toast({
      title: "Failed to load conversations",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

// Create a new conversation
export const createConversation = async (freelancerId: string, clientId: string, projectId: string) => {
  try {
    // Get the project title
    const { data: projectData } = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single();
    
    // Get client info
    const { data: clientData } = await supabase
      .from('client_profiles')
      .select('contact_name, company_name')
      .eq('id', clientId)
      .maybeSingle();
    
    let clientInfo: ClientInfo;
    
    // If no client profile found, try to get user data from auth
    if (!clientData) {
      try {
        const { data: userData, error: userError } = await supabase.functions.invoke('get-user-email', {
          body: { userId: clientId }
        });
        
        if (userError || !userData) {
          clientInfo = {
            contact_name: 'Unknown Client',
            company_name: null,
            email: null
          };
        } else {
          clientInfo = {
            contact_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Unknown Client'),
            company_name: null,
            email: userData.email || null
          };
        }
      } catch (error) {
        console.error('Error calling edge function:', error);
        clientInfo = {
          contact_name: 'Unknown Client',
          company_name: null,
          email: null
        };
      }
    } else {
      clientInfo = {
        contact_name: clientData.contact_name || 'Unknown Client',
        company_name: clientData.company_name,
        email: null
      };
    }
    
    // We need to use type assertion because conversations table isn't in the Supabase type definition
    const { data, error } = await (supabase
      .from('conversations') as any)
      .insert({
        freelancer_id: freelancerId,
        client_id: clientId,
        project_id: projectId,
        last_message_time: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Failed to create conversation",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    const newConversation: Conversation = {
      ...data,
      project_title: projectData?.title || 'Unknown Project',
      client_info: clientInfo
    };
    
    return newConversation;
  } catch (e) {
    console.error('Error in createConversation:', e);
    toast({
      title: "Failed to create conversation",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Update conversation's last message time
export const updateConversationTime = async (conversationId: string) => {
  try {
    return await (supabase
      .from('conversations') as any)
      .update({ last_message_time: new Date().toISOString() })
      .eq('id', conversationId);
  } catch (error) {
    console.error('Error updating conversation time:', error);
    return { error };
  }
};
