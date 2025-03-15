
import React, { useEffect, useRef } from 'react';
import { Message, MessageAttachment } from '@/types/messaging';
import { FileIcon, Paperclip, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
}

const AttachmentPreview = ({ attachment }: { attachment: MessageAttachment }) => {
  const isImage = attachment.type.startsWith('image/');
  
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    return '📎';
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
              className="max-w-[180px] max-h-[120px] rounded-md object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs truncate max-w-[160px]">{attachment.name}</span>
            <span className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(0)} KB</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-1.5 bg-background/80 rounded-md border hover:bg-muted/30 transition-colors">
          <span className="text-base">{getFileIcon(attachment.type)}</span>
          <div className="flex-grow truncate">
            <span className="text-xs font-medium truncate block">{attachment.name}</span>
            <span className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(0)} KB</span>
          </div>
          <Download className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        </div>
      )}
    </a>
  );
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
        const hasAttachments = message.attachments && message.attachments.length > 0;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
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
                <div className={`${message.message ? 'mt-2 pt-1 border-t border-opacity-20' : ''} space-y-1`}>
                  <div className="text-xs font-medium mb-0.5 opacity-70 flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {message.attachments.length === 1 ? '1 attachment' : `${message.attachments.length} attachments`}
                  </div>
                  <div className="space-y-1.5">
                    {message.attachments?.map((attachment, index) => (
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
