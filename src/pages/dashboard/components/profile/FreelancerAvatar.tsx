
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FreelancerAvatarProps {
  profileImageUrl: string | null;
  uploadingImage: boolean;
  imageKey?: string;
  initials: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: 'default' | 'lg' | 'xl';
}

const FreelancerAvatar: React.FC<FreelancerAvatarProps> = ({
  profileImageUrl,
  uploadingImage,
  imageKey = '',
  initials,
  handleImageUpload,
  className,
  size = 'default'
}) => {
  // Determine size classes
  const sizeClasses = {
    default: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  // Avatar size class
  const avatarSizeClass = sizeClasses[size];
  
  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Handle click on avatar to trigger file input
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <Avatar 
        className={cn(
          avatarSizeClass,
          "cursor-pointer border-2 border-primary/10 hover:border-primary/30 transition-colors", 
          className
        )}
        onClick={handleAvatarClick}
      >
        {profileImageUrl ? (
          <AvatarImage 
            src={profileImageUrl + `?key=${imageKey}`} 
            alt="Profile" 
            className="object-cover"
          />
        ) : null}
        <AvatarFallback className="text-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {uploadingImage && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center rounded-full bg-black/20",
          avatarSizeClass
        )}>
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default FreelancerAvatar;
