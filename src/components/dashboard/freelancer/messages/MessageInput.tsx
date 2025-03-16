
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { MessageAttachment } from '@/types/messaging';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSending: boolean;
  onFileSelect?: (files: FileList | null) => void;
  attachments?: File[];
  onRemoveAttachment?: (index: number) => void;
  isUploading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  isSending,
  onFileSelect,
  attachments = [],
  onRemoveAttachment,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div className="p-3 border-t">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-muted/50 pl-2 pr-1 py-1 rounded text-xs"
            >
              <span>{getFileIcon(file.type)}</span>
              <span className="max-w-[120px] truncate">{file.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5" 
                onClick={() => onRemoveAttachment?.(index)}
                disabled={isSending}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {onFileSelect && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={(e) => onFileSelect(e.target.files)}
              className="hidden"
              disabled={isSending}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={handleAttachClick}
              disabled={isSending}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </>
        )}
        
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
          disabled={((!value.trim()) && attachments.length === 0) || isSending}
        >
          {(isSending || isUploading) ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isUploading ? 'Uploading...' : 'Sending...'}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
