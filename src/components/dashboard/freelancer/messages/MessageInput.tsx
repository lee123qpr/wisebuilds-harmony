
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  isSending
}) => {
  return (
    <div className="p-3 border-t">
      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={isSending}
          className="flex-grow"
        />
        <Button 
          onClick={onSend} 
          disabled={!value.trim() || isSending}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
