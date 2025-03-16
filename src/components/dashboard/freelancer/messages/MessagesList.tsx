
import React, { useEffect, useRef } from 'react';
import { Message, MessageAttachment } from '@/types/messaging';
import { Paperclip } from 'lucide-react';

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
      className="block mt-2 break-all"
    >
      {isImage ? (
        <div className="mt-2">
          <img 
            src={attachment.url} 
            alt={attachment.name} 
            className="max-w-[200px] max-h-[150px] rounded-md object-cover"
          />
          <span className="text-xs block mt-1">{attachment.name}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
          <span className="text-lg">{getFileIcon(attachment.type)}</span>
          <span className="text-sm truncate max-w-[160px]">{attachment.name}</span>
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
              {message.message && <div>{message.message}</div>}
              
              {/* Display attachments if any */}
              {hasAttachments && (
                <div className="mt-2 space-y-2">
                  {message.attachments?.map((attachment, index) => (
                    <AttachmentPreview key={index} attachment={attachment} />
                  ))}
                </div>
              )}
              
              <div className="text-xs opacity-75 mt-1">
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
