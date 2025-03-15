
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
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = fileName; // Simplified path without folder prefix
    
    const bucketName = 'attachments';
    console.log(`Attempting to upload file "${file.name}" (${file.size} bytes) to bucket "${bucketName}" with path "${filePath}"`);
    
    // Check if bucket exists first
    const { data: buckets, error: bucketsError } = await supabase.storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      toast({
        title: "Failed to access storage",
        description: bucketsError.message,
        variant: "destructive"
      });
      return null;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.error(`Bucket "${bucketName}" does not exist in this Supabase project`);
      toast({
        title: "Storage configuration error",
        description: `The required storage bucket "${bucketName}" is not configured.`,
        variant: "destructive"
      });
      return null;
    }
    
    // Upload the file to the bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      toast({
        title: "Failed to upload file",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    console.log('File uploaded successfully. Public URL:', publicUrl);
    
    return {
      id: filePath,
      name: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
      path: filePath
    };
  } catch (e) {
    console.error('Error in uploadMessageAttachment:', e);
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
