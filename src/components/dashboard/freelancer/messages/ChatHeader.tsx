
import React from 'react';
import { Mail, User } from 'lucide-react';
import { Conversation } from '@/hooks/messages/useConversations';

interface ChatHeaderProps {
  conversation: Conversation;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  return (
    <div className="p-3 bg-muted/50 border-b">
      <div className="font-medium">
        {conversation.client_info?.contact_name || 'Unknown Client'}
      </div>
      <div className="text-sm text-muted-foreground">
        {conversation.project_title}
      </div>
      
      {/* Client contact details */}
      <div className="flex flex-wrap gap-4 mt-2 text-xs">
        {conversation.client_info?.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>{conversation.client_info.email}</span>
          </div>
        )}
        {conversation.client_info?.company_name && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{conversation.client_info.company_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
