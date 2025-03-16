
import React from 'react';
import { Conversation } from '@/types/messaging';
import { ArrowLeft, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ChatHeaderProps {
  conversation: Conversation;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  const clientName = conversation.client_info?.contact_name || 'Unknown Client';
  const companyName = conversation.client_info?.company_name;
  const projectTitle = conversation.project_title;

  return (
    <div className="p-3 border-b flex items-center gap-3 bg-white">
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-primary/10 text-primary rounded-full p-2">
        <User className="h-5 w-5" />
      </div>
      
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
