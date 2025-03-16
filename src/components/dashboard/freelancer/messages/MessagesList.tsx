
import React, { useEffect, useRef } from 'react';
import { Message, MessageAttachment } from '@/types/messaging';
import { 
  FileIcon, Paperclip, Download, FileText, Image, FileSpreadsheet, Music, 
  Video, Archive, File, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Json } from '@/integrations/supabase/types';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
}

const AttachmentPreview = ({ attachment }: { attachment: MessageAttachment }) => {
  const isImage = attachment.type.startsWith('image/');
  
  const getFileIcon = (mimeType: string, fileName: string) => {
    if (isImage) return <Image className="h-4 w-4 text-blue-500" />;
    if (mimeType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (mimeType.includes('word') || mimeType.includes('document') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) 
      return <FileText className="h-4 w-4 text-blue-700" />;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) 
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    if (mimeType.includes('audio')) return <Music className="h-4 w-4 text-purple-500" />;
    if (mimeType.includes('video')) return <Video className="h-4 w-4 text-orange-500" />;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="h-4 w-4 text-yellow-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };
  
  return (
    <a 
      href={attachment.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block mt-1 break-all"
      download={attachment.name}
    >
      {isImage ? (
        <div className="mt-1">
          <div className="relative group">
            <img 
              src={attachment.url} 
              alt={attachment.name} 
              className="max-w-[140px] max-h-[90px] rounded-md object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs truncate max-w-[140px]">{attachment.name}</span>
            <span className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(0)} KB</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 p-1.5 hover:bg-gray-50 transition-colors">
          {getFileIcon(attachment.type, attachment.name)}
          <div className="flex-grow truncate">
            <span className="text-xs font-medium text-gray-900 truncate block">{attachment.name}</span>
            <span className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(0)} KB</span>
          </div>
          <Download className="h-3 w-3 text-gray-500 flex-shrink-0" />
        </div>
      )}
    </a>
  );
};

// Helper function to safely get array length with type checking
const getAttachmentsLength = (attachments: MessageAttachment[] | Json | null | undefined): number => {
  if (!attachments) return 0;
  if (Array.isArray(attachments)) return attachments.length;
  return 0;
};

// Helper function to safely get attachments array
const getAttachmentsArray = (attachments: MessageAttachment[] | Json | null | undefined): MessageAttachment[] => {
  if (!attachments) return [];
  if (Array.isArray(attachments)) return attachments;
  return [];
};

const MessagesList: React.FC<MessagesListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map(message => {
        const isCurrentUser = message.sender_id === currentUserId;
        const hasAttachments = getAttachmentsLength(message.attachments) > 0;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-2.5 ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              {message.message && 
                <div className="mb-1">{message.message}</div>
              }
              
              {/* Display attachments if any */}
              {hasAttachments && (
                <div className={`${message.message ? 'mt-2 pt-1 border-t border-opacity-10' : ''} space-y-1`}>
                  <div className="text-xs font-medium mb-0.5 opacity-70 flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {getAttachmentsLength(message.attachments) === 1 ? '1 attachment' : `${getAttachmentsLength(message.attachments)} attachments`}
                  </div>
                  <div className="space-y-1">
                    {getAttachmentsArray(message.attachments).map((attachment, index) => (
                      <AttachmentPreview key={index} attachment={attachment} />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs opacity-75 mt-1 text-right">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
