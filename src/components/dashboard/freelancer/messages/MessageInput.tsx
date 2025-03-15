
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  attachments?: File[];
  onRemoveAttachment?: (index: number) => void;
  isUploading?: boolean;
  uploadProgress?: {[key: string]: number};
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
  uploadProgress = {}
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFileTip, setShowFileTip] = useState(false);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
    setShowFileTip(true);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (file.type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (file.type.includes('word') || file.type.includes('document')) return <FileText className="h-4 w-4 text-blue-700" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FileText className="h-4 w-4 text-green-600" />;
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
        <Alert variant="default" className="mb-3 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            Max file size is 30MB. For larger files, consider using <a href="https://wetransfer.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WeTransfer</a> or similar services and paste the link in your message.
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 ml-auto" 
            onClick={() => setShowFileTip(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 max-h-[120px] overflow-y-auto p-2 bg-muted/30 rounded-md">
          {attachments.map((file, index) => {
            const progress = uploadProgress[index];
            const isUploading = progress !== undefined && progress >= 0 && progress < 100;
            const hasError = progress === -1;
            
            return (
              <div 
                key={index}
                className={`flex items-center gap-1 p-2 rounded text-xs ${
                  hasError ? 'bg-red-100 border-red-200' : 'bg-muted/50 border'
                }`}
              >
                <span className="mr-1">{getFileIcon(file)}</span>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate max-w-[120px]">{file.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1" 
                      onClick={() => onRemoveAttachment?.(index)}
                      disabled={isSending || isUploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-muted-foreground block">{getFileSize(file.size)}</span>
                  
                  {isUploading && (
                    <Progress value={progress} className="h-1 mt-1" />
                  )}
                  
                  {hasError && (
                    <span className="text-red-500 text-[10px]">Upload failed</span>
                  )}
                </div>
              </div>
            );
          })}
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
