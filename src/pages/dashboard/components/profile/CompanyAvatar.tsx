
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';

interface CompanyAvatarProps {
  logoUrl: string | null;
  uploadingLogo: boolean;
  imageKey: number;
  initials: string;
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyAvatar: React.FC<CompanyAvatarProps> = ({
  logoUrl,
  uploadingLogo,
  imageKey,
  initials,
  handleLogoUpload
}) => {
  return (
    <div className="relative group">
      <Avatar className="h-24 w-24 border-2 border-primary/10">
        {logoUrl ? (
          <AvatarImage key={imageKey} src={logoUrl} alt="Company logo" />
        ) : null}
        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <label className="cursor-pointer p-2">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={uploadingLogo}
          />
          {uploadingLogo ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Upload className="h-5 w-5 text-white" />
          )}
        </label>
      </div>
    </div>
  );
};

export default CompanyAvatar;
