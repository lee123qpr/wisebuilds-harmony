import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUserId } from './conversations';
import { Message, MessageAttachment } from '@/types/messaging';

// Fetch messages for a conversation
export const fetchMessages = async (conversationId: string) => {
  try {
    // We need to use type assertion because messages table isn't in the Supabase type definition
    const { data, error } = await (supabase
      .from('messages') as any)
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load messages",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('Error in fetchMessages:', e);
    toast({
      title: "Failed to load messages",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

// Mark messages as read
export const markMessagesAsRead = async (messageIds: string[]) => {
  if (messageIds.length === 0) return;
  
  try {
    const { error } = await (supabase
      .from('messages') as any)
      .update({ is_read: true })
      .in('id', messageIds);
    
    if (error) {
      console.error('Error marking messages as read:', error);
    }
  } catch (e) {
    console.error('Error in markMessagesAsRead:', e);
  }
};

// Upload a file for a message
export const uploadMessageAttachment = async (file: File): Promise<MessageAttachment | null> => {
  try {
    if (!file) {
      console.error('No file provided for upload.');
      toast({
        title: "Upload failed",
        description: "No file provided",
        variant: "destructive"
      });
      return null;
    }

    const bucketName = 'attachments';
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    console.log(`Uploading file: "${file.name}" (${file.size} bytes) to bucket "${bucketName}"`);
    
    // Upload the file directly without checking if bucket exists
    // (bucket should be pre-configured in Supabase)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Change to true if you want to overwrite existing files
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      
      // Provide more specific error messages based on error code
      let errorMessage = error.message;
      if (error.message.includes('bucket')) {
        errorMessage = `Storage bucket "${bucketName}" is not configured.`;
      }
      
      toast({
        title: "Failed to upload file",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
    
    // Get the public URL for the file (getPublicUrl is synchronous)
    const publicUrl = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath).data.publicUrl;
    
    console.log('File uploaded successfully. Public URL:', publicUrl);
    
    return {
      id: filePath,
      name: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
      path: filePath // This is now valid since we updated the MessageAttachment interface
    };
  } catch (e) {
    console.error('Unexpected error during file upload:', e);
    toast({
      title: "Failed to upload file",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Send a new message
export const sendMessage = async (conversationId: string, message: string, attachments: MessageAttachment[] = []) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Generate a better default message when sending attachments
    let messageText = message.trim();
    if (!messageText && attachments.length > 0) {
      const fileTypes = [...new Set(attachments.map(a => {
        if (a.type.startsWith('image/')) return 'image';
        if (a.type.includes('pdf')) return 'PDF';
        if (a.type.includes('word') || a.type.includes('document')) return 'document';
        if (a.type.includes('spreadsheet') || a.type.includes('excel')) return 'spreadsheet';
        return 'file';
      }))];
      
      if (fileTypes.length === 1) {
        messageText = `Sent ${attachments.length > 1 ? `${attachments.length} ${fileTypes[0]}s` : `an ${fileTypes[0]}`}`;
      } else {
        messageText = `Sent ${attachments.length} files`;
      }
    }
    
    // Send the message
    const { error } = await (supabase
      .from('messages') as any)
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        message: messageText,
        is_read: false,
        attachments: attachments.length > 0 ? attachments : null
      });
    
    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Error in sendMessage:', e);
    toast({
      title: "Failed to send message",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
