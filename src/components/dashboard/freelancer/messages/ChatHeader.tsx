
import React from 'react';
import { Mail, User, Briefcase } from 'lucide-react';
import { Conversation } from '@/types/messaging';

interface ChatHeaderProps {
  conversation: Conversation;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  return (
    <div className="p-3 bg-muted/50 border-b">
      <div className="font-medium text-lg">
        {conversation.client_info?.contact_name || 'Unknown Client'}
      </div>
      <div className="flex items-center gap-1 text-sm text-primary mt-1">
        <Briefcase className="h-3.5 w-3.5" />
        <span className="font-medium">{conversation.project_title}</span>
      </div>
      
      {/* Client contact details */}
      <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
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
