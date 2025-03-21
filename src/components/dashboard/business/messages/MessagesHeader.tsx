
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MessagesHeaderProps {
  conversationCount: number;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({ conversationCount }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <MessageSquare className="h-6 w-6 text-primary" />
      <h2 className="text-2xl font-bold tracking-tight">
        Messages
      </h2>
      <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
        {conversationCount}
      </Badge>
    </div>
  );
};

export default MessagesHeader;
