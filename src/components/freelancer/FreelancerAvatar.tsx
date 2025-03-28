
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/pages/dashboard/hooks/useImageUpload';

interface FreelancerAvatarProps {
  profileImage: string | null;
  fullName: string;
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  allowImageUpload?: boolean;
  imageKey?: string;
}

const FreelancerAvatar: React.FC<FreelancerAvatarProps> = ({
  profileImage,
  fullName,
  userId,
  size = 'md',
  uploadingImage = false,
  setUploadingImage,
  setProfileImage,
  allowImageUpload = false,
  imageKey,
}) => {
  // Get initials for avatar fallback
  const getInitials = () => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Size mappings for consistent avatar sizing
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  // Use our custom hook if upload functionality is needed
  const { handleImageUpload } = allowImageUpload ? useImageUpload({
    userId,
    folder: 'profile',
    namePrefix: 'avatar'
  }) : { handleImageUpload: null };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowImageUpload || !setUploadingImage || !setProfileImage || !handleImageUpload) return;
    
    try {
      setUploadingImage(true);
      const url = await handleImageUpload(e);
      if (url) {
        setProfileImage(url.toString());
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
        <AvatarImage 
          src={profileImage || undefined} 
          alt={fullName} 
          className="object-cover" 
          key={imageKey} // Force re-render when imageKey changes
        />
        <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
      </Avatar>
      
      {allowImageUpload && (
        <>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="profile-picture"
            className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
          >
            {uploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </label>
        </>
      )}
    </div>
  );
};

export default FreelancerAvatar;
