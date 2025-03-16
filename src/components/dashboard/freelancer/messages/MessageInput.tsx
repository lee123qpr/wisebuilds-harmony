
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, X, File, Loader2 } from 'lucide-react';
import { MessageAttachment } from '@/types/messaging';
import { Progress } from '@/components/ui/progress';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isSending: boolean;
  onFileSelect: (files: FileList) => void;
  attachments: MessageAttachment[];
  onRemoveAttachment: (id: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  isSending,
  onFileSelect,
  attachments,
  onRemoveAttachment,
  isUploading,
  uploadProgress
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-3 border-t bg-white">
      {/* Attachments display */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"
            >
              <File className="h-3 w-3" />
              <span className="text-xs truncate max-w-[100px]">
                {attachment.name}
              </span>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* File upload progress */}
      {isUploading && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs">Uploading...</span>
            <span className="text-xs">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1" />
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="relative flex-grow">
          <textarea
            placeholder="Type a message..."
            className="w-full border rounded-md py-2 px-3 resize-none min-h-[80px] max-h-[150px]"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={isSending}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFileButtonClick}
            disabled={isSending || isUploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            size="icon"
            onClick={onSend}
            disabled={isSending || (value.trim() === '' && attachments.length === 0)}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
};

export default MessageInput;
