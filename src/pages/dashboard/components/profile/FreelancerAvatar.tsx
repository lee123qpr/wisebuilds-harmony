
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
  const [imageError, setImageError] = React.useState(false);

  // When the button is clicked, trigger the hidden file input
  const handleButtonClick = () => {
    console.log('Avatar upload button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Log when file is selected before handling upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected for upload:', file.name);
      setImageError(false); // Reset error state when new file is selected
      handleImageUpload(e);
    } else {
      console.log('No file selected');
    }
  };

  // Log the current profile image URL for debugging
  React.useEffect(() => {
    if (profileImageUrl) {
      console.log('Avatar rendering with URL:', profileImageUrl);
      setImageError(false); // Reset error state when URL changes
    } else {
      console.log('Avatar rendering with no image URL, showing initials:', initials);
    }
  }, [profileImageUrl, imageKey, initials]);

  const handleImageError = () => {
    console.error("Failed to load image:", profileImageUrl);
    setImageError(true);
  };

  return (
    <div className="relative">
      <Avatar className="h-20 w-20 border-2 border-white shadow-md">
        {profileImageUrl && !imageError ? (
          <AvatarImage
            src={profileImageUrl}
            alt="Profile"
            className="object-cover"
            key={imageKey}
            onError={handleImageError}
          />
        ) : (
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        )}
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
            onChange={handleFileChange}
            disabled={uploadingImage}
          />
        </div>
      </div>
    </div>
  );
};

export default FreelancerAvatar;
