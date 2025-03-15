
import React from 'react';
import { Conversation } from '@/types/messaging';
import { Button } from '@/components/ui/button';
import { RefreshCcw, User, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onRefresh,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="p-3 space-y-2">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden flex flex-col h-full">
      <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
        <h3 className="font-medium">Conversations</h3>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh}
          title="Refresh conversations"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-y-auto flex-grow">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No conversations found
          </div>
        ) : (
          conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">
                    {conversation.client_info?.contact_name || 'Unknown Client'}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary truncate mt-1">
                    <Briefcase className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{conversation.project_title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(conversation.last_message_time), 'dd/MM/yyyy, HH:mm')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
