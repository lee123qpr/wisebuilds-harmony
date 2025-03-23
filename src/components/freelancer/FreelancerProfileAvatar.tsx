import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface FreelancerProfileAvatarProps {
  profileImage: string | null;
  uploadingImage: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  fullName: string;
  userId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
}

const FreelancerProfileAvatar: React.FC<FreelancerProfileAvatarProps> = ({
  profileImage,
  uploadingImage,
  setUploadingImage,
  setProfileImage,
  fullName,
  userId,
  size = 'md',
  editable = false,
}) => {
  const [hovered, setHovered] = useState(false);
  
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40',
  };
  
  const getInitials = () => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editable || !setUploadingImage || !setProfileImage) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `profile_photos/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
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
      <div 
        className={cn(
          "relative rounded-full overflow-hidden transition-all duration-300",
          sizeClasses[size],
          editable && "cursor-pointer",
          hovered && editable && "ring-4 ring-primary/20"
        )}
        onMouseEnter={() => editable && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Avatar className={cn(
          "border-2 border-primary/10", 
          sizeClasses[size]
        )}>
          <AvatarImage src={profileImage || undefined} alt={fullName} className="object-cover" />
          <AvatarFallback className={cn(
            size === 'sm' ? 'text-lg' : 'text-2xl',
            "bg-primary/10 text-primary font-semibold"
          )}>
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        {editable && hovered && !uploadingImage && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
            <Upload className="h-8 w-8 text-white" />
          </div>
        )}
        
        {uploadingImage && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
      
      {editable && (
        <input
          type="file"
          id="profile-picture"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload profile picture"
        />
      )}
      
      {editable && (
        <label
          htmlFor="profile-picture"
          className={cn(
            "absolute -bottom-1.5 -right-1.5 rounded-full p-1.5 cursor-pointer",
            "bg-primary text-primary-foreground shadow-lg transition-transform",
            "hover:scale-110 active:scale-95",
            hovered ? "scale-105" : "scale-100"
          )}
        >
          {uploadingImage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </label>
      )}
    </div>
  );
};

export default FreelancerProfileAvatar;
