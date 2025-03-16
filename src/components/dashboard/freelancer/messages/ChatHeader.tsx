
import React from 'react';
import { Conversation } from '@/types/messaging';
import { ArrowLeft, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatHeaderProps {
  conversation: Conversation;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  const clientName = conversation.client_info?.contact_name || 'Unknown Client';
  const companyName = conversation.client_info?.company_name;
  const projectTitle = conversation.project_title;
  const logoUrl = conversation.client_info?.logo_url;

  // Get initials for avatar fallback
  const getInitials = () => {
    if (companyName) {
      return companyName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return clientName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-3 border-b flex items-center gap-3 bg-white">
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <Avatar className="h-9 w-9">
        {logoUrl ? (
          <AvatarImage src={logoUrl} alt={companyName || clientName} />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-grow min-w-0">
        <div className="font-medium truncate">
          {clientName}
          {companyName && (
            <span className="ml-1 text-sm text-muted-foreground">
              ({companyName})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
          <Briefcase className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">Project: {projectTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
