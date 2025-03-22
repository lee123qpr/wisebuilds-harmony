
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, X, Loader2, FileIcon, Image, FileText, AlertCircle } from 'lucide-react';
import { MessageAttachment } from '@/types/messaging';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSending: boolean;
  onFileSelect?: (files: FileList | null) => void;
  attachments?: MessageAttachment[];
  onRemoveAttachment?: (index: number) => void;
  isUploading?: boolean;
  uploadProgress?: number;
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
  isUploading = false,
  uploadProgress = 0
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFileTip, setShowFileTip] = useState(false);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
    setShowFileTip(true);
  };

  const getFileIcon = (attachment: MessageAttachment) => {
    if (attachment.type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (attachment.type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (attachment.type.includes('word') || attachment.type.includes('document')) return <FileText className="h-4 w-4 text-blue-700" />;
    if (attachment.type.includes('excel') || attachment.type.includes('spreadsheet') || attachment.name.endsWith('.xlsx') || attachment.name.endsWith('.xls')) 
      return <FileText className="h-4 w-4 text-green-600" />;
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-3 border-t">
      {/* File size tip */}
      {showFileTip && (
        <Alert variant="default" className="mb-3 bg-blue-50 py-2 px-3">
          <div className="flex items-center w-full">
            <AlertCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
            <AlertDescription className="text-xs flex-grow">
              Max file size is 30MB. For larger files, consider using <a href="https://wetransfer.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WeTransfer</a> or similar services.
            </AlertDescription>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0 ml-1" 
              onClick={() => setShowFileTip(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 max-h-[100px] overflow-y-auto p-2 bg-muted/30 rounded-md">
          {attachments.map((attachment, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 py-1 px-2 rounded text-xs bg-white border"
            >
              <span className="mr-1">{getFileIcon(attachment)}</span>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate max-w-[120px]">{attachment.name}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 p-0" 
                    onClick={() => onRemoveAttachment?.(index)}
                    disabled={isSending || isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-muted-foreground block">{getFileSize(attachment.size)}</span>
                
                {isUploading && (
                  <Progress value={uploadProgress} className="h-1 mt-1" />
                )}
              </div>
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
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={handleAttachClick}
              disabled={isSending}
              title="Attach files (up to 30MB)"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <div className="flex-grow">
          <Input
            placeholder="Type your message..."
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={isSending}
          />
        </div>
        
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
