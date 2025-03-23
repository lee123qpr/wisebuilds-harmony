
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [imageError, setImageError] = React.useState(false);
  
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

  // Reset image error state when profileImageUrl changes
  React.useEffect(() => {
    setImageError(false);
  }, [profileImageUrl]);

  // Handle image load error
  const handleImageError = () => {
    console.error('Failed to load avatar image:', profileImageUrl);
    setImageError(true);
  };

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, etc.)'
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    // Validate file size (5MB max)
    if (file && file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Image must be less than 5MB'
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    // If validations pass, call the upload handler
    handleImageUpload(e);
  };

  return (
    <div className="relative group">
      <Avatar 
        className={cn(
          avatarSizeClass,
          "cursor-pointer border-2 border-primary/10 hover:border-primary/30 transition-colors", 
          className
        )}
        onClick={handleAvatarClick}
      >
        {profileImageUrl && !imageError ? (
          <AvatarImage 
            src={profileImageUrl + `?key=${imageKey}`}
            alt="Profile" 
            className="object-cover"
            onError={handleImageError}
          />
        ) : null}
        <AvatarFallback className="text-lg relative">
          {initials}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="h-6 w-6 text-white" />
          </div>
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
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!uploadingImage && (
        <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarClick}>
          <Upload className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default FreelancerAvatar;
