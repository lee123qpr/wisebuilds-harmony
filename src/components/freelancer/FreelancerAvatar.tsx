
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { StorageBucket } from '@/utils/storage';

interface FreelancerAvatarProps {
  profileImage: string | null;
  fullName: string;
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  allowImageUpload?: boolean;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowImageUpload || !setUploadingImage || !setProfileImage) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      
      // Create a filename with user ID to prevent conflicts
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload the file to Supabase storage using the correct bucket name
      const { data, error } = await supabase.storage
        .from(StorageBucket.AVATARS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) throw error;
      
      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from(StorageBucket.AVATARS)
        .getPublicUrl(filePath);
        
      // Set the profile image URL
      setProfileImage(urlData.publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading profile image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
        <AvatarImage src={profileImage || undefined} alt={fullName} className="object-cover" />
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
