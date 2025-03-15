
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';

interface FreelancerAvatarProps {
  profileImageUrl: string | null;
  uploadingImage: boolean;
  imageKey: string;
  initials: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FreelancerAvatar: React.FC<FreelancerAvatarProps> = ({
  profileImageUrl,
  uploadingImage,
  imageKey,
  initials,
  handleImageUpload
}) => {
  return (
    <div className="relative">
      <Avatar className="h-20 w-20 border-2 border-white shadow-md">
        <AvatarImage
          src={profileImageUrl || ''}
          alt="Profile"
          className="object-cover"
          key={imageKey}
        />
        <AvatarFallback className="text-lg bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -bottom-2 -right-2">
        <div className="relative">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full shadow"
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
        </div>
      </div>
    </div>
  );
};

export default FreelancerAvatar;
