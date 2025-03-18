
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
  // Create a ref for the file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // When the button is clicked, trigger the hidden file input
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
            onClick={handleButtonClick}
          >
            {uploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
        </div>
      </div>
    </div>
  );
};

export default FreelancerAvatar;
